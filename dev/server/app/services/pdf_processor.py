from typing import List
from io import BytesIO
import os
import PyPDF2
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from pdf2image import convert_from_bytes
import pdfplumber
import pytesseract
import cv2
import numpy as np
from PIL import Image

class PDFProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.embeddings = OpenAIEmbeddings()

    pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

    def preprocess_image(self, image: Image.Image) -> Image.Image:
        # Convert PIL Image to OpenCV format
        open_cv_image = np.array(image.convert('L'))  # convert to grayscale
        _, thresh = cv2.threshold(open_cv_image, 150, 255, cv2.THRESH_BINARY)
        return Image.fromarray(thresh)
    
    def extract_text_from_pdf(self, pdf_content: bytes) -> str:
        text = ""
        ocr_fallback_threshold = 50  # characters

        # Convert pages to images
        images = convert_from_bytes(pdf_content, dpi=300)

        # Try text extraction with pdfplumber, else use OCR
        with pdfplumber.open(BytesIO(pdf_content)) as pdf:
            for idx, page in enumerate(pdf.pages):
                page_text = page.extract_text()
                if not page_text or len(page_text.strip()) < ocr_fallback_threshold:
                    print(f"[OCR fallback on page {idx+1}]")
                    image = images[idx]
                    # ocr_text = pytesseract.image_to_string(image)
                    ocr_text = pytesseract.image_to_string(preprocess_image(image))
                    text += ocr_text + "\n"
                else:
                    text += page_text + "\n"

        return text
    
    def process_and_store_pdfs(self, pdf_files: List[bytes], agent_id: str) -> str:
        all_texts = []
        
        for pdf_content in pdf_files:
            text = self.extract_text_from_pdf(pdf_content)
            chunks = self.text_splitter.split_text(text)
            all_texts.extend(chunks)
        
        if all_texts:
            # Create FAISS index
            vectorstore = FAISS.from_texts(all_texts, self.embeddings)
            
            # Save the index
            index_path = f"data/vectors/{agent_id}"
            vectorstore.save_local(index_path)
            
            return index_path
        
        return None

with open("C:\\Users\\ACER\\Desktop\\check.pdf", "rb") as f:
    pdf_bytes = f.read()

images = convert_from_bytes(pdf_bytes, dpi=300)

for i, image in enumerate(images):
    print(f"\n--- Page {i+1} ---\n")
    text = pytesseract.image_to_string(image)
    print(text)