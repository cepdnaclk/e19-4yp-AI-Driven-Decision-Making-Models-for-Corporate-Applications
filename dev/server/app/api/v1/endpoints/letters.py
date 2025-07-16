from fastapi import APIRouter, HTTPException, Depends
from app.dependencies.auth_dependencies import AuthDependencies
from app.models.chat import LetterRequest, LetterResponse
from app.templates.letter_templates import TEMPLATES

router = APIRouter()
auth_dependencies = AuthDependencies()

@router.post("/generate", response_model=LetterResponse)
def generate_letter(
    data: LetterRequest,
    user: dict = Depends(auth_dependencies.get_current_user)
):
    template = TEMPLATES.get(data.template_type)
    if not template:
        raise HTTPException(status_code=400, detail="Invalid template type.")

    try:
        content = template.format(**data.fields)
        return {"content": content}
    except KeyError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required field for template: {str(e)}"
        )
