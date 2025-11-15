import { useState, useEffect, useCallback } from "react";
import NavbarComponent from "../components/NavbarComponent";
import GraphComponent from "../components/GraphComponent";
import api from "../helpers/api";
import styles from "../styles/page_styles/GraphPage.module.css";

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

  const selectedNodeLinkedNodes = selectedNodeId
    ? graphData.links
        .filter(
          (l) =>
            resolveId(l.source) === selectedNodeId ||
            resolveId(l.target) === selectedNodeId
        )
        .map((l) => {
          const otherId =
            resolveId(l.source) === selectedNodeId
              ? resolveId(l.target)
              : resolveId(l.source);
          return (
            graphData.nodes.find((n) => n.id === otherId) || {
              id: otherId,
              title: otherId,
            }
          );
        })
    : [];

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
        <aside
          className={styles.nodeDetails}
          style={{
            position: "fixed",
            right: 20,
            top: 80,
            width: 320,
            maxHeight: "70vh",
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => setSelectedNodeId(null)}
            style={{
              float: "right",
              border: "none",
              background: "transparent",
              fontSize: 18,
            }}
            aria-label="Close"
          >
            ×
          </button>
          <h3 style={{ marginTop: 4 }}>
            {selectedNode.title || selectedNode.id}
          </h3>
          <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
            {selectedNode.description}
          </div>
          <div style={{ marginTop: 12 }}>
            <strong>Linked nodes</strong>
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
          </div>
        </aside>
      )}
    </div>
  );
}

export default GraphPage;
