import json
import os
import sqlite3
from typing import List
from langchain_openai import ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory
from langchain.tools import Tool

from app.services.tools_repo import ToolsRepository
from app.services.pdf_processor import PDFProcessor
from app.models.chat import ChatMessage

tools_repo = ToolsRepository()
pdf_processor = PDFProcessor()

class ReActAgent:
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.llm = ChatOpenAI(temperature=0.2, model="gpt-4o-mini")
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        self.agent_executor = None
        self.retriever = None
        self.temp_retriever = None  # session based retriever

    def load_agent_config(self):
        conn = sqlite3.connect('agents.db')
        cursor = conn.cursor()

        cursor.execute('''
            SELECT name, description, tools, system_prompt, vector_index_path
            FROM agents WHERE id = ?
        ''', (self.agent_id,))
        result = cursor.fetchone()
        conn.close()

        if not result:
            raise ValueError(f"Agent {self.agent_id} not found")

        name, description, tools_str, system_prompt, vector_index_path = result
        tool_names = json.loads(tools_str)
        tools = tools_repo.get_tools_by_names(tool_names)

        # Add retrieval tool if vector index exists
        if vector_index_path and os.path.exists(vector_index_path):
            vectorstore = FAISS.load_local(vector_index_path, pdf_processor.embeddings, allow_dangerous_deserialization=True)
            self.retriever = vectorstore.as_retriever()

            retrieval_tool = Tool(
                name="knowledge_retriever",
                description="Retrieve relevant information from knowledge base",
                func=self._retrieve_knowledge
            )
            tools.append(retrieval_tool)

        # ✅ Create agent using OpenAI Functions agent type
        self.agent_executor = initialize_agent(
            tools=tools,
            llm=self.llm,
            agent=AgentType.OPENAI_FUNCTIONS,
            memory=self.memory,
            verbose=True,
            max_iterations=30,
            max_execution_time=60,
            handle_parsing_errors=True
        )

    def append_pdf_to_temp_retriever(self, file_path: str):
        docs = pdf_processor.load(file_path)

        if not docs:
            print("No documents found in PDF.")
            return

        if self.temp_retriever:
            self.temp_retriever.vectorstore.add_documents(docs)
        else:
            vs = FAISS.from_documents(docs, pdf_processor.embeddings)
            self.temp_retriever = vs.as_retriever()

    def _retrieve_knowledge(self, query: str) -> str:
        all_docs = []

        if self.retriever:
            all_docs.extend(self.retriever.get_relevant_documents(query))
        if self.temp_retriever:
            all_docs.extend(self.temp_retriever.get_relevant_documents(query))

        if not all_docs:
            return "No knowledge base available"

        return "\n".join([doc.page_content for doc in all_docs[:3]])

    def chat(self, message: str, chat_history: List[ChatMessage]) -> str:
        if not self.agent_executor:
            self.load_agent_config()

        # Update memory
        for msg in chat_history:
            if msg.role == "user":
                self.memory.chat_memory.add_user_message(msg.content)
            elif msg.role == "assistant":
                self.memory.chat_memory.add_ai_message(msg.content)

        try:
            response = self.agent_executor.invoke({"input": message})
            return response.get("output", "I couldn't process your request.")
        except Exception as e:
            return f"Error: {str(e)}"


    def get_assigned_agents(user_id: str) -> List[str]:
        conn = sqlite3.connect('agents.db')
        cursor = conn.cursor()
        cursor.execute("SELECT agent_id FROM agent_assignments WHERE user_id = ?", (user_id,))
        result = cursor.fetchall()
        conn.close()
        return [row[0] for row in result]

