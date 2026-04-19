import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { HAIM8Logo } from './HAIM8Logo';

export function StarScene() {
  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ cursor: 'grab' }}
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
        <HAIM8Logo />
        <Preload all />
      </Canvas>
    </div>
  );
}
