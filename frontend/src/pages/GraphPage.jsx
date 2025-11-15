import { useState, useEffect, useCallback } from "react";
import NavbarComponent from "../components/NavbarComponent";
import GraphComponent from "../components/GraphComponent";
import api from "../helpers/api";
import styles from "../styles/page_styles/GraphPage.module.css";
import authStyles from "../styles/component_styles/AuthFormComponent.module.css";

function GraphPage() {
  const [showAddNodeForm, setShowAddNodeForm] = useState(false);
  const [newNodeTitle, setNewNodeTitle] = useState("");
  const [newNodeNotes, setNewNodeNotes] = useState("");
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedLinkIds, setSelectedLinkIds] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const fetchGraphData = useCallback(async () => {
    try {
      const query = `
        query {
          searchNodes(titleQuery: "") {
            id
            title
            description
            connections {
              relationship {
                id
                type
                notes
                from { id }
                to { id }
              }
              node {
                id
                title
                description
              }
            }
          }
        }
      `;
      const res = await api.post("/graphql", { query });
      if (res.data.errors) {
        console.error("Failed to fetch graph data:", res.data.errors);
        return;
      }
      const nodesRaw = res.data.data.searchNodes;
      const nodes = nodesRaw.map((node) => ({
        id: node.id,
        title: node.title,
        description: node.description,
      }));
      const links = [];
      nodesRaw.forEach((node) => {
        node.connections.forEach((conn) => {
          const reverseLinkExists = links.some(
            (l) => l.source === conn.node.id && l.target === node.id
          );
          if (!reverseLinkExists) {
            links.push({
              source: conn.relationship.from.id,
              target: conn.relationship.to.id,
              type: conn.relationship.type,
              notes: conn.relationship.notes,
            });
          }
        });
      });
      setGraphData({ nodes, links });
    } catch (error) {
      console.error("Failed to fetch graph data:", error);
    }
  }, []);

  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  async function handleAddNode(e) {
    e.preventDefault();
    try {
      const mutationString = `
        mutation AddNode($title: String!, $description: String!) {
          addNode(input: { title: $title, description: $description }) {
            id
            title
            description
          }
        }
      `;
      const variables = { title: newNodeTitle, description: newNodeNotes };
      const response = await api.post("/graphql", {
        query: mutationString,
        variables,
      });

      const confirmationData = response.data;
      if (confirmationData.errors) {
        console.error("GraphQL Errors:", confirmationData.errors);
        alert("Error creating node. See console for details.");
        return; // Exit if there's an error
      }

      const newNode = confirmationData.data.addNode;
      let newLinks = [];

      // Link to existing nodes if any are selected
      if (selectedLinkIds.length > 0) {
        const linkMutation = `
          mutation LinkNodes($fromId: ID!, $toId: ID!, $type: RelationshipType!) {
            linkNodes(input: { fromNodeId: $fromId, toNodeId: $toId, type: $type }) {
              id
            }
          }
        `;
        for (const toId of selectedLinkIds) {
          try {
            await api.post("/graphql", {
              query: linkMutation,
              variables: { fromId: newNode.id, toId: toId, type: "RELATED_TO" },
            });
          } catch (linkError) {
            console.error(`Failed to link to node ${toId}:`, linkError);
          }
        }
        // Prepare new links for local state update
        newLinks = selectedLinkIds.map((toId) => ({
          source: newNode.id,
          target: toId,
          type: "RELATED_TO",
          notes: "",
        }));
      }

      setGraphData((prevData) => ({
        nodes: [...prevData.nodes, newNode],
        links: [...prevData.links, ...newLinks],
      }));

      alert(`New node created with ID: ${newNode.id}`);
      console.log("Success:", confirmationData.data);

      // Reset form state
      setShowAddNodeForm(false);
      setNewNodeTitle("");
      setNewNodeNotes("");
      setSelectedLinkIds([]);
    } catch (error) {
      console.error("Network or API call error:", error);
      alert("A network error occurred. Please try again.");
    }
  }

  function toggleSelectLink(id) {
    setSelectedLinkIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSelectChange(e) {
    const options = Array.from(e.target.options || []);
    const selected = options.filter((o) => o.selected).map((o) => o.value);
    setSelectedLinkIds(selected);
  }

  function handleNodeClick(id) {
    setSelectedNodeId(id);
  }

  function resolveId(val) {
    return val && typeof val === "object" ? val.id : val;
  }

  const selectedNode = selectedNodeId
    ? graphData.nodes.find((n) => n.id === selectedNodeId)
    : null;

  // Compute only direct neighbors (no transitive expansion) and dedupe
  const selectedNodeLinkedNodes = (() => {
    if (!selectedNodeId) return [];
    const neighborIdSet = new Set();
    for (const l of graphData.links) {
      const s = resolveId(l.source);
      const t = resolveId(l.target);
      if (s === selectedNodeId && t !== selectedNodeId) neighborIdSet.add(t);
      if (t === selectedNodeId && s !== selectedNodeId) neighborIdSet.add(s);
    }
    const neighbors = [];
    for (const id of neighborIdSet) {
      const node = graphData.nodes.find((n) => n.id === id) || {
        id,
        title: id,
      };
      neighbors.push(node);
    }
    return neighbors;
  })();

  async function handleDeleteNode(id) {
    if (!id) return;
    const ok = window.confirm(
      `Delete node "${
        graphData.nodes.find((n) => n.id === id)?.title || id
      }"? This will remove all its links.`
    );
    if (!ok) return;
    try {
      const mutation = `mutation DeleteNode($id: ID!) { deleteNode(id: $id) }`;
      const res = await api.post("/graphql", {
        query: mutation,
        variables: { id },
      });
      if (res.data.errors) {
        console.error("Delete errors:", res.data.errors);
        alert("Failed to delete node. See console for details.");
        return;
      }
      const deletedId = res.data.data.deleteNode;
      setGraphData((prev) => ({
        nodes: prev.nodes.filter((n) => n.id !== deletedId),
        links: prev.links.filter(
          (l) =>
            resolveId(l.source) !== deletedId &&
            resolveId(l.target) !== deletedId
        ),
      }));
      setSelectedNodeId(null);
      alert(`Deleted node ${deletedId}`);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Network error while deleting node.");
    }
  }

  return (
    <div className={styles.graphPage}>
      <NavbarComponent />
      <GraphComponent data={graphData} onNodeClick={handleNodeClick} />
      <button
        className={styles.createNode}
        onClick={() => setShowAddNodeForm(true)}
      >
        Add Node
      </button>

      {showAddNodeForm && (
        <div
          className={styles.overlay}
          onClick={() => setShowAddNodeForm(false)}
        >
          <div className={styles.nodeForm} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.nodeFormClose}
              onClick={() => setShowAddNodeForm(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3>Add Node</h3>
            <form onSubmit={handleAddNode}>
              <label>
                Title
                <input
                  value={newNodeTitle}
                  onChange={(e) => setNewNodeTitle(e.target.value)}
                  placeholder="Node title"
                  required
                />
              </label>
              <label>
                Content
                <textarea
                  value={newNodeNotes}
                  onChange={(e) => setNewNodeNotes(e.target.value)}
                  placeholder="Node content"
                  rows={6}
                  required
                />
              </label>
              <div style={{ textAlign: "left", marginTop: 8 }}>
                <strong>Link to existing nodes</strong>
                <div
                  style={{ maxHeight: 200, overflowY: "auto", marginTop: 8 }}
                >
                  {graphData.nodes.length === 0 && <div>No existing nodes</div>}
                  {graphData.nodes.length > 0 && (
                    <select
                      multiple
                      value={selectedLinkIds}
                      onChange={handleSelectChange}
                      style={{ width: "100%", minHeight: 120 }}
                      aria-label="Select nodes to link"
                    >
                      {graphData.nodes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.title || n.id}
                        </option>
                      ))}
                    </select>
                  )}
                  <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                    Hold Cmd / Ctrl (multi-key) to select multiple nodes.
                  </div>
                </div>
              </div>
              <div className={styles.nodeFormActions}>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.primary}`}
                >
                  Add
                </button>
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => setShowAddNodeForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedNode && (
        <div
          onClick={() => setSelectedNodeId(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            className={authStyles.authFormContainer}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 600, width: "100%", color: "#000" }}
          >
            <button
              onClick={() => setSelectedNodeId(null)}
              style={{
                float: "right",
                border: "none",
                background: "transparent",
                fontSize: 20,
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h1 className={authStyles.formTitle} style={{ marginTop: 4 }}>
              {selectedNode.title || selectedNode.id}
            </h1>
            <section style={{ marginTop: 8 }}>
              <h4 style={{ marginBottom: 6 }}>Notes</h4>
              <div style={{ whiteSpace: "pre-wrap", color: "#000" }}>
                {selectedNode.description || "(No notes)"}
              </div>
            </section>

            <section
              style={{
                marginTop: 18,
                borderTop: "1px solid #e6e6e6",
                paddingTop: 12,
              }}
            >
              <h4 style={{ marginBottom: 6 }}>Linked nodes</h4>
              {selectedNodeLinkedNodes.length === 0 && (
                <div style={{ marginTop: 6 }}>No linked nodes</div>
              )}
              {selectedNodeLinkedNodes.length > 0 && (
                <ul style={{ marginTop: 8, paddingLeft: 16 }}>
                  {selectedNodeLinkedNodes.map((ln) => (
                    <li key={ln.id} style={{ marginBottom: 6 }}>
                      <button
                        onClick={() => setSelectedNodeId(ln.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#0366d6",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        {ln.title || ln.id}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <div
              style={{
                marginTop: 18,
                display: "flex",
                justifyContent: "flex-end",
                gap: 12,
              }}
            >
              <button
                onClick={() => setSelectedNodeId(null)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <button
                onClick={() => handleDeleteNode(selectedNode.id)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#d9534f",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Delete Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GraphPage;
