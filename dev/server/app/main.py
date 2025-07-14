from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import init_db
from app.api.v1.endpoints import tools, agents, chat, users

app = FastAPI(title="Agentic AI Platform", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
init_db()

# Include routers
app.include_router(tools.router, prefix="/tools", tags=["Tools"])
app.include_router(agents.router, prefix="/agents", tags=["Agents"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(users.router, tags=["Users"])

@app.get("/")
async def root():
    return {"message": "Agentic AI Platform API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
