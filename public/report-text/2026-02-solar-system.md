# 3D Solar System Simulator

Report: https://reports.instap.net/reports/2026-02-solar-system
Date: 2026-02-04
Coverage: rendered-initial-view-and-existing-data

交互式3D太阳系模拟器，支持手势控制



Loading Solar System...

×Controls
Left drag: Rotate view
Right drag: Pan
Scroll: Zoom in/out
Click planet: Show info
✋ Open hand: Rotate view
🤏 Single pinch: Pan view
🤲 Both pinch: Zoom in/out

Loading...

✋ Open = Rotate · 🤏 Pinch = Pan · 🤲 Both = Zoom

Solar System
Interactive 3D Simulation

## Existing authored data: src/reports/2026-02-solar-system/data/planetData.js

```
// Planet data with scaled distances and sizes for visualization
// Real astronomical data would make inner planets invisible
// Using logarithmic scaling for better visualization

// Planet types for shader: 0=rocky, 1=gas giant, 2=ice giant, 3=earth-like
export const PLANET_TYPES = {
  ROCKY: 0,
  GAS_GIANT: 1,
  ICE_GIANT: 2,
  EARTH_LIKE: 3,
};

export const SUN_DATA = {
  name: 'Sun',
  nameCn: '太阳',
  radius: 5,
  description: 'The star at the center of our solar system',
  descriptionCn: '太阳系中心的恒星',
  facts: {
    diameter: '1,392,700 km',
    mass: '1.989 × 10³⁰ kg',
    temperature: '5,500°C (surface)',
    age: '4.6 billion years',
  },
};

export const PLANETS = [
  {
    name: 'Mercury',
    nameCn: '水星',
    radius: 0.4,
    distance: 10,
    orbitalSpeed: 0.04,
    rotationSpeed: 0.004,
    planetType: PLANET_TYPES.ROCKY,
    colors: ['#8B7355', '#A0522D', '#696969'], // Brown/gray rocky
    texture: '/textures/planets/mercury.jpg',
    description: 'The smallest planet and closest to the Sun',
    descriptionCn: '最小的行星，距离太阳最近',
    facts: {
      diameter: '4,879 km',
      dayLength: '59 Earth days',
      yearLength: '88 Earth days',
      moons: 0,
    },
  },
  {
    name: 'Venus',
    nameCn: '金星',
    radius: 0.9,
    distance: 14,
    orbitalSpeed: 0.015,
    rotationSpeed: -0.002,
    planetType: PLANET_TYPES.ROCKY,
    colors: ['#E6C229', '#DAA520', '#CD853F'], // Yellow/orange
    texture: '/textures/planets/venus.jpg',
    hasAtmosphere: true,
    atmosphereColor: '#E6C229',
    description: 'The hottest planet with thick toxic atmosphere',
    descriptionCn: '最热的行星，拥有浓厚的有毒大气',
    facts: {
      diameter: '12,104 km',
      dayLength: '243 Earth days',
      yearLength: '225 Earth days',
      moons: 0,
    },
  },
  {
    name: 'Earth',
    nameCn: '地球',
    radius: 1,
    distance: 18,
    orbitalSpeed: 0.01,
    rotationSpeed: 0.02,
    planetType: PLANET_TYPES.EARTH_LIKE,
    colors: ['#1E90FF', '#228B22', '#8B4513'], // Ocean, land, mountains
    texture: '/textures/planets/earth.jpg',
    hasAtmosphere: true,
    atmosphereColor: '#87CEEB',
    description: 'Our home planet, the only known world with life',
    descriptionCn: '我们的家园，唯一已知有生命的星球',
    facts: {
      diameter: '12,742 km',
      dayLength: '24 hours',
      yearLength: '365.25 days',
      moons: 1,
    },
    moons: [
      {
        name: 'Moon',
        nameCn: '月球',
        radius: 0.27,
        distance: 2.5,
        orbitalSpeed: 0.05,
        colors: ['#C0C0C0', '#A9A9A9', '#808080'],
        planetType: PLANET_TYPES.ROCKY,
        texture: '/textures/planets/moon.jpg',
      },
    ],
  },
  {
    name: 'Mars',
    nameCn: '火星',
    radius: 0.5,
    distance: 24,
    orbitalSpeed: 0.008,
    rotationSpeed: 0.018,
    planetType: PLANET_TYPES.ROCKY,
    colors: ['#CD5C5C', '#B22222', '#8B0000'], // Red/rust
    texture: '/textures/planets/mars.jpg',
    hasAtmosphere: true,
    atmosphereColor: '#CD5C5C',
    description: 'The Red Planet, target for human exploration',
    descriptionCn: '红色星球，人类探索的目标',
    facts: {
      diameter: '6,779 km',
      dayLength: '24.6 hours',
      yearLength: '687 Earth days',
      moons: 2,
    },
    moons: [
      {
        name: 'Phobos',
        nameCn: '火卫一',
        radius: 0.1,
        distance: 1.2,
        orbitalSpeed: 0.1,
        colors: ['#8B7355', '#696969', '#555555'],
        planetType: PLANET_TYPES.ROCKY,
      },
      {
        name: 'Deimos',
        nameCn: '火卫二',
        radius: 0.06,
        distance: 1.8,
        orbitalSpeed: 0.07,
        colors: ['#8B7355', '#696969', '#555555'],
        planetType: PLANET_TYPES.ROCKY,
      },
    ],
  },
  {
    name: 'Jupiter',
    nameCn: '木星',
    radius: 3,
    distance: 40,
    orbitalSpeed: 0.002,
    rotationSpeed: 0.04,
    planetType: PLANET_TYPES.GAS_GIANT,
    colors: ['#D4A574', '#F5DEB3', '#CD853F'], // Tan/brown bands
    texture: '/textures/planets/jupiter.jpg',
    description: 'The largest planet, a gas giant with the Great Red Spot',
    descriptionCn: '最大的行星，拥有大红斑的气态巨行星',
    facts: {
      diameter: '139,820 km',
      dayLength: '10 hours',
      yearLength: '12 Earth years',
      moons: 95,
    },
    moons: [
      {
        name: 'Io',
        nameCn: '木卫一',
        radius: 0.28,
        distance: 5,
        orbitalSpeed: 0.08,
        colors: ['#FFFF00', '#FFD700', '#FF8C00'],
        planetType: PLANET_TYPES.ROCKY,
      },
      {
        name: 'Europa',
        nameCn: '木卫二',
        radius: 0.24,
        distance: 6,
        orbitalSpeed: 0.06,
        colors: ['#F5DEB3', '#DCDCDC', '#B8860B'],
        planetType: PLANET_TYPES.ROCKY,
      },
      {
        name: 'Ganymede',
        nameCn: '木卫三',
        radius: 0.4,
        distance: 7.5,
        orbitalSpeed: 0.04,
        colors: ['#808080', '#A9A9A9', '#696969'],
        planetType: PLANET_TYPES.ROCKY,
      },
      {
        name: 'Callisto',
        nameCn: '木卫四',
        radius: 0.38,
        distance: 9,
        orbitalSpeed: 0.03,
        colors: ['#696969', '#555555', '#404040'],
        planetType: PLANET_TYPES.ROCKY,
      },
    ],
  },
  {
    name: 'Saturn',
    nameCn: '土星',
    radius: 2.5,
    distance: 58,
    orbitalSpeed: 0.0009,
    rotationSpeed: 0.038,
    planetType: PLANET_TYPES.GAS_GIANT,
    colors: ['#F4D03F', '#DAA520', '#D2B48C'], // Gold/tan
    texture: '/textures/planets/saturn.jpg',
    hasRings: true,
    ringInnerRadius: 3.2,
    ringOuterRadius: 5.5,
    ringColors: ['#C9A961', '#D4AF37', '#8B7355'],
    description: 'The ringed planet, famous for its spectacular ring system',
    descriptionCn: '以壮观光环闻名的行星',
    facts: {
      diameter: '116,460 km',
      dayLength: '10.7 hours',
      yearLength: '29 Earth years',
      moons: 146,
    },
    moons: [
      {
        name: 'Titan',
        nameCn: '土卫六',
        radius: 0.4,
        distance: 8,
        orbitalSpeed: 0.025,
        colors: ['#DAA520', '#CD853F', '#8B4513'],
        planetType: PLANET_TYPES.ROCKY,
      },
    ],
  },
  {
    name: 'Uranus',
    nameCn: '天王星',
    radius: 1.8,
    distance: 76,
    orbitalSpeed: 0.0004,
    rotationSpeed: -0.03,
    planetType: PLANET_TYPES.ICE_GIANT,
    colors: ['#B2DFDB', '#80CBC4', '#4DB6AC'], // Cyan/teal
    texture: '/textures/planets/uranus.jpg',
    hasRings: true,
    ringInnerRadius: 2.2,
    ringOuterRadius: 2.8,
    ringColors: ['#607D8B', '#78909C', '#546E7A'],
    tilt: Math.PI / 2,
    description: 'The ice giant that rotates on its side',
    descriptionCn: '侧躺旋转的冰巨星',
    facts: {
      diameter: '50,724 km',
      dayLength: '17 hours',
      yearLength: '84 Earth years',
      moons: 28,
    },
  },
  {
    name: 'Neptune',
    nameCn: '海王星',
    radius: 1.7,
    distance: 92,
    orbitalSpeed: 0.0001,
    rotationSpeed: 0.032,
    planetType: PLANET_TYPES.ICE_GIANT,
    colors: ['#4169E1', '#1E90FF', '#0000CD'], // Deep blue
    texture: '/textures/planets/neptune.jpg',
    hasAtmosphere: true,
    atmosphereColor: '#4169E1',
    description: 'The windiest planet with supersonic storms',
    descriptionCn: '风速最快的行星，拥有超音速风暴',
    facts: {
      diameter: '49,244 km',
      dayLength: '16 hours',
      yearLength: '165 Earth years',
      moons: 16,
    },
    moons: [
      {
        name: 'Triton',
        nameCn: '海卫一',
        radius: 0.21,
        distance: 4,
        orbitalSpeed: -0.04,
        colors: ['#FFB6C1', '#DDA0DD', '#E6E6FA'],
        planetType: PLANET_TYPES.ROCKY,
      },
    ],
  },
];

export const ASTEROID_BELT = {
  innerRadius: 30,
  outerRadius: 36,
  count: 3000,
  mobileCount: 0,
  colors: ['#8B8B83', '#696969', '#A9A9A9'],
};

export const KUIPER_BELT = {
  innerRadius: 100,
  outerRadius: 120,
  count: 1000,
  colors: ['#4A4A4A', '#363636', '#555555'],
};

```


