import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <h2>HR Assistant</h2>
      </div>
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/pdf-upload">
            Upload PDF
          </NavLink>
        </li>
        <li>
          <NavLink to="/chat">
            Chat
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
