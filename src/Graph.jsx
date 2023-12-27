import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEdge } from "./redux/graphSlice";
import { hsvToRgb } from "./utils/colorUtils"; // Assume we've extracted the color conversion to a utility file.
import { calculatePosition, isCloseEnough } from "./utils/graphUtils"; // Extract the positioning and proximity check logic.

// Custom hook to manage dragging state.
function useDraggable() {
  const [isDragging, setIsDragging] = useState(false);
  const [startNode, setStartNode] = useState(null);
  const [endPosition, setEndPosition] = useState({ x: 0, y: 0 });
  const [potentialEndNode, setPotentialEndNode] = useState(null);

  const startDrag = (node) => {
    setIsDragging(true);
    setStartNode(node);
  };

  const endDrag = (node) => {
    setIsDragging(false);
    setStartNode(null);
    setEndPosition({ x: 0, y: 0 });
    return node;
  };

  const drag = (position) => {
    setEndPosition(position);
  };

  return {
    isDragging,
    startNode,
    endPosition,
    potentialEndNode,
    setPotentialEndNode,
    startDrag,
    endDrag,
    drag,
  };
}

const GraphSVG = ({ colorEnabled }) => {
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.graph.nodes);
  const edges = useSelector((state) => state.graph.edges);
  const graphColoring = useSelector((state) => state.graph.graphColoring);
  const numColors = useSelector((state) => state.graph.numColors);
  const radius = 150;

  useEffect(() => {
    console.log("Component mounted");
    return () => console.log("Component will unmount");
  }, []);

  const isSameColor = useCallback(
    (node1, node2) => {
      const color1 = graphColoring[node1];
      const color2 = graphColoring[node2];
      return color1 !== undefined && color1 === color2;
    },
    [graphColoring]
  );
  const {
    isDragging,
    startNode,
    endPosition,
    potentialEndNode,
    setPotentialEndNode,
    startDrag,
    endDrag,
    drag,
  } = useDraggable();

  const totalColors = graphColoring
    ? Math.max(...Object.values(graphColoring)) + 1
    : 0;

  const getColor = useCallback(
    (index) => {
      if (totalColors === 0) return "white";
      const hue = index / totalColors;
      const rgb = hsvToRgb(hue, 1, 1);
      return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    },
    [totalColors]
  );

  const hasEdge = useCallback(
    (node1, node2) =>
      edges.some(
        (edge) =>
          (edge[0] === node1 && edge[1] === node2) ||
          (edge[0] === node2 && edge[1] === node1)
      ),
    [edges]
  );

  const handleMouseDown = (node) => startDrag(node);

  const handleMouseUp = (node) => {
    const endNode = endDrag(node);
    if (isDragging && startNode && node !== startNode) {
      dispatch(addEdge(`${startNode}-${endNode}`));
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const svgRect = e.target.ownerSVGElement.getBoundingClientRect();
      const currentPos = {
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top,
      };
      drag(currentPos);
      // Check if the current position is close enough to any node
      const closeNode = nodes.find((node, index) => {
        const nodePos = calculatePosition(index, nodes.length, radius);
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
      onMouseUp={endDrag}
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
      {edges.map((edge, index) => {
        const startNodePosition = calculatePosition(
          nodes.indexOf(edge[0]),
          nodes.length,
          radius
        );
        const endNodePosition = calculatePosition(
          nodes.indexOf(edge[1]),
          nodes.length,
          radius
        );
        // Check if the nodes at the ends of the edge have the same color
        const sameColor = isSameColor(edge[0], edge[1]);
        return (
          <line
            key={`edge-${index}`}
            x1={startNodePosition.x}
            y1={startNodePosition.y}
            x2={endNodePosition.x}
            y2={endNodePosition.y}
            stroke={colorEnabled && sameColor ? "red" : "black"} // Here we use red if the nodes have the same color and color is enabled, otherwise black
          />
        );
      })}

      {/* Dynamic edge while dragging */}
      {isDragging && startNode && (
        <line
          x1={
            calculatePosition(nodes.indexOf(startNode), nodes.length, radius).x
          }
          y1={
            calculatePosition(nodes.indexOf(startNode), nodes.length, radius).y
          }
          x2={
            potentialEndNode
              ? calculatePosition(
                  nodes.indexOf(potentialEndNode),
                  nodes.length,
                  radius
                ).x
              : endPosition.x
          }
          y2={
            potentialEndNode
              ? calculatePosition(
                  nodes.indexOf(potentialEndNode),
                  nodes.length,
                  radius
                ).y
              : endPosition.y
          }
          stroke="black"
          strokeDasharray="4"
        />
      )}

      {/* Drawing nodes and node labels */}
      {nodes.map((node, index) => {
        const position = calculatePosition(index, nodes.length, radius);
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
              cx={position.x}
              cy={position.y}
              r="10"
              fill={(colorEnabled && nodeColor) || "white"}
              pointerEvents="all"
              stroke={
                isDragging && startNode !== node && !hasEdge(startNode, node)
                  ? "blue"
                  : "black"
              }
              strokeWidth="3"
            />
            <text
              x={position.x}
              y={position.y}
              dy="4"
              fill="black"
              fontSize="12"
              textAnchor="middle"
              pointerEvents="bounding-box"
            >
              {node}
            </text>
          </g>
        );
      })}
      {colorEnabled && (
        <text
          x="0" // Adjust as needed for positioning
          y="20" // Adjust as needed for positioning
          fill="black"
          fontSize="16"
          fontWeight="bold"
        >
          {`Colors: ${numColors}`}
        </text>
      )}
    </svg>
  );
};

export default GraphSVG;
