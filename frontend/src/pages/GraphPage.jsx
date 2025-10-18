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

  return (
    <div className={styles.graphPage}>
      <NavbarComponent />
      <GraphComponent data={graphData} />
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
                  style={{ maxHeight: 160, overflowY: "auto", marginTop: 8 }}
                >
                  {graphData.nodes.length === 0 && <div>No existing nodes</div>}
                  {graphData.nodes.map((n) => (
                    <label
                      key={n.id}
                      style={{ display: "block", marginBottom: 6 }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLinkIds.includes(n.id)}
                        onChange={() => toggleSelectLink(n.id)}
                        style={{ marginRight: 8 }}
                      />
                      {n.title || n.id}
                    </label>
                  ))}
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
    </div>
  );
}

export default GraphPage;
