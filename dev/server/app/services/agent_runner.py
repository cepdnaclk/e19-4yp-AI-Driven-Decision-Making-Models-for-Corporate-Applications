import json
import os
import sqlite3
from typing import List
from langchain_openai import ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory
from langchain.tools import Tool
from langchain.chains import RetrievalQA
from langchain.tools import tool

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

            # retrieval_tool = Tool(
            #     name="knowledge_retriever",
            #     description="Retrieve relevant information from knowledge base",
            #     func=self._retrieve_knowledge
            # )
            # tools.append(retrieval_tool)
            @tool
            def knowledge_retriever(query: str) -> str:
                """Retrieve relevant information from the uploaded company PDFs based on the user's question."""
                if self.retriever:
                    docs = self.retriever.get_relevant_documents(query)
                    return "\n\n".join([doc.page_content for doc in docs[:3]])
                return "No knowledge base available."

            tools.append(knowledge_retriever)

        # Create agent using OpenAI Functions agent type
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

    def _retrieve_knowledge(self, query: str) -> str:
        if self.retriever:
            docs = self.retriever.get_relevant_documents(query)
            for i, doc in enumerate(docs):
                print(f"[Retriever Doc {i+1}]\n{doc.page_content[:300]}\n")
            return "\n\n".join([doc.page_content for doc in docs[:3]])
        return "No knowledge base available."

    # def _retrieve_knowledge(self, query: str) -> str:
    #     if self.retriever:
    #         docs = self.retriever.get_relevant_documents(query)
    #         return "\n".join([doc.page_content for doc in docs[:3]])
    #     return "No knowledge base available"

    # In ReActAgent
    def chat(self, message: str, chat_history: List[ChatMessage]) -> str:
        # Ensure agent config (retriever) is loaded
        if not self.retriever:
            self.load_agent_config()

        # Use retrieval-based QA only
        if self.retriever:
            retriever_qa = RetrievalQA.from_chain_type(
                llm=self.llm,
                retriever=self.retriever,
                chain_type="stuff",
                return_source_documents=True
            )
            result = retriever_qa({"query": message})
            answer = result.get("result", "").strip()

            # You can also check the similarity score or source content length here if needed
            if len(answer) < 30 or "I'm not sure" in answer or answer.lower().startswith("i don't know"):
                return "Sorry, I can't provide a valid answer for that question."
            
            return answer

        return "There is no knowledge base available."


    # def chat(self, message: str, chat_history: List[ChatMessage]) -> str:
    #     if not self.agent_executor:
    #         self.load_agent_config()

    #     # Update memory
    #     for msg in chat_history:
    #         if msg.role == "user":
    #             self.memory.chat_memory.add_user_message(msg.content)
    #         elif msg.role == "assistant":
    #             self.memory.chat_memory.add_ai_message(msg.content)

    #     try:
    #         response = self.agent_executor.invoke({"input": message})
    #         return response.get("output", "I couldn't process your request.")
    #     except Exception as e:
    #         return f"Error: {str(e)}"

    @staticmethod
    def get_assigned_agents(user_id: str) -> List[str]:
        conn = sqlite3.connect('agents.db')
        cursor = conn.cursor()
        cursor.execute("SELECT agent_id FROM agent_assignments WHERE user_id = ?", (user_id,))
        result = cursor.fetchall()
        conn.close()
        return [row[0] for row in result]

