import os
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.vectorstores import FAISS
from langchain_community.vectorstores import FAISS
# from langchain.embeddings import OpenAIEmbeddings
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

VECTOR_DIR = "vectorstore"
MAX_CHUNK_SIZE = 1500  # ~600–800 tokens depending on content
CHUNK_OVERLAP = 200    # Less overlap = fewer embeddings

def load_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    full_text = ""
    for page in reader.pages:
        text = page.extract_text()
        if text:
            full_text += text + "\n"
    return full_text

async def process_pdf(file):
    # Save uploaded file
    path = f"uploads/{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    # Load and chunk
    raw_text = load_text_from_pdf(path)
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=MAX_CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = splitter.split_text(raw_text)

    # Embed with OpenAI
    embeddings = OpenAIEmbeddings()  # Uses OPENAI_API_KEY from env
    db = FAISS.from_texts(chunks, embeddings)
    db.save_local(VECTOR_DIR)

def get_vector_retriever():
    embeddings = OpenAIEmbeddings()
    
    # return FAISS.load_local(VECTOR_DIR, embeddings).as_retriever()
    if os.path.exists("vectorstore"):
        return FAISS.load_local("vectorstore", embeddings).as_retriever()
    else:
        raise ValueError("Vector store not found. Upload a PDF first.")
