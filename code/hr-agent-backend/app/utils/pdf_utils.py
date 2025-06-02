import os
# from langchain.document_loaders import PyPDFLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from .pinecone_config import vector_store 

def process_pdf_and_upload(file_path):
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    # Split text
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(documents)

    # Store in Pinecone
    vector_store.add_documents(chunks)
