import sqlite3
import uuid
from datetime import datetime
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv
from app.models.chat import EmailInput

load_dotenv()

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_SIMULATION_MODE = os.getenv("EMAIL_SIMULATION_MODE", "false").lower() == "true"

def save_email_to_db(sender, recipient, subject, body):
    conn = sqlite3.connect("agents.db")
    cursor = conn.cursor()
    email_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO emails (id, sender, recipient, subject, body, sent_at) VALUES (?, ?, ?, ?, ?, ?)",
        (email_id, sender, recipient, subject, body, datetime.now())
    )
    conn.commit()
    conn.close()

def send_real_email(sender, recipient, subject, body):
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = recipient
    msg["Subject"] = subject
    msg.set_content(body)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(SMTP_EMAIL, SMTP_PASSWORD)
        smtp.send_message(msg)


