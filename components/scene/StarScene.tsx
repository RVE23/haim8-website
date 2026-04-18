import { Canvas, useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { useScroll, useTransform } from 'motion/react';
import { Star } from './Star';

function StarRig() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scrollYProgress } = useScroll();

  const yMV = useTransform(scrollYProgress, [0, 1], [1.4, -5]);
  const xMV = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.55, 0.75, 1],
    [0, -2.4, 2.2, -1.8, 2.0, 0]
  );
  const rotXMV = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 4.5]);
  const rotYMV = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 6.5]);
  const rotZMV = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 3]);
  const scaleMV = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 0.55, 0.4]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const lerp = THREE.MathUtils.lerp;
    mesh.position.y = lerp(mesh.position.y, yMV.get(), 0.08);
    mesh.position.x = lerp(mesh.position.x, xMV.get(), 0.06);
    mesh.rotation.x = lerp(mesh.rotation.x, rotXMV.get(), 0.05);
    mesh.rotation.y = lerp(mesh.rotation.y, rotYMV.get(), 0.05);
    mesh.rotation.z = lerp(mesh.rotation.z, rotZMV.get(), 0.05);
    const s = scaleMV.get();
    mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, s, 0.07));
  });

  return <Star ref={meshRef} />;
}

export function StarScene() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 6, 6]}
          intensity={2.2}
          color="#60a5fa"
        />
        <directionalLight
          position={[-6, -3, 4]}
          intensity={1.1}
          color="#9b5fd4"
        />
        <pointLight position={[0, 0, 3]} intensity={0.6} color="#ffffff" />
        <Environment preset="city" />
        <StarRig />
      </Canvas>
    </div>
  );
}
