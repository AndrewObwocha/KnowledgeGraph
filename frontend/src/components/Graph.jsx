import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../styles/Graph.css';

const generateBlobPath = (radius = 50, numAnchors = 16, variance = 0.25) => {
  const points = [];
  
  // Calculate evenly spaced angles around a circle based on numAnchors
  const totalAngle = (Math.PI * 2);
  const angleStep = totalAngle / numAnchors; 

  for (let i = 0; i < numAnchors; i++) {
    const currentAngle = i * angleStep;
   
    // Calculate a random radius for this anchor point
    const randomScalar = 1 + (Math.random() - 0.5) * variance
    const randomRadius = radius * randomScalar;

    // Convert from polar coordinates (angle, radius) to Cartesian (x, y)
    const x = randomRadius * Math.cos(currentAngle);
    const y = randomRadius * Math.sin(currentAngle);
    
    points.push([x, y]);
  }
  
  // Return a string representing a smooth, closed path that goes through all our points
  return d3.line().curve(d3.curveCatmullRomClosed)(points);
};


const Graph = ({ data }) => {
  const svgRef = useRef();
  const simulationRef = useRef();
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    // Add a new attribute to each node object defininig their SVG path
    const initialNodes = data.nodes.map(node => ({
      ...node,
      d: generateBlobPath()
    }));

    // D3 Force Simulation Setup
    simulationRef.current = d3.forceSimulation(initialNodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(150))  // Connect nodes with links and set link distance
      .force("charge", d3.forceManyBody().strength(-300))  // All nodes repel each other
      .force("center", d3.forceCenter(400, 300));  // All nodes attracted to center of SVG

    // Re-render on every tick of the simulation
    simulationRef.current.on("tick", () => {
      setNodes([...simulationRef.current.nodes()]);
      setLinks([...data.links]);
    });

    // Initialize state to trigger the first render
    setNodes(initialNodes);
    setLinks(data.links);

    // Cleanup function to stop the simulation when the component unmounts
    return () => {
      simulationRef.current.stop();
    };

  }, [data]); // Dependency on `data` allows re-initialization if data changes


  // Drag effect needs to be reapplied whenever nodes change
  useEffect(() => {
    if (nodes.length === 0) return;

    const drag = d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulationRef.current.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulationRef.current.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
      
    // Select nodes after rendering and reapply drag behavior
    d3.select(svgRef.current)
      .selectAll('.node-group')
      .data(nodes, d => d.id)
      .call(drag);

  }, [nodes]); // Dependency on `nodes` ensures this runs after render

  return (
    <svg ref={svgRef} width="800" height="600" className="graph-container">
      <g className="links">
        {links.map((link) => (
          
          (typeof link.source === 'object' && typeof link.target === 'object') && (
            <line
              key={`${link.source.id}-${link.target.id}`}
              className="link"
              x1={link.source.x}
              y1={link.source.y}
              x2={link.target.x}
              y2={link.target.y}
            />
          )
        ))}
      </g>
      <g className="nodes">
        {nodes.map((node, i) => (
          node.x && (
            <g
              key={node.id}
              className="node-group"
              transform={`translate(${node.x}, ${node.y})`}
            >
              <path
                className={`node-shape color-${i % 5}`}
                d={node.d}
              />
              <text className="node-label" textAnchor="middle" dy="0.3em">
                {node.id}
              </text>
            </g>
          )
        ))}
      </g>
    </svg>
  );
};

export default Graph;