/* eslint-disable react/prop-types */
import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEdge, addEdgeBulk, removeEdge } from "./redux/graphSlice";
import { randomEdges } from "./utils/graphUtils";
export const EdgeInput = () => {
  const dispatch = useDispatch();
  const edges = useSelector((state) => state.graph.edges);
  const nodes = useSelector((state) => state.graph.nodes);
  const [newEdges, setNewEdges] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const addEdges = () => {
    dispatch(addEdge(newEdges));
  };
  const removeEdges = () => {
    dispatch(removeEdge(newEdges));
  };

  const generateRandomEdges = () => {
    const newEdges = randomEdges(nodes);
    const newEdgesString = newEdges.map((edge) => edge.join("-")).join(",");
    dispatch(addEdgeBulk(newEdgesString));
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" marginBottom="8px">
        Manage Edges
      </Text>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addEdges(newEdges);
          setNewEdges("");
        }}
      >
        <HStack spacing={4}>
          <Input
            className="dark:bg-gray-100 dark:text-gray-800 px-1 light:bg-gray-800 light:text-gray-100 border-gray-300 border-2 rounded-md"
            value={newEdges}
            onChange={(e) => {
              setNewEdges(e.target.value);
              setErrorMessage("");
            }}
            placeholder="Edge Pairs (e.g., a-b, c-d)"
            width={["100%", "80%", "70%", "400px"]}
          />
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white transition duration-300 ease-in-out"
            type="submit"
          >
            Add Edges
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white transition duration-300 ease-in-out"
            onClick={() => {
              removeEdges(newEdges);
              setNewEdges("");
            }}
          >
            Remove Edges
          </Button>
          <Button
            className="bg-green-500 hover:bg-green-600 text-white transition duration-300 ease-in-out"
            onClick={generateRandomEdges}
          >
            Random Edges
          </Button>
        </HStack>
      </form>

      {errorMessage && (
        <Text color="red.500" mt={2}>
          {errorMessage}
        </Text>
      )}

      <Box mt={4}>
        <Text>Edges:</Text>
        <HStack spacing={4}>
          <Text>
            {edges
              .slice(0, 10)
              .map((edge) => edge.join("-"))
              .join(", ")}
          </Text>
          {edges.length > 10 && <Text>...</Text>}
        </HStack>
      </Box>
    </Box>
  );
};
