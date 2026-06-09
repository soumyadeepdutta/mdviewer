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
  const [customHeader, setCustomHeader] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomHeader(event.target.result);
      };
      reader.readAsDataURL(file);
    }
    // Reset input value to allow uploading the same file again if needed
    e.target.value = null;
  };

  const handleImageLink = () => {
    const url = window.prompt("Enter the image URL:");
    if (url) {
      setCustomHeader(url);
    }
  };

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
        onImageUpload={handleImageUpload}
        onImageLink={handleImageLink}
      />
      <main className="main-content">
        {(viewMode === 'editor' || viewMode === 'split') && (
          <Editor markdown={markdown} setMarkdown={setMarkdown} />
        )}
        
        {viewMode === 'split' && <div className="divider"></div>}
        
        {(viewMode === 'viewer' || viewMode === 'split') && (
          <Viewer 
            markdown={markdown} 
            customHeader={customHeader} 
            onRemoveHeader={() => setCustomHeader(null)} 
          />
        )}
      </main>
      <footer className="app-footer">
        <a href="https://www.linkedin.com/in/soumyadeep-dutta/" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          @soumyadeep-dutta
        </a>
        <a href="https://github.com/soumyadeepdutta/mdviewer" target="_blank" rel="noopener noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          GitHub
        </a>
      </footer>
    </>
  );
}

export default App;
