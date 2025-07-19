from fastapi import APIRouter, HTTPException, Depends
from app.dependencies.auth_dependencies import AuthDependencies
from app.models.chat import TemplateRequest, TemplateResponse
from app.services.agent_runner import ReActAgent
from app.models.chat import GeneratedMessageRequest, ChatMessage
from app.services.rag_engine import get_or_create_agent
from app.templates.letter_templates import TEMPLATES
from datetime import datetime
import sqlite3, json

router = APIRouter()
auth_dependencies = AuthDependencies()

@router.post("/generate", response_model=TemplateResponse)
def generate_template(
    data: TemplateRequest,
    user: dict = Depends(auth_dependencies.get_current_user)
):
    template = TEMPLATES.get(data.template_type)
    if not template:
        raise HTTPException(status_code=400, detail="Invalid template type.")

    try:
        content = template.format(**data.fields)

        return {
            "content": content,
        }
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing required field: {str(e)}")
    
@router.post("/{agent_id}/store-generated-message")
async def store_generated_message(
    agent_id: str,
    request: GeneratedMessageRequest,
    user: dict = Depends(auth_dependencies.get_current_user)
):
    try:
        user_id = user["sub"]
        user_role = user["role"]
        print(f"📩 Storing generated message for agent {agent_id} by user {user_id}")

        # Permission check for non admins
        if user_role != "admin":
            assigned_agents = ReActAgent.get_assigned_agents(user_id)
            if agent_id not in assigned_agents:
                raise HTTPException(status_code=403, detail="Not authorized to access this agent.")

        # Get or create the agent instance
        agent = get_or_create_agent(agent_id, user_id)

        # Build updated history: add the generated message as assistant message
        updated_history = request.history + [
            ChatMessage(role="assistant", content=request.content)
        ]

        # Store to SQLite
        conn = sqlite3.connect('agents.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO chat_history (id, agent_id, user_id, messages, updated_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            f"chat_{agent_id}_{user_id}",
            agent_id,
            user_id,
            json.dumps([msg.dict() for msg in updated_history]),
            datetime.now()
        ))
        conn.commit()
        conn.close()

        return {
            "message": "Generated message stored successfully.",
            "chat_history": [msg.dict() for msg in updated_history]
        }

    except Exception as e:
        print("❌ ERROR in store_generated_message:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
