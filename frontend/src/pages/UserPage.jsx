import { useMemo } from "react";
import NavbarComponent from "../components/NavbarComponent";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../helpers/constants";
import authStyles from "../styles/component_styles/AuthFormComponent.module.css";
import styles from "../styles/page_styles/TablePage.module.css";

function parseJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

function UserPage() {
  const access = localStorage.getItem(ACCESS_TOKEN);
  const refresh = localStorage.getItem(REFRESH_TOKEN);

  const accessPayload = useMemo(() => parseJwt(access), [access]);
  const refreshPayload = useMemo(() => parseJwt(refresh), [refresh]);

  const username = accessPayload?.sub || accessPayload?.username || "(unknown)";

  return (
    <div className={styles.tablePage}>
      <NavbarComponent />
      <main className={styles.content}>
        <div
          style={{ display: "flex", justifyContent: "center", width: "100%" }}
        >
          <div
            className={authStyles.authFormContainer}
            style={{ maxWidth: 720, width: "100%" }}
          >
            <h1 className={authStyles.formTitle}>Your Profile</h1>

            {!access && (
              <div style={{ padding: 12 }}>
                You are not logged in. Please log in to see your profile.
              </div>
            )}

            {access && (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <strong>Username:</strong> {username}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <strong>Access token expires:</strong>{" "}
                  {accessPayload?.exp
                    ? new Date(accessPayload.exp * 1000).toLocaleString()
                    : "unknown"}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserPage;
