import { useState, useEffect } from 'react';

export function ControlsHint({ isMobile = false }) {
  const [visible, setVisible] = useState(true);

  // Auto-hide after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-40 bg-black/70 backdrop-blur-sm rounded-lg p-3 max-w-xs border border-white/10"
      style={{
        animation: 'fadeIn 0.5s ease-out',
      }}
    >
      <button
        onClick={() => setVisible(false)}
        className="absolute top-1 right-2 text-white/40 hover:text-white text-sm"
        aria-label="Dismiss"
      >
        &times;
      </button>

      <h3 className="text-white/90 text-sm font-medium mb-2">Controls</h3>

      {isMobile ? (
        <ul className="text-white/70 text-xs space-y-1">
          <li>Drag to rotate view</li>
          <li>Pinch to zoom in/out</li>
          <li>Tap planet for info</li>
        </ul>
      ) : (
        <ul className="text-white/70 text-xs space-y-1">
          <li>Left drag: Rotate view</li>
          <li>Right drag: Pan</li>
          <li>Scroll: Zoom in/out</li>
          <li>Click planet: Show info</li>
          <li className="text-cyan-300/80 pt-1 border-t border-white/10 mt-1">
            ✋ Open hand: Rotate view
          </li>
          <li className="text-green-300/80">
            🤏 Single pinch: Pan view
          </li>
          <li className="text-pink-300/80">
            🤲 Both pinch: Zoom in/out
          </li>
        </ul>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
