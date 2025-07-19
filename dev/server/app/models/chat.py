from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any

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
    assigned_user_ids: Optional[List[str]] = None

class UpdateProfileRequest(BaseModel):
    firstname: str | None = None
    lastname: str | None = None
    email: EmailStr | None = None
    old_password: str | None = None
    new_password: str | None = None

class TemplateRequest(BaseModel):
    template_type: str
    fields: Dict[str, Any]

class TemplateResponse(BaseModel):
    content: str

class GeneratedMessageRequest(BaseModel):
    content: str
    history: List[ChatMessage] = []

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: str

class LoginRequest(BaseModel):
    username: str
    password: str

class EmailRequest(BaseModel):
    to: EmailStr
    subject: str
    body: str

class EmailInput(BaseModel):
    recipient: EmailStr = Field(..., description="Recipient's email address")
    subject: str = Field(..., description="Subject of the email")
    body: str = Field(..., description="Body of the email")