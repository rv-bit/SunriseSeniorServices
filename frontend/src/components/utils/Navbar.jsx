import './Navbar.css';

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar () {
    const [menuOpen, setMenu] = useState(false);

    const Links = [
        { name: "Login", path: "/login" },
        { name: "Signup", path: "/signup" },
    ]

    return (
        <nav>
            <Link to="/" className="title">Home</Link>

            <div className = "menu" onClick={() => {setMenu(!menuOpen)}}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className = {menuOpen ? "open" : ""}>
                {Links.map((link, index) => {
                    return (
                        <li key={link.path}>
                            <NavLink to={link.path}>{link.name}</NavLink>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}