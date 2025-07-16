from fastapi import APIRouter, Form, HTTPException, Depends
from app.auth_helpers.auth import Auth
from app.dependencies.auth_dependencies import AuthDependencies
from app.models.chat import LoginResponse, UpdateProfileRequest
import sqlite3, uuid
from pydantic import EmailStr

router = APIRouter()

auth_dependencies = AuthDependencies()

@router.post("/register")
def register_user(
    username: str = Form(...), 
    password: str = Form(...), 
    email: EmailStr = Form(...),
    role: str = Form(...)
):
    if role not in ["customer"]:
        raise HTTPException(status_code=400, detail="You can only self-register as a customer")

    conn = sqlite3.connect("agents.db")
    cursor = conn.cursor()
    user_id = str(uuid.uuid4())

    hashed = Auth.hash_password(password)
    try:
        cursor.execute(
            "INSERT INTO users (id, username, password, email, role) VALUES (?, ?, ?, ?, ?)",
            (user_id, username, hashed, email, role),
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

@router.post("/create-user")
def create_employee(
    username: str = Form(...), 
    password: str = Form(...), 
    role: str = Form(...),
    user=Depends(auth_dependencies.require_role("admin"))
):
    if role not in ['employee', 'customer']:
        raise HTTPException(status_code=400, detail="Invalid role")
    
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

    return {"message": "User created", "user_id": user_id}

@router.get("/users")
async def get_users(user=Depends(auth_dependencies.require_role("admin"))):
    conn = sqlite3.connect('agents.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, role FROM users")
    rows = cursor.fetchall()
    conn.close()

    users = [{"id": row[0], "name": row[1], "role": row[2]} for row in rows]
    return {"users": users}

@router.get("/profile")
def get_profile(user: dict = Depends(auth_dependencies.get_current_user)):
    conn = sqlite3.connect('agents.db')
    cursor = conn.cursor()

    user_id = user["sub"]
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID missing in token")

    cursor.execute(
        "SELECT firstname, lastname, username, email, role FROM users WHERE id = ?", (user_id,)
    )
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "firstname": row[0],
        "lastname": row[1],
        "username": row[2],
        "email": row[3],
        "role": row[4],
    }

@router.put("/profile")
def update_profile(data: UpdateProfileRequest, user: dict = Depends(auth_dependencies.get_current_user)):
    user_id = user["sub"]
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID missing in token")

    conn = sqlite3.connect("agents.db")
    cursor = conn.cursor()

    cursor.execute("SELECT password FROM users WHERE id = ?", (user_id,))
    result = cursor.fetchone()
    if not result:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    current_hashed_pw = result[0]

    # Validate old_password if new_password provided
    if data.new_password:
        if not data.old_password:
            conn.close()
            raise HTTPException(status_code=400, detail="Old password is required to change password")
        if not Auth.verify_password(data.old_password, current_hashed_pw):
            conn.close()
            raise HTTPException(status_code=401, detail="Old password is incorrect")

    update_fields = []
    values = []

    if data.firstname is not None:
        update_fields.append("firstname = ?")
        values.append(data.firstname)

    if data.lastname is not None:
        update_fields.append("lastname = ?")
        values.append(data.lastname)

    if data.email is not None:
        update_fields.append("email = ?")
        values.append(data.email)

    if data.new_password is not None:
        new_hashed_pw = Auth.hash_password(data.new_password)
        update_fields.append("password = ?")
        values.append(new_hashed_pw)

    if update_fields:
        sql = f"UPDATE users SET {', '.join(update_fields)} WHERE id = ?"
        values.append(user_id)
        cursor.execute(sql, values)
        conn.commit()

    conn.close()
    return {"message": "Profile updated successfully"}