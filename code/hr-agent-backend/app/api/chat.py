from fastapi import APIRouter
from pydantic import BaseModel
from app.services.langgraph_agent import run_bot

router = APIRouter()

class Question(BaseModel):
    question: str

@router.post("/ask-bot/")
async def ask_bot(data: Question):
    print("Received question:", data.question) 
    answer = run_bot(data.question)
    return {"response": answer}
