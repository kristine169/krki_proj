import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/view-cards">View Cards</Link></li>
        <li><Link to="/add-card">Add Card</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
