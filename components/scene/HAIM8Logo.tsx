import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from 'motion/react';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { BRAND } from '../../lib/tokens';

useGLTF.preload('/haim8.glb');

const LETTER_IDS = ['H', 'A', 'I', 'M', '_8', 'Gem'] as const;
type LetterId = (typeof LETTER_IDS)[number];

type LetterPlan = {
  id: LetterId;
  anchorId: string | null;
  flyStart: number;
  flyEnd: number;
  fadeStart: number;
  tint: string;
  frosted: boolean;
};

const LETTERS: LetterPlan[] = [
  { id: 'H',   anchorId: 'anchor-h',  flyStart: 0.05, flyEnd: 0.20, fadeStart: 0.32, tint: '#e5ecf4', frosted: true  },
  { id: 'A',   anchorId: 'anchor-a',  flyStart: 0.22, flyEnd: 0.38, fadeStart: 0.62, tint: BRAND.signal, frosted: false },
  { id: 'I',   anchorId: 'anchor-i',  flyStart: 0.22, flyEnd: 0.38, fadeStart: 0.62, tint: BRAND.signalLight, frosted: false },
  { id: 'M',   anchorId: 'anchor-m',  flyStart: 0.52, flyEnd: 0.68, fadeStart: 0.88, tint: '#e5ecf4', frosted: true  },
  { id: '_8',  anchorId: 'anchor-8',  flyStart: 0.52, flyEnd: 0.68, fadeStart: 0.88, tint: '#e5ecf4', frosted: true  },
  { id: 'Gem', anchorId: null,        flyStart: 0,    flyEnd: 0,    fadeStart: 0.90, tint: BRAND.signal, frosted: false },
];

const HERO_SCALE = 1.4;
const SECTION_SCALE = 1.0;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function domCenterToWorld(
  el: Element,
  camera: THREE.Camera,
  out: THREE.Vector3
): THREE.Vector3 | null {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const ndcX = (cx / window.innerWidth) * 2 - 1;
  const ndcY = -(cy / window.innerHeight) * 2 + 1;

  // Unproject the NDC point to a world-space point
  out.set(ndcX, ndcY, 0.5).unproject(camera);

  // Ray direction from camera through that world point (read before writing out)
  const dirX = out.x - camera.position.x;
  const dirY = out.y - camera.position.y;
  const dirZ = out.z - camera.position.z;
  if (Math.abs(dirZ) < 1e-6) return null;

  // Intersect with the z=0 plane
  const t = -camera.position.z / dirZ;
  out.set(
    camera.position.x + dirX * t,
    camera.position.y + dirY * t,
    0
  );
  return out;
}

