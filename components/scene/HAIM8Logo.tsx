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

// Each letter is fully visible during the hero zone, then fades out so the
// page content can breathe. It re-appears just before its own flyStart, sits
// at its anchor through fadeStart, and fades again. Letters that aren't
// flying right now are completely hidden — no more drift across body text.
const HERO_VISIBILITY_END = 0.06;
// Letter fades in over this slice of scroll progress, starting AT flyStart
// (not before). This keeps the letter from appearing at hero-center while
// another section is still showing its own letters at anchor.
const APPEAR_RAMP = 0.04;

const LETTERS: LetterPlan[] = [
  { id: 'H',   anchorId: 'anchor-h',  flyStart: 0.08, flyEnd: 0.22, fadeStart: 0.30, tint: '#e5ecf4', frosted: true  },
  { id: 'A',   anchorId: 'anchor-a',  flyStart: 0.30, flyEnd: 0.44, fadeStart: 0.58, tint: BRAND.signal, frosted: false },
  { id: 'I',   anchorId: 'anchor-i',  flyStart: 0.30, flyEnd: 0.44, fadeStart: 0.58, tint: BRAND.signalLight, frosted: false },
  { id: 'M',   anchorId: 'anchor-m',  flyStart: 0.58, flyEnd: 0.72, fadeStart: 0.88, tint: '#e5ecf4', frosted: true  },
  { id: '_8',  anchorId: 'anchor-8',  flyStart: 0.58, flyEnd: 0.72, fadeStart: 0.88, tint: '#e5ecf4', frosted: true  },
  { id: 'Gem', anchorId: null,        flyStart: 0,    flyEnd: 0,    fadeStart: 0.90, tint: BRAND.signal, frosted: false },
];

const HERO_SCALE = 1.4;
const SECTION_SCALE = 0.85;

