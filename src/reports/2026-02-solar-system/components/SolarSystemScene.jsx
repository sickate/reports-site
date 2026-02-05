import { Suspense } from 'react';
import { AdaptiveDpr } from '@react-three/drei';
import { Sun } from './CelestialBodies/Sun';
import { Planet } from './CelestialBodies/Planet';
import { AsteroidBelt } from './CelestialBodies/AsteroidBelt';
import { Starfield } from './Effects/Starfield';
import { CameraRig } from './Controls/CameraRig';
import { SUN_DATA, PLANETS, ASTEROID_BELT } from '../data/planetData';

export function SolarSystemScene({ settings }) {
  const {
    starCount,
    asteroidCount,
    enableAtmosphere,
    geometrySegments,
  } = settings;

  return (
    <>
      {/* Adaptive resolution */}
      <AdaptiveDpr pixelated />

      {/* Camera controls */}
      <CameraRig />

      {/* Ambient light for visibility */}
      <ambientLight intensity={0.1} />

      {/* Star background */}
      <Suspense fallback={null}>
        <Starfield count={starCount} />
      </Suspense>

      {/* Sun */}
      <Sun radius={SUN_DATA.radius} color={SUN_DATA.color} />

      {/* Planets */}
      {PLANETS.map((planet) => (
        <Planet
          key={planet.name}
          data={planet}
          showOrbit={true}
          showAtmosphere={enableAtmosphere}
          segments={geometrySegments}
        />
      ))}

      {/* Asteroid belt */}
      {asteroidCount > 0 && (
        <AsteroidBelt
          innerRadius={ASTEROID_BELT.innerRadius}
          outerRadius={ASTEROID_BELT.outerRadius}
          count={asteroidCount}
          color={ASTEROID_BELT.color}
        />
      )}
    </>
  );
}
