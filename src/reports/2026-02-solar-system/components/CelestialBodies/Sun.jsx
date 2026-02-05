import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import sunVert from '../../shaders/sun.vert';
import sunFrag from '../../shaders/sun.frag';

export function Sun({ radius = 5 }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const coronaRef = useRef();

  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: sunVert,
      fragmentShader: sunFrag,
      uniforms: {
        uTime: { value: 0 },
      },
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Update shader time
    if (sunMaterial) {
      sunMaterial.uniforms.uTime.value = time;
    }

    // Breathing animation
    if (meshRef.current) {
      const scale = 1 + Math.sin(time * 0.5) * 0.015;
      meshRef.current.scale.setScalar(scale);
    }

    // Glow pulsing
    if (glowRef.current) {
      glowRef.current.material.opacity = 0.4 + Math.sin(time * 0.8) * 0.1;
    }

    // Corona rotation
    if (coronaRef.current) {
      coronaRef.current.rotation.z = time * 0.02;
    }
  });

  return (
    <group>
      {/* Sun core with procedural texture */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <primitive object={sunMaterial} attach="material" />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef} scale={1.08}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color="#FF6B00"
          transparent={true}
          opacity={0.4}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona layer 1 */}
      <mesh ref={coronaRef} scale={1.2}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color="#FF4500"
          transparent={true}
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona layer 2 - outer glow */}
      <mesh scale={1.4}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color="#FF2000"
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Corona layer 3 - soft outer */}
      <mesh scale={1.7}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial
          color="#FF3300"
          transparent={true}
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Point light */}
      <pointLight
        color="#FFF5E1"
        intensity={4}
        distance={400}
        decay={1.5}
      />
    </group>
  );
}
