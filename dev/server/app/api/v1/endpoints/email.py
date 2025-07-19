from fastapi import APIRouter, Depends, UploadFile, Form, File
from app.models.chat import EmailRequest
from app.services.email_sender import send_real_email
from app.dependencies.auth_dependencies import AuthDependencies
import logging

router = APIRouter()

auth_dependencies = AuthDependencies()

@router.post("/send-email")
async def send_email(
    to: str = Form(...),
    subject: str = Form(...),
    body: str = Form(...),
    files: list[UploadFile] = File(default=[]),
    user: dict = Depends(AuthDependencies().get_current_user)
):
    try:
        send_real_email(to, subject, body, files)
        return {"message": "Email sent successfully"}
    except Exception as e:
        logging.error(f"Email sending failed: {str(e)}")
        raise
