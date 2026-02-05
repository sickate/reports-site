import { create } from 'zustand';

// Exponential moving average for smoothing
const EMA_ALPHA = 0.3;

export const useGestureStore = create((set, get) => ({
  // Zoom state
  zoom: 1,
  targetZoom: 1,
  minZoom: 0.3,
  maxZoom: 3,

  // Pinch gesture state
  isPinching: false,
  pinchDistance: 0,
  lastPinchDistance: 0,

  // Hand tracking state
  handsDetected: false,
  leftHand: null,
  rightHand: null,

  // Camera permission
  cameraEnabled: false,
  cameraError: null,

  // Selected planet
  selectedPlanet: null,

  // Actions
  setZoom: (zoom) => {
    const { minZoom, maxZoom } = get();
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoom));
    set({ zoom: clampedZoom, targetZoom: clampedZoom });
  },

  updatePinchZoom: (distance) => {
    const { lastPinchDistance, isPinching, zoom, minZoom, maxZoom } = get();

    if (!isPinching || lastPinchDistance === 0) {
      set({ lastPinchDistance: distance, isPinching: true });
      return;
    }

    // Calculate zoom change based on pinch distance change
    const delta = (distance - lastPinchDistance) * 0.01;
    const newZoom = Math.max(minZoom, Math.min(maxZoom, zoom + delta));

    // Apply EMA smoothing
    const smoothedZoom = zoom + EMA_ALPHA * (newZoom - zoom);

    set({
      zoom: smoothedZoom,
      targetZoom: newZoom,
      lastPinchDistance: distance,
    });
  },

  startPinch: () => set({ isPinching: true, lastPinchDistance: 0 }),
  endPinch: () => set({ isPinching: false, lastPinchDistance: 0 }),

  setHands: (leftHand, rightHand) => {
    set({
      leftHand,
      rightHand,
      handsDetected: leftHand !== null || rightHand !== null,
    });
  },

  setCameraEnabled: (enabled) => set({ cameraEnabled: enabled }),
  setCameraError: (error) => set({ cameraError: error }),

  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  clearSelectedPlanet: () => set({ selectedPlanet: null }),

  // Reset zoom to default
  resetZoom: () => set({ zoom: 1, targetZoom: 1 }),
}));
