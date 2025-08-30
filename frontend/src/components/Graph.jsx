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
  const gRef = useRef();  // Ref for the <g> element that holds nodes/links
  const simulationRef = useRef();

  useEffect(() => {
    // Select the SVG and the groups for D3 to control
    const svg = d3.select(svgRef.current);
    const g = d3.select(gRef.current);
    const linkG = g.select('.links');
    const nodeG = g.select('.nodes');

    // Create a new simulation if one doesn't exist
    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(400, 300));
    }

    // Update the simulation with new data
    const simulation = simulationRef.current;
    simulation.nodes(data.nodes);
    simulation.force("link").links(data.links);

    // D3's drag behavior 
    const drag = d3.drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Update links and nodes directly using D3 (avoid triggering React re-renders)
    const link = linkG.selectAll("line")
      .data(data.links, d => `${d.source.id}-${d.target.id}`)
      .join("line")
      .attr("class", "link");

    const node = nodeG.selectAll(".node-group")
      .data(data.nodes, d => d.id)
      .join(
        enter => {
          const g = enter.append("g")
            .attr("class", "node-group")
            .call(drag); // Apply drag behavior on enter
          g.append("path")
            .attr("class", (d, i) => `node-shape color-${i % 5}`)
            .attr("d", () => generateBlobPath());
          g.append("text")
            .attr("class", "node-label")
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em")
            .text(d => d.id);
          return g;
        },
        update => update,
        exit => exit.remove()
      );

    // Update element attributes directly, not React state on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
      node.attr("transform", d => `translate(${d.x}, ${d.y})`);
    });

    // Cleanup function to stop simulation when component unmounts
    return () => simulation.stop();

  }, [data]); // Re-run effect only when data changes

    return (
    <svg ref={svgRef} width="800" height="600" className="graph-container">
      <g ref={gRef}>
        <g className="links"></g>
        <g className="nodes"></g>
      </g>
    </svg>
  );
};


export default Graph;