// Updated ChatBox.js with separated MessageOutput component
import React, { useState, useRef, useEffect } from 'react';
import './ChatBox.css';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa';
import MessageOutput from './MessageOutput';

export default function ChatBox({ isSidebarOpen, addChatHeading, currentChatHeading, fileContent }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [hasSavedFirstMessage, setHasSavedFirstMessage] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (currentChatHeading) {
      const saved = localStorage.getItem(`chatMessages_${currentChatHeading}`);
      setMessages(saved ? JSON.parse(saved) : []);
    } else {
      setMessages([]);
    }
    setHasSavedFirstMessage(false);
  }, [currentChatHeading]);

  useEffect(() => {
    if (currentChatHeading) {
      localStorage.setItem(`chatMessages_${currentChatHeading}`, JSON.stringify(messages));
    }
  }, [messages, currentChatHeading]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSend = async () => {
    if (!message.trim()) return;

    if (!hasSavedFirstMessage) {
      const shortHeading = message.length > 30 ? message.slice(0, 30) + '...' : message;
      if (addChatHeading) addChatHeading(shortHeading);
      setHasSavedFirstMessage(true);
    }

    setMessages(prev => [...prev, { text: message, role: 'user' }]);
    const userMessage = message;
    setMessage('');

    try {
      const response = await fetch("http://localhost:8000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content: fileContent,
          question: userMessage
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { text: data.answer, role: 'ai' }]);
    } catch (error) {
      const errorMessage = error.response?.data?.error || '❌ AI failed to respond.';
      setMessages(prev => [...prev, { text: errorMessage, role: 'ai' }]);
    }
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsListening(true);

    recognition.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = function () {
      setIsListening(false);
    };

    recognition.onend = function () {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <>
      {isListening && (
        <div className="listening-overlay">
          <div className="listening-popup">🎤 Listening to you...</div>
        </div>
      )}

      <MessageOutput messages={messages} />

      <div className={`chatbox-modern ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="chatbox-top-actions">
          <button className="send-button-top" onClick={handleSend}>
            <FaPaperPlane />
          </button>
        </div>

        <textarea
          ref={inputRef}
          className="chat-input-modern"
          placeholder="Type your message or speak..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
        />

        <button className="icon-button" onClick={handleMicClick}>
          <FaMicrophone />
        </button>
      </div>
    </>
  );
}
