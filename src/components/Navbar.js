import logo from './logo.png';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { IoPersonAddOutline } from 'react-icons/io5';
import { AiOutlineContacts } from 'react-icons/ai';
import { LuHandHelping } from 'react-icons/lu';
import { FaTrashAlt } from 'react-icons/fa';

const Navbar = ({ show, chatHistory, onDeleteChat, onNewChat }) => {
  return (
    <div className={show ? 'sidenav active' : 'sidenav'}>
      <img src={logo} alt="logo" className="logo" />

      <button className="new-chat-btn" onClick={onNewChat}>
        🆕 New Chat
      </button>

      <ul className="nav-links">
        <li><Link to="/"><FiHome /> Home</Link></li>
        <li><Link to="/about"><IoPersonAddOutline /> About</Link></li>
        <li><Link to="/"><AiOutlineContacts /> Contact</Link></li>
        <li><Link to="/"><LuHandHelping /> Help</Link></li>
      </ul>

      <div className="chat-history">
        <h4 className="chat-history-title">📝 Recent Chats</h4>
        <ul className="chat-titles">
          {chatHistory.length === 0 ? (
            <li className="chat-title-placeholder">No recent chats</li>
          ) : (
            chatHistory.map((title, index) => (
              <li key={index} className="chat-title-item">
                <div className="chat-title-row">
                  <Link to="/" className="chat-title-text">{title}</Link>
                  <FaTrashAlt
                    className="chat-delete-icon"
                    onClick={() => onDeleteChat(index)}
                    title="Delete Chat"
                  />
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
