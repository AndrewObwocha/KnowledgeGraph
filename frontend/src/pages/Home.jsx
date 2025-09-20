import { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import Graph from './Graph';
import api from '../api';
import '../styles/Home.css';

function Home() {
    const [showSidebar, setShowSidebar] = useState(true);
    const [graphData, setGraphData] = useState({ nodes: [], links: [] })        
    
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

                const res = await api.post('/graphql', { query });
                const nodesRaw = res.data.data.searchNodes;

                const nodes = nodesRaw.map(node => ({
                    id: node.id,
                    title: node.title,
                    description: node.description
                }));

                const links = [];
                nodesRaw.forEach(node => {
                    node.connections.forEach(conn => {
                        links.push({
                            source: node.id,
                            target: conn.node.id,
                            type: conn.relationship.type,
                            notes: conn.relationship.notes
                        });
                    });
                });

                setGraphData({ nodes, links });
            setGraphData(res.data);
          } catch (error) {
            console.error("Failed to fetch graph data:", error);
          }
        }
        fetchGraphData();
    }, []);
    
    return (
        <div className="Home">
            <button className="toggle-sidebar" onClick={() => setShowSidebar((prev) => !prev)}>
              {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
            </button>
            {showSidebar && <Sidebar />}
            <Graph data={graphData} sidebarVisible={showSidebar} />
        </div>
    );
}

export default Home;