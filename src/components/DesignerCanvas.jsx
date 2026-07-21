import React, { useCallback, useRef, useEffect } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useDesignerStore from '../store/designerStore';

import { 
  RectangleNode, RoundedNode, StadiumNode, 
  CircleNode, DiamondNode, HexagonNode, 
  ParallelogramNode, SubroutineNode 
} from './nodes/CustomNodes';
import { JourneyTaskNode, JourneySectionNode } from './nodes/JourneyNodes';
import { ArchServiceNode, ArchGroupNode } from './nodes/ArchitectureNodes';

// Register custom node types
const nodeTypes = {
  rectangleNode: RectangleNode,
  roundedNode: RoundedNode,
  stadiumNode: StadiumNode,
  circleNode: CircleNode,
  diamondNode: DiamondNode,
  hexagonNode: HexagonNode,
  parallelogramNode: ParallelogramNode,
  subroutineNode: SubroutineNode,
  journeyTaskNode: JourneyTaskNode,
  journeySectionNode: JourneySectionNode,
  archServiceNode: ArchServiceNode,
  archGroupNode: ArchGroupNode,
};

let id = 0;
const getId = () => `node_${id++}`;

export default function DesignerCanvas() {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes } = useDesignerStore();

  const updateNodeData = useCallback((id, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  }, [setNodes]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/reactflow-label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Project the pixel coordinates to the React Flow instance's coordinate system
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // If it's a group or section node, set dragHandle and style for groups
      const isGroup = type === 'journeySectionNode' || type === 'archGroupNode';
      
      const newNode = {
        id: getId(),
        type,
        position,
        data: { 
          label: label || `${type} node`,
          onChange: (newLabel, extraData) => updateNodeData(newNode.id, { label: newLabel, ...extraData })
        },
        style: isGroup ? { width: 300, height: 200 } : undefined,
      };

      setNodes((nds) => {
          // ensure nodes are an array
          const currentNodes = Array.isArray(nds) ? nds : [];
          return currentNodes.concat(newNode);
      });
    },
    [screenToFlowPosition, setNodes, updateNodeData],
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const state = useDesignerStore.temporal.getState();
        if (state.pastStates.length > 0) state.undo();
      }
      // Ctrl+Y, Cmd+Y, or Ctrl+Shift+Z / Cmd+Shift+Z
      if (((e.ctrlKey || e.metaKey) && e.key === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        const state = useDesignerStore.temporal.getState();
        if (state.futureStates.length > 0) state.redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="designer-canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="var(--border-color)" gap={16} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => 'var(--accent)'} 
          maskColor="rgba(0, 0, 0, 0.1)" 
        />
      </ReactFlow>
    </div>
  );
}
