import React, { useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { EdgeInput } from "./EdgeInput";
import GraphSVG from "./Graph";
import { NodeInput } from "./NodeInput";

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [graphColoring, setGraphColoring] = useState({});
  const [error, setError] = useState(null);

  const generateGraph = async () => {
    try {
      const response = await axios.post(
        "https://graph-be-umitaltintas.vercel.app/generate_graph",
        { nodes, edges }
      );
      setGraphColoring(response.data.coloring);
      setError(null);
    } catch (err) {
      console.error("Error generating graph:", err);
      setError("Error generating graph. Please try again.");
    }
  };

  const addEdges = (newEdges) => {
    const edgePairs = newEdges
      .split(",")
      .map((edge) => edge.split("-").map((node) => node.trim()));

    const validEdges = edgePairs.filter((pair) => {
      if (pair.length !== 2) return false;
      if (!nodes.includes(pair[0]) || !nodes.includes(pair[1])) return false;
      if (pair[0] === pair[1]) return false;

      const edgeExists = edges.some(
        (edge) =>
          (edge[0] === pair[0] && edge[1] === pair[1]) ||
          (edge[0] === pair[1] && edge[1] === pair[0])
      );

      return !edgeExists;
    });

    if (validEdges.length > 0) {
      setEdges([...edges, ...validEdges]);
    } else {
      setErrorMessage(
        "Invalid edge(s). Please ensure the start and end nodes are different, selected, formatted correctly, and not duplicate."
      );
    }
  };

  const removeEdges = (newEdges) => {
    const edgePairs = newEdges
      .split(",")
      .map((edge) => edge.split("-").map((node) => node.trim()));

    const validEdges = edgePairs.filter((pair) => {
      if (pair.length !== 2) return false;
      if (!nodes.includes(pair[0]) || !nodes.includes(pair[1])) return false;
      if (pair[0] === pair[1]) return false;

      const edgeExists = edges.some(
        (edge) =>
          (edge[0] === pair[0] && edge[1] === pair[1]) ||
          (edge[0] === pair[1] && edge[1] === pair[0])
      );

      return edgeExists;
    });

    if (validEdges.length > 0) {
      const updatedEdges = edges.filter(
        (edge) =>
          !validEdges.some(
            (pair) =>
              (pair[0] === edge[0] && pair[1] === edge[1]) ||
              (pair[0] === edge[1] && pair[1] === edge[0])
          )
      );
      setEdges(updatedEdges);
    }
  };

  const addEdgeFromDrag = (newEdge) => {
    if (
      !edges.some(
        (edge) =>
          (edge[0] === newEdge[0] && edge[1] === newEdge[1]) ||
          (edge[0] === newEdge[1] && edge[1] === newEdge[0])
      )
    ) {
      setEdges((prevEdges) => [...prevEdges, newEdge]);
    }
  };
  return (
    <Flex
      direction="column"
      padding="6"
      bg="gray.50"
      minHeight="100vh"
      align="center"
    >
      <VStack
        spacing={32}
        align="start"
        maxWidth={["100%", "80%", "70%", "600px"]}
        w="full"
      >
        <Text
          className="text-4xl md:text-5xl lg:text-6xl"
          fontWeight="bold"
          marginBottom={"4rem"}
          css={css`
            background: linear-gradient(90deg, #5da4a9 0%, #7a8eb9 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
          `}
        >
          Graph UI by Umit Altintas
        </Text>

        <NodeInput nodes={nodes} setNodes={setNodes} />

        <EdgeInput
          edges={edges}
          addEdges={addEdges}
          removeEdges={removeEdges}
        />

        <Button
          className="bg-green-500 hover:bg-green-600 text-white transition duration-300 ease-in-out"
          onClick={generateGraph}
          width={["100%", "50%", "40%", "30%"]}
        >
          Generate Graph
        </Button>

        {nodes.length === 0 && edges.length === 0 ? (
          <Text mt={4}>No data available for graphs.</Text>
        ) : (
          <HStack spacing={6} mt={6}>
            <GraphBox
              title="Original Graph"
              nodes={nodes}
              edges={edges}
              onAddEdge={addEdgeFromDrag}
            />
            {Object.keys(graphColoring).length > 0 && (
              <GraphBox
                title="Colored Graph"
                nodes={nodes}
                edges={edges}
                graphColoring={graphColoring}
                onAddEdge={addEdgeFromDrag}
              />
            )}
          </HStack>
        )}

        {error && (
          <Alert status="error" width="sm" mt={4}>
            <AlertIcon width={{ base: "5px", md: "6" }} />
            {error}
          </Alert>
        )}
      </VStack>
    </Flex>
  );
}

const GraphBox = ({ title, nodes, edges, graphColoring, onAddEdge }) => (
  <Box>
    <Text fontSize="lg" fontWeight="bold" mb={4}>
      {title}
    </Text>
    <GraphSVG
      nodes={nodes}
      edges={edges}
      graphColoring={graphColoring}
      onAddEdge={onAddEdge}
    />
  </Box>
);

export default App;
