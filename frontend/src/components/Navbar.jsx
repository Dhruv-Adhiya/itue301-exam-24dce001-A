import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">MedCare Plus</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/doctors">Doctors</Link>
        <Link to="/booking">Booking</Link>
      </div>
    </nav>
  );
};

export default Navbar;
