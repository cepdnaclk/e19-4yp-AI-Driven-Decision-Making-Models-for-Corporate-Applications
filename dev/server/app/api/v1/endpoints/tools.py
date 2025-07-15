from fastapi import APIRouter
from app.services.tools_repo  import ToolsRepository

router = APIRouter()
tools_repo = ToolsRepository()

@router.get("/")
async def get_available_tools():
    return {"tools": tools_repo.get_available_tools()}
