import React, { useRef, useState } from 'react';
import { Edit3, Eye, Printer, Moon, Sun, Monitor, Type, ImagePlus, Link, Menu, X } from 'lucide-react';

export default function Header({ viewMode, setViewMode, theme, setTheme, onPrint, onImageUpload, onImageLink }) {
  const fileInputRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <header className="animate-fade-in">
      <div className="header-left">
        <div className="app-title">
          <img src="/logo.png" alt="MDViewer Logo" className="app-logo" style={{ height: '32px', width: '32px', borderRadius: '6px' }} />
          <span>MD Viewer</span>
        </div>
      </div>
      
      <div className={`mobile-menu-container ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Menu</span>
          <button className="icon-btn close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="header-center">
          <button 
            className={viewMode === 'editor' ? 'active' : ''} 
            onClick={() => setViewMode('editor')}
            data-tooltip="Editor"
          >
            <Edit3 size={16} /> <span>Editor</span>
          </button>
          <button 
            className={viewMode === 'split' ? 'active' : ''} 
            onClick={() => setViewMode('split')}
            data-tooltip="Split View"
          >
            <Monitor size={16} /> <span>Split View</span>
          </button>
          <button 
            className={viewMode === 'viewer' ? 'active' : ''} 
            onClick={() => setViewMode('viewer')}
            data-tooltip="Viewer"
          >
            <Eye size={16} /> <span>Viewer</span>
          </button>
        </div>

        <div className="header-right">
          {viewMode !== 'editor' && (
            <div className="header-actions">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={onImageUpload} 
              />
              <button className="icon-btn" onClick={() => fileInputRef.current?.click()} data-tooltip="Upload Header Image">
                <ImagePlus size={16} />
              </button>
              <button className="icon-btn" onClick={onImageLink} data-tooltip="Add Header Link">
                <Link size={16} />
              </button>
            </div>
          )}
          <div className="theme-switcher-container">
            <div className="theme-options">
              <button className={`icon-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')} data-tooltip="Light Mode">
                <Sun size={16} />
              </button>
              <button className={`icon-btn ${theme === 'system' ? 'active' : ''}`} onClick={() => setTheme('system')} data-tooltip="System Mode">
                <Monitor size={16} />
              </button>
              <button className={`icon-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')} data-tooltip="Dark Mode">
                <Moon size={16} />
              </button>
            </div>
            <button className="icon-btn current-theme-btn" data-tooltip="Theme menu">
              <ThemeIcon size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="header-right-always">
        <button onClick={onPrint} className="print-btn" disabled={viewMode === 'editor'}>
          <Printer size={16} /> <span className="hide-on-mobile">Print to PDF</span>
        </button>
        <button className="icon-btn mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
