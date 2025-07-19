from fastapi import APIRouter, HTTPException, Depends
from app.dependencies.auth_dependencies import AuthDependencies
from app.models.chat import TemplateRequest
from app.services.agent_runner import ReActAgent
from app.models.chat import GeneratedMessageRequest, ChatMessage
from app.services.rag_engine import get_or_create_agent
from app.fill_docx.offer import generate_offer_letter_docx, generate_confirmation_letter_docx
from fastapi.responses import StreamingResponse
from app.templates.letter_templates import TEMPLATES
import io

router = APIRouter()
auth_dependencies = AuthDependencies()

@router.post("/generate")
def generate_template(
    data: TemplateRequest,
    user: dict = Depends(auth_dependencies.get_current_user)
):
    if data.template_type == "offer_letter":
        try:
            docx_bytes = generate_offer_letter_docx(data.fields)
            return StreamingResponse(io.BytesIO(docx_bytes), media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={
                "Content-Disposition": "attachment; filename=offer_letter.docx"
            })
        except KeyError as e:
            raise HTTPException(status_code=400, detail=f"Missing field: {str(e)}")
        
    if data.template_type == "confirmation_letter":
        try:
            docx_bytes = generate_confirmation_letter_docx(data.fields)
            return StreamingResponse(io.BytesIO(docx_bytes), media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", headers={
                "Content-Disposition": "attachment; filename=confirmation_letter.docx"
            })
        except KeyError as e:
            raise HTTPException(status_code=400, detail=f"Missing field: {str(e)}")
        
    else:
        template = TEMPLATES.get(data.template_type)
        if not template:
            raise HTTPException(status_code=400, detail="Invalid template type.")
        try:
            content = template.format(**data.fields)
            return {"content": content}
        except KeyError as e:
            raise HTTPException(status_code=400, detail=f"Missing field: {str(e)}")

