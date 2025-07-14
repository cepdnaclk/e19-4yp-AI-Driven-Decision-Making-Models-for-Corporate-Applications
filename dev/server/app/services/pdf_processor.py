from typing import List
from io import BytesIO
import os
import PyPDF2
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

class PDFProcessor:
    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        self.embeddings = OpenAIEmbeddings()
    
    def extract_text_from_pdf(self, pdf_content: bytes) -> str:
        pdf_reader = PyPDF2.PdfReader(BytesIO(pdf_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
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
