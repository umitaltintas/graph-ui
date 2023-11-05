/* eslint-disable react/prop-types */
import React, { useState } from "react";
import axios from "axios";
import { css } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { setGraphColoring } from "../redux/graphSlice";

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

import { EdgeInput } from "../EdgeInput";
import GraphSVG from "../Graph";
import { NodeInput } from "../NodeInput";

function App() {
  const dispatch = useDispatch();
  const edges = useSelector((state) => state.graph.edges);
  const nodes = useSelector((state) => state.graph.nodes);
  const graphColoring = useSelector((state) => state.graph.graphColoring);
  const [error, setError] = useState(null);

  const generateGraph = async () => {
    try {
      const response = await axios.post(
        "https://graph-be-umitaltintas.vercel.app/generate_graph",
        { nodes, edges }
      );
      dispatch(setGraphColoring(response.data.coloring));
      setError(null);
    } catch (err) {
      console.error("Error generating graph:", err);
      setError("Error generating graph. Please try again.");
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
        <NodeInput />
        <EdgeInput />
        <Button
          className="bg-green-500 hover:bg-green-600 text-white transition duration-300 ease-in-out"
          onClick={generateGraph}
          width={["100%", "50%", "40%", "30%"]}
        >
          Generate Graph
        </Button>
        {nodes.length === 0 ? (
          <Text mt={4}>No data available for graphs.</Text>
        ) : (
          <HStack spacing={6} mt={6}>
            <GraphBox title="Original Graph" />
            {Object.keys(graphColoring).length > 0 && (
              <GraphBox title="Colored Graph" graphColoring={graphColoring} />
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

const GraphBox = ({ title }) => (
  <Box>
    <Text fontSize="lg" fontWeight="bold" mb={4}>
      {title}
    </Text>
    <GraphSVG />
  </Box>
);

export default App;
