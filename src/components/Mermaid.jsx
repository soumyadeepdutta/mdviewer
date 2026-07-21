import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { ZoomIn, ZoomOut, RotateCcw, Maximize, Minimize, Lock, Unlock } from 'lucide-react';

export default function Mermaid({ chart }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      let id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
      try {
        setError(false);
        
        // Determine theme based on document root class
        const isDark = document.documentElement.classList.contains('dark');
        
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
        });
        
        const { svg } = await mermaid.render(id, chart);
        
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err) {
        console.error('Mermaid rendering failed:', err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        // Cleanup mermaid's temporary DOM nodes that might be left behind on error
        // Specifically look for the exact ID to avoid deleting concurrent renders
        const orphanNode = document.getElementById('d' + id);
        if (orphanNode && orphanNode.parentNode === document.body) {
          orphanNode.remove();
        }
      }
    };

    if (chart) {
      renderChart();
    }

    return () => {
      isMounted = false;
    };
  }, [chart]);

  // Optionally listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          // Re-render chart on theme change
          const isDark = document.documentElement.classList.contains('dark');
          mermaid.initialize({
            theme: isDark ? 'dark' : 'default'
          });
          // Since mermaid.render is async and requires the chart, 
          // we could just force a re-render by calling the same logic.
          // For simplicity, we can just rely on the component re-mounting 
          // or we can extract render logic.
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  if (error) {
    return (
      <div className="mermaid-error">
        <p>Failed to render diagram. Raw code:</p>
        <pre><code>{chart}</code></pre>
      </div>
    );
  }

  const fullscreenStyle = isFullscreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    backgroundColor: 'var(--bg-color)',
    padding: 0,
    margin: 0,
    borderRadius: 0,
    border: 'none',
    display: 'flex',
    flexDirection: 'column'
  } : {
    position: 'relative', 
    overflow: 'hidden', 
    padding: 0, 
    display: 'block',
    width: '100%'
  };

  return (
    <div className={`mermaid-wrapper ${isFullscreen ? 'fullscreen' : ''}`} style={fullscreenStyle}>
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={10}
        centerOnInit={true}
        disabled={isLocked && !isFullscreen}
        wheel={{ wheelDisabled: isLocked && !isFullscreen }}
        panning={{ disabled: isLocked && !isFullscreen }}
        pinch={{ disabled: isLocked && !isFullscreen }}
        doubleClick={{ disabled: isLocked && !isFullscreen }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, display: 'flex', gap: '4px', backgroundColor: 'var(--bg-color)', padding: '4px', borderRadius: '6px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s ease' }}>
              <button type="button" className="icon-btn" onClick={() => setIsLocked(!isLocked)} title={isLocked ? "Unlock Diagram" : "Lock Diagram"} style={{ width: '28px', height: '28px', padding: 0, border: 'none', background: isLocked ? 'rgba(239, 68, 68, 0.1)' : 'transparent', color: isLocked ? '#ef4444' : 'inherit' }}>
                {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
              
              {!isLocked && (
                <>
                  <div style={{ width: '1px', backgroundColor: 'var(--border-color)', margin: '4px 2px' }}></div>
                  <button type="button" className="icon-btn" onClick={() => zoomIn()} title="Zoom In" style={{ width: '28px', height: '28px', padding: 0, border: 'none', background: 'transparent' }}><ZoomIn size={16} /></button>
                  <button type="button" className="icon-btn" onClick={() => zoomOut()} title="Zoom Out" style={{ width: '28px', height: '28px', padding: 0, border: 'none', background: 'transparent' }}><ZoomOut size={16} /></button>
                  <button type="button" className="icon-btn" onClick={() => resetTransform()} title="Reset Zoom" style={{ width: '28px', height: '28px', padding: 0, border: 'none', background: 'transparent' }}><RotateCcw size={16} /></button>
                </>
              )}
              
              <div style={{ width: '1px', backgroundColor: 'var(--border-color)', margin: '4px 2px' }}></div>
              <button type="button" className="icon-btn" onClick={() => { 
                const enteringFullscreen = !isFullscreen;
                setIsFullscreen(enteringFullscreen); 
                if (enteringFullscreen) setIsLocked(false);
                setTimeout(resetTransform, 100); 
              }} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} style={{ width: '28px', height: '28px', padding: 0, border: 'none', background: 'transparent' }}>
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
            </div>
            <TransformComponent 
              wrapperStyle={{ 
                width: '100%', 
                height: isFullscreen ? '100%' : 'auto', 
                minHeight: isFullscreen ? '100vh' : 'auto' 
              }} 
              contentStyle={{ 
                width: '100%', 
                height: isFullscreen ? '100%' : 'auto', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: isFullscreen ? '2rem' : '1.5rem' 
              }}
            >
              <div 
                ref={containerRef}
                dangerouslySetInnerHTML={{ __html: svgContent }} 
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
