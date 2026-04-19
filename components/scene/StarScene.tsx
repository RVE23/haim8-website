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
      {/* Faint radial wash — barely there, just to lift the surroundings */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 42%, rgba(120,160,255,0.10) 0%, rgba(80,90,200,0.04) 40%, rgba(0,0,0,0) 75%)',
        }}
      />
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ cursor: 'grab' }}
      >
        {/* Light setup is gentle — the GLB textures bake their own iridescence
            and emissive, so we just lift shadows with a soft fill. */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[5, 6, 6]} intensity={0.7} color="#bcd6ff" />
        <directionalLight position={[-6, -3, 4]} intensity={0.4} color="#c98bff" />
        <Environment preset="studio" background={false} environmentIntensity={0.5} />
        <HAIM8Logo />
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.35}
            luminanceThreshold={0.78}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
