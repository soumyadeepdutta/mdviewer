import React, { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MobileDesignerGuard() {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="mobile-guard">
      <div className="mobile-guard-card">
        <Monitor size={48} className="mobile-guard-icon" />
        <h2>Desktop Required</h2>
        <p>
          The Mermaid Designer requires a larger screen for the best experience. 
          Please visit on a tablet or desktop device to use the visual drag-and-drop builder.
        </p>
        <button className="primary-btn" onClick={() => navigate('/')}>
          Go Back to MD Viewer
        </button>
      </div>
    </div>
  );
}
