import React, { useState } from 'react';
import axios from 'axios';
import './EmployeeFeedback.css';

const EmployeeFeedbackForm: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!message.trim()) return;
    await axios.post('http://localhost:8000/feedback/submit-question/', { message });
    setMessage('');
    alert("Your feedback has been submitted.");
  };

  return (
    <div className="feedback-form">
      <textarea
        placeholder="Describe your issue or suggestion."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={!message.trim()}>
        Submit Feedback
      </button>
    </div>
  );
};

export default EmployeeFeedbackForm;
