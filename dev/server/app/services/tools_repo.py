import json
from langchain.tools import Tool
from typing import List

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
            "email_sender": Tool(
                name="email_sender",
                description="Send emails. Input should be a JSON string with recipient, subject, and body fields. Example: {\"recipient\": \"user@example.com\", \"subject\": \"Hello\", \"body\": \"Message content\"}",
                func=self._email_sender
            ),
            "data_analyzer": Tool(
                name="data_analyzer",
                description="Analyze data and generate insights",
                func=self._data_analyzer
            )
        }
    
    def _web_search(self, query: str) -> str:
        # Placeholder for web search implementation
        return f"Web search results for: {query}"
    
    def _calculator(self, expression: str) -> str:
        try:
            result = eval(expression)
            return f"Result: {result}"
        except Exception as e:
            return f"Error in calculation: {str(e)}"
    
    def _file_reader(self, file_path: str) -> str:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return f"File content: {content}..."
        except Exception as e:
            return f"Error reading file: {str(e)}"
    
    def _email_sender(self, input_str: str) -> str:
        try:
            # Parse the input JSON string
            input_data = json.loads(input_str)
            recipient = input_data.get('recipient')
            subject = input_data.get('subject')
            body = input_data.get('body')
            
            if not all([recipient, subject, body]):
                return "Error: Missing required fields. Please provide recipient, subject, and body."
            
            # Placeholder for email sending implementation
            return f"Email sent to {recipient} with subject: {subject}"
        except json.JSONDecodeError:
            return "Error: Invalid input format. Please provide a valid JSON string."
        except Exception as e:
            return f"Error sending email: {str(e)}"
    
    def _data_analyzer(self, data: str) -> str:
        # Placeholder for data analysis implementation
        return f"Data analysis complete for: {data[:100]}..."
    
    def get_available_tools(self) -> List[str]:
        return list(self.tools.keys())
    
    def get_tools_by_names(self, tool_names: List[str]) -> List[Tool]:
        return [self.tools[name] for name in tool_names if name in self.tools]