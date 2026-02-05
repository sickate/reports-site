import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function AsteroidBelt({
  innerRadius = 30,
  outerRadius = 36,
  count = 3000,
  color = '#8B8B83',
}) {
  const meshRef = useRef();

  const { matrices, dummy } = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices = [];

    for (let i = 0; i < count; i++) {
      // Random position in the belt
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2; // Some vertical spread

      dummy.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      );

      // Random rotation
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      // Random scale (mostly small)
      const scale = 0.1 + Math.random() * 0.2;
      dummy.scale.setScalar(scale);

      dummy.updateMatrix();
      matrices.push(dummy.matrix.clone());
    }

    return { matrices, dummy };
  }, [innerRadius, outerRadius, count]);

  // Slow rotation of the entire belt
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.001;
    }
  });

  // Apply matrices to instanced mesh
  useMemo(() => {
    if (meshRef.current) {
      matrices.forEach((matrix, i) => {
        meshRef.current.setMatrixAt(i, matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [matrices]);

  if (count === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        metalness={0.1}
        flatShading={true}
      />
    </instancedMesh>
  );
}
