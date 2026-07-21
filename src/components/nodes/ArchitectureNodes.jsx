import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const ICONS = ['server', 'database', 'cloud', 'disk', 'internet', 'client'];

export const ArchServiceNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'New Service');
  const [icon, setIcon] = useState(data.icon || 'server');

  const onBlur = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(label, { icon });
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onBlur();
    }
  };

  return (
    <div className={`custom-node arch-service-node ${selected ? 'selected' : ''}`} style={{ minWidth: '120px', padding: '10px', textAlign: 'center' }}>
      <Handle type="target" position={Position.Top} id="target-top" />
      <Handle type="source" position={Position.Top} id="source-top" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" />
      <Handle type="target" position={Position.Left} id="target-left" />
      <Handle type="source" position={Position.Left} id="source-left" />
      <Handle type="target" position={Position.Right} id="target-right" />
      <Handle type="source" position={Position.Right} id="source-right" />

      <div style={{ marginBottom: '8px' }}>
        <select 
          value={icon} 
          onChange={(e) => {
            setIcon(e.target.value);
            if (data.onChange) data.onChange(label, { icon: e.target.value });
          }}
          className="nodrag"
          style={{ background: 'var(--bg-color)', color: 'inherit', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px', fontSize: '12px' }}
        >
          {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </div>

      <div onDoubleClick={() => setIsEditing(true)} style={{ width: '100%', fontWeight: 'bold' }}>
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
    </div>
  );
};

export const ArchGroupNode = ({ data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'New Group');
  const [icon, setIcon] = useState(data.icon || 'cloud');

  const onBlur = () => {
    setIsEditing(false);
    if (data.onChange) {
      data.onChange(label, { icon });
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onBlur();
    }
  };

  return (
    <div className={`custom-node arch-group-node ${selected ? 'selected' : ''}`} style={{ width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.02)', border: '2px solid var(--border-color)', borderRadius: '8px', minWidth: '200px', minHeight: '150px' }}>
      <div style={{ position: 'absolute', top: '-30px', left: '0', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select 
          value={icon} 
          onChange={(e) => {
            setIcon(e.target.value);
            if (data.onChange) data.onChange(label, { icon: e.target.value });
          }}
          className="nodrag"
          style={{ background: 'var(--surface-color)', color: 'inherit', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '2px', fontSize: '12px' }}
        >
          {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        
        <div onDoubleClick={() => setIsEditing(true)} style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>
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
    </div>
  );
};
