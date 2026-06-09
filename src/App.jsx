import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Editor from './components/Editor';
import Viewer from './components/Viewer';

function App() {
  const [markdown, setMarkdown] = useState(() => {
    return localStorage.getItem('md-content') || '# Welcome to MD Viewer\n\nType some **markdown** here to get started.\n\n- Beautiful\n- Fast\n- Offline';
  });
  const [viewMode, setViewMode] = useState('split'); // editor, viewer, split
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('md-theme') || 'system';
  });

  // Save content to local storage
  useEffect(() => {
    localStorage.setItem('md-content', markdown);
  }, [markdown]);

  // Handle Theme
  useEffect(() => {
    localStorage.setItem('md-theme', theme);
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Handle system theme change
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        theme={theme} 
        setTheme={setTheme}
        onPrint={handlePrint}
      />
      <main className="main-content">
        {(viewMode === 'editor' || viewMode === 'split') && (
          <Editor markdown={markdown} setMarkdown={setMarkdown} />
        )}
        
        {viewMode === 'split' && <div className="divider"></div>}
        
        {(viewMode === 'viewer' || viewMode === 'split') && (
          <Viewer markdown={markdown} />
        )}
      </main>
      <footer className="app-footer">
        <a href="https://www.linkedin.com/in/soumyadeep-dutta/" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          @soumyadeep-dutta
        </a>
      </footer>
    </>
  );
}

export default App;
