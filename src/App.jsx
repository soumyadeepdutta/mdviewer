import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Editor from './components/Editor';
import Viewer from './components/Viewer';

const MermaidDesigner = lazy(() => import('./components/MermaidDesigner'));

export const BODY_FONTS = {
  'Inter': "'Inter', system-ui, -apple-system, sans-serif",
  'Roboto': "'Roboto', sans-serif",
  'Aptos': "'Aptos', 'Segoe UI', system-ui, sans-serif",
  'Verdana': "'Verdana', Geneva, sans-serif",
  'Times New Roman': "'Times New Roman', Times, serif",
  'Merriweather': "'Merriweather', Georgia, serif",
  'Sans-Serif': "sans-serif"
};

export const CODE_FONTS = {
  'Fira Code': "'Fira Code', monospace",
  'Roboto Mono': "'Roboto Mono', monospace",
  'Consolas': "'Consolas', 'Monaco', monospace",
  'Monaco': "'Monaco', 'Consolas', monospace",
  'JetBrains Mono': "'JetBrains Mono', monospace"
};

function App() {
  const [markdown, setMarkdown] = useState(() => {
    return localStorage.getItem('md-content') || '# Welcome to MD Viewer\n\nType some **markdown** here to get started.\n\n- Beautiful\n- Fast\n- Offline';
  });
  const [viewMode, setViewMode] = useState('split'); // editor, viewer, split
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('md-theme') || 'system';
  });
  
  const [bodyFont, setBodyFont] = useState(() => {
    return localStorage.getItem('md-body-font') || 'Inter';
  });

  const [codeFont, setCodeFont] = useState(() => {
    return localStorage.getItem('md-code-font') || 'Fira Code';
  });

  // Initialize codeTheme based on current theme, or default to dark
  const [codeTheme, setCodeTheme] = useState(() => {
    if (theme === 'light') return 'light';
    if (theme === 'dark') return 'dark';
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [customHeader, setCustomHeader] = useState(null);
  const [isConfidential, setIsConfidential] = useState(() => {
    return localStorage.getItem('md-confidential') === 'true';
  });

  const [docFooter, setDocFooter] = useState(() => {
    try {
      const saved = localStorage.getItem('md-doc-footer');
      return saved ? JSON.parse(saved) : { preparedBy: '', designation: '', date: '', place: '' };
    } catch (e) {
      return { preparedBy: '', designation: '', date: '', place: '' };
    }
  });

  useEffect(() => {
    localStorage.setItem('md-doc-footer', JSON.stringify(docFooter));
  }, [docFooter]);

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

  // Save confidential state to local storage
  useEffect(() => {
    localStorage.setItem('md-confidential', isConfidential ? 'true' : 'false');
  }, [isConfidential]);

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('md-font-size');
    return saved ? Number(saved) : 16;
  });

  const [lineHeight, setLineHeight] = useState(() => {
    const saved = localStorage.getItem('md-line-height');
    return saved ? Number(saved) : 1.7;
  });

  const [paragraphSpacing, setParagraphSpacing] = useState(() => {
    const saved = localStorage.getItem('md-paragraph-spacing');
    return saved ? Number(saved) : 16;
  });

  // Sync Body Font CSS Variable
  useEffect(() => {
    localStorage.setItem('md-body-font', bodyFont);
    const fontStr = BODY_FONTS[bodyFont] || BODY_FONTS['Inter'];
    document.documentElement.style.setProperty('--body-font-family', fontStr);
  }, [bodyFont]);

  // Sync Code Font CSS Variable
  useEffect(() => {
    localStorage.setItem('md-code-font', codeFont);
    const fontStr = CODE_FONTS[codeFont] || CODE_FONTS['Fira Code'];
    document.documentElement.style.setProperty('--code-font-family', fontStr);
  }, [codeFont]);

  // Sync Font Size CSS Variable
  useEffect(() => {
    localStorage.setItem('md-font-size', fontSize);
    document.documentElement.style.setProperty('--doc-font-size', `${fontSize}px`);
  }, [fontSize]);

  // Sync Line Height CSS Variable
  useEffect(() => {
    localStorage.setItem('md-line-height', lineHeight);
    document.documentElement.style.setProperty('--doc-line-height', `${lineHeight}`);
  }, [lineHeight]);

  // Sync Paragraph Spacing CSS Variable
  useEffect(() => {
    localStorage.setItem('md-paragraph-spacing', paragraphSpacing);
    document.documentElement.style.setProperty('--doc-paragraph-spacing', `${paragraphSpacing}px`);
  }, [paragraphSpacing]);

  // Handle Theme and One-Way Sync to Code Theme
  useEffect(() => {
    localStorage.setItem('md-theme', theme);
    
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const systemTheme = isDark ? 'dark' : 'light';
      root.classList.add(systemTheme);
      setCodeTheme(systemTheme); // One-way sync
    } else {
      root.classList.add(theme);
      setCodeTheme(theme); // One-way sync
    }
  }, [theme]);

  // Handle system theme change
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        const isDark = mediaQuery.matches;
        root.classList.add(isDark ? 'dark' : 'light');
        setCodeTheme(isDark ? 'dark' : 'light'); // Sync dynamically when system changes
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const editorRef = React.useRef(null);
  const viewerRef = React.useRef(null);
  const scrollingSourceRef = React.useRef(null);
  const isSyncingRef = React.useRef(false);

  const handleEditorScroll = (e) => {
    if (viewMode !== 'split') return;
    if (isSyncingRef.current) return;
    if (scrollingSourceRef.current && scrollingSourceRef.current !== 'editor') return;

    const editorEl = e.target;
    const viewerEl = viewerRef.current;
    if (!editorEl || !viewerEl) return;

    const maxEditorScroll = editorEl.scrollHeight - editorEl.clientHeight;
    if (maxEditorScroll <= 0) return;

    const percentage = editorEl.scrollTop / maxEditorScroll;
    const maxViewerScroll = viewerEl.scrollHeight - viewerEl.clientHeight;

    isSyncingRef.current = true;
    viewerEl.scrollTop = percentage * maxViewerScroll;
    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  };

  const handleViewerScroll = (e) => {
    if (viewMode !== 'split') return;
    if (isSyncingRef.current) return;
    if (scrollingSourceRef.current && scrollingSourceRef.current !== 'viewer') return;

    const viewerEl = e.target;
    const editorEl = editorRef.current;
    if (!viewerEl || !editorEl) return;

    const maxViewerScroll = viewerEl.scrollHeight - viewerEl.clientHeight;
    if (maxViewerScroll <= 0) return;

    const percentage = viewerEl.scrollTop / maxViewerScroll;
    const maxEditorScroll = editorEl.scrollHeight - editorEl.clientHeight;

    isSyncingRef.current = true;
    editorEl.scrollTop = percentage * maxEditorScroll;
    requestAnimationFrame(() => {
      isSyncingRef.current = false;
    });
  };

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
        customHeader={customHeader}
        onRemoveHeader={() => setCustomHeader(null)}
        isConfidential={isConfidential}
        setIsConfidential={setIsConfidential}
        bodyFont={bodyFont}
        setBodyFont={setBodyFont}
        codeFont={codeFont}
        setCodeFont={setCodeFont}
        docFooter={docFooter}
        setDocFooter={setDocFooter}
        fontSize={fontSize}
        setFontSize={setFontSize}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        paragraphSpacing={paragraphSpacing}
        setParagraphSpacing={setParagraphSpacing}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <>
              {(viewMode === 'editor' || viewMode === 'split') && (
                <Editor 
                  markdown={markdown} 
                  setMarkdown={setMarkdown} 
                  editorRef={editorRef}
                  onScroll={handleEditorScroll}
                  onMouseEnter={() => { scrollingSourceRef.current = 'editor'; }}
                  onTouchStart={() => { scrollingSourceRef.current = 'editor'; }}
                />
              )}
              
              {viewMode === 'split' && <div className="divider"></div>}
              
              {(viewMode === 'viewer' || viewMode === 'split') && (
                <Viewer 
                  markdown={markdown} 
                  customHeader={customHeader} 
                  onRemoveHeader={() => setCustomHeader(null)} 
                  codeTheme={codeTheme}
                  setCodeTheme={setCodeTheme}
                  isConfidential={isConfidential}
                  docFooter={docFooter}
                  viewerRef={viewerRef}
                  onScroll={handleViewerScroll}
                  onMouseEnter={() => { scrollingSourceRef.current = 'viewer'; }}
                  onTouchStart={() => { scrollingSourceRef.current = 'viewer'; }}
                />
              )}
            </>
          } />
          <Route path="/designer" element={
            <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>Loading Designer...</div>}>
              <MermaidDesigner codeTheme={codeTheme} />
            </Suspense>
          } />
        </Routes>
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
