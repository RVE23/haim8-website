import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { HAIM8Logo } from './HAIM8Logo';

export function StarScene() {
  return (
    <div
      className="fixed inset-0"
      style={{ zIndex: 5 }}
      aria-hidden="true"
    >
      {/* Soft radial backdrop gives the glass something brighter to refract */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 42%, rgba(120,160,255,0.22) 0%, rgba(80,90,200,0.10) 35%, rgba(0,0,0,0) 70%)',
        }}
      />
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
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.85}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.25}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
