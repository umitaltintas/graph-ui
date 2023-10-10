import React, { useState } from "react";

const GraphSVG = ({ nodes, edges, graphColoring, onAddEdge }) => {
  const radius = 150;

  // Convert HSV to RGB
  function hsvToRgb(h, s, v) {
    let r, g, b;
    let i;
    let f, p, q, t;
    if (arguments.length === 1) {
      (s = h.s), (v = h.v), (h = h.h);
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }
  const totalColors = graphColoring
    ? Object.keys(graphColoring).reduce((acc, key) => {
        return Math.max(acc, graphColoring[key]);
      }, 0) + 1
    : 0;
  const hasEdge = (node1, node2) => {
    return edges.some(
      (edge) =>
        (edge[0] === node1 && edge[1] === node2) ||
        (edge[0] === node2 && edge[1] === node1)
    );
  };
  const getColor = (index) => {
    if (totalColors === 0) return "white"; // Return white if no colors are defined
    const hue = index / totalColors;
    const rgb = hsvToRgb(hue, 1, 1);
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  };

  const calculatePosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI;
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle),
    };
  };

  // State to track potential end node during dragging
  const [potentialEndNode, setPotentialEndNode] = useState(null);

  const isCloseEnough = (point1, point2, distance) => {
    return (
      Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2) <=
      distance
    );
  };

  const [isDragging, setIsDragging] = useState(false);
  const [startNode, setStartNode] = useState(null);
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (node) => {
    setIsDragging(true);
    setStartNode(node);
  };

  const handleMouseUp = (node) => {
    if (isDragging && startNode && node !== startNode) {
      onAddEdge([startNode, node]);
    }
    setIsDragging(false);
    setStartNode(null);
    setEndPosition({ x: 0, y: 0 });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const svgRect = e.target.ownerSVGElement.getBoundingClientRect();
      const currentPos = {
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top,
      };
      setEndPosition(currentPos);

      // Check if the current position is close enough to any node
      const closeNode = nodes.find((node, index) => {
        const nodePos = calculatePosition(index, nodes.length);
        return isCloseEnough(currentPos, nodePos, 30);
      });

      setPotentialEndNode(closeNode || null);
    }
  };

  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
    >
      <defs>
        <radialGradient id="graphGradient" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" style={{ stopColor: "#e0eafc" }} />
          <stop offset="100%" style={{ stopColor: "#cfd9df" }} />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="400" height="400" fill="url(#graphGradient)" />

      {/* Drawing edges */}
      {edges.map((edge) => {
        const startNode = calculatePosition(
          nodes.indexOf(edge[0]),
          nodes.length
        );
        const endNode = calculatePosition(nodes.indexOf(edge[1]), nodes.length);
        return (
          <line
            key={`edge-${edge[0]}-${edge[1]}`}
            x1={startNode.x}
            y1={startNode.y}
            x2={endNode.x}
            y2={endNode.y}
            stroke="black"
          />
        );
      })}

      {/* Dynamic edge while dragging */}
      {isDragging && startNode && (
        <line
          x1={calculatePosition(nodes.indexOf(startNode), nodes.length).x}
          y1={calculatePosition(nodes.indexOf(startNode), nodes.length).y}
          x2={
            potentialEndNode
              ? calculatePosition(nodes.indexOf(potentialEndNode), nodes.length)
                  .x
              : endPosition.x
          }
          y2={
            potentialEndNode
              ? calculatePosition(nodes.indexOf(potentialEndNode), nodes.length)
                  .y
              : endPosition.y
          }
          stroke="black"
          strokeDasharray="4"
        />
      )}

      {/* Drawing nodes and node labels */}
      {nodes.map((node, index) => {
        const position = calculatePosition(index, nodes.length);
        const nodeColor =
          graphColoring && graphColoring[node]
            ? getColor(graphColoring[node])
            : "white";

        return (
          <g
            key={`node-group-${node}`}
            onMouseDown={() => handleMouseDown(node)}
            onMouseUp={() => handleMouseUp(potentialEndNode || node)}
          >
            <circle
              key={`node-${node}`}
              cx={position.x}
              cy={position.y}
              r="10"
              fill={nodeColor}
              pointerEvents="all"
              // Colorize only if dragging and it's not the start node and there's no existing edge
              stroke={
                isDragging && startNode !== node && !hasEdge(startNode, node)
                  ? "blue"
                  : "black"
              }
              strokeWidth="3"
            />
            <text
              key={`node-label-${node}`}
              x={position.x}
              y={position.y}
              dy="4"
              fill="black"
              fontSize="12"
              textAnchor="middle"
              pointerEvents="bounding-box" // This makes sure the drag starts even when clicking on the empty space inside the text bounding box
            >
              {node}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default GraphSVG;
