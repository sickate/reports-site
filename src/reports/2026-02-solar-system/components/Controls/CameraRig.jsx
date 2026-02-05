import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGestureStore } from '../../hooks/useGestureStore';
import * as THREE from 'three';

export function CameraRig({ minDistance = 20, maxDistance = 200 }) {
  const controlsRef = useRef();
  const { camera } = useThree();

  // Get gesture states from store
  const isPinching = useGestureStore((state) => state.isPinching);
  const zoomDelta = useGestureStore((state) => state.zoomDelta);
  const isRotating = useGestureStore((state) => state.isRotating);
  const rotationDelta = useGestureStore((state) => state.rotationDelta);
  const isPanning = useGestureStore((state) => state.isPanning);
  const panDelta = useGestureStore((state) => state.panDelta);

  useFrame(() => {
    if (!controlsRef.current) return;

    let needsUpdate = false;

    // Apply two-hand pinch zoom
    if (isPinching && Math.abs(zoomDelta) > 0.0001) {
      const currentDistance = camera.position.length();
      // Positive delta = hands apart = zoom in (closer) = smaller distance
      const newDistance = currentDistance * (1 - zoomDelta);
      const clampedDistance = Math.max(minDistance, Math.min(maxDistance, newDistance));

      if (Math.abs(clampedDistance - currentDistance) > 0.01) {
        const direction = camera.position.clone().normalize();
        camera.position.copy(direction.multiplyScalar(clampedDistance));
        needsUpdate = true;
      }
    }

    // Apply single hand rotation (rotate around Y axis)
    if (isRotating && Math.abs(rotationDelta) > 0.001) {
      // Get current azimuthal angle and add rotation delta
      const spherical = new THREE.Spherical().setFromVector3(camera.position);

      // Rotate horizontally (theta = azimuthal angle)
      spherical.theta += rotationDelta * 2; // Scale for sensitivity

      // Apply new position
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);
      needsUpdate = true;
    }

    // Apply single hand pan (rotate view based on pinch position movement)
    if (isPanning && (Math.abs(panDelta.x) > 0.001 || Math.abs(panDelta.y) > 0.001)) {
      const spherical = new THREE.Spherical().setFromVector3(camera.position);

      // Pan horizontally (theta) and vertically (phi)
      spherical.theta -= panDelta.x * 0.5;
      spherical.phi += panDelta.y * 0.5;

      // Clamp phi to avoid flipping
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));

      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 0, 0);
      needsUpdate = true;
    }

    if (needsUpdate) {
      controlsRef.current.update();
    }
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
