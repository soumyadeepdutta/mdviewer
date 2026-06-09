import React from 'react';

export default function Editor({ markdown, setMarkdown }) {
  return (
    <div className="editor-container animate-fade-in">
      <textarea
        className="editor-textarea"
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Type your markdown here..."
        spellCheck="false"
      />
    </div>
  );
}
