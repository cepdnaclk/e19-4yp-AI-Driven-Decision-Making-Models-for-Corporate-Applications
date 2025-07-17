from typing import List
from io import BytesIO
import os
import PyPDF2
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

import pdfplumber
import pytesseract

class PDFProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.embeddings = OpenAIEmbeddings()
    
    def extract_text_from_pdf(self, pdf_content: bytes) -> str:
        text = ""

        with pdfplumber.open(BytesIO(pdf_content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                # If no text found, try OCR on that specific page
                if not page_text or len(page_text.strip()) < 30:
                    print("[OCR Fallback for this page]")
                    page_image = page.to_image(resolution=300)
                    image = page_image.original
                    ocr_text = pytesseract.image_to_string(image)
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
