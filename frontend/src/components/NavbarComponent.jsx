import { NavLink } from "react-router-dom";
import styles from "../styles/component_styles/NavbarComponent.module.css";

const navLinks = [
  { label: "Graph View", to: "/graphview" },
  { label: "Table View", to: "/tableview" },
  { label: "User Profile", to: "/userview" },
];

const NavbarComponent = () => {
  return (
    <header className={styles.navbarHeader}>
      <nav className={styles.navbar}>
        <div className={styles.navbarBrand}>
          <NavLink to="/" className={styles.navbarBrandLink}>
            GraphMind
          </NavLink>
        </div>
        <ul className={styles.navbarLinks}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className={({ isActive }) => `${isActive ? styles.active : ""}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default NavbarComponent;
