from langchain.tools import Tool, StructuredTool
from typing import List
from app.services.email_service import SMTP_EMAIL, EMAIL_SIMULATION_MODE, save_email_to_db, send_real_email
from app.models.chat import EmailInput

class ToolsRepository:
    def __init__(self):
        self.tools = {
            "web_search": Tool(
                name="web_search",
                description="Search the web for current information",
                func=self._web_search
            ),
            "calculator": Tool(
                name="calculator",
                description="Perform mathematical calculations",
                func=self._calculator
            ),
            "file_reader": Tool(
                name="file_reader",
                description="Read and analyze files",
                func=self._file_reader
            ),
            "email_sender": StructuredTool.from_function(
                name="email_sender",
                description="Send an email to a user. Provide recipient, subject, and body.",
                func=self._email_sender,
                args_schema=EmailInput
            ),
            "data_analyzer": Tool(
                name="data_analyzer",
                description="Analyze data and generate insights",
                func=self._data_analyzer
            )
        }

    def _web_search(self, query: str) -> str:
        return f"Web search results for: {query}"

    def _calculator(self, expression: str) -> str:
        try:
            result = eval(expression)
            return f"Result: {result}"
        except Exception as e:
            return f"Error in calculation: {str(e)}"

    def _file_reader(self, file_path: str) -> str:
        try:
            with open(file_path, 'r') as f:
                content = f.read()
            return f"File content: {content[:500]}..."
        except Exception as e:
            return f"Error reading file: {str(e)}"
        
    def _email_sender(self, recipient: str, subject: str, body: str) -> str:
        sender = SMTP_EMAIL or "no-reply@example.com"

        try:
            if EMAIL_SIMULATION_MODE:
                # Simulate success and save to DB
                save_email_to_db(sender, recipient, subject, body)
                return f"✅ Simulated email sent to {recipient} with subject: {subject}"
            else:
                send_real_email(sender, recipient, subject, body)
                save_email_to_db(sender, recipient, subject, body)
                return f"✅ Email sent to {recipient} with subject: {subject}"

        except Exception as e:
            return f"❌ Error sending email: {str(e)}"

    def _data_analyzer(self, data: str) -> str:
        return f"Data analysis complete for: {data[:100]}..."

    def get_available_tools(self) -> List[str]:
        return list(self.tools.keys())

    def get_tools_by_names(self, tool_names: List[str]) -> List[Tool]:
        return [self.tools[name] for name in tool_names if name in self.tools]
