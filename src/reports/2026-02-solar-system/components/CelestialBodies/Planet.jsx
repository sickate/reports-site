import { useRef, useState, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Atmosphere } from '../Effects/Atmosphere';
import { OrbitLine } from '../Effects/OrbitLine';
import { Moon } from './Moon';
import { SaturnRings } from './SaturnRings';
import { useGestureStore } from '../../hooks/useGestureStore';
import { PLANET_TYPES } from '../../data/planetData';
import planetVert from '../../shaders/planet.vert';
import planetFrag from '../../shaders/planet.frag';

// Texture cache to avoid reloading
const textureLoader = new THREE.TextureLoader();
const textureCache = new Map();

export function Planet({
  data,
  showOrbit = true,
  showAtmosphere = true,
  segments = 32,
  onClick,
}) {
  const groupRef = useRef();
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const setSelectedPlanet = useGestureStore((state) => state.setSelectedPlanet);

  // Initial random orbital position
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

  // Create shader material for the planet
  const planetMaterial = useMemo(() => {
    const colors = data.colors || ['#888888', '#666666', '#444444'];
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

    // Orbital motion
    if (groupRef.current) {
      const angle = initialAngle.current + time * data.orbitalSpeed;
      groupRef.current.position.x = Math.cos(angle) * data.distance;
      groupRef.current.position.z = Math.sin(angle) * data.distance;
    }

    // Rotation and shader update
    if (meshRef.current) {
      meshRef.current.rotation.y += data.rotationSpeed * 0.1;

      // Update shader uniforms
      if (planetMaterial) {
        planetMaterial.uniforms.uTime.value = time;
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setSelectedPlanet(data);
    onClick?.(data);
  };

  return (
    <>
      {/* Orbit line */}
      {showOrbit && <OrbitLine radius={data.distance} />}

      {/* Planet group - moves along orbit */}
      <group ref={groupRef} rotation={data.tilt ? [data.tilt, 0, 0] : undefined}>
        {/* Planet mesh */}
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <sphereGeometry args={[data.radius, segments, segments]} />
          <primitive object={planetMaterial} attach="material" />
        </mesh>

        {/* Hover highlight */}
        {hovered && (
          <mesh scale={1.02}>
            <sphereGeometry args={[data.radius, segments, segments]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent={true}
              opacity={0.1}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Atmosphere */}
        {showAtmosphere && data.hasAtmosphere && (
          <Atmosphere
            radius={data.radius}
            color={data.atmosphereColor}
            intensity={1.2}
            power={3}
          />
        )}

        {/* Saturn/Uranus rings */}
        {data.hasRings && (
          <SaturnRings
            innerRadius={data.ringInnerRadius}
            outerRadius={data.ringOuterRadius}
            colors={data.ringColors}
          />
        )}

        {/* Moons */}
        {data.moons?.map((moon) => (
          <Moon key={moon.name} data={moon} segments={Math.floor(segments / 2)} />
        ))}
      </group>
    </>
  );
}
