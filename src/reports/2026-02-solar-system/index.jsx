import { Suspense, useState, useEffect } from 'react';
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

export default function SolarSystemSimulator() {
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const device = useDeviceDetection();
  const settings = getPerformanceSettings(device);

  useEffect(() => {
    setWebGLSupported(checkWebGLSupport());
    // Simulate minimum loading time for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!webGLSupported) {
    return <WebGLNotSupported />;
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
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

      {/* UI Overlays */}
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
  );
}
