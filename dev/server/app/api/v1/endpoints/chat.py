from fastapi import APIRouter, HTTPException, Request, Query, Depends
from app.services.rag_engine import ReActAgent
from app.models.chat import ChatRequest
from app.models.chat import ChatMessage
from app.services.agent_runner import ReActAgent
from app.dependencies.auth_dependencies import AuthDependencies
from datetime import datetime
import sqlite3, json

router = APIRouter()

auth_dependencies = AuthDependencies()

@router.post("/")
async def chat_with_agent(chat_request: ChatRequest, user=Depends(auth_dependencies.get_current_user)):
    try:
        user_id = user["sub"]
        user_role = user["role"]

        print("✅ Chat requested by", user_id, "with role", user_role)

        # Only admins or assigned users can chat with this agent
        if user_role != "admin":
            assigned_agents = ReActAgent.get_assigned_agents(user_id)
            if chat_request.agent_id not in assigned_agents:
                raise HTTPException(status_code=403, detail="You are not authorized to chat with this agent.")
        
        agent = ReActAgent(chat_request.agent_id)
        response = agent.chat(chat_request.message, chat_request.chat_history)

        updated_history = chat_request.chat_history + [
            ChatMessage(role="user", content=chat_request.message),
            ChatMessage(role="assistant", content=response)
        ]

        conn = sqlite3.connect('agents.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO chat_history (id, agent_id, messages, updated_at)
            VALUES (?, ?, ?, ?)
        ''', (f"chat_{chat_request.agent_id}", chat_request.agent_id, 
              json.dumps([msg.dict() for msg in updated_history]), datetime.now()))
        conn.commit()
        conn.close()

        return {
            "response": response,
            "chat_history": [msg.dict() for msg in updated_history]
        }
    
    except Exception as e:
        print("❌ ERROR in chat_with_agent:", str(e)) 
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{agent_id}")
async def get_chat_history(agent_id: str, user=Depends(auth_dependencies.get_current_user)):
    user_id = user["sub"]
    role = user["role"]

    if role != "admin":
        assigned_agents = ReActAgent.get_assigned_agents(user_id)
        if agent_id not in assigned_agents:
            raise HTTPException(status_code=403, detail="Access denied to chat history.")

    conn = sqlite3.connect('agents.db')
    cursor = conn.cursor()
    cursor.execute('SELECT messages FROM chat_history WHERE agent_id = ?', (agent_id,))
    result = cursor.fetchone()
    conn.close()

    if result:
        return {"chat_history": json.loads(result[0])}
    else:
        return {"chat_history": []}
