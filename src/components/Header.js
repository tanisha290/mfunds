import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; 

/**
 * Header Component
 * 
 * Displays the navigation bar with links to different sections of the application.
 */
function Header() {
    return (
        <nav className="navbar">
            <div className="logo">Invest Buddy</div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/compare">Compare</Link></li>
                <li><Link to="/calculate">Calculate</Link></li>
                <li><Link to="/personalize">Personalize</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        </nav>
    );
}

export default Header;
