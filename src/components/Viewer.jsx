import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { X, Sun, Moon, ShieldAlert } from 'lucide-react';
import Mermaid from './Mermaid';

export default function Viewer({ 
  markdown, 
  customHeader, 
  onRemoveHeader, 
  codeTheme, 
  setCodeTheme, 
  isConfidential, 
  docFooter,
  viewerRef,
  onScroll,
  onMouseEnter,
  onTouchStart
}) {
  const memoizedComponents = React.useMemo(() => ({
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
            customStyle={{ borderRadius: '8px', margin: 0, padding: '16px', boxShadow: 'inset 0 0 0 1px var(--border-color)', fontFamily: 'var(--code-font-family, monospace)' }}
            codeTagProps={{ style: { fontFamily: 'var(--code-font-family, monospace)' } }}
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
  }), [codeTheme, setCodeTheme]);

  const hasFooterMeta = docFooter && (docFooter.preparedBy || docFooter.designation || docFooter.date || docFooter.place);

  return (
    <div 
      ref={viewerRef}
      onScroll={onScroll}
      onMouseEnter={onMouseEnter}
      onTouchStart={onTouchStart}
      className={`viewer-container animate-fade-in ${isConfidential ? 'has-confidential-mark' : ''}`}
    >
      {isConfidential && (
        <div className="confidential-watermark" aria-hidden="true">
          <span>CONFIDENTIAL</span>
          <span>CONFIDENTIAL</span>
          <span>CONFIDENTIAL</span>
          <span>CONFIDENTIAL</span>
        </div>
      )}
      <div className="markdown-body">
        {isConfidential && (
          <div className="confidential-banner">
            <ShieldAlert size={18} />
            <span>CONFIDENTIAL & SENSITIVE DOCUMENT — RESTRICTED ACCESS</span>
          </div>
        )}
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
          components={memoizedComponents}
        >
          {markdown || '*No content to display. Type some markdown!*'}
        </ReactMarkdown>
        
        {hasFooterMeta && (
          <div className="doc-footer-meta-block">
            <div className="doc-footer-grid">
              <div className="doc-footer-col doc-footer-col-left">
                {docFooter.place && (
                  <div className="doc-footer-field">
                    <span className="doc-footer-label">Place:</span>
                    <span className="doc-footer-value">{docFooter.place}</span>
                  </div>
                )}
                {docFooter.date && (
                  <div className="doc-footer-field">
                    <span className="doc-footer-label">Date:</span>
                    <span className="doc-footer-value">{docFooter.date}</span>
                  </div>
                )}
              </div>
              <div className="doc-footer-col doc-footer-col-right">
                {docFooter.preparedBy && (
                  <div className="doc-footer-field">
                    <span className="doc-footer-label">Prepared By:</span>
                    <span className="doc-footer-value doc-footer-name">{docFooter.preparedBy}</span>
                  </div>
                )}
                {docFooter.designation && (
                  <div className="doc-footer-designation">{docFooter.designation}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
