import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, PlusSquare, Image as ImageIcon, Download } from 'lucide-react';
import Mermaid from './Mermaid';
import { useNavigate } from 'react-router-dom';

export default function DesignerOutput({ code, theme }) {
  const [activeTab, setActiveTab] = useState('preview');
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    // Could add a toast notification here
  };

  const handleInsert = () => {
    // Append to localStorage md-content
    const existing = localStorage.getItem('md-content') || '';
    const newContent = existing + `\n\n\`\`\`mermaid\n${code}\n\`\`\`\n`;
    localStorage.setItem('md-content', newContent);
    // Navigate back to editor
    navigate('/');
  };

  const handleExportSVG = () => {
    const svgElement = document.querySelector('.designer-preview .mermaid-wrapper svg');
    if (!svgElement) return;
    
    // Create a Blob from the SVG content
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="designer-output">
      <div className="designer-output-tabs">
        <button 
          className={activeTab === 'preview' ? 'active' : ''} 
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
        <button 
          className={activeTab === 'code' ? 'active' : ''} 
          onClick={() => setActiveTab('code')}
        >
          Code
        </button>
        <div style={{ flex: 1 }}></div>
        {activeTab === 'preview' && (
          <button className="icon-btn" onClick={handleExportSVG} title="Export SVG">
            <Download size={16} /> SVG
          </button>
        )}
        <button className="icon-btn" onClick={handleCopy} title="Copy Code">
          <Copy size={16} />
        </button>
        <button className="icon-btn insert-btn" onClick={handleInsert} title="Insert into Markdown">
          <PlusSquare size={16} /> Insert
        </button>
      </div>

      <div className="designer-output-content">
        {activeTab === 'preview' ? (
          <div className="designer-preview">
             <Mermaid chart={code} />
          </div>
        ) : (
          <div className="designer-code">
            <SyntaxHighlighter
              style={theme === 'dark' ? vscDarkPlus : vs}
              language="mermaid"
              customStyle={{ background: 'transparent', margin: 0, padding: '16px', height: '100%', overflow: 'auto' }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  );
}
