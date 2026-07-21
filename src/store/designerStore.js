import { create } from 'zustand';
import { temporal } from 'zundo';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

const useDesignerStore = create(
  temporal(
    (set, get) => ({
      nodes: [],
      edges: [],
      diagramType: 'flowchart', // 'flowchart', 'journey', 'architecture'
      
      setDiagramType: (type) => set({ diagramType: type }),
      
      setNodes: (nodes) => {
        // If it's a function (like how useState's setter works)
        if (typeof nodes === 'function') {
          set({ nodes: nodes(get().nodes) });
        } else {
          set({ nodes });
        }
      },
      
      setEdges: (edges) => {
        if (typeof edges === 'function') {
          set({ edges: edges(get().edges) });
        } else {
          set({ edges });
        }
      },

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },

      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },

      onConnect: (connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },
      
      clear: () => set({ nodes: [], edges: [] })
    }),
    {
      limit: 50,
      handleSet: (id) => {
          // This keeps zundo quiet about setting state
      }
    }
  )
);

export default useDesignerStore;
