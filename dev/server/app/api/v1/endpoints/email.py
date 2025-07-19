from fastapi import APIRouter, HTTPException, Depends
from app.services.email_sender import send_real_email
from app.dependencies.auth_dependencies import AuthDependencies
from app.models.chat import EmailRequest
import logging

router = APIRouter()

auth_dependencies = AuthDependencies()

# Route for sending emails
@router.post("/send-email")
def send_email(
    email_data: EmailRequest,
    user=Depends(auth_dependencies.get_current_user)
):
    sender = user.get("email")
    if not sender:
        raise HTTPException(status_code=400, detail="User email not found")

    try:
        send_real_email(sender, email_data.to, email_data.subject, email_data.body)
    except Exception as e:
        logging.error(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")

    return {"message": "Email sent successfully"}
