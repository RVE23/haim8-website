import { forwardRef, useMemo } from 'react';
import * as THREE from 'three';
import type { Mesh } from 'three';
import { BRAND } from '../../lib/tokens';

function createStarShape(outer = 1, inner = 0.32): THREE.Shape {
  const shape = new THREE.Shape();
  const points = 4;
  const steps = points * 2;
  const angleStep = (Math.PI * 2) / steps;
  for (let i = 0; i < steps; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = i * angleStep - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

export const Star = forwardRef<Mesh>((_, ref) => {
  const geometry = useMemo(() => {
    const shape = createStarShape(1.0, 0.3);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.07,
      bevelSegments: 6,
      curveSegments: 16,
    });
    geom.center();
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <mesh ref={ref} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={BRAND.signal}
        transmission={0.85}
        thickness={1.4}
        roughness={0.06}
        ior={1.52}
        clearcoat={1}
        clearcoatRoughness={0.04}
        iridescence={0.55}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[100, 600]}
        metalness={0.05}
        attenuationColor={BRAND.vision}
        attenuationDistance={2.2}
        envMapIntensity={1.4}
        specularIntensity={1}
      />
    </mesh>
  );
});

Star.displayName = 'Star';
