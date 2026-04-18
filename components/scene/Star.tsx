import { forwardRef, useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { Mesh, BufferGeometry } from 'three';
import { BRAND } from '../../lib/tokens';

useGLTF.preload('/star.glb');

function findFirstMesh(obj: THREE.Object3D): Mesh | null {
  if ((obj as Mesh).isMesh) return obj as Mesh;
  for (const child of obj.children) {
    const found = findFirstMesh(child);
    if (found) return found;
  }
  return null;
}

export const Star = forwardRef<Mesh>((_, ref) => {
  const gltf = useGLTF('/star.glb');

  const geometry = useMemo<BufferGeometry | null>(() => {
    const mesh = findFirstMesh(gltf.scene);
    if (!mesh) return null;
    const geom = mesh.geometry.clone();
    geom.center();
    geom.computeVertexNormals();
    return geom;
  }, [gltf]);

  useEffect(() => {
    return () => {
      geometry?.dispose();
    };
  }, [geometry]);

  if (!geometry) return null;

  return (
    <mesh ref={ref} geometry={geometry} castShadow receiveShadow>
      <meshPhysicalMaterial
        color={BRAND.signal}
        transmission={0.88}
        thickness={1.6}
        roughness={0.04}
        ior={1.52}
        clearcoat={1}
        clearcoatRoughness={0.03}
        iridescence={0.6}
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[120, 640]}
        metalness={0.05}
        attenuationColor={BRAND.vision}
        attenuationDistance={2.0}
        envMapIntensity={1.6}
        specularIntensity={1.2}
      />
    </mesh>
  );
});

Star.displayName = 'Star';
