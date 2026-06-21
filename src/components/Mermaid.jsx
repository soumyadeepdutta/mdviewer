import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

export default function Mermaid({ chart }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        setError(false);
        
        // Determine theme based on document root class
        const isDark = document.documentElement.classList.contains('dark');
        
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
        });

        // Generate a unique ID for the mermaid diagram
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        
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

  return (
    <div 
      className="mermaid-wrapper" 
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svgContent }} 
    />
  );
}
