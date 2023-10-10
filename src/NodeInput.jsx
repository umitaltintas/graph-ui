import React, { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Input,
  Text,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

export const NodeInput = ({ nodes = [], setNodes, edges = [], setEdges }) => {
  const [newNodes, setNewNodes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const addNodes = () => {
    const nodesToAdd = newNodes
      .split(",")
      .map((node) => node.trim())
      .filter((node) => node && !nodes.includes(node));

    if (nodesToAdd.length > 0) {
      setNodes([...nodes, ...nodesToAdd]);
      setNewNodes("");
    }
  };

  const removeNodes = () => {
    const nodesToRemove = newNodes
      .split(",")
      .map((node) => node.trim())
      .filter((node) => nodes.includes(node));

    if (nodesToRemove.length > 0) {
      const updatedNodes = nodes.filter(
        (node) => !nodesToRemove.includes(node)
      );
      const updatedEdges = edges.filter(
        (edge) =>
          !nodesToRemove.includes(edge[0]) && !nodesToRemove.includes(edge[1])
      );

      setNodes(updatedNodes);
      setEdges(updatedEdges);
      setNewNodes("");
    } else {
      setErrorMessage(
        "Node(s) not found. Please ensure you've entered the correct node names to remove."
      );
    }
  };

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" marginBottom="8px">
        Manage Nodes
      </Text>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNodes();
        }}
      >
        <HStack spacing={4}>
          <Input
            className="dark:bg-gray-100 dark:text-gray-800 px-1 light:bg-gray-800 light:text-gray-100 border-gray-300 border-2 rounded-md"
            value={newNodes}
            onChange={(e) => {
              setNewNodes(e.target.value);
              setErrorMessage("");
            }}
            placeholder="Node Names (e.g., a,b,c,d)"
            width={["100%", "80%", "70%", "400px"]}
          />
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white transition duration-300 ease-in-out"
            type="submit"
          >
            Add Nodes
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white transition duration-300 ease-in-out"
            onClick={removeNodes}
          >
            Remove Nodes
          </Button>
        </HStack>
      </form>

      {errorMessage && (
        <Text color="red.500" mt={2}>
          {errorMessage}
        </Text>
      )}

      <Box mt={4}>
        <Text>Nodes:</Text>
        <HStack spacing={4}>
          {nodes.map((node) => (
            <Box key={node}>
              <Text display="inline">{node},</Text>
            </Box>
          ))}
        </HStack>
      </Box>
    </Box>
  );
};
