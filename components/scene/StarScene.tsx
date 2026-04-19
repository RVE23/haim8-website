import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
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
        <ambientLight intensity={0.45} />
        <directionalLight
          position={[5, 6, 6]}
          intensity={2.6}
          color="#9bd0ff"
        />
        <directionalLight
          position={[-6, -3, 4]}
          intensity={1.4}
          color="#c98bff"
        />
        <pointLight position={[0, 0, 3]} intensity={0.9} color="#ffffff" />
        <Environment preset="studio" background={false} environmentIntensity={1.2} />
        <HAIM8Logo />
      </Canvas>
    </div>
  );
}
