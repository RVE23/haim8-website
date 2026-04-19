# Sprint 4 — Real 3D HAIM8 Logo + Per-Letter Animation

## Context

Sprints 1–3 shipped the scroll narrative, Blender-modelled gem, mobile guards, and reduced-motion fallback. Two structural upgrades wanted now:

1. **The whole HAIM8 logo rendered as real 3D geometry in Blender** — each letter (H, A, I, M, 8) and the gem as a separate mesh inside a single `.glb`, so each can be transformed independently at runtime.
2. **User can manipulate the logo in the hero** — drag-to-rotate the whole group (confirmed), with idle rotation between interactions.
3. **Letters detach and fly to each narrative section as the user scrolls** (confirmed), replacing the current rembg-sliced PNG watermarks.

Plus one regression fix: **the gem's asymmetric 4-point reshape (NS-long, EW-short) looked worse than the original equal 4-point version.** Revert to the earlier proportions — they matched the reference better than the Sprint 2 sparkle variant.

Outcome: a single R3F canvas drives the entire narrative with real 3D typography throughout, drag interaction in the hero, and scroll-linked fly-to-section animation per letter.

## Approach

One master `public/haim8.glb` with 6 named nodes (`Gem`, `H`, `A`, `I`, `M`, `_8`). One R3F component `HAIM8Logo.tsx` loads it and exposes each letter as an independent mesh ref. Per-letter animation is driven by `useScroll` + `useTransform` (Framer Motion) feeding into `useFrame` lerps. Mobile + reduced-motion continue to use the existing PNG watermarks — the 3D path is desktop-only.

### Asset sourcing

Confirmed: the reference logo was AI-generated, so no native 3D source exists and AI-generated alternate angles would warp the letters. **Two-track asset strategy:**

