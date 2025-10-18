import { useNavigate } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import styles from "../styles/page_styles/HomePage.module.css";
import GraphmindLogo from "../assets/Graphmind.png";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <NavbarComponent />
      <div className={styles.homepageContainer}>
        <img
          src={GraphmindLogo}
          className={styles.homepageLogo}
          alt="Graphmind Logo"
        />

        <h1 className={styles.homepageTitle}>Welcome to GraphMind</h1>

        <p className={styles.homepageSubtitle}>Open the hood to your brain</p>

        <div className={styles.homepageActions}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => navigate("/register")}
          >
            Register
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
