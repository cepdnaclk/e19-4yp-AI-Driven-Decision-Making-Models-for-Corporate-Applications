import React, { useState } from 'react';
import axios from 'axios';
import './ChatBox.css';

const ChatBox: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string }[]>([]);
  const [question, setQuestion] = useState('');

  const askBot = async () => {
    if (!question.trim()) return;

    try {
      const res = await axios.post("http://localhost:8000/ask-bot/", { question });
      const answer = res.data.response;

      setChatHistory(prev => [...prev, { question, answer }]);
      setQuestion('');
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, { question, answer: "Failed to get response" }]);
    }
  };

  // remove previously given pdf if removed from storage - also option to remove uploaded pdfs
  return (
    <div className="chatbox-container">
      <div className="chatbox-window">
        {chatHistory.map((chat, index) => (
          <div key={index} className="chatbox-message">
            <div><strong>You:</strong> {chat.question}</div>
            <div><strong>Bot:</strong> <p style={{ whiteSpace: 'pre-line' }}>{chat.answer}</p></div>
          </div>
        ))}
      </div>

      <div className="chatbox-input-container">
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="chatbox-input"
        />
        <button
          onClick={askBot}
          disabled={!question.trim()}
          className="chatbox-button"
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
