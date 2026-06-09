import React from 'react';
import { Edit3, Eye, Printer, Moon, Sun, Monitor, Type } from 'lucide-react';

export default function Header({ viewMode, setViewMode, theme, setTheme, onPrint }) {
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <header className="animate-fade-in">
      <div className="header-left">
        <div className="app-title">
          <Type size={24} />
          <span>MD Viewer</span>
        </div>
      </div>
      
      <div className="header-center">
        <button 
          className={viewMode === 'editor' ? 'active' : ''} 
          onClick={() => setViewMode('editor')}
        >
          <Edit3 size={16} /> Editor
        </button>
        <button 
          className={viewMode === 'split' ? 'active' : ''} 
          onClick={() => setViewMode('split')}
        >
          <Monitor size={16} /> Split View
        </button>
        <button 
          className={viewMode === 'viewer' ? 'active' : ''} 
          onClick={() => setViewMode('viewer')}
        >
          <Eye size={16} /> Viewer
        </button>
      </div>

      <div className="header-right">
        <div className="theme-switcher-container">
          <div className="theme-options">
            <button className={`icon-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')} title="Light Mode">
              <Sun size={16} />
            </button>
            <button className={`icon-btn ${theme === 'system' ? 'active' : ''}`} onClick={() => setTheme('system')} title="System Mode">
              <Monitor size={16} />
            </button>
            <button className={`icon-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')} title="Dark Mode">
              <Moon size={16} />
            </button>
          </div>
          <button className="icon-btn current-theme-btn" title={`Theme menu`}>
            <ThemeIcon size={20} />
          </button>
        </div>
        <button onClick={onPrint} className="print-btn" disabled={viewMode === 'editor'}>
          <Printer size={16} /> Print to PDF
        </button>
      </div>
    </header>
  );
}
