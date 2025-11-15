import { useState, useEffect, useCallback } from "react";
import NavbarComponent from "../components/NavbarComponent";
import api from "../helpers/api";
import styles from "../styles/page_styles/TablePage.module.css";

function TablePage() {
  const [rows, setRows] = useState([]);

  const fetchNodes = useCallback(async () => {
    try {
      const query = `
        query {
          searchNodes(titleQuery: "") {
            id
            title
            description
            connections {
              relationship { id }
              node { id title }
            }
          }
        }
      `;
      const res = await api.post("/graphql", { query });
      if (res.data.errors) {
        console.error("Failed to fetch nodes:", res.data.errors);
        return;
      }
      const nodesRaw = res.data.data.searchNodes || [];

      // Map to a shape useful for table rows
      const mapped = nodesRaw.map((n) => {
        const linked = (n.connections || []).map((c) => c.node).filter(Boolean);
        const linkedUnique = Array.from(
          new Map(linked.map((ln) => [ln.id, ln])).values()
        );
        return {
          id: n.id,
          title: n.title,
          description: n.description,
          linkedNodes: linkedUnique,
        };
      });

      setRows(mapped);
    } catch (err) {
      console.error("Error fetching table nodes:", err);
    }
  }, []);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  return (
    <div className={styles.tablePage}>
      <NavbarComponent />
      <main className={styles.content}>
        <h2 className={styles.title}>Nodes</h2>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Notes</th>
                <th>Linked Nodes</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: 24 }}>
                    No nodes found
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className={styles.idCell}>{r.id}</td>
                  <td className={styles.titleCell}>
                    {r.title || "(untitled)"}
                  </td>
                  <td className={styles.notesCell}>
                    <div className={styles.notesInner}>
                      {r.description || "(No notes)"}
                    </div>
                  </td>
                  <td className={styles.linkedCell}>
                    {r.linkedNodes.length === 0
                      ? "—"
                      : r.linkedNodes.map((ln) => ln.title || ln.id).join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default TablePage;
