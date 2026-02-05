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
