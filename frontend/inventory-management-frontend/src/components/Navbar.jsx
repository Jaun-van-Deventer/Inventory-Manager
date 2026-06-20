import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';  // Importing the CSS file

function Navbar() {
  return (
    <nav className="nav">
      <ul className="ul">
        <li className="li">
          <Link to="/" className="link">Dashboard</Link>
        </li>
        <li className="li">
          <Link to="/products" className="link">Products</Link>
        </li>
        <li className="li">
          <Link to="/add-product" className="link">Add Product</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