## Existing authored data: src/reports/2026-02-solar-system/hooks/useGestureStore.js

```
import { create } from 'zustand';

// Exponential moving average for smoothing
const EMA_ALPHA = 0.3;

export const useGestureStore = create((set, get) => ({
  // ===== Pinch Zoom State (Two hands) =====
  isPinching: false,
  pinchDistance: 0,
  lastPinchDistance: 0,
  // Delta to apply each frame (not clamped - let CameraRig handle limits)
  zoomDelta: 0,

  // ===== Single Hand Rotation State =====
  isRotating: false,
  handAngle: 0,
  lastHandAngle: 0,
  rotationDelta: 0, // Delta rotation to apply

  // ===== Single Hand Pan State (pinch + drag) =====
  isPanning: false,
  panPosition: { x: 0, y: 0 },
  lastPanPosition: { x: 0, y: 0 },
  panDelta: { x: 0, y: 0 },

  // ===== Hand tracking state =====
  handsDetected: false,
  leftHand: null,
  rightHand: null,

  // ===== Camera permission =====
  cameraEnabled: false,
  cameraError: null,

  // ===== Selected planet =====
  selectedPlanet: null,

  // ===== Actions =====

  // Two-hand pinch zoom - now stores delta directly
  updatePinchZoom: (distance) => {
    const { lastPinchDistance, isPinching } = get();

    if (!isPinching || lastPinchDistance === 0) {
      set({ lastPinchDistance: distance, isPinching: true, zoomDelta: 0 });
      return;
    }

    // Calculate zoom delta based on pinch distance change
    // Positive = zoom in (hands moving apart), Negative = zoom out
    const delta = (distance - lastPinchDistance) * 0.002;

    // Apply EMA smoothing to delta
    const { zoomDelta: prevDelta } = get();
    const smoothedDelta = prevDelta + EMA_ALPHA * (delta - prevDelta);

    set({
      zoomDelta: smoothedDelta,
      lastPinchDistance: distance,
    });
  },

  endPinch: () => set({
    isPinching: false,
    lastPinchDistance: 0,
    zoomDelta: 0,
  }),

  // Single hand rotation - based on wrist angle
  updateRotation: (angle) => {
    const { lastHandAngle, isRotating } = get();

    if (!isRotating) {
      set({ isRotating: true, lastHandAngle: angle, rotationDelta: 0 });
      return;
    }

    // Calculate rotation delta
    let delta = angle - lastHandAngle;

    // Handle angle wrap-around (-PI to PI)
    if (delta > Math.PI) delta -= 2 * Math.PI;
    if (delta < -Math.PI) delta += 2 * Math.PI;

    // Apply smoothing
    const { rotationDelta: prevDelta } = get();
    const smoothedDelta = prevDelta + EMA_ALPHA * (delta - prevDelta);

    set({
      handAngle: angle,
      lastHandAngle: angle,
      rotationDelta: smoothedDelta,
    });
  },

  endRotation: () => set({
    isRotating: false,
    lastHandAngle: 0,
    rotationDelta: 0,
  }),

  // Single hand pan - pinch and drag
  updatePan: (x, y) => {
    const { lastPanPosition, isPanning } = get();

    if (!isPanning) {
      set({
        isPanning: true,
        lastPanPosition: { x, y },
        panPosition: { x, y },
        panDelta: { x: 0, y: 0 },
      });
      return;
    }

    // Calculate pan delta
    const deltaX = (x - lastPanPosition.x) * 2; // Scale for sensitivity
    const deltaY = (y - lastPanPosition.y) * 2;

    // Apply smoothing
    const { panDelta: prevDelta } = get();
    const smoothedDelta = {
      x: prevDelta.x + EMA_ALPHA * (deltaX - prevDelta.x),
      y: prevDelta.y + EMA_ALPHA * (deltaY - prevDelta.y),
    };

    set({
      panPosition: { x, y },
      lastPanPosition: { x, y },
      panDelta: smoothedDelta,
    });
  },

  endPan: () => set({
    isPanning: false,
    lastPanPosition: { x: 0, y: 0 },
    panDelta: { x: 0, y: 0 },
  }),

  // Hand state
  setHands: (leftHand, rightHand) => {
    set({
      leftHand,
      rightHand,
      handsDetected: leftHand !== null || rightHand !== null,
    });
  },

  // Camera state
  setCameraEnabled: (enabled) => set({ cameraEnabled: enabled }),
  setCameraError: (error) => set({ cameraError: error }),

  // Planet selection
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  clearSelectedPlanet: () => set({ selectedPlanet: null }),
}));

```


## Existing authored data: src/reports/2026-02-solar-system/hooks/useDeviceDetection.js

```
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

```


## Existing data files


