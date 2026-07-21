import dagre from '@dagrejs/dagre';

export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure layout direction
  const isHorizontal = direction === 'LR' || direction === 'RL';
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 60, // separation between nodes in the same rank
    ranksep: 80, // separation between nodes in different ranks
  });

  nodes.forEach((node) => {
    // We assume a standard width and height for layout calculations
    // In a real app we might get the actual dimensions from the DOM,
    // but for simple flowcharts static sizes work okay enough.
    dagreGraph.setNode(node.id, { width: 172, height: 60 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Return the new nodes with updated positions
  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // We shift the dagre node position (top left corner) to match React Flow's coordinate system
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 172 / 2,
        y: nodeWithPosition.y - 60 / 2,
      },
    };
  });
};
