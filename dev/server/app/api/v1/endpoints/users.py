from fastapi import APIRouter, Form, HTTPException, Depends
from app.auth_helpers.auth import Auth
from app.dependencies.auth_dependencies import AuthDependencies
from app.models.chat import LoginResponse
import sqlite3, uuid
from datetime import timedelta

router = APIRouter()

auth_dependencies = AuthDependencies()

@router.post("/register")
def register_user(username: str = Form(...), password: str = Form(...), role: str = Form(...)):
    if role not in ["customer"]:
        raise HTTPException(status_code=400, detail="You can only self-register as a customer")

    conn = sqlite3.connect("agents.db")
    cursor = conn.cursor()
    user_id = str(uuid.uuid4())

    hashed = Auth.hash_password(password)
    try:
        cursor.execute(
            "INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)",
            (user_id, username, hashed, role),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        conn.close()

    return {"message": "User registered", "user_id": user_id}

@router.post("/login", response_model=LoginResponse)
def login(username: str = Form(...), password: str = Form(...)):
    conn = sqlite3.connect("agents.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, password, role FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()

    if not user or not Auth.verify_password(password, user[1]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id, _, role = user
    token = Auth.create_access_token({"sub": user_id, "role": role})
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role,
        "user_id": user_id
    }

@router.post("/create-employee")
def create_employee(username: str = Form(...), password: str = Form(...), user=Depends(auth_dependencies.require_role("admin"))):
    conn = sqlite3.connect("agents.db")
    cursor = conn.cursor()
    user_id = str(uuid.uuid4())

    hashed = Auth.hash_password(password)
    try:
        cursor.execute(
            "INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, 'employee')",
            (user_id, username, hashed),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        conn.close()

    return {"message": "Employee created", "user_id": user_id}

@router.get("/users")
async def get_users(user=Depends(auth_dependencies.require_role("admin"))):
    conn = sqlite3.connect('agents.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, role FROM users")
    rows = cursor.fetchall()
    conn.close()

    users = [{"id": row[0], "name": row[1], "role": row[2]} for row in rows]
    return {"users": users}