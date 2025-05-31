import React, { useState } from 'react';
import axios from 'axios';

const ChatBox: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const askBot = async () => {
    try {
      const res = await axios.post("http://localhost:8000/ask-bot/", { question });
      setResponse(res.data.response);
    } catch (err) {
      console.error(err);
      setResponse("Failed to get response");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Ask your question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={askBot} disabled={!question.trim()}>Ask</button>
      <p><strong>Bot:</strong> {response}</p>
    </div>
  );
};

export default ChatBox;
