import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Graph from "../components/Graph";
import api from "../api";
import "../styles/Home.css";

function Home() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAddNodeForm, setShowAddNodeForm] = useState(false);

  const [newNodeTitle, setNewNodeTitle] = useState("");
  const [newNodeNotes, setNewNodeNotes] = useState("");

  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    async function fetchGraphData() {
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
                                    fromNodeId
                                    toNodeId
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
        const nodesRaw = res.data.data.searchNodes;

        const nodes = nodesRaw.map((node) => ({
          id: node.id,
          title: node.title,
          description: node.description,
        }));

        const links = [];
        nodesRaw.forEach((node) => {
          node.connections.forEach((conn) => {
            links.push({
              source: node.id,
              target: conn.node.id,
              type: conn.relationship.type,
              notes: conn.relationship.notes,
            });
          });
        });

        setGraphData({ nodes, links });
      } catch (error) {
        console.error("Failed to fetch graph data:", error);
      }
    }
    fetchGraphData();
  }, []);

  async function handleAddNode(e) {
    try {
      e.preventDefault();

      const mutationString = `
        mutation AddNode($title: String!, $description: String!) {
          addNode(input: { title: $title, description: $description }) {
            id
            title
            description
          }
        }
      `;

      const variables = {
        title: newNodeTitle,
        description: newNodeNotes,
      };

      const response = await api.post("/graphql", {
        mutationString,
        variables,
      });

      const confirmationData = await response.data;

      if (confirmationData.errors) {
        console.error("GraphQL Errors:", confirmationData.errors);
      } else {
        alert(
          `New player created with ID: ${confirmationData.data.addNode.id}`
        );
      }
      console.log(result);

      setShowAddNodeForm(false);
      setNewNodeTitle("");
      setNewNodeNotes("");
    } catch (error) {
      console.error("Network or API call error:", error);
    }
  }

  return (
    <div className="Home">
      <button
        className="toggle-sidebar"
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
      </button>

      {showSidebar && <Sidebar />}

      <Graph data={graphData} sidebarVisible={showSidebar} />

      <button className="create-node" onClick={() => setShowAddNodeForm(true)}>
        Add Node
      </button>

      {showAddNodeForm && (
        <div className="overlay" onClick={() => setShowAddNodeForm(false)}>
          <div className="node-form" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="node-form-close"
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

              <div className="node-form-actions">
                <button
                  type="submit"
                  className="btn primary"
                  onClick={(e) => handleAddNode(e)}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="btn"
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

export default Home;
