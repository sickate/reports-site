import { useState, useEffect } from 'react';

export function useDeviceDetection() {
  const [device, setDevice] = useState({
    isMobile: false,
    isTouch: false,
    gpuTier: 'high', // 'high', 'medium', 'low'
  });

  useEffect(() => {
    const checkDevice = () => {
      // Check if mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

      // Check if touch device
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Simple GPU tier detection based on device and screen
      let gpuTier = 'high';
      if (isMobile) {
        gpuTier = 'low';
      } else if (window.devicePixelRatio < 2 || window.innerWidth < 1200) {
        gpuTier = 'medium';
      }

      setDevice({ isMobile, isTouch, gpuTier });
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return device;
}

export function getPerformanceSettings(device) {
  const { isMobile, gpuTier } = device;

  if (isMobile) {
    return {
      starCount: 50000,
      asteroidCount: 0,
      enableAtmosphere: false,
      geometrySegments: 16,
      enableShadows: false,
      maxDpr: 1.5,
    };
  }

  if (gpuTier === 'low') {
    return {
      starCount: 100000,
      asteroidCount: 1000,
      enableAtmosphere: true,
      geometrySegments: 24,
      enableShadows: false,
      maxDpr: 1.5,
    };
  }

  if (gpuTier === 'medium') {
    return {
      starCount: 150000,
      asteroidCount: 2000,
      enableAtmosphere: true,
      geometrySegments: 28,
      enableShadows: true,
      maxDpr: 2,
    };
  }

  // High tier
  return {
    starCount: 200000,
    asteroidCount: 3000,
    enableAtmosphere: true,
    geometrySegments: 32,
    enableShadows: true,
    maxDpr: 2,
  };
}
