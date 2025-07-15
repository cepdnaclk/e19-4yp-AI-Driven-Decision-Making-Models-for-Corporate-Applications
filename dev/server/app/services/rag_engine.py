from typing import Dict, Tuple
from app.services.agent_runner import ReActAgent
from datetime import datetime, timedelta

# Dictionary to hold agents keyed by (agent_id, user_id)
agent_pool: Dict[Tuple[str, str], Tuple[ReActAgent, datetime]] = {}

# Timeout duration for inactive agents (e.g., 30 minutes)
INACTIVITY_TIMEOUT = timedelta(minutes=30)

def get_or_create_agent(agent_id: str, user_id: str) -> ReActAgent:
    key = (agent_id, user_id)
    now = datetime.utcnow()

    if key in agent_pool:
        agent, last_active = agent_pool[key]
        # Update last active timestamp
        agent_pool[key] = (agent, now)
        return agent

    # Create new agent instance and store with timestamp
    agent = ReActAgent(agent_id)
    agent_pool[key] = (agent, now)
    return agent

def cleanup_expired_agents():
    now = datetime.utcnow()
    expired_keys = [key for key, (_, last_active) in agent_pool.items()
                    if now - last_active > INACTIVITY_TIMEOUT]

    for key in expired_keys:
        del agent_pool[key]
