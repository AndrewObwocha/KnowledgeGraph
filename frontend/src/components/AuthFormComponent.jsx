import { useState } from "react";
import styles from "../styles/component_styles/AuthFormComponent.module.css";
import api from "../helpers/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../helpers/constants";
import { useNavigate } from "react-router-dom";

function AuthFormComponent({ method, route }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const methodName = method === "login" ? "Login" : "Register";

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(route, { username, password });

      if (method === "login" && res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
        localStorage.setItem(REFRESH_TOKEN, res.data.refreshToken);
        navigate("/graphview");
      } else if (method === "register" && res.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.authFormContainer}>
      <h1 className={styles.formTitle}> {methodName} </h1>
      <form className={styles.authForm} onSubmit={(e) => handleSubmit(e)}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className={styles.formInput}
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={styles.formInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.formButtons}>
          <button
            type="button"
            className={`${styles.formButton} ${styles.cancelButton}`}
          >
            Cancel
          </button>
          <button className={styles.formButton} type="submit">
            {methodName} {/* It's better to use the dynamic methodName here */}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthFormComponent;