// Compute the desired opacity for a letter at the current scroll progress.
// Hero zone shows all; after that each letter is only visible during its own
// fly + anchor window. Gem (no anchor) stays visible until its fadeStart.
function letterOpacity(plan: LetterPlan, progress: number): number {
  if (progress < HERO_VISIBILITY_END) return 1;
  if (!plan.anchorId) {
    return 1 - smoothstep(plan.fadeStart, plan.fadeStart + 0.08, progress);
  }
  const fadeIn = smoothstep(plan.flyStart, plan.flyStart + APPEAR_RAMP, progress);
  const fadeOut = 1 - smoothstep(plan.fadeStart, plan.fadeStart + 0.08, progress);
  return Math.min(fadeIn, fadeOut);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Project a screen-space rect center to a point on the z=0 world plane.
function rectCenterToWorld(
  rect: DOMRect,
  camera: THREE.Camera,
  out: THREE.Vector3
): THREE.Vector3 | null {
  if (rect.width === 0 || rect.height === 0) return null;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const ndcX = (cx / window.innerWidth) * 2 - 1;
  const ndcY = -(cy / window.innerHeight) * 2 + 1;

  out.set(ndcX, ndcY, 0.5).unproject(camera);

  const dirX = out.x - camera.position.x;
  const dirY = out.y - camera.position.y;
  const dirZ = out.z - camera.position.z;
  if (Math.abs(dirZ) < 1e-6) return null;

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
  const { camera, invalidate } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const meshRefs = useRef<Record<LetterId, THREE.Mesh | null>>({
    H: null, A: null, I: null, M: null, _8: null, Gem: null,
  });
  const { scrollYProgress } = useScroll();
  const dragState = useRef({
    dragging: false,
    targetX: 0,
    targetY: 0,
  });

  // Cached DOM anchors: looked up once on mount, rect refreshed on scroll/resize.
  const anchors = useRef<Map<string, { el: HTMLElement; rect: DOMRect }>>(new Map());

  const { geometries, materials, restPositions } = useMemo(() => {
    const geomMap: Partial<Record<LetterId, THREE.BufferGeometry>> = {};
    const matMap: Partial<Record<LetterId, THREE.Material>> = {};
    const pos: Partial<Record<LetterId, THREE.Vector3>> = {};
    gltf.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      const id = mesh.name as LetterId;
      if (!LETTER_IDS.includes(id)) return;
      geomMap[id] = mesh.geometry;
      // Clone the baked material so we can mutate opacity per-letter without
      // affecting other meshes that share it.
      const src = mesh.material as THREE.Material;
      const cloned = src.clone();
      cloned.transparent = true;
      matMap[id] = cloned;
      pos[id] = new THREE.Vector3().copy(mesh.position);
    });
    return { geometries: geomMap, materials: matMap, restPositions: pos };
  }, [gltf]);

  // Build the anchor cache + keep rects fresh on scroll/resize.
  useEffect(() => {
    const map = anchors.current;
    map.clear();
    for (const plan of LETTERS) {
      if (!plan.anchorId) continue;
      const el = document.getElementById(plan.anchorId) as HTMLElement | null;
      if (el) map.set(plan.anchorId, { el, rect: el.getBoundingClientRect() });
    }

    let dirty = false;
    const refresh = () => {
      dirty = false;
      for (const entry of map.values()) {
        entry.rect = entry.el.getBoundingClientRect();
      }
      invalidate();
    };
    const schedule = () => {
      if (dirty) return;
      dirty = true;
      requestAnimationFrame(refresh);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [invalidate]);

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

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    // Frame-rate-independent damping factors (k = "stiffness", higher = snappier).
    // alpha = 1 - exp(-k * delta) → equivalent to lerp(_, _, alpha) per frame.
    const dampRot = 1 - Math.exp(-9 * delta);
    const dampPos = 1 - Math.exp(-12 * delta);
    const dampScale = 1 - Math.exp(-10 * delta);
    const dampOpacity = 1 - Math.exp(-15 * delta);
    const lerp = THREE.MathUtils.lerp;

    const progress = scrollYProgress.get();
    const inHero = progress < 0.06;
    const elapsed = state.clock.elapsedTime;

    // Idle sway pauses during drag.
    const idleSway = inHero && !dragState.current.dragging
      ? Math.sin(elapsed * 0.35) * 0.14
      : 0;
    group.rotation.y = lerp(group.rotation.y, dragState.current.targetY + idleSway, dampRot);
    group.rotation.x = lerp(group.rotation.x, dragState.current.targetX + Math.sin(elapsed * 0.25) * 0.05, dampRot);

    // Per-letter fly-to-section + fade.
    for (const plan of LETTERS) {
      const mesh = meshRefs.current[plan.id];
      const rest = restPositions[plan.id];
      if (!mesh || !rest) continue;

      const hero = tmpVec.current.copy(rest).multiplyScalar(HERO_SCALE);

      let target = hero;
      let targetScale = HERO_SCALE;
      if (plan.anchorId) {
        const t = smoothstep(plan.flyStart, plan.flyEnd, progress);
        if (t > 0) {
          const cached = anchors.current.get(plan.anchorId);
          if (cached) {
            const world = rectCenterToWorld(cached.rect, camera, tmpVec2.current);
            if (world) {
              target = tmpVec.current.lerpVectors(hero, world, t);
              targetScale = lerp(HERO_SCALE, SECTION_SCALE, t);
            }
          }
        }
      }

      mesh.position.lerp(target, dampPos);
      mesh.scale.setScalar(lerp(mesh.scale.x, targetScale, dampScale));

      const fade = letterOpacity(plan, progress);
      const mat = mesh.material as THREE.Material & { opacity?: number };
      if (mat && 'opacity' in mat && typeof mat.opacity === 'number') {
        mat.opacity = lerp(mat.opacity, fade, dampOpacity);
        // Skip the depth/draw cost when fully transparent.
        mesh.visible = mat.opacity > 0.01;
      }
    }

    // Gem: gentle face-camera sway. The 4-point star reads best when seen
    // mostly head-on, so keep X/Z tilts small and let Y swing slowly. Only
    // overwrite position.y while in the hero zone — once any future scroll
    // target is wired up, the per-letter loop above owns position.
    const gem = meshRefs.current.Gem;
    if (gem) {
      gem.rotation.y = Math.sin(elapsed * 0.45) * 0.6;
      gem.rotation.x = Math.sin(elapsed * 0.32) * 0.12;
      gem.rotation.z = Math.cos(elapsed * 0.27) * 0.08;
      const gemRest = restPositions.Gem;
      if (gemRest && progress < HERO_VISIBILITY_END) {
        gem.position.y = gemRest.y * HERO_SCALE + Math.sin(elapsed * 0.9) * 0.04;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {LETTERS.map((plan) => {
        const geom = geometries[plan.id];
        const mat = materials[plan.id];
        if (!geom || !mat) return null;
        return (
          <mesh
            key={plan.id}
            ref={(el) => {
              meshRefs.current[plan.id] = el;
            }}
            geometry={geom}
            material={mat}
            position={restPositions[plan.id]?.clone().multiplyScalar(HERO_SCALE) ?? [0, 0, 0]}
            scale={HERO_SCALE}
          />
        );
      })}
    </group>
  );
}
