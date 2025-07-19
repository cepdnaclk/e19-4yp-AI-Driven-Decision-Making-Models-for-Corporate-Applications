import smtplib
from email.message import EmailMessage
import os
import logging
from dotenv import load_dotenv

load_dotenv()

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_SIMULATION_MODE = os.getenv("EMAIL_SIMULATION_MODE", "false").lower() == "true"

def send_real_email(recipient, subject, body):
    if EMAIL_SIMULATION_MODE:
        logging.info(f"[SIMULATED EMAIL] To: {recipient}, Subject: {subject}\nBody:\n{body}")
        return  # Don’t actually send
    else:
        msg = EmailMessage()
        # msg["From"] = sender
        msg["To"] = recipient
        msg["Subject"] = subject
        msg.set_content(body)

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(SMTP_EMAIL, SMTP_PASSWORD)
            smtp.send_message(msg)
