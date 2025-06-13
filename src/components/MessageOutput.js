import React from "react";
import "./MessageOutput.css";

export default function MessageOutput({ messages }) {
  return (
    <div className="chat-window-top">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${msg.role === 'ai' ? 'ai-message' : 'user-message'}`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
