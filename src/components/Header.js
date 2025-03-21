import React from "react";
import { Link } from "react-router-dom";
import "./Header.css"; 

function Header() {
    return (
        <nav className="navbar">
            <div className="logo">Invest Buddy</div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/Compare">Compare</Link></li>
                <li><Link to="/Calculate">Calculate</Link></li>
                <li><Link to="/login">Login</Link></li>
            </ul>
        </nav>
    );
}

export default Header;
