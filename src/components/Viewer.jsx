import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X } from 'lucide-react';

export default function Viewer({ markdown, customHeader, onRemoveHeader }) {
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
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
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
