import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const NodeLabel = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Node');

  const onDoubleClick = () => {
    setIsEditing(true);
  };

  const onBlur = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(label);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onBlur();
    }
  };

  return (
    <div onDoubleClick={onDoubleClick} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40px' }}>
      {isEditing ? (
        <input
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className="node-label-input nodrag"
          style={{ width: '90%', textAlign: 'center', background: 'transparent', border: '1px solid var(--accent-color)', color: 'inherit', outline: 'none' }}
        />
      ) : (
        <span>{label}</span>
      )}
    </div>
  );
};

const BaseNode = ({ id, data, className }) => (
  <div className={`custom-node ${className}`}>
    <Handle type="target" position={Position.Top} id="target-top" style={{ top: -4, background: 'var(--text-color)' }} />
    <Handle type="source" position={Position.Top} id="source-top" style={{ top: -4, background: 'transparent', border: 'none' }} />
    
    <Handle type="target" position={Position.Right} id="target-right" style={{ right: -4, background: 'var(--text-color)' }} />
    <Handle type="source" position={Position.Right} id="source-right" style={{ right: -4, background: 'transparent', border: 'none' }} />
    
    <Handle type="target" position={Position.Bottom} id="target-bottom" style={{ bottom: -4, background: 'var(--text-color)' }} />
    <Handle type="source" position={Position.Bottom} id="source-bottom" style={{ bottom: -4, background: 'transparent', border: 'none' }} />
    
    <Handle type="target" position={Position.Left} id="target-left" style={{ left: -4, background: 'var(--text-color)' }} />
    <Handle type="source" position={Position.Left} id="source-left" style={{ left: -4, background: 'transparent', border: 'none' }} />
    
    <NodeLabel data={{ ...data, onChange: (newLabel) => {
      if (data.onLabelChange) {
        data.onLabelChange(id, newLabel);
      }
    }}} />
  </div>
);

export const RectangleNode = (props) => <BaseNode {...props} className="node-rectangle" />;
export const RoundedNode = (props) => <BaseNode {...props} className="node-rounded" />;
export const StadiumNode = (props) => <BaseNode {...props} className="node-stadium" />;
export const CircleNode = (props) => <BaseNode {...props} className="node-circle" />;
export const DiamondNode = (props) => <BaseNode {...props} className="node-diamond" />;
export const HexagonNode = (props) => <BaseNode {...props} className="node-hexagon" />;
export const ParallelogramNode = (props) => <BaseNode {...props} className="node-parallelogram" />;
export const SubroutineNode = (props) => <BaseNode {...props} className="node-subroutine" />;
