from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
import json
import os

from fpdf import FPDF
from fastapi.responses import FileResponse

router = APIRouter(prefix="/feedback")

QUESTIONS_LOG = os.path.join("feedback_uploads", "questions_log.jsonl")
REPORT_PDF_PATH = os.path.join("feedback_uploads", "weekly_feedback_report.pdf")

class Question(BaseModel):
    message: str

# Submit questions
@router.post("/submit-question/")
async def submit_question(q: Question):
    os.makedirs("feedback_uploads", exist_ok=True)
    with open(QUESTIONS_LOG, "a") as f:
        json.dump({"message": q.message, "timestamp": str(datetime.now())}, f)
        f.write("\n")
    return {"status": "saved"}

# Generate the report
@router.get("/generate-weekly-report-pdf/")
async def generate_weekly_report_pdf():
    questions = []

    if not os.path.exists(QUESTIONS_LOG):
        return {"report": "No feedback data found."}

    with open(QUESTIONS_LOG, "r") as f:
        for line in f:
            entry = json.loads(line)
            questions.append(entry["message"])

    if not questions:
        return {"report": "No questions submitted yet."}

    # Create the PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(0, 10, "Employee Feedback Report", ln=True, align='C')
    pdf.ln(10)

    for i, q in enumerate(questions, start=1):
        pdf.multi_cell(0, 10, f"{i}. {q}", border=0)
        pdf.ln(1)

    pdf.output(REPORT_PDF_PATH)

    return FileResponse(REPORT_PDF_PATH, media_type='application/pdf', filename="employee_feedback_report.pdf")
