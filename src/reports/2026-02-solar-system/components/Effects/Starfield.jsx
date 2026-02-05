import { useMemo, useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Texture loader for skybox
const textureLoader = new THREE.TextureLoader();

export function Starfield({ count = 50000, showGrid = true }) {
  const starsRef = useRef();
  const gridRef = useRef();
  const skyboxRef = useRef();

  // Load milky way texture for skybox
  const skyboxTexture = useMemo(() => {
    const texture = textureLoader.load('/textures/planets/stars_milky_way.jpg');
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute stars on a sphere
      const radius = 400 + Math.random() * 600;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Star colors - mostly white with some blue and yellow tints
      const colorType = Math.random();
      if (colorType < 0.7) {
        // White stars
        colors[i * 3] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1;
      } else if (colorType < 0.85) {
        // Blue stars
        colors[i * 3] = 0.6 + Math.random() * 0.2;
        colors[i * 3 + 1] = 0.7 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1;
      } else {
        // Yellow/orange stars
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 0.6 + Math.random() * 0.2;
      }

      // Random sizes with more small stars
      sizes[i] = Math.random() < 0.95 ? 0.3 + Math.random() * 0.4 : 0.8 + Math.random() * 1.2;
    }

    return { positions, colors, sizes };
  }, [count]);

  // Subtle rotation for depth effect
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.001;
    }
    if (gridRef.current) {
      gridRef.current.rotation.y = state.clock.elapsedTime * 0.0005;
    }
  });

  return (
    <group>
      {/* Skybox - large sphere with milky way texture */}
      <mesh ref={skyboxRef} scale={[-1, 1, 1]}>
        <sphereGeometry args={[900, 64, 64]} />
        <meshBasicMaterial
          map={skyboxTexture}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Additional point stars for sparkle effect */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.0}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.7}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Grid background - like in the reference image */}
      {showGrid && <SpaceGrid ref={gridRef} />}
    </group>
  );
}

// Space grid component
const SpaceGrid = forwardRef(function SpaceGrid(props, ref) {
  const gridLines = useMemo(() => {
    const lines = [];
    const gridSize = 300;
    const divisions = 30;
    const step = gridSize / divisions;

    // Create grid on XZ plane (horizontal)
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      const pos = i * step;
      // X lines
      lines.push(
        new THREE.Vector3(-gridSize / 2, -50, pos),
        new THREE.Vector3(gridSize / 2, -50, pos)
      );
      // Z lines
      lines.push(
        new THREE.Vector3(pos, -50, -gridSize / 2),
        new THREE.Vector3(pos, -50, gridSize / 2)
      );
    }

    return lines;
  }, []);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(gridLines);
    return geom;
  }, [gridLines]);

  return (
    <group ref={ref}>
      <lineSegments geometry={geometry}>
        <lineBasicMaterial
          color="#1a3a5c"
          transparent={true}
          opacity={0.15}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
});
