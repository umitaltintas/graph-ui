/* eslint-disable react/prop-types */
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EdgeInput } from "../EdgeInput";
import GraphSVG from "../Graph";
import { NodeInput } from "../NodeInput";
import {
  clearGraphData,
  setGraphColoring,
  setThreshold,
} from "../redux/graphSlice";

function App() {
  const dispatch = useDispatch();
  const edges = useSelector((state) => state.graph.edges);
  const nodes = useSelector((state) => state.graph.nodes);
  const threshold = useSelector((state) => state.graph.threshold);
  const graphColoring = useSelector((state) => state.graph.graphColoring);
  const [error, setError] = useState(null);

  const generateGraph = async () => {
    try {
      const response = await axios.post(
        "https://graph-be-umitaltintas.vercel.app/generate_graph",
        { nodes, edges, threshold }
      );
      dispatch(setGraphColoring(response.data.coloring));
      setError(null);
    } catch (err) {
      console.error("Error generating graph:", err);
      setError("Error generating graph. Please try again.");
    }
  };
  const clearGraph = () => {
    dispatch(clearGraphData());
  };

  const setThresholdValue = (value) => {
    dispatch(setThreshold(value));
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
        {/* defect treshhold input */}
        <Text fontSize="xl" fontWeight="bold" marginBottom="8px">
          Defect Treshold : {threshold}
        </Text>
        <Input
          className="dark:bg-gray-100 dark:text-gray-800 px-1 light:bg-gray-800 light:text-gray-100 border-gray-300 border-2 rounded-md"
          placeholder="Defect Treshold"
          type="number"
          width={["100%", "80%", "70%", "400px"]}
          value={threshold}
          onChange={(e) => {
            setThresholdValue(e.target.value);
          }}
        />
        <HStack spacing={4} width="full">
          <Button
            className="bg-green-500 hover:bg-green-600 text-white transition duration-300 ease-in-out"
            onClick={generateGraph}
            width={{ base: "100%", sm: "auto" }} // 100% width on smallest screens, auto on larger screens
            flexGrow={{ sm: 1 }} // The buttons will grow to fill the space on larger screens
          >
            Generate Graph
          </Button>
          {/* New Clear Graph button */}
          <Button
            className="bg-red-500 hover:bg-red-600 text-white transition duration-300 ease-in-out"
            onClick={clearGraph}
            width={{ base: "100%", sm: "auto" }} // 100% width on smallest screens, auto on larger screens
            flexGrow={{ sm: 1 }} // The buttons will grow to fill the space on larger screens
            ml={4} // Add some left margin for spacing
          >
            Clear Graph
          </Button>
        </HStack>
        {nodes.length === 0 ? (
          <Text mt={4}>No data available for graphs.</Text>
        ) : (
          <HStack spacing={6} mt={6}>
            <GraphBox title="Original Graph" />
            {Object.keys(graphColoring).length > 0 && (
              <GraphBox title="Colored Graph" colorEnabled={true} />
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

const GraphBox = ({ title, colorEnabled = false }) => (
  <Box>
    <Text fontSize="lg" fontWeight="bold" mb={4}>
      {title}
    </Text>
    <GraphSVG colorEnabled={colorEnabled} />
  </Box>
);

export default App;
