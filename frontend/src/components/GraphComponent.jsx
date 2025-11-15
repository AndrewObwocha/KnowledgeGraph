import { useEffect, useRef } from "react";
import * as d3 from "d3";
import styles from "../styles/component_styles/GraphComponent.module.css";

const generateBlobPath = (radius = 50, numAnchors = 16, variance = 0.25) => {
  const points = [];
  const totalAngle = Math.PI * 2;
  const angleStep = totalAngle / numAnchors;

  for (let i = 0; i < numAnchors; i++) {
    const currentAngle = i * angleStep;
    const randomScalar = 1 + (Math.random() - 0.5) * variance;
    const randomRadius = radius * randomScalar;
    const x = randomRadius * Math.cos(currentAngle);
    const y = randomRadius * Math.sin(currentAngle);
    points.push([x, y]);
  }

  return d3.line().curve(d3.curveCatmullRomClosed)(points);
};

const Graph = ({ data, onNodeClick }) => {
  const svgRef = useRef();
  const gRef = useRef();
  const simulationRef = useRef();

  useEffect(() => {
    const g = d3.select(gRef.current);
    const linkG = g.select(`.${styles.links}`);
    const nodeG = g.select(`.${styles.nodes}`);

    if (!simulationRef.current) {
      simulationRef.current = d3
        .forceSimulation()
        .force(
          "link",
          d3
            .forceLink()
            .id((d) => d.id)
            .distance(150)
        )
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(650, 400));
    }

    const simulation = simulationRef.current;
    simulation.nodes(data.nodes);
    simulation.force("link").links(data.links);

    const drag = d3
      .drag()
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

    const link = linkG
      .selectAll("line")
      .data(data.links, (d) => `${d.source.id}-${d.target.id}`)
      .join("line")
      .attr("class", styles.link);

    const node = nodeG
      .selectAll(`.${styles.nodeGroup}`)
      .data(data.nodes, (d) => d.id)
      .join(
        (enter) => {
          const g = enter
            .append("g")
            .attr("class", styles.nodeGroup)
            .call(drag)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
              if (onNodeClick) onNodeClick(d.id);
            });
          g.append("path")
            .attr(
              "class",
              (d, i) => `${styles.nodeShape} ${styles[`color-${i % 5}`]}`
            )
            .attr("d", () => generateBlobPath());
          g.append("text")
            .attr("class", styles.nodeLabel)
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em")
            .text((d) => d.title);
          return g;
        },
        (update) => update,
        (exit) => exit.remove()
      );

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
      node.attr("transform", (d) => `translate(${d.x}, ${d.y})`);
    });

    return () => simulation.stop();
  }, [data]);

  return (
    <svg ref={svgRef} className={styles.graphContainer}>
      <g ref={gRef}>
        <g className={styles.links}></g>
        <g className={styles.nodes}></g>
      </g>
    </svg>
  );
};

export default Graph;