export function HAIM8Logo() {
  const gltf = useGLTF('/haim8.glb');
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<Record<LetterId, THREE.Mesh | null>>({
    H: null, A: null, I: null, M: null, _8: null, Gem: null,
  });
  const restPositions = useRef<Record<LetterId, THREE.Vector3>>({} as any);
  const { scrollYProgress } = useScroll();
  const dragState = useRef({
    dragging: false,
    targetX: 0,
    targetY: 0,
    idleY: 0,
  });

  const geometries = useMemo(() => {
    const map: Partial<Record<LetterId, THREE.BufferGeometry>> = {};
    const pos: Partial<Record<LetterId, THREE.Vector3>> = {};
    gltf.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const id = mesh.name as LetterId;
      if (!LETTER_IDS.includes(id)) return;
      map[id] = mesh.geometry;
      pos[id] = new THREE.Vector3().copy(mesh.position);
    });
    restPositions.current = pos as Record<LetterId, THREE.Vector3>;
    return map;
  }, [gltf]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragState.current.dragging) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      dragState.current.targetY = nx * 0.8;
      dragState.current.targetX = ny * 0.4;
    };
    const onDown = (e: PointerEvent) => {
      if (scrollYProgress.get() > 0.06) return;
      dragState.current.dragging = true;
      onMove(e);
    };
    const onUp = () => {
      dragState.current.dragging = false;
      dragState.current.targetX = 0;
      dragState.current.targetY = 0;
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointerleave', onUp);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointerleave', onUp);
    };
  }, [scrollYProgress]);

  const tmpVec = useRef(new THREE.Vector3());
  const tmpVec2 = useRef(new THREE.Vector3());

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const progress = scrollYProgress.get();
    const inHero = progress < 0.06;
    const lerp = THREE.MathUtils.lerp;

    // Idle: gentle sway, pauses during drag
    const elapsed = state.clock.elapsedTime;
    const idleSway = inHero && !dragState.current.dragging
      ? Math.sin(elapsed * 0.35) * 0.14
      : 0;

    group.rotation.y = lerp(group.rotation.y, dragState.current.targetY + idleSway, 0.08);
    group.rotation.x = lerp(group.rotation.x, dragState.current.targetX + Math.sin(elapsed * 0.25) * 0.05, 0.08);

    // Per-letter fly-to-section + fade
    for (const plan of LETTERS) {
      const mesh = meshRefs.current[plan.id];
      const rest = restPositions.current[plan.id];
      if (!mesh || !rest) continue;

      // Hero-pose: scaled rest position
      const hero = tmpVec.current.copy(rest).multiplyScalar(HERO_SCALE);

      // Section target in world space (if anchor exists in DOM)
      let target = hero;
      let targetScale = HERO_SCALE;
      if (plan.anchorId) {
        const t = smoothstep(plan.flyStart, plan.flyEnd, progress);
        if (t > 0) {
          const el = document.getElementById(plan.anchorId);
          if (el) {
            const world = domCenterToWorld(el, camera, tmpVec2.current);
            if (world) {
              // lerp between hero and section anchor
              target = tmpVec.current.lerpVectors(hero, world, t);
              targetScale = lerp(HERO_SCALE, SECTION_SCALE, t);
            }
          }
        }
      }

      mesh.position.lerp(target, 0.12);
      const s = mesh.scale.x;
      const nextScale = lerp(s, targetScale, 0.1);
      mesh.scale.setScalar(nextScale);

      // Fade out as we approach the bottom
      const fade = 1 - smoothstep(plan.fadeStart, plan.fadeStart + 0.08, progress);
      const mat = mesh.material as THREE.MeshPhysicalMaterial;
      if (mat && 'opacity' in mat) {
        mat.opacity = lerp(mat.opacity, fade, 0.15);
        mat.transparent = true;
      }
    }

    // Debug: expose per-letter mesh state on window for dev inspection
    if (typeof window !== 'undefined') {
      const dbg: Record<string, unknown> = { progress, inHero };
      for (const plan of LETTERS) {
        const m = meshRefs.current[plan.id];
        if (m) {
          dbg[plan.id] = {
            x: +m.position.x.toFixed(2),
            y: +m.position.y.toFixed(2),
            z: +m.position.z.toFixed(2),
            s: +m.scale.x.toFixed(2),
            opacity: +(m.material as THREE.MeshPhysicalMaterial).opacity.toFixed(2),
            visible: m.visible,
          };
        }
      }
      (window as unknown as { __haim8: typeof dbg }).__haim8 = dbg;
    }

    // Gem gets a gentle independent tumble on top of group rotation
    const gem = meshRefs.current.Gem;
    if (gem) {
      const tumble = state.clock.elapsedTime;
      gem.rotation.y = tumble * 0.6;
      gem.rotation.x = Math.sin(tumble * 0.4) * 0.3;
      gem.rotation.z = Math.cos(tumble * 0.3) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {LETTERS.map((plan) => {
        const geom = geometries[plan.id];
        if (!geom) return null;
        return (
          <mesh
            key={plan.id}
            ref={(el) => {
              meshRefs.current[plan.id] = el;
            }}
            geometry={geom}
            position={restPositions.current[plan.id]?.clone().multiplyScalar(HERO_SCALE) ?? [0, 0, 0]}
            scale={HERO_SCALE}
            castShadow
            receiveShadow
          >
            <meshPhysicalMaterial
              color={plan.tint}
              transmission={plan.frosted ? 0.6 : 0.85}
              thickness={plan.frosted ? 1.4 : 1.1}
              roughness={plan.frosted ? 0.18 : 0.06}
              ior={1.52}
              clearcoat={1}
              clearcoatRoughness={0.04}
              iridescence={plan.frosted ? 0.2 : 0.5}
              iridescenceIOR={1.3}
              iridescenceThicknessRange={[100, 600]}
              metalness={0.04}
              attenuationColor={plan.frosted ? '#c8d7ef' : BRAND.vision}
              attenuationDistance={plan.frosted ? 3.5 : 1.8}
              envMapIntensity={plan.frosted ? 1.0 : 1.6}
              transparent
            />
          </mesh>
        );
      })}
    </group>
  );
}
