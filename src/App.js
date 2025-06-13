// App.js
import './App.css';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import About from './components/pages/About';
import Home from './components/pages/Home';
import ChatBox from './components/ChatBox';
import Uploadbox from './components/Uploadbox';

function App() {
  const [showNav, setShowNav] = useState(false);

  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [hasSavedHeading, setHasSavedHeading] = useState(false); // ✅

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const addChatHeading = (newHeading) => {
    if (!newHeading || hasSavedHeading) return;

    setChatHistory(prev => {
      const filtered = prev.filter(h => h !== newHeading);
      const updated = [newHeading, ...filtered];
      return updated.slice(0, 20);
    });

    setHasSavedHeading(true); // ✅ prevent further updates in this session
  };

  return (
    <Router>
      <header className="head">
        <div className="menu">
          <GiHamburgerMenu onClick={() => setShowNav(!showNav)} />
        </div>
        <div className="title">AuraAI</div>
      </header>

      <Navbar
        show={showNav}
        chatHistory={chatHistory}
        onDeleteChat={(index) => {
          const updated = [...chatHistory];
          updated.splice(index, 1);
          setChatHistory(updated);
        }}
        onNewChat={() => {
          // ✅ Start fresh session
          setHasSavedHeading(false); // allow saving again in next session
          localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
          setChatHistory([...chatHistory]); // keep old but trigger re-render
          localStorage.removeItem("uploadedDoc");
          window.location.reload(); // or reset specific states instead
        }}
      />

      <Uploadbox />

      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>

      <ChatBox
        isSidebarOpen={showNav}
        addChatHeading={addChatHeading} // ✅ passed to ChatBox
      />
    </Router>
  );
}
export default App;