// graphUtils.jsx
import { hsvToRgb } from "./colorUtils";
// Function to calculate the position of a node on the SVG canvas
export const calculatePosition = (index, total, radius = 150) => {
  const angle = (index / total) * 2 * Math.PI;
  return {
    x: 200 + radius * Math.cos(angle),
    y: 200 + radius * Math.sin(angle),
  };
};

// Function to check if an edge exists between two nodes
export const hasEdge = (edges, node1, node2) => {
  return edges.some(
    (edge) =>
      (edge[0] === node1 && edge[1] === node2) ||
      (edge[0] === node2 && edge[1] === node1)
  );
};

// Function to get the color for a node
export const getColor = (index, totalColors) => {
  if (totalColors === 0) return "white";
  const hue = index / totalColors;
  // Assuming hsvToRgb function is exported from colorUtils.jsx
  const rgb = hsvToRgb(hue, 1, 1);
  return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
};

// Function to determine if two points are close enough
export const isCloseEnough = (point1, point2, distance) => {
  return (
    Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2) <=
    distance
  );
};

export const randomNodes = (numNodes) => {
  const nodes = [];
  for (let i = 0; i < numNodes; i++) {
    nodes.push(i);
  }
  return nodes;
};

export const randomEdges = (nodes) => {
  const ratio = 0.1;
  const totalPossibleEdges = (nodes.length * (nodes.length - 1)) / 2;
  const numberOfEdgesToCreate = Math.floor(totalPossibleEdges * ratio);
  const edges = new Map();

  while (edges.size < numberOfEdgesToCreate) {
    const index1 = Math.floor(Math.random() * nodes.length);
    const index2 = Math.floor(Math.random() * nodes.length);

    if (index1 !== index2) {
      // Create a string key for the edge that is invariant to node order
      const key =
        index1 < index2 ? `${index1}_${index2}` : `${index2}_${index1}`;

      // If the edge isn't already in the map, add it
      if (!edges.has(key)) {
        edges.set(key, [nodes[index1], nodes[index2]]);
      }
    }
  }

  // Extract just the edges from the map
  return Array.from(edges.values());
};
