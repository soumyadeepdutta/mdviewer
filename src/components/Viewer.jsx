import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X, Sun, Moon } from 'lucide-react';
import Mermaid from './Mermaid';

export default function Viewer({ markdown, customHeader, onRemoveHeader, codeTheme, setCodeTheme }) {
  return (
    <div className="viewer-container animate-fade-in">
      <div className="markdown-body">
        {customHeader && (
          <div className="pdf-custom-header-container">
            <img src={customHeader} alt="Custom PDF Header" className="pdf-custom-header" />
            <button className="remove-header-btn icon-btn" onClick={onRemoveHeader} data-tooltip="Remove Header">
              <X size={16} />
            </button>
          </div>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre({children}) {
              // Strip the outer <pre> tag entirely so its hardcoded dark background CSS
              // doesn't interfere with our custom code block wrapper
              return <>{children}</>;
            },
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              
              if (!inline && match && match[1] === 'mermaid') {
                return <Mermaid chart={String(children).replace(/\n$/, '')} />
              }

              return !inline && match ? (
                <div className="code-block-wrapper">
                  <button 
                    className="code-theme-toggle"
                    onClick={() => setCodeTheme(codeTheme === 'dark' ? 'light' : 'dark')}
                    data-tooltip={codeTheme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
                    style={{
                      background: codeTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {codeTheme === 'dark' ? <Sun size={14} color="#d4d4d4" /> : <Moon size={14} color="#333333" />}
                  </button>
                  <SyntaxHighlighter
                    style={codeTheme === 'dark' ? vscDarkPlus : vs}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{ borderRadius: '8px', margin: 0, padding: '16px', boxShadow: 'inset 0 0 0 1px var(--border-color)' }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {markdown || '*No content to display. Type some markdown!*'}
        </ReactMarkdown>
      </div>
    </div>
  );
}
