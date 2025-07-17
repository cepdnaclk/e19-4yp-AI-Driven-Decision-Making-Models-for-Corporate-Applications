from typing import List
from io import BytesIO
import os
# import PyPDF2
import pdfplumber
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
# from pdf2image import convert_from_bytes
from PIL import Image
import pytesseract

class PDFProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.embeddings = OpenAIEmbeddings()
    
    pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'
    # img = Image.open("C:/Users/ACER/Desktop/Semester 8/FYP/FYP_After/e19-4yp-AI-Driven-Decision-Making-Models-for-Corporate-Applications/docs/dataset/image_2.png")
    # print(pytesseract.image_to_string(img))
    
    def extract_text_from_pdf(self, pdf_content: bytes) -> str:
        text = ""

        try:
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
        except Exception as e:
            print("pdfplumber failed:", e)
            # Total fallback to OCR for all pages
            try:
                images = convert_from_bytes(pdf_content)
                for i, image in enumerate(images):
                    print(f"[OCR] Page {i+1}")
                    text += pytesseract.image_to_string(image) + "\n"
            except Exception as ocr_e:
                print("OCR failed:", ocr_e)

        return text
        
        # with pdfplumber.open(BytesIO(pdf_content)) as pdf:
        #     for page in pdf.pages:
        #         text += page.extract_text() or ""
        # return text

        # pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_content))
        # text = ""
        # for page in pdf_reader.pages:
        #     text += page.extract_text()
        # return text
    
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
