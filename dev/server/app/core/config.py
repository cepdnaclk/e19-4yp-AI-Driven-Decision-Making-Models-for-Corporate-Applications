import os
import sqlite3
import uuid
from dotenv import load_dotenv

load_dotenv()

# Initialize folders
os.makedirs("data/agents", exist_ok=True)
os.makedirs("data/vectors", exist_ok=True)
os.makedirs("data/pdfs", exist_ok=True)

# DB init
def init_db():
    conn = sqlite3.connect('agents.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS agents (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            tools TEXT NOT NULL,
            system_prompt TEXT NOT NULL,
            vector_index_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_history (
            id TEXT PRIMARY KEY,
            agent_id TEXT NOT NULL,
            user_id TEXT,
            messages TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (agent_id) REFERENCES agents (id)
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT CHECK(role IN ('admin', 'employee', 'customer')) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Seed a default super-admin if none exists
    cursor.execute("SELECT * FROM users WHERE role = 'admin'")
    if not cursor.fetchone():
        import bcrypt
        admin_pw = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        cursor.execute('''
            INSERT INTO users (id, username, password, role) VALUES (?, ?, ?, ?)
        ''', (str(uuid.uuid4()), 'admin', admin_pw, 'admin'))
        print("✅ Default admin created. Username: admin, Password: admin123")

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS agent_assignments (
            id TEXT PRIMARY KEY,
            agent_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            FOREIGN KEY (agent_id) REFERENCES agents(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    conn.commit()
    conn.close()
