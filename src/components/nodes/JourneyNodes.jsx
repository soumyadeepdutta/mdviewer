import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

export const JourneyTaskNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'New Task');
  const [score, setScore] = useState(data.score !== undefined ? data.score : 3);
  const [actor, setActor] = useState(data.actor || 'User');

  const onBlur = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(label, { score, actor });
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onBlur();
    }
  };

  return (
    <div className={`custom-node journey-task-node ${selected ? 'selected' : ''}`} style={{ minWidth: '160px', padding: '10px' }}>
      <Handle type="target" position={Position.Top} id="target-top" />
      <Handle type="source" position={Position.Top} id="source-top" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" />
      <Handle type="target" position={Position.Left} id="target-left" />
      <Handle type="source" position={Position.Left} id="source-left" />
      <Handle type="target" position={Position.Right} id="target-right" />
      <Handle type="source" position={Position.Right} id="source-right" />

      <div onDoubleClick={() => setIsEditing(true)} style={{ width: '100%', textAlign: 'center', marginBottom: '8px', fontWeight: 'bold' }}>
        {isEditing ? (
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className="node-label-input nodrag"
            style={{ width: '100%', textAlign: 'center', background: 'var(--bg-color)', border: '1px solid var(--accent-color)', color: 'inherit', outline: 'none' }}
          />
        ) : (
          <span>{label}</span>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Score:</span>
          <input 
            type="number" 
            min="0" max="7" 
            value={score} 
            onChange={(e) => {
              setScore(parseInt(e.target.value) || 0);
              if (data.onChange) data.onChange(label, { score: parseInt(e.target.value) || 0, actor });
            }}
            className="nodrag"
            style={{ width: '40px', background: 'var(--bg-color)', color: 'inherit', border: '1px solid var(--border-color)', borderRadius: '4px', textAlign: 'center' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Actor:</span>
          <input 
            type="text" 
            value={actor} 
            onChange={(e) => {
              setActor(e.target.value);
              if (data.onChange) data.onChange(label, { score, actor: e.target.value });
            }}
            className="nodrag"
            style={{ width: '80px', background: 'var(--bg-color)', color: 'inherit', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px 4px' }}
          />
        </div>
      </div>
    </div>
  );
};

export const JourneySectionNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'New Section');

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
    <div className={`custom-node journey-section-node ${selected ? 'selected' : ''}`} style={{ width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.03)', border: '2px dashed var(--border-color)', borderRadius: '8px', minWidth: '200px', minHeight: '150px' }}>
      <div onDoubleClick={() => setIsEditing(true)} style={{ position: 'absolute', top: '-24px', left: '0', fontWeight: 'bold', color: 'var(--text-color)' }}>
        {isEditing ? (
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className="node-label-input nodrag"
            style={{ background: 'var(--bg-color)', border: '1px solid var(--accent-color)', color: 'inherit', outline: 'none', padding: '2px 6px', borderRadius: '4px' }}
          />
        ) : (
          <span>{label}</span>
        )}
      </div>
    </div>
  );
};
