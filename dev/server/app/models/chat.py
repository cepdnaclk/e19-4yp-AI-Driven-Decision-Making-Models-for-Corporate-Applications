from pydantic import BaseModel, Field
from typing import List, Optional

# Pydantic models
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    agent_id: str
    message: str
    chat_history: List[ChatMessage] = Field(default_factory=list)

class AgentResponse(BaseModel):
    id: str
    name: str
    description: str
    tools: List[str]
    created_at: str

class AgentUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    tools: Optional[List[str]] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: str

class LoginRequest(BaseModel):
    username: str
    password: str