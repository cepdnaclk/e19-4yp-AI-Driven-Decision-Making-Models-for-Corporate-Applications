from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from app.services.rag_engine import get_or_create_agent, agent_pool
from app.services.agent_runner import ReActAgent
from app.services.pdf_processor import PDFProcessor
from app.dependencies.auth_dependencies import AuthDependencies
from app.models.chat import ChatRequest
from app.models.chat import ChatMessage
from langchain_community.vectorstores import FAISS
from typing import List
from datetime import datetime
import sqlite3, json, os

router = APIRouter()

auth_dependencies = AuthDependencies()
pdf_processor = PDFProcessor()

@router.post("/")
async def chat_with_agent(
    chat_request: ChatRequest, 
    user: dict = Depends(auth_dependencies.get_current_user)
):
    try:
        user_id = user["sub"]
        user_role = user["role"]

        print("✅ Chat requested by", user_id, "with role", user_role)

        if not user_id:
            raise HTTPException(status_code=401, detail="Missing user ID in token")

        # Only admins or assigned users can chat with this agent
        if user_role != "admin":
            assigned_agents = ReActAgent.get_assigned_agents(user_id)
            if chat_request.agent_id not in assigned_agents:
                raise HTTPException(status_code=403, detail="You are not authorized to chat with this agent.")
        
        agent = get_or_create_agent(chat_request.agent_id, user_id)
        response = agent.chat(chat_request.message, chat_request.chat_history)

        updated_history = chat_request.chat_history + [
            ChatMessage(role="user", content=chat_request.message),
            ChatMessage(role="assistant", content=response)
        ]

        conn = sqlite3.connect('agents.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT OR REPLACE INTO chat_history (id, agent_id, user_id, messages, updated_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (f"chat_{chat_request.agent_id}_{user_id}", chat_request.agent_id, user_id, 
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
    cursor.execute('SELECT messages FROM chat_history WHERE agent_id = ? AND user_id = ?', 
                   (agent_id, user_id))
    result = cursor.fetchone()
    conn.close()

    if result:
        return {"chat_history": json.loads(result[0])}
    else:
        return {"chat_history": []}

@router.post("/{agent_id}/upload")
async def upload_multiple_files(
    agent_id: str,
    files: List[UploadFile] = File(...),
    user: dict = Depends(auth_dependencies.get_current_user),
):
    user_id = user["sub"]
    if not user_id:
        raise HTTPException(status_code=401, detail="user_id missing in token")

    all_chunks = []

    for file in files:
        pdf_content = await file.read()
        text = pdf_processor.extract_text_from_pdf(pdf_content)
        chunks = pdf_processor.text_splitter.split_text(text)
        all_chunks.extend(chunks)

    if not all_chunks:
        raise HTTPException(status_code=400, detail="No valid text found in PDFs.")

    index_path = f"data/vectors/{agent_id}"

    # ✅ Check if an index already exists for this agent
    if os.path.exists(index_path):
        vectorstore = FAISS.load_local(
            index_path,
            pdf_processor.embeddings,
            allow_dangerous_deserialization=True
        )
        vectorstore.add_texts(all_chunks)
    else:
        vectorstore = FAISS.from_texts(all_chunks, pdf_processor.embeddings)

    # ✅ Save (or overwrite) the updated index
    vectorstore.save_local(index_path)

    # Update DB if needed (optional, since path stays same)
    conn = sqlite3.connect('agents.db')
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE agents SET vector_index_path = ? WHERE id = ?",
        (index_path, agent_id)
    )
    conn.commit()
    conn.close()

    agent_pool.pop((agent_id, user_id), None)

    return {"message": f"{len(files)} PDFs processed and added to existing retriever."}


