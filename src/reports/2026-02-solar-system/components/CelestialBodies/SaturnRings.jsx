import { useMemo } from 'react';
import * as THREE from 'three';

export function SaturnRings({ innerRadius, outerRadius, colors = ['#C9A961', '#D4AF37', '#8B7355'] }) {
  // Create ring texture procedurally
  const ringTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Create gradient with gaps (Cassini division effect)
    const gradient = ctx.createLinearGradient(0, 0, 512, 0);

    // Inner ring
    gradient.addColorStop(0, 'rgba(139, 115, 85, 0.0)');
    gradient.addColorStop(0.05, 'rgba(139, 115, 85, 0.3)');
    gradient.addColorStop(0.15, colors[2]);
    gradient.addColorStop(0.25, colors[1]);

    // Cassini division (gap)
    gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.1)');
    gradient.addColorStop(0.40, 'rgba(0, 0, 0, 0.05)');

    // Outer ring
    gradient.addColorStop(0.45, colors[0]);
    gradient.addColorStop(0.55, colors[1]);
    gradient.addColorStop(0.70, colors[0]);
    gradient.addColorStop(0.85, colors[2]);
    gradient.addColorStop(0.95, 'rgba(139, 115, 85, 0.2)');
    gradient.addColorStop(1.0, 'rgba(139, 115, 85, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 64);

    // Add some noise/variation
    const imageData = ctx.getImageData(0, 0, 512, 64);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, [colors]);

  // Custom ring geometry with proper UV mapping
  const ringGeometry = useMemo(() => {
    const segments = 128;
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments, 1);

    // Fix UV mapping for radial texture
    const pos = geometry.attributes.position;
    const uv = geometry.attributes.uv;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const distance = Math.sqrt(x * x + y * y);
      const u = (distance - innerRadius) / (outerRadius - innerRadius);
      uv.setXY(i, u, 0.5);
    }

    return geometry;
  }, [innerRadius, outerRadius]);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <primitive object={ringGeometry} attach="geometry" />
      <meshBasicMaterial
        map={ringTexture}
        side={THREE.DoubleSide}
        transparent={true}
        opacity={0.9}
        depthWrite={false}
      />
    </mesh>
  );
}
