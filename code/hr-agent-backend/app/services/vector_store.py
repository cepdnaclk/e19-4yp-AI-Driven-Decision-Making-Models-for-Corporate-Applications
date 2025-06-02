import os
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain.schema import Document
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone as PineconeClient
from app.utils.pinecone_config import PINECONE_API_KEY, PINECONE_INDEX_NAME  # adjust if named differently

# Initialize Pinecone and Langchain objects
embedding = OpenAIEmbeddings()
pc = PineconeClient(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX_NAME)

vector_store = PineconeVectorStore(index=index, embedding=embedding, text_key="text")

def process_pdf_and_upload(file_path: str):
    """
    Loads a PDF, splits it into text chunks, and uploads to Pinecone vector store.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    loader = PyPDFLoader(file_path)
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = splitter.split_documents(documents)

    if not chunks:
        raise ValueError("No chunks generated from the document.")

    vector_store.add_documents(chunks)
    print(f"[INFO] Uploaded {len(chunks)} chunks to Pinecone from {file_path}")


def get_vector_retriever():
    return vector_store.as_retriever(search_kwargs={"k": 5})
