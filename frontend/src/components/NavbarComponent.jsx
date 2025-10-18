import React, { useState } from "react";
import styles from "../styles/component_styles/NavbarComponent.module.css";

const NavbarComponent = () => {
  const [activeLink, setActiveLink] = useState("Graph View");

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
  };

  const navLinks = ["Graph View", "Table View", "User Profile"];

  return (
    <header className={styles.navbarHeader}>
      <nav className={styles.navbar}>
        <div className={styles.navbarBrand}>
          <a href="">GraphMind</a>
        </div>
        <ul className={styles.navbarLinks}>
          {navLinks.map((link) => (
            <li key={link}>
              <a
                href=""
                className={`${styles.navbarLink} ${
                  activeLink === link ? styles.active : ""
                }`}
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

export default NavbarComponent;
