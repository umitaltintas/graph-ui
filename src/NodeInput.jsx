import { Box, Button, HStack, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNode, removeNode } from "./redux/graphSlice";
import { randomNodes } from "./utils/graphUtils";
export const NodeInput = () => {
  const [newNodes, setNewNodes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const nodes = useSelector((state) => state.graph.nodes);

  const addNodes = () => {
    dispatch(addNode(newNodes));
  };

  const removeNodes = () => {
    dispatch(removeNode(newNodes));
  };

  const generateRandomNodes = () => {
    const nodes = randomNodes(newNodes);
    dispatch(addNode(nodes.join(",")));
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

          {/* button for random nodes */}
          <Button
            className="bg-green-500 hover:bg-green-600 text-white transition duration-300 ease-in-out"
            onClick={generateRandomNodes}
          >
            Random Nodes
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
        {nodes.slice(0, 10).join(", ")}
        {nodes.length > 10 && "..."}
      </Box>
    </Box>
  );
};
