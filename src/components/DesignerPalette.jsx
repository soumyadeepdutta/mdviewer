import React from 'react';
import { Square, Circle, Diamond, Hexagon, Component, GripVertical, Spline, LayoutList, FolderOpen, Box, BoxSelect } from 'lucide-react';
import useDesignerStore from '../store/designerStore';

const FLOWCHART_SHAPES = [
  { type: 'rectangleNode', label: 'Process', icon: Square, desc: '[Rectangle]' },
  { type: 'roundedNode', label: 'Action', icon: Component, desc: '(Rounded)' },
  { type: 'stadiumNode', label: 'Start/End', icon: Component, desc: '([Pill])' },
  { type: 'circleNode', label: 'State', icon: Circle, desc: '((Circle))' },
  { type: 'diamondNode', label: 'Decision', icon: Diamond, desc: '{Diamond}' },
  { type: 'hexagonNode', label: 'Preparation', icon: Hexagon, desc: '{{Hexagon}}' },
  { type: 'parallelogramNode', label: 'Input/Output', icon: Spline, desc: '[/Slant/]' },
  { type: 'subroutineNode', label: 'Subroutine', icon: Component, desc: '[[Double]]' },
];

const JOURNEY_SHAPES = [
  { type: 'journeySectionNode', label: 'Section', icon: LayoutList, desc: 'Groups Tasks' },
  { type: 'journeyTaskNode', label: 'Task', icon: Component, desc: 'Journey Step' },
];

const ARCHITECTURE_SHAPES = [
  { type: 'archGroupNode', label: 'Group', icon: FolderOpen, desc: 'Groups Services' },
  { type: 'archServiceNode', label: 'Service', icon: Box, desc: 'System Component' },
];

export default function DesignerPalette({ isOpen, setIsOpen }) {
  const { diagramType } = useDesignerStore();
  
  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow-label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className={`designer-palette ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="palette-header">
        {isOpen && <span>Nodes</span>}
      </div>
      
      {isOpen && (
        <div className="palette-items">
          <p className="palette-desc">Drag nodes to the canvas</p>
          {(diagramType === 'flowchart' ? FLOWCHART_SHAPES : diagramType === 'journey' ? JOURNEY_SHAPES : ARCHITECTURE_SHAPES).map((shape) => {
            const Icon = shape.icon;
            return (
              <div
                key={shape.type}
                className="draggable-item"
                onDragStart={(event) => onDragStart(event, shape.type, shape.label)}
                draggable
              >
                <GripVertical size={14} className="drag-handle" />
                <Icon size={16} />
                <div className="item-details">
                  <span className="item-label">{shape.label}</span>
                  <span className="item-desc">{shape.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
