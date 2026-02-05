import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGestureStore } from '../../hooks/useGestureStore';

export function CameraRig({ minDistance = 20, maxDistance = 200 }) {
  const controlsRef = useRef();
  const lastGestureZoom = useRef(1);
  const { camera } = useThree();

  // Get gesture zoom from store (only for hand gesture control)
  const gestureZoom = useGestureStore((state) => state.zoom);
  const isPinching = useGestureStore((state) => state.isPinching);

  useFrame(() => {
    // Only apply gesture zoom when actively pinching
    // This allows OrbitControls to handle mouse/touch zoom normally
    if (controlsRef.current && isPinching) {
      const zoomDelta = gestureZoom - lastGestureZoom.current;

      if (Math.abs(zoomDelta) > 0.001) {
        // Apply zoom by moving camera closer/further
        const currentDistance = camera.position.length();
        const newDistance = currentDistance / (1 + zoomDelta * 0.5);
        const clampedDistance = Math.max(minDistance, Math.min(maxDistance, newDistance));

        const direction = camera.position.clone().normalize();
        camera.position.copy(direction.multiplyScalar(clampedDistance));
        controlsRef.current.update();
      }
    }
    lastGestureZoom.current = gestureZoom;
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={minDistance}
      maxDistance={maxDistance}
      autoRotate={false}
      autoRotateSpeed={0.5}
      dampingFactor={0.05}
      enableDamping={true}
      rotateSpeed={0.5}
      zoomSpeed={1.2}
    />
  );
}
