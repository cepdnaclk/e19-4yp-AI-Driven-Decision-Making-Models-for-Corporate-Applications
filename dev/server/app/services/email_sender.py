import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from fastapi import HTTPException, UploadFile
from dotenv import load_dotenv

load_dotenv()

def send_real_email(to: str, subject: str, body: str, files: list[UploadFile]):
    app_email = os.getenv("APP_EMAIL")
    app_password = os.getenv("APP_PASSWORD")

    if not app_email or not app_password:
        raise HTTPException(status_code=500, detail="Email credentials missing")

    # Build email
    msg = MIMEMultipart()
    msg["Subject"] = subject
    msg["From"] = app_email
    msg["To"] = to

    # Add the body
    msg.attach(MIMEText(body, "plain"))

    # Attach files
    for file in files:
        content = file.file.read()
        part = MIMEApplication(content, Name=file.filename)
        part["Content-Disposition"] = f'attachment; filename="{file.filename}"'
        msg.attach(part)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(app_email, app_password)
            server.sendmail(app_email, [to], msg.as_string())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
