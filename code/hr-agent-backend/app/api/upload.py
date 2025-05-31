from fastapi import APIRouter, UploadFile, File
from app.services.vector_store import process_pdf

router = APIRouter()

@router.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    await process_pdf(file)
    return {"status": "PDF processed and stored"}
