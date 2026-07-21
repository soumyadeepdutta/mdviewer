import React, { useState } from 'react';
import { 
  Heading1, Heading2, AlignLeft, Bold, Italic, 
  List, ListOrdered, Code, Network, Quote, GripVertical,
  PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

const PALETTE_ITEMS = [
  { id: 'h1', icon: Heading1, label: 'Heading 1', text: '# Heading 1\n\n' },
  { id: 'h2', icon: Heading2, label: 'Heading 2', text: '## Heading 2\n\n' },
  { id: 'p', icon: AlignLeft, label: 'Paragraph', text: '\nWrite your paragraph here...\n\n' },
  { id: 'bold', icon: Bold, label: 'Bold Text', text: '**Bold Text**' },
  { id: 'italic', icon: Italic, label: 'Italic Text', text: '*Italic Text*' },
  { id: 'bullet', icon: List, label: 'Bullet List', text: '\n- Item 1\n- Item 2\n- Item 3\n\n' },
  { id: 'number', icon: ListOrdered, label: 'Numbered List', text: '\n1. First item\n2. Second item\n3. Third item\n\n' },
  { id: 'quote', icon: Quote, label: 'Blockquote', text: '\n> This is a blockquote.\n\n' },
  { id: 'code', icon: Code, label: 'Code Block', text: '\n```javascript\n// Write your code here\nconsole.log("Hello World");\n```\n\n' },
  { id: 'mermaid', icon: Network, label: 'Mermaid Flowchart', text: '\n```mermaid\ngraph LR\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Process]\n    B -->|No| D[End]\n```\n\n' },
];

export default function Editor({ markdown, setMarkdown, editorRef, onScroll, onMouseEnter, onTouchStart }) {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  const handleDragStart = (e, text) => {
    e.dataTransfer.setData('text/plain', text);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="editor-container animate-fade-in">
      <div className={`element-palette ${isPaletteOpen ? 'open' : 'collapsed'}`}>
        <div className="palette-header">
          {isPaletteOpen && (
            <div className="palette-titles">
              <span>Elements</span>
              <span className="palette-subtitle">Drag to editor</span>
            </div>
          )}
          <button 
            className="icon-btn toggle-palette-btn" 
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            data-tooltip={isPaletteOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isPaletteOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        </div>
        <div className="palette-items">
          {PALETTE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="draggable-item"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, item.text)}
                title={item.label}
              >
                <GripVertical size={14} className="drag-handle" />
                <Icon size={16} />
                <span className="item-label">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <textarea
        ref={editorRef}
        onScroll={onScroll}
        onMouseEnter={onMouseEnter}
        onTouchStart={onTouchStart}
        className="editor-textarea"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Type your markdown here... or drag elements from the left."
        spellCheck="false"
      />
    </div>
  );
}
