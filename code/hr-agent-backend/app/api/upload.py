from typing import List
from fastapi import APIRouter, UploadFile, File
import os
from app.services.vector_store import process_pdf_and_upload
# from io import BytesIO

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-pdf/")
async def upload_pdfs(files: List[UploadFile] = File(...)):
    uploaded_files = []

    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Process the file (your own logic here)
        process_pdf_and_upload(file_path)

        uploaded_files.append(file.filename)

    return {"status": "success", "filenames": uploaded_files}

### Accept a stream (BytesIO) instead of a file path
# async def process_pdf_directly(file: UploadFile):
#     content = await file.read()
#     pdf_stream = BytesIO(content)
#     process_pdf_and_upload(pdf_stream)
#     return {"status": "success", "filename": file.filename}
