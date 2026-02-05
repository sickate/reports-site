import { useMemo } from 'react';
import * as THREE from 'three';

export function OrbitLine({ radius, color = '#4080ff', opacity = 0.4, segments = 256 }) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    return pts;
  }, [radius, segments]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [points]);

  return (
    <group>
      {/* Main orbit line */}
      <line geometry={geometry}>
        <lineBasicMaterial
          color={color}
          transparent={true}
          opacity={opacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </line>
      {/* Glow effect - slightly larger */}
      <line geometry={geometry}>
        <lineBasicMaterial
          color={color}
          transparent={true}
          opacity={opacity * 0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          linewidth={2}
        />
      </line>
    </group>
  );
}
