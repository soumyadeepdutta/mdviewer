import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Undo2, Redo2, Layout, PanelLeftClose, PanelLeftOpen, Trash2 } from 'lucide-react';
import DesignerPalette from './DesignerPalette';
import DesignerCanvas from './DesignerCanvas';
import DesignerOutput from './DesignerOutput';
import { serializeToMermaid } from '../utils/mermaidSerializer';
import { getLayoutedElements } from '../utils/dagreLayout';
import MobileDesignerGuard from './MobileDesignerGuard';
import useDesignerStore from '../store/designerStore';

export default function MermaidDesigner({ codeTheme }) {
  const { nodes, edges, setNodes, setEdges, clear, diagramType, setDiagramType } = useDesignerStore();
  const { undo, redo, pastStates, futureStates } = useDesignerStore.temporal.getState();
  
  const [mermaidCode, setMermaidCode] = useState('');
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  
  // Serialize nodes and edges to mermaid code whenever they change
  useEffect(() => {
    // Basic debounce to avoid aggressive re-rendering
    const timer = setTimeout(() => {
      if (nodes.length > 0 || edges.length > 0) {
        const code = serializeToMermaid(nodes, edges, diagramType);
        setMermaidCode(code);
        // Persist
        localStorage.setItem('mermaid-designer-nodes', JSON.stringify(nodes));
        localStorage.setItem('mermaid-designer-edges', JSON.stringify(edges));
      } else {
        setMermaidCode('');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [nodes, edges]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedNodes = localStorage.getItem('mermaid-designer-nodes');
      const savedEdges = localStorage.getItem('mermaid-designer-edges');
      if (savedNodes && savedEdges) {
        setNodes(JSON.parse(savedNodes));
        setEdges(JSON.parse(savedEdges));
      }
    } catch (e) {
      console.error('Failed to parse saved designer state');
    }
  }, [setNodes, setEdges]);

  const onLayout = useCallback(() => {
    const layoutedNodes = getLayoutedElements(nodes, edges, 'TB');
    setNodes([...layoutedNodes]);
  }, [nodes, edges, setNodes]);

  const handleDiagramTypeChange = (type) => {
    if (type === diagramType) return;
    if (nodes.length > 0 || edges.length > 0) {
      if (!window.confirm('Switching diagram types will clear your current canvas. Are you sure?')) {
        return;
      }
    }
    clear();
    setDiagramType(type);
  };

  return (
    <div className="mermaid-designer-wrapper">
      <MobileDesignerGuard />
      
      <div className="designer-toolbar">
        <button className="toolbar-btn" onClick={() => setIsPaletteOpen(!isPaletteOpen)} title="Toggle Palette">
           {isPaletteOpen ? (
             <><PanelLeftClose size={16} /> Hide Nodes</>
           ) : (
             <><PanelLeftOpen size={16} /> Show Nodes</>
           )}
        </button>
        
        <div className="segment-control" style={{ marginLeft: '16px' }}>
          <button className={`segment-btn ${diagramType === 'flowchart' ? 'active' : ''}`} onClick={() => handleDiagramTypeChange('flowchart')}>Flowchart</button>
          <button className={`segment-btn ${diagramType === 'journey' ? 'active' : ''}`} onClick={() => handleDiagramTypeChange('journey')}>User Journey</button>
          <button className={`segment-btn ${diagramType === 'architecture' ? 'active' : ''}`} onClick={() => handleDiagramTypeChange('architecture')}>Architecture</button>
        </div>

        <div style={{ flex: 1 }}></div>
        <button className="toolbar-btn" onClick={() => undo()} disabled={pastStates.length === 0} title="Undo (Ctrl+Z)">
          <Undo2 size={16} /> Undo
        </button>
        <button className="toolbar-btn" onClick={() => redo()} disabled={futureStates.length === 0} title="Redo (Ctrl+Y)">
          <Redo2 size={16} /> Redo
        </button>
        <button className="toolbar-btn" onClick={onLayout} title="Auto-layout Nodes">
          <Layout size={16} /> Auto Layout
        </button>
        <button className="toolbar-btn danger" onClick={clear}>
          <Trash2 size={16} /> Clear Canvas
        </button>
      </div>

      <div className="designer-layout">
        <DesignerPalette isOpen={isPaletteOpen} setIsOpen={setIsPaletteOpen} />
        
        <div className="designer-canvas-container">
          <ReactFlowProvider>
            <DesignerCanvas />
          </ReactFlowProvider>
        </div>
        
        <div className="designer-output-container">
          <DesignerOutput code={mermaidCode} theme={codeTheme} />
        </div>
      </div>
    </div>
  );
}
