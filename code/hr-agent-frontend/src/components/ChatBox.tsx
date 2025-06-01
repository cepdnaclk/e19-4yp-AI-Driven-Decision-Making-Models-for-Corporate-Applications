import React, { useState } from 'react';
import axios from 'axios';

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

  return (
    <div style={{ padding: '1rem', width: '90rem', marginLeft: '40px', margin: 'auto' }}>
      <div style={{ border: '1px solid #ccc', padding: '1rem', height: '400px', overflowY: 'auto' }}>
        {chatHistory.map((chat, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div><strong>You:</strong> {chat.question}</div>
            <div><strong>Bot:</strong> <p style={{ whiteSpace: 'pre-line' }}>{chat.answer}</p></div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Ask your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: '86%', marginLeft: '45px', marginRight: '19px' }}
        />
        <button onClick={askBot} disabled={!question.trim()}>Ask</button>
      </div>
    </div>
  );

};

export default ChatBox;
