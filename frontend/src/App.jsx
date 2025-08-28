import Sidebar from './components/Sidebar';
import Graph from './components/Graph';
import './styles/App.css';

const graphData = {
  nodes: [
    { id: "Quantum Physics" },
    { id: "Machine Learning" },
    { id: "Neuroscience" },
    { id: "Renewable Energy" },
    { id: "Space Exploration" },
    { id: "Ancient History" },
    { id: "Fossils" },
  ],
  links: [
    { source: "Quantum Physics", target: "Machine Learning" },
    { source: "Neuroscience", target: "Machine Learning" },
    { source: "Quantum Physics", target: "Space Exploration" },
    { source: "Renewable Energy", target: "Space Exploration" },
    { source: "Renewable Energy", target: "Neuroscience" },
    { source: "Fossils", target: "Ancient History" },
    { source: "Machine Learning", target: "Space Exploration" },
  ]
};


function App() {
  return (
    <div className="App">
      <Sidebar />
      <main>
        <Graph data={graphData} />
      </main>
    </div>
  );
}

export default App;