**Track A (Meshy-first — active):** Rae runs [Meshy.ai](https://meshy.ai) image-to-3D on `haim8-logo-3d-glass-v6.png`, downloads the GLB, drops it at `public/haim8.glb`. Meshy uses the image's baked glass/depth cues as hints and can produce a usable mesh in ~1–3 minutes. If the letters read as distinct shapes (not a blobbed mass), we integrate directly and skip the Blender re-model entirely. Meshy typically produces one un-split mesh — we still need a post-process step in Blender to separate it into 6 named nodes by loose parts.

**Track B (potrace fallback):** If Meshy's output is blobby or loses the letters, we fall back to the potrace + Blender workflow originally described below (tracing the flat PNG, modelling in Blender). Slower but predictable.

All R3F wiring + section anchors are **asset-agnostic**. If a higher-fidelity GLB is produced later (e.g. Fiverr 3D artist, ~£100–300, 2–3 days), we swap the `.glb` file and everything else works unchanged.

**Post-process step (both tracks):** after the GLB lands in `public/haim8.glb`, run `scripts/split_haim8.py` (new Blender script — see section 3b) to separate the mesh into 6 named nodes (`Gem`, `H`, `A`, `I`, `M`, `_8`) and re-export. This is required because Meshy returns a single merged mesh and our R3F component needs per-letter handles.

## Implementation

### 1. Revert the gem

**File:** [scripts/model_star.py](Website/haim8-website/scripts/model_star.py)

Restore the earlier equal 4-point proportions the user preferred:

```
OUTER = 1.0        # all four points same length
INNER = 0.30       # wider waist (not the 0.16 sparkle narrow)
DEPTH = 0.34       # slightly more depth for weight
```

Bump bevel segments 6 → 8 and subsurf levels 2 → 3 for smoother glass edges.

Regenerate: `blender -b -P scripts/model_star.py` → `public/star.glb`.

### 2. Trace the flat HAIM8 reference into SVG paths

Tools to install:
- `brew install potrace` (bitmap → SVG vector trace)
- `brew install imagemagick` (PNG → PBM for potrace input)

Pipeline:

```
magick public/haim8-logo-flat.png \
  -threshold 50% -colorspace Gray \
  public/haim8-bw.pbm
potrace public/haim8-bw.pbm \
  --svg --output public/haim8-trace.svg \
  --turdsize 8 --opttolerance 0.2
```

The result: one SVG with six paths (Gem + 5 letters) we can import into Blender.

### 3a. Post-process the Meshy GLB (Track A, active path)

**File (new):** `scripts/split_haim8.py`

Headless Blender script:

1. Import `public/haim8.glb` (Meshy output)
2. Select the imported mesh, `bpy.ops.mesh.separate(type='LOOSE')` — splits disconnected geometry into separate objects
3. Sort resulting objects by bounding-box center X (left-to-right), assign names: top-most (highest Y) → `Gem`, remainder left-to-right → `H`, `A`, `I`, `M`, `_8`
4. For each object: center origin on geometry, apply material tint per letter group (Frosted for H/M/8, Signal blue for A/I, gem tint)
5. Re-export to `public/haim8.glb` (overwriting the Meshy file)

If `bpy.ops.mesh.separate(type='LOOSE')` doesn't cleanly split the letters (e.g. Meshy merged them into a single watertight mesh), fall back to Track B.

### 3b. Build the letter meshes from scratch (Track B, fallback)

**File (new):** `scripts/model_haim8.py`

Headless Blender script:

1. Import `public/haim8-trace.svg` via `bpy.ops.import_curve.svg`.
2. Sort imported curves left-to-right by bounding-box X, separate into six objects named: `Gem` (topmost), `H`, `A`, `I`, `M`, `_8` (glTF node names can't start with a digit — prefix with `_`).
3. For each letter:
   - Convert curve → mesh (`bpy.ops.object.convert(target='MESH')`)
   - Center origin on object geometry
   - Solidify modifier, thickness `0.12` (give each letter depth)
   - Bevel modifier, width `0.015`, segments `4`, profile `0.65`
   - Subsurf modifier, level `2`
   - Apply all modifiers
   - Shade smooth
4. Apply base materials:
   - `FrostedBase` (H, M, 8): `color = #e5ecf4`, roughness `0.08`, metallic `0.05`
   - `SignalBase` (A, I): `color = #3b82f6`, roughness `0.05`, metallic `0.05`
   - `GemBase` (Gem): `color = #60a5fa`, roughness `0.04`
   - All carry principled-BSDF with IOR 1.52, transmission 0.8, coat 1.0
   - R3F overrides these with full `MeshPhysicalMaterial` at runtime (iridescence, clearcoat roughness, attenuation) — same pattern we use for the star.
5. Export single GLB:
   ```
   bpy.ops.export_scene.gltf(filepath='public/haim8.glb', use_selection=False,
                             export_materials='EXPORT', export_yup=True,
                             export_extras=True)
   ```

Script runs via `blender -b -P scripts/model_haim8.py`.

### 4. R3F component for the logo

**File (new):** `components/scene/HAIM8Logo.tsx`

- `useGLTF('/haim8.glb')` with preload
- Walks `gltf.scene` to find each named node (`Gem`, `H`, `A`, `I`, `M`, `_8`); memoizes their cloned geometries
- Accepts a `scrollYProgress` Framer Motion value (MotionValue\<number\>) and an array of anchor positions (one per letter + gem) derived from DOM measurements
- Each letter is its own `<mesh>` with its own ref. A `useFrame` hook per letter lerps position + rotation toward a per-letter target computed from scroll:
  - `0 → 0.05`: assembled in the hero pose (tight spacing), user-drag rotation applied to parent group
  - `0.05 → 0.25`: `H` translates to H-anchor screen position, scales up, rotation smoothed to 0
  - `0.25 → 0.55`: `A` + `I` travel to AI-anchor
  - `0.55 → 0.80`: `M` + `_8` travel to M8-anchor
  - `0.80 → 1.0`: all letters fade out (`material.opacity` + transparent=true)
- Gem is still the scroll-tumbling element it is today — reuse the existing motion values from `StarScene.tsx`.
- `MeshTransmissionMaterial` from drei (cheaper than `meshPhysicalMaterial.transmission` when 6 meshes render at once) on the glass letters; per-material tint based on the letter group.

Reuse:
- [lib/tokens.ts](Website/haim8-website/lib/tokens.ts) BRAND palette and EASE constants
- Existing `useScroll()` hook pattern from [StarScene.tsx](Website/haim8-website/components/scene/StarScene.tsx)

### 5. Hero drag-rotate interaction

In `HAIM8Logo.tsx`:

- A `<group>` wraps all 6 meshes. Its `rotation.x` and `rotation.y` are motion-driven.
- When `scrollYProgress.get() < 0.05` (hero zone), attach pointer handlers:
  - `onPointerDown` stores initial pointer + rotation
  - Window-level `pointermove` drags rotation proportional to pixel delta (0.005 rad per px), clamped to ±0.5 rad on X, unclamped on Y
  - `pointerup` starts a spring-back to rest pose via `motion/react`'s `animate()` helper with `{ type: 'spring', stiffness: 60, damping: 12 }`
- When scrollYProgress ≥ 0.05, handlers detach — scroll takes over and per-letter flight begins.
- Idle state (no drag, in hero): gentle `rotation.y += delta * 0.1` in `useFrame` so the logo feels alive at rest. Pauses during drag.
- Cursor changes to `grab` on hover over the group, `grabbing` during drag.
- Mobile gate (`isMobile` in [App.tsx](Website/haim8-website/App.tsx)) already skips the whole R3F canvas, so no touch-vs-scroll conflict to engineer.

### 6. Section anchors + integration

Each section gains an invisible anchor div for the flying letter's target position:

- [HValues.tsx](Website/haim8-website/components/sections/HValues.tsx): `<div ref={hAnchorRef} id="h-anchor" className="w-[clamp(18rem,36vw,34rem)] aspect-[0.55/1] opacity-0 pointer-events-none" />` inside the existing H-image slot
- [AIServices.tsx](Website/haim8-website/components/sections/AIServices.tsx): two anchors `ai-a-anchor`, `ai-i-anchor` side-by-side
- [M8Mates.tsx](Website/haim8-website/components/sections/M8Mates.tsx): two anchors `m-anchor`, `_8-anchor`

Desktop: remove the `<img src="/haim8-{letter}.png" />` and the watermark wrapper. Mobile keeps the img via the existing `md:` breakpoint classes.

`HAIM8Logo` reads all six anchor bounding rects once per scroll tick (throttled via `useFrame`) and converts them to world-space target positions for each letter.

### 7. Wire into StarScene

**File:** [components/scene/StarScene.tsx](Website/haim8-website/components/scene/StarScene.tsx)

- Add `<HAIM8Logo />` inside the existing `<Canvas>`, sharing lighting + environment with `<Star>`
- Gem rendering moves from `<Star>` into `<HAIM8Logo>` (it's now part of the logo mesh). Keep `<Star>` as a thin wrapper or remove and fold its scroll logic into `HAIM8Logo`.

### 8. Perf safeguards

- Desktop-only (mobile gate already in [App.tsx](Website/haim8-website/App.tsx) via `useIsMobile(768)`)
- DPR clamp `[1, 1.5]` on Canvas
- `<Environment preset="city" />` already shared
- Add drei's `<Preload all />` so GLBs + env map load up-front
- Enable `<EffectComposer>` with `Bloom` (threshold 0.85, intensity 0.6) + very light `ChromaticAberration` via `@react-three/postprocessing` (already installed) for premium polish

### 9. One-shot asset regeneration

Add `scripts/build-assets.sh` (optional nice-to-have) that runs both Blender scripts plus the potrace pipeline:

```
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
magick public/haim8-logo-flat.png -threshold 50% -colorspace Gray public/haim8-bw.pbm
potrace public/haim8-bw.pbm --svg --output public/haim8-trace.svg --turdsize 8 --opttolerance 0.2
BLENDER_SYSTEM_RESOURCES=/Applications/Blender.app/Contents/Resources \
  /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/model_star.py
BLENDER_SYSTEM_RESOURCES=/Applications/Blender.app/Contents/Resources \
  /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/model_haim8.py
```

## Tooling / software needed

| Tool | Status | Why |
|---|---|---|
| Blender 5.1.1 | installed | SVG → mesh → glb export |
| potrace | **install via `brew install potrace`** | bitmap → SVG vector trace |
| imagemagick | **install via `brew install imagemagick`** | PNG → PBM for potrace |
| @react-three/postprocessing | installed | bloom + chromatic aberration for glass polish |
| @react-three/drei | installed | `MeshTransmissionMaterial`, `useGLTF`, `Environment` |
| @react-three/rapier | not needed | physics playground option was declined — no install |

## Critical files

**Create:**
- `scripts/model_haim8.py` — Blender headless script, builds the 6-node glb
- `scripts/build-assets.sh` — one-shot regeneration
- `public/haim8.glb` — output of `model_haim8.py`
- `public/haim8-trace.svg` — intermediate
- `public/haim8-bw.pbm` — intermediate
- `components/scene/HAIM8Logo.tsx` — R3F component with per-letter refs + drag interaction

**Modify:**
- [scripts/model_star.py](Website/haim8-website/scripts/model_star.py) — revert gem to equal 4-point proportions, bump quality
- [components/scene/StarScene.tsx](Website/haim8-website/components/scene/StarScene.tsx) — embed `<HAIM8Logo />`, potentially fold `<Star>` in
- [components/scene/Star.tsx](Website/haim8-website/components/scene/Star.tsx) — either adapt to consume the new gem glb node or deprecate (the gem now lives inside `haim8.glb`)
- [components/sections/Hero.tsx](Website/haim8-website/components/sections/Hero.tsx) — remove the `<img src="/haim8-noBG.png" />`, let the 3D logo fill the hero; keep subtitle + scroll indicator
- [components/sections/HValues.tsx](Website/haim8-website/components/sections/HValues.tsx) — swap desktop `<img>` for anchor ref
- [components/sections/AIServices.tsx](Website/haim8-website/components/sections/AIServices.tsx) — same
- [components/sections/M8Mates.tsx](Website/haim8-website/components/sections/M8Mates.tsx) — same
- [App.tsx](Website/haim8-website/App.tsx) — no changes; existing mobile/reduced-motion guard continues to gate the canvas

**Reuse (no change):**
- [lib/tokens.ts](Website/haim8-website/lib/tokens.ts) — BRAND, EASE, DUR
- Existing PNGs in `public/haim8-{H,A,I,M,8}.png` — stay as the mobile + reduced-motion fallback

## Verification

1. `brew install potrace imagemagick`
2. `bash scripts/build-assets.sh` — check:
   - `public/haim8-trace.svg` opens in the browser and shows recognisable HAIM8 + gem paths
   - `public/haim8.glb` ~1–3 MB with 6 named nodes (open in Blender GUI or a glTF viewer)
   - `public/star.glb` has the reverted equal-4-point gem
3. `npm run dev`, `preview_start`, then from the preview:
   - Hero loads, full 3D HAIM8 + gem visible
   - `preview_eval` pointer drag events on the canvas → logo rotates; release → springs back
   - Scroll to 15% → `preview_snapshot` confirms H has flown to H-Values section, values still readable
   - Scroll 40% → A + I visible at AI-Services, service cards unblocked
   - Scroll 70% → M + 8 at M8-Mates, case tiles legible
   - Scroll 95% → letters faded, Contact form primary focus
   - `preview_console_logs level: error` clean (no R3F / gltf warnings)
4. `preview_resize preset: mobile` → canvas absent (existing gate), PNG watermarks still show
5. `preview_eval` force `prefers-reduced-motion: reduce` → canvas absent, static fallback
6. `npm run build` passes, gzip ≤ 500 KB (add code-split on the R3F chunk if we bust that)
7. Lighthouse desktop perf ≥ 70 (6 glass meshes is the ceiling; can optimise in a later sprint)

## Deployment

- Push `HAIM8-website` branch → Vercel preview auto-fires
- Verify preview URL renders the 3D logo + interaction before any prod promotion
