import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Edit3, Eye, Printer, Moon, Sun, Monitor, Type, ImagePlus, Link as LinkIcon, Menu, X, LayoutTemplate, ShieldAlert, Check, FileText } from 'lucide-react';
import { BODY_FONTS, CODE_FONTS } from '../App';

export default function Header({ 
  viewMode, 
  setViewMode, 
  theme, 
  setTheme, 
  onPrint, 
  onImageUpload, 
  onImageLink, 
  customHeader,
  onRemoveHeader,
  isConfidential, 
  setIsConfidential,
  bodyFont,
  setBodyFont,
  codeFont,
  setCodeFont,
  docFooter,
  setDocFooter,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  paragraphSpacing,
  setParagraphSpacing
}) {
  const fileInputRef = useRef(null);
  const fontMenuRef = useRef(null);
  const footerMenuRef = useRef(null);
  const themeMenuRef = useRef(null);
  const imageMenuRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const [isFooterMenuOpen, setIsFooterMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  
  const location = useLocation();
  const isDesigner = location.pathname === '/designer';
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
  
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  const hasDocFooter = docFooter && (docFooter.preparedBy || docFooter.designation || docFooter.date || docFooter.place);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(e.target)) {
        setIsFontMenuOpen(false);
      }
      if (footerMenuRef.current && !footerMenuRef.current.contains(e.target)) {
        setIsFooterMenuOpen(false);
      }
      if (themeMenuRef.current && !themeMenuRef.current.contains(e.target)) {
        setIsThemeMenuOpen(false);
      }
      if (imageMenuRef.current && !imageMenuRef.current.contains(e.target)) {
        setIsImageMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="animate-fade-in">
      <div className="header-left">
        <div className="app-title">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="MDViewer Logo" className="app-logo" style={{ height: '32px', width: '32px', borderRadius: '6px' }} />
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}><span>MD Viewer</span></Link>
        </div>
        
        <div className="nav-links hide-on-mobile segment-control" style={{ marginLeft: '16px' }}>
          <Link to="/" className={`segment-btn ${!isDesigner ? 'active' : ''}`}>
            <Type size={14} /> Markdown
          </Link>
          <Link to="/designer" className={`segment-btn ${isDesigner ? 'active' : ''}`}>
            <LayoutTemplate size={14} /> Designer
          </Link>
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
          {!isDesigner && (
            <div className="segment-control">
              <button 
                className={`segment-btn ${viewMode === 'editor' ? 'active' : ''}`} 
                onClick={() => setViewMode('editor')}
                data-tooltip="Editor Only"
              >
                <Edit3 size={14} /> <span>Editor</span>
              </button>
              <button 
                className={`segment-btn ${viewMode === 'split' ? 'active' : ''}`} 
                onClick={() => setViewMode('split')}
                data-tooltip="Split View"
              >
                <Monitor size={14} /> <span>Split View</span>
              </button>
              <button 
                className={`segment-btn ${viewMode === 'viewer' ? 'active' : ''}`} 
                onClick={() => setViewMode('viewer')}
                data-tooltip="Viewer Only"
              >
                <Eye size={14} /> <span>Viewer</span>
              </button>
            </div>
          )}
        </div>

        <div className="header-right">
          {!isDesigner && viewMode !== 'editor' && (
            <div className="header-actions">
              <div className="font-menu-container" ref={imageMenuRef}>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    onImageUpload(e);
                    setIsImageMenuOpen(false);
                  }} 
                />
                <button 
                  className={`icon-btn ${isImageMenuOpen || customHeader ? 'active' : ''}`} 
                  onClick={() => setIsImageMenuOpen(!isImageMenuOpen)} 
                  data-tooltip="Header Image Options"
                >
                  <ImagePlus size={16} />
                </button>
                {isImageMenuOpen && (
                  <div className="font-picker-dropdown animate-fade-in" style={{ width: '200px' }}>
                    <div className="font-section-title">Header Image</div>
                    <div className="font-option-list">
                      <button
                        type="button"
                        className="font-option-btn"
                        onClick={() => {
                          fileInputRef.current?.click();
                          setIsImageMenuOpen(false);
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ImagePlus size={14} /> <span>Upload Local Image</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        className="font-option-btn"
                        onClick={() => {
                          setIsImageMenuOpen(false);
                          onImageLink();
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <LinkIcon size={14} /> <span>Enter Image URL</span>
                        </div>
                      </button>
                      {customHeader && (
                        <>
                          <div className="font-picker-divider" />
                          <button
                            type="button"
                            className="font-option-btn"
                            style={{ color: '#ef4444' }}
                            onClick={() => {
                              onRemoveHeader();
                              setIsImageMenuOpen(false);
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <X size={14} /> <span>Remove Header</span>
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="font-menu-container" ref={fontMenuRef}>
                <button 
                  className={`icon-btn ${isFontMenuOpen ? 'active' : ''}`} 
                  onClick={() => setIsFontMenuOpen(!isFontMenuOpen)} 
                  data-tooltip="Font Options"
                >
                  <Type size={16} />
                </button>
                {isFontMenuOpen && (
                  <div className="font-picker-dropdown typography-picker-dropdown animate-fade-in">
                    <div className="typo-columns-wrapper">
                      {/* Left Column: Fonts */}
                      <div className="typo-column typo-column-left">
                        <div className="font-picker-section">
                          <div className="font-section-title">Document Font</div>
                          <div className="font-option-list">
                            {Object.keys(BODY_FONTS).map((font) => (
                              <button
                                key={font}
                                className={`font-option-btn ${bodyFont === font ? 'active' : ''}`}
                                style={{ fontFamily: BODY_FONTS[font] }}
                                onClick={() => setBodyFont(font)}
                              >
                                <span>{font}</span>
                                {bodyFont === font && <Check size={14} />}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="font-picker-divider" />
                        <div className="font-picker-section">
                          <div className="font-section-title">Code Font</div>
                          <div className="font-option-list">
                            {Object.keys(CODE_FONTS).map((font) => (
                              <button
                                key={font}
                                className={`font-option-btn ${codeFont === font ? 'active' : ''}`}
                                style={{ fontFamily: CODE_FONTS[font] }}
                                onClick={() => setCodeFont(font)}
                              >
                                <span>{font}</span>
                                {codeFont === font && <Check size={14} />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="typo-column-divider" />

                      {/* Right Column: Size & Spacing Sliders */}
                      <div className="typo-column typo-column-right">
                        <div className="font-picker-section">
                          <div className="font-section-title">Size & Spacing</div>
                          <div className="typo-controls-form">
                            {/* Font Size */}
                            <div className="typo-control-row">
                              <div className="typo-control-header">
                                <span>Font Size</span>
                                <span className="typo-unit">px</span>
                              </div>
                              <div className="typo-input-group">
                                <input 
                                  type="range" 
                                  min="12" 
                                  max="28" 
                                  step="1"
                                  className="typo-slider"
                                  value={fontSize} 
                                  onChange={(e) => setFontSize(Number(e.target.value))} 
                                />
                                <input 
                                  type="number" 
                                  min="12" 
                                  max="28" 
                                  step="1"
                                  className="typo-num-input"
                                  value={fontSize} 
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (val >= 12 && val <= 28) setFontSize(val);
                                  }} 
                                />
                              </div>
                            </div>

                            {/* Line Spacing */}
                            <div className="typo-control-row">
                              <div className="typo-control-header">
                                <span>Line Spacing</span>
                              </div>
                              <div className="typo-input-group">
                                <input 
                                  type="range" 
                                  min="1.0" 
                                  max="2.5" 
                                  step="0.1"
                                  className="typo-slider"
                                  value={lineHeight} 
                                  onChange={(e) => setLineHeight(Number(parseFloat(e.target.value).toFixed(1)))} 
                                />
                                <input 
                                  type="number" 
                                  min="1.0" 
                                  max="2.5" 
                                  step="0.1"
                                  className="typo-num-input"
                                  value={lineHeight} 
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (val >= 1.0 && val <= 2.5) setLineHeight(val);
                                  }} 
                                />
                              </div>
                            </div>

                            {/* Paragraph Spacing */}
                            <div className="typo-control-row">
                              <div className="typo-control-header">
                                <span>Paragraph Spacing</span>
                                <span className="typo-unit">px</span>
                              </div>
                              <div className="typo-input-group">
                                <input 
                                  type="range" 
                                  min="8" 
                                  max="40" 
                                  step="2"
                                  className="typo-slider"
                                  value={paragraphSpacing} 
                                  onChange={(e) => setParagraphSpacing(Number(e.target.value))} 
                                />
                                <input 
                                  type="number" 
                                  min="8" 
                                  max="40" 
                                  step="2"
                                  className="typo-num-input"
                                  value={paragraphSpacing} 
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    if (val >= 8 && val <= 40) setParagraphSpacing(val);
                                  }} 
                                />
                              </div>
                            </div>

                            {(fontSize !== 16 || lineHeight !== 1.7 || paragraphSpacing !== 16) && (
                              <button 
                                type="button"
                                className="typo-reset-btn"
                                onClick={() => {
                                  setFontSize(16);
                                  setLineHeight(1.7);
                                  setParagraphSpacing(16);
                                }}
                              >
                                Reset Spacing Defaults
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="font-menu-container" ref={footerMenuRef}>
                <button 
                  className={`icon-btn ${isFooterMenuOpen || hasDocFooter ? 'active' : ''}`} 
                  onClick={() => setIsFooterMenuOpen(!isFooterMenuOpen)} 
                  data-tooltip="Footer Metadata (Prepared By, Date, Place)"
                >
                  <FileText size={16} />
                </button>
                {isFooterMenuOpen && (
                  <div className="font-picker-dropdown doc-footer-picker-dropdown animate-fade-in">
                    <div className="font-section-title">Document Footer Sign-off</div>
                    <div className="doc-footer-form">
                      <div className="doc-footer-input-group">
                        <label>Prepared By</label>
                        <input 
                          type="text" 
                          placeholder="e.g. John Doe"
                          value={docFooter?.preparedBy || ''} 
                          onChange={(e) => setDocFooter({ ...docFooter, preparedBy: e.target.value })} 
                        />
                      </div>
                      <div className="doc-footer-input-group">
                        <label>Designation</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Lead Analyst"
                          value={docFooter?.designation || ''} 
                          onChange={(e) => setDocFooter({ ...docFooter, designation: e.target.value })} 
                        />
                      </div>
                      <div className="doc-footer-input-group">
                        <label>Date</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 21 July 2026"
                          value={docFooter?.date || ''} 
                          onChange={(e) => setDocFooter({ ...docFooter, date: e.target.value })} 
                        />
                      </div>
                      <div className="doc-footer-input-group">
                        <label>Place</label>
                        <input 
                          type="text" 
                          placeholder="e.g. New York"
                          value={docFooter?.place || ''} 
                          onChange={(e) => setDocFooter({ ...docFooter, place: e.target.value })} 
                        />
                      </div>
                      {hasDocFooter && (
                        <button 
                          type="button"
                          className="doc-footer-clear-btn"
                          onClick={() => setDocFooter({ preparedBy: '', designation: '', date: '', place: '' })}
                        >
                          Clear Footer Fields
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button 
                className={`icon-btn confidential-toggle-btn ${isConfidential ? 'active' : ''}`} 
                onClick={() => setIsConfidential(!isConfidential)} 
                data-tooltip={isConfidential ? "Remove Confidential Mark" : "Mark as Confidential"}
              >
                <ShieldAlert size={16} />
              </button>
            </div>
          )}
          <div className="font-menu-container" ref={themeMenuRef}>
            <button 
              className={`icon-btn ${isThemeMenuOpen ? 'active' : ''}`} 
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)} 
              data-tooltip="Theme Mode"
            >
              <ThemeIcon size={16} />
            </button>
            {isThemeMenuOpen && (
              <div className="font-picker-dropdown animate-fade-in" style={{ width: '170px' }}>
                <div className="font-section-title">Theme Mode</div>
                <div className="font-option-list">
                  <button
                    type="button"
                    className={`font-option-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sun size={14} /> <span>Light Mode</span>
                    </div>
                    {theme === 'light' && <Check size={14} />}
                  </button>
                  <button
                    type="button"
                    className={`font-option-btn ${theme === 'system' ? 'active' : ''}`}
                    onClick={() => { setTheme('system'); setIsThemeMenuOpen(false); }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Monitor size={14} /> <span>System Mode</span>
                    </div>
                    {theme === 'system' && <Check size={14} />}
                  </button>
                  <button
                    type="button"
                    className={`font-option-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => { setTheme('dark'); setIsThemeMenuOpen(false); }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Moon size={14} /> <span>Dark Mode</span>
                    </div>
                    {theme === 'dark' && <Check size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="header-right-always">
        {!isDesigner && (
          <button onClick={onPrint} className="print-btn" disabled={viewMode === 'editor'}>
            <Printer size={16} /> <span className="hide-on-mobile">Print to PDF</span>
          </button>
        )}
        <button className="icon-btn mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
