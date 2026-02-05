import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PLANET_TYPES } from '../../data/planetData';
import planetVert from '../../shaders/planet.vert';
import planetFrag from '../../shaders/planet.frag';

// Texture cache to avoid reloading
const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();

export function Moon({ data, segments = 16 }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const initialAngle = useRef(Math.random() * Math.PI * 2);

  // Load texture if available
  const texture = useMemo(() => {
    if (!data.texture) return null;
    if (textureCache.has(data.texture)) {
      return textureCache.get(data.texture);
    }
    const tex = textureLoader.load(data.texture);
    tex.colorSpace = THREE.SRGBColorSpace;
    textureCache.set(data.texture, tex);
    return tex;
  }, [data.texture]);

  // Create shader material for the moon
  const moonMaterial = useMemo(() => {
    const colors = data.colors || ['#C0C0C0', '#A9A9A9', '#808080'];
    return new THREE.ShaderMaterial({
      vertexShader: planetVert,
      fragmentShader: planetFrag,
      uniforms: {
        uColor1: { value: new THREE.Color(colors[0]) },
        uColor2: { value: new THREE.Color(colors[1]) },
        uColor3: { value: new THREE.Color(colors[2]) },
        uTime: { value: 0 },
        uPlanetType: { value: data.planetType ?? PLANET_TYPES.ROCKY },
        uSunPosition: { value: new THREE.Vector3(0, 0, 0) },
        uTexture: { value: texture },
        uUseTexture: { value: !!texture },
      },
    });
  }, [data.colors, data.planetType, texture]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      const angle = initialAngle.current + time * data.orbitalSpeed;
      groupRef.current.position.x = Math.cos(angle) * data.distance;
      groupRef.current.position.z = Math.sin(angle) * data.distance;
    }

    if (meshRef.current && moonMaterial) {
      moonMaterial.uniforms.uTime.value = time;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[data.radius, segments, segments]} />
        <primitive object={moonMaterial} attach="material" />
      </mesh>
    </group>
  );
}
