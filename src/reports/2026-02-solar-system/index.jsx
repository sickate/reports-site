import { Suspense, useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { SolarSystemScene } from './components/SolarSystemScene';
import { GestureController } from './components/Controls/GestureController';
import { InfoPanel } from './components/UI/InfoPanel';
import { ControlsHint } from './components/UI/ControlsHint';
import { useDeviceDetection, getPerformanceSettings } from './hooks/useDeviceDetection';

// WebGL compatibility check
function checkWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Loading component
function Loader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/80">Loading Solar System...</p>
      </div>
    </div>
  );
}

// WebGL not supported fallback
function WebGLNotSupported() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-white mb-4">WebGL Not Supported</h1>
        <p className="text-white/70 mb-4">
          Your browser doesn't support WebGL, which is required for the 3D solar system.
          Please try using a modern browser like Chrome, Firefox, Safari, or Edge.
        </p>
        <a
          href="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}

// Fullscreen button component
function FullscreenButton({ isFullscreen, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        z-[10000] p-2 rounded-lg transition-all duration-300
        ${isFullscreen
          ? 'fixed bottom-4 left-4 bg-white/10 hover:bg-white/20'
          : 'absolute top-16 left-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm'
        }
        text-white/80 hover:text-white border border-white/20
      `}
      title={isFullscreen ? 'Exit fullscreen (ESC)' : 'Enter fullscreen'}
    >
      {isFullscreen ? (
        // Exit fullscreen icon
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 14 10 14 10 20" />
          <polyline points="20 10 14 10 14 4" />
          <line x1="14" y1="10" x2="21" y2="3" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      ) : (
        // Enter fullscreen icon
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      )}
    </button>
  );
}

export default function SolarSystemSimulator() {
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const device = useDeviceDetection();
  const settings = getPerformanceSettings(device);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Add class to body when component mounts (for full-width styling)
  useEffect(() => {
    document.body.classList.add('solar-system-active');
    return () => {
      document.body.classList.remove('solar-system-active');
    };
  }, []);

  // Toggle body class for hiding external layout elements
  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add('solar-system-fullscreen');
    } else {
      document.body.classList.remove('solar-system-fullscreen');
    }
    return () => {
      document.body.classList.remove('solar-system-fullscreen');
    };
  }, [isFullscreen]);

  useEffect(() => {
    setWebGLSupported(checkWebGLSupport());
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!webGLSupported) {
    return <WebGLNotSupported />;
  }

  return (
    <div
      className={`
        solar-system-wrapper bg-black relative overflow-hidden
        ${isFullscreen
          ? 'fixed inset-0 z-[9999] w-screen h-screen'
          : 'w-full h-screen'
        }
      `}
    >
      {/* Loading overlay */}
      {isLoading && <Loader />}

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: [0, 40, 80],
          fov: 60,
          near: 0.1,
          far: 2000,
        }}
        dpr={[1, settings.maxDpr]}
        performance={{ min: 0.5 }}
        style={{ background: '#000' }}
        onCreated={() => setIsLoading(false)}
      >
        <Suspense fallback={null}>
          <SolarSystemScene settings={settings} />
        </Suspense>
      </Canvas>

      {/* Fullscreen button - always visible */}
      <FullscreenButton isFullscreen={isFullscreen} onClick={toggleFullscreen} />

      {/* UI Overlays - hidden in fullscreen mode */}
      <div
        className={`transition-opacity duration-300 ${
          isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <InfoPanel />
        <ControlsHint isMobile={device.isMobile} />

        {/* Gesture controller - only on desktop */}
        {!device.isMobile && <GestureController enabled={!device.isMobile} />}

        {/* Title */}
        <div className="absolute top-4 right-4 text-right z-30">
          <h1 className="text-white/90 text-lg font-light tracking-wide">Solar System</h1>
          <p className="text-white/50 text-xs">Interactive 3D Simulation</p>
        </div>
      </div>

      {/* Fullscreen hint - shows briefly when entering fullscreen */}
      {isFullscreen && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 text-white/50 text-xs
                     animate-pulse pointer-events-none"
          style={{
            animation: 'fadeOut 3s forwards',
          }}
        >
          Press ESC to exit fullscreen
        </div>
      )}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
