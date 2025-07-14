from langchain.schema import HumanMessage
from langchain_openai import ChatOpenAI

class SystemPromptGenerator:
    def __init__(self):
        self.llm = ChatOpenAI(temperature=0.2, model="gpt-4o-mini")

    def generate_system_prompt(self, agent_name: str, description: str, knowledge_summary: str) -> str:
        prompt = f"""
        You are {agent_name}, a helpful AI assistant.

        Description: {description}

        You have access to tools such as web search, calculator, file reader, email sender, and data analyzer.

        Use your knowledge base and tools when appropriate to help users efficiently.

        Here is a brief summary of the knowledge base you might reference: {knowledge_summary[:700]}...

        Keep your responses concise, clear, and professional.
        """
        try:
            return prompt.strip()
        except Exception as e:
            # Fallback system prompt
            return f"""
            You are {agent_name}, an AI assistant with the following capabilities:
            
            Description: {description}
            
            You have access to a knowledge base containing relevant information to help users.
            When answering questions, always:
            1. Be helpful and accurate
            2. Use your knowledge base when relevant
            3. Use available tools when needed
            4. Provide clear and concise responses
            5. Ask for clarification if needed
            
            Knowledge Base: {knowledge_summary[:500]}...
            """
