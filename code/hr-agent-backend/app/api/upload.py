from fastapi import APIRouter, UploadFile, File
import os
from app.services.vector_store import process_pdf_and_upload
# from io import BytesIO

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    process_pdf_and_upload(file_path)
    return {"status": "success", "filename": file.filename}

### Accept a stream (BytesIO) instead of a file path
# async def process_pdf_directly(file: UploadFile):
#     content = await file.read()
#     pdf_stream = BytesIO(content)
#     process_pdf_and_upload(pdf_stream)
#     return {"status": "success", "filename": file.filename}
