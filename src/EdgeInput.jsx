import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Input,
  Text,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import React, { useState } from "react";

export const EdgeInput = ({ edges, addEdges, removeEdges }) => {
  const [newEdges, setNewEdges] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
          {edges.map((edge) => (
            <Box key={`${edge[0]}-${edge[1]}`}>
              <Text display="inline">
                ({edge[0]},{edge[1]})
              </Text>
            </Box>
          ))}
        </HStack>
      </Box>
    </Box>
  );
};
