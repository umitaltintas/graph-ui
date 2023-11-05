import { createSlice } from "@reduxjs/toolkit";

const graphSlice = createSlice({
  name: "graph",
  initialState: {
    nodes: [],
    edges: [],
    graphColoring: {},
  },
  reducers: {
    addNode: (state, action) => {
      const nodesToAdd = action.payload
        .toLowerCase()
        .split(",")
        .map((node) => node.trim())
        .filter((node) => node && !state.nodes.includes(node));

      if (nodesToAdd.length > 0) {
        state.nodes = [...state.nodes, ...nodesToAdd];
      }
    },
    removeNode: (state, action) => {
      const nodesToRemove = action.payload
        .toLowerCase()
        .split(",")
        .map((node) => node.trim())
        .filter((node) => node && state.nodes.includes(node));

      if (nodesToRemove.length > 0) {
        state.nodes = state.nodes.filter(
          (node) => !nodesToRemove.includes(node)
        );
        state.edges = state.edges.filter(
          (edge) =>
            !nodesToRemove.includes(edge[0]) && !nodesToRemove.includes(edge[1])
        );
      }
    },
    addEdge: (state, action) => {
      const edgePairs = action.payload.split(",").map((edge) => {
        return edge.split("-").map((node) => node.trim());
      });
      edgePairs.forEach((edgePair) => {
        if (edgePair.length !== 2) return;
        if (!state.nodes.includes(edgePair[0])) return;
        if (!state.nodes.includes(edgePair[1])) return;
        if (edgePair[0] === edgePair[1]) return;
        if (
          state.edges.some(
            (edge) =>
              (edge[0] === edgePair[0] && edge[1] === edgePair[1]) ||
              (edge[0] === edgePair[1] && edge[1] === edgePair[0])
          )
        )
          return;

        state.edges = [...state.edges, edgePair];
      });
    },
    addEdgeBulk: (state, action) => {
      // , separated list of edges
      const edgePairs = action.payload
        .split(",")
        .map((edge) => edge.split("-").map((node) => node.trim()));
      edgePairs.forEach((edgePair) => {
        if (edgePair.length !== 2) return;
        if (!state.nodes.includes(edgePair[0])) return;
        if (!state.nodes.includes(edgePair[1])) return;
        if (edgePair[0] === edgePair[1]) return;
        if (
          state.edges.some(
            (edge) =>
              (edge[0] === edgePair[0] && edge[1] === edgePair[1]) ||
              (edge[0] === edgePair[1] && edge[1] === edgePair[0])
          )
        )
          return;

        state.edges = [...state.edges, edgePair];
      });
    },
    removeEdge: (state, action) => {
      const edgePairs = action.payload
        .split(",")
        .map((edge) => edge.split("-").map((node) => node.trim()));

      edgePairs.forEach((edgePair) => {
        if (edgePair.length !== 2) return;
        if (!state.nodes.includes(edgePair[0])) return;
        if (!state.nodes.includes(edgePair[1])) return;
        if (edgePair[0] === edgePair[1]) return;
        if (
          !state.edges.some(
            (edge) =>
              (edge[0] === edgePair[0] && edge[1] === edgePair[1]) ||
              (edge[0] === edgePair[1] && edge[1] === edgePair[0])
          )
        )
          return;

        state.edges = state.edges.filter(
          (edge) =>
            !(
              (edge[0] === edgePair[0] && edge[1] === edgePair[1]) ||
              (edge[0] === edgePair[1] && edge[1] === edgePair[0])
            )
        );
      });
    },

    setGraphColoring: (state, action) => {
      state.graphColoring = action.payload;
    },
    clearGraphData: (state) => {
      state.nodes = [];
      state.edges = [];
      state.graphColoring = {};
    },
  },
});

export const {
  addNode,
  removeNode,
  addEdge,
  removeEdge,
  setGraphColoring,
  addEdgeBulk,
  clearGraphData,
} = graphSlice.actions;

export default graphSlice.reducer;
