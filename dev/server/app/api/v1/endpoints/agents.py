from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import List
import json, uuid, sqlite3, os, shutil
from app.services.pdf_processor import PDFProcessor
from app.services.prompt_generator import SystemPromptGenerator
from app.services.agent_runner import ReActAgent
from app.models.chat import AgentUpdateRequest
from app.dependencies.auth_dependencies import AuthDependencies

router = APIRouter()

pdf_processor = PDFProcessor()
prompt_generator = SystemPromptGenerator()
auth_dependencies = AuthDependencies()

@router.get("/")
async def get_agents(user=Depends(auth_dependencies.get_current_user)):
    conn = sqlite3.connect('agents.db')
    cursor = conn.cursor()
    
    if user["role"] == "admin":
        cursor.execute('SELECT id, name, description, tools, created_at FROM agents')
        agents = cursor.fetchall()
    else:
        assigned_ids = ReActAgent.get_assigned_agents(user["sub"])
        if not assigned_ids:
            conn.close()
            return {"agents": []}
        placeholders = ','.join('?' for _ in assigned_ids)
        query = f'SELECT id, name, description, tools, created_at FROM agents WHERE id IN ({placeholders})'
        cursor.execute(query, assigned_ids)
        agents = cursor.fetchall()
    
    result = []
    for agent in agents:
        agent_id = agent[0]
        # Fetch assigned users for this agent
        cursor.execute('''
            SELECT users.id, users.username, users.role
            FROM agent_assignments
            JOIN users ON agent_assignments.user_id = users.id
            WHERE agent_assignments.agent_id = ?
        ''', (agent_id,))
        assigned_users_raw = cursor.fetchall()
        assigned_users = [
            {"id": u[0], "name": u[1], "role": u[2]} for u in assigned_users_raw
        ]
        
        result.append({
            "id": agent_id,
            "name": agent[1],
            "description": agent[2],
            "tools": json.loads(agent[3]),
            "created_at": agent[4],
            "assigned_users": assigned_users,
        })
    
    conn.close()
    return {"agents": result}

@router.get("/{agent_id}")
async def get_agent(agent_id: str):
    conn = sqlite3.connect('agents.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT id, name, description, tools, created_at FROM agents WHERE id = ?', (agent_id,))
    agent = cursor.fetchone()
    conn.close()
    
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    return {
        "id": agent[0],
        "name": agent[1],
        "description": agent[2],
        "tools": json.loads(agent[3]),
        "created_at": agent[4]
    }

@router.post("/")
async def create_agent(
    name: str = Form(...),
    description: str = Form(...),
    tools: str = Form(...),
    assigned_user_ids: str = Form(...),  # ← New field
    files: List[UploadFile] = File(default=[]),
    user=Depends(auth_dependencies.require_role("admin"))
):
    try:
        agent_id = str(uuid.uuid4())
        tool_list = json.loads(tools)
        user_ids = json.loads(assigned_user_ids)  # ← Parse input

        vector_index_path = None
        knowledge_summary = ""

        if files and files[0].filename:
            pdf_contents = []
            for file in files:
                content = await file.read()
                pdf_contents.append(content)

            vector_index_path = pdf_processor.process_and_store_pdfs(pdf_contents, agent_id)
            for content in pdf_contents:
                text = pdf_processor.extract_text_from_pdf(content)
                knowledge_summary += text[:1000] + "..."

        system_prompt = prompt_generator.generate_system_prompt(name, description, knowledge_summary)

        conn = sqlite3.connect('agents.db')
        cursor = conn.cursor()

        cursor.execute('''
            INSERT INTO agents (id, name, description, tools, system_prompt, vector_index_path)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (agent_id, name, description, json.dumps(tool_list), system_prompt, vector_index_path))

        # Add agent assignments
        for user_id in user_ids:
            assignment_id = str(uuid.uuid4())
            cursor.execute(
                '''
                INSERT INTO agent_assignments (id, agent_id, user_id)
                VALUES (?, ?, ?)
                ''',
                (assignment_id, agent_id, user_id)
            )

        conn.commit()
        conn.close()

        return {"message": "Agent created and assigned successfully", "agent_id": agent_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{agent_id}")
async def update_agent(agent_id: str, update: AgentUpdateRequest):
    conn = sqlite3.connect('agents.db')
    cursor = conn.cursor()

    # Fetch existing agent to verify it exists
    cursor.execute('SELECT id, name, description, tools, system_prompt FROM agents WHERE id = ?', (agent_id,))
    existing = cursor.fetchone()

    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Agent not found")

    current_name, current_description, current_tools_json, current_prompt = existing[1], existing[2], existing[3], existing[4]

    # Use new values if provided, else fallback to current
    new_name = update.name or current_name
    new_description = update.description or current_description
    new_tools_json = json.dumps(update.tools) if update.tools else current_tools_json

    # Optional: regenerate system prompt only if name, desc, or tools changed
    regenerate_prompt = (
        update.name is not None or update.description is not None or update.tools is not None
    )
    new_prompt = (
        prompt_generator.generate_system_prompt(new_name, new_description, "")
        if regenerate_prompt else current_prompt
    )

    cursor.execute('''
        UPDATE agents
        SET name = ?, description = ?, tools = ?, system_prompt = ?
        WHERE id = ?
    ''', (new_name, new_description, new_tools_json, new_prompt, agent_id))

    conn.commit()
    conn.close()

    return {"message": "Agent updated successfully", "agent_id": agent_id}


@router.delete("/{agent_id}")
async def delete_agent(agent_id: str):
    conn = sqlite3.connect('agents.db')
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM agents WHERE id = ?', (agent_id,))
    cursor.execute('DELETE FROM chat_history WHERE agent_id = ?', (agent_id,))
    
    conn.commit()
    conn.close()
    
    # Clean up vector index files
    vector_path = f"data/vectors/{agent_id}"
    if os.path.exists(vector_path):
        import shutil
        shutil.rmtree(vector_path)
    
    return {"message": "Agent deleted successfully"}
