import React, { useState } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("Graph View");

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const navLinks = ["Graph View", "Table View", "User Profile"];

  return (
    <header className="navbar-header">
      <nav className="navbar">
        <div className="navbar-brand">
          <a href="#">GraphMind</a>
        </div>
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href="#"
                className={activeLink === link ? "active" : ""}
                onClick={() => handleLinkClick(link)}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
