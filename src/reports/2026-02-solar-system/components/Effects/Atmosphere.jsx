import { useMemo } from 'react';
import * as THREE from 'three';
import atmosphereVert from '../../shaders/atmosphere.vert';
import atmosphereFrag from '../../shaders/atmosphere.frag';

export function Atmosphere({ radius, color = '#87CEEB', intensity = 1.5, power = 3 }) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVert,
      fragmentShader: atmosphereFrag,
      uniforms: {
        glowColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        power: { value: power },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, [color, intensity, power]);

  return (
    <mesh scale={1.15}>
      <sphereGeometry args={[radius, 32, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
