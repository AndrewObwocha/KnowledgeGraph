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
        mutation AddNode($newNodeTitle: Str!, $newNodeNotes: Str!) {
          addNode(title: $newNodeTitle, description: $newNodeNotes) {
            id
            title
          }
        }
      `;

      const response = await api.post("/graphql", { mutationString });
      const confirmationData = await response.json();

      if (confirmationData.errors) {
        console.error("GraphQL Errors:", confirmationData.errors);
      } else {
        alert(
          `New player created with ID: ${confirmationData.data.addNode.id}`
        );
      }
      console.log(result);
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
        <form className="node-form" onSubmit={(event) => handleAddNode(event)}>
          <label for="title">Title: </label>
          <input
            id="title"
            type="text"
            name="title"
            value={newNodeTitle}
            onChange={(event) => setNewNodeTitle(event.target.value)}
          />

          <label for="notes">Content: </label>
          <input
            id="notes"
            type="textarea"
            name="notes"
            value={newNodeNotes}
            onChange={(event) => setNewNodeNotes(event.target.value)}
          />

          <input id="submit" type="submit" />
        </form>
      )}
    </div>
  );
}

export default Home;
