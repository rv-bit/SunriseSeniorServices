import './Navbar.css';

import { useState, useContext, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from './Fetching';

export default function Navbar () {
    const {userAuthData} = useContext(AuthContext);    
    const [menuOpen, setMenu] = useState(false);

    const Links = [
        { name: "Login", path: "/login", auth: false},
        { name: "Sign Up", path: "/signup", auth: false},

        { name: "Log Out", path: "/logout", auth: true },
        { name: "Chat", path: "/chat", auth: true },
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
                    const showLink = (link.auth && userAuthData && userAuthData.isConnected) || (!link.auth && (!userAuthData || !userAuthData.isConnected));

                    return showLink ? (
                        <li key={link.path}>
                            <NavLink to={link.path}>{link.name}</NavLink>
                        </li>
                    ) : null;
                })}
            </ul>
        </nav>
    );
}