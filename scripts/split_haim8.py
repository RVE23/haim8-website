"""Post-process the Meshy GLB: separate into 6 named letter meshes and re-export.

Meshy returns one merged mesh. Loose-parts separation yields 7 pieces because
the 'i' has a separate dot. We merge those, sort the rest by X (left→right),
identify the gem by its Z position (top), apply Decimate to drop poly count,
shade-smooth, then export.

Run (defaults read public/haim8-meshy.glb, write public/haim8.glb):
  blender -b -P scripts/split_haim8.py
  blender -b -P scripts/split_haim8.py -- public/haim8-raw.glb public/haim8.glb 0.12
"""
from __future__ import annotations
import os
import sys

import bpy

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

_args = sys.argv
try:
    _idx = _args.index("--")
    _extra = _args[_idx + 1:]
except ValueError:
    _extra = []

SRC = _extra[0] if len(_extra) > 0 else os.path.join(ROOT, "public", "haim8-meshy.glb")
OUT = _extra[1] if len(_extra) > 1 else os.path.join(ROOT, "public", "haim8.glb")
DECIMATE_RATIO = float(_extra[2]) if len(_extra) > 2 else 0.12
KEEP_MATERIALS = (_extra[3].lower() in ("1","true","keep")) if len(_extra) > 3 else False

if not os.path.isabs(SRC):
    SRC = os.path.join(ROOT, SRC)
if not os.path.isabs(OUT):
    OUT = os.path.join(ROOT, OUT)

print(f"[split] SRC={SRC}", file=sys.stderr)
print(f"[split] OUT={OUT}", file=sys.stderr)
print(f"[split] DECIMATE_RATIO={DECIMATE_RATIO}", file=sys.stderr)

# Clear scene ---------------------------------------------------------------
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for block in list(bpy.data.meshes):
    bpy.data.meshes.remove(block)
for block in list(bpy.data.materials):
    bpy.data.materials.remove(block)
for block in list(bpy.data.images):
    bpy.data.images.remove(block)

print(f"[split] importing {SRC}", file=sys.stderr)
bpy.ops.import_scene.gltf(filepath=SRC)

# Find the imported mesh ----------------------------------------------------
root = [o for o in bpy.data.objects if o.type == "MESH"]
if not root:
    sys.exit("no mesh in GLB")
main = root[0]
print(f"[split] main mesh: {main.name} verts={len(main.data.vertices)}", file=sys.stderr)

# Loose-parts separation ----------------------------------------------------
bpy.ops.object.select_all(action="DESELECT")
main.select_set(True)
bpy.context.view_layer.objects.active = main
bpy.ops.object.mode_set(mode="EDIT")
bpy.ops.mesh.select_all(action="SELECT")
bpy.ops.mesh.separate(type="LOOSE")
bpy.ops.object.mode_set(mode="OBJECT")

parts = [o for o in bpy.data.objects if o.type == "MESH"]
print(f"[split] loose parts: {len(parts)}", file=sys.stderr)


def world_bbox_center(obj):
    bbox = [obj.matrix_world @ v.co for v in obj.data.vertices]
    if not bbox:
        return (0, 0, 0)
    xs = [v.x for v in bbox]
    ys = [v.y for v in bbox]
    zs = [v.z for v in bbox]
    return ((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, (min(zs) + max(zs)) / 2)


def bbox_size(obj):
    bbox = [obj.matrix_world @ v.co for v in obj.data.vertices]
    xs = [v.x for v in bbox]
    ys = [v.y for v in bbox]
    zs = [v.z for v in bbox]
    return (max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs))


parts_info = [(p, world_bbox_center(p), bbox_size(p)) for p in parts]

# Two strategies:
#   - few pieces (legacy low-poly): top-Z is gem, sort rest L→R, merge i-dot
#   - many pieces (high-poly textured mesh shatters into hundreds of islands):
#     bucket every piece by nearest letter-center on X; gem = anything above
#     Z threshold; else assign to nearest letter bucket.
USE_BUCKETS = len(parts_info) > 12

LETTER_CENTERS_X = {"H": -0.76, "A": -0.33, "I": -0.02, "M": 0.32, "_8": 0.78}
GEM_Z_THRESHOLD = 0.22  # piece must be above this Z to be considered gem
GEM_X_RADIUS = 0.20  # piece must also be within this X distance from origin

def join_objects(objs):
    if not objs:
        return None
    bpy.ops.object.select_all(action="DESELECT")
    primary = objs[0]
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = primary
    if len(objs) > 1:
        bpy.ops.object.join()
    return primary

if USE_BUCKETS:
    print(f"[split] >12 parts ({len(parts_info)}) — using X-bucket strategy", file=sys.stderr)
    buckets: dict[str, list] = {k: [] for k in LETTER_CENTERS_X}
    gem_pieces: list = []
    for p, c, _ in parts_info:
        if c[2] > GEM_Z_THRESHOLD and abs(c[0]) < GEM_X_RADIUS:
            gem_pieces.append(p)
            continue
        nearest = min(LETTER_CENTERS_X, key=lambda k: abs(c[0] - LETTER_CENTERS_X[k]))
        buckets[nearest].append(p)
    for k, lst in buckets.items():
        print(f"[split] bucket {k}: {len(lst)} pieces", file=sys.stderr)
    print(f"[split] gem pieces (z>{GEM_Z_THRESHOLD}): {len(gem_pieces)}", file=sys.stderr)
    merged = []
    for letter_name in ["H", "A", "I", "M", "_8"]:
        joined = join_objects(buckets[letter_name])
        if joined:
            joined.name = letter_name
            joined.data.name = letter_name + "_mesh"
            merged.append((joined, world_bbox_center(joined), bbox_size(joined)))
    gem_obj = join_objects(gem_pieces)
    if gem_obj:
        gem_obj.name = "Gem"
        gem_obj.data.name = "Gem_mesh"
    gem_candidate = (gem_obj, world_bbox_center(gem_obj) if gem_obj else (0, 0, 0), bbox_size(gem_obj) if gem_obj else (0, 0, 0))
else:
    parts_info.sort(key=lambda t: -t[1][2])
    gem_candidate = parts_info[0]
    letters_info = parts_info[1:]
    print(f"[split] gem candidate: {gem_candidate[0].name} center_z={gem_candidate[1][2]:.2f}", file=sys.stderr)
    letters_info.sort(key=lambda t: t[1][0])
    merged = []
    skip_next = False
    for i, (p, c, s) in enumerate(letters_info):
        if skip_next:
            skip_next = False
            continue
        if i + 1 < len(letters_info):
            p2, c2, s2 = letters_info[i + 1]
            if abs(c[0] - c2[0]) < 0.08 and s[0] < 0.20 and s2[0] < 0.20:
                print(f"[split] merging {p2.name} into {p.name} (i-dot + i-body)", file=sys.stderr)
                bpy.ops.object.select_all(action="DESELECT")
                p.select_set(True)
                p2.select_set(True)
                bpy.context.view_layer.objects.active = p
                bpy.ops.object.join()
                merged.append((p, world_bbox_center(p), bbox_size(p)))
                skip_next = True
                continue
        merged.append((p, c, s))
    letter_names = ["H", "A", "I", "M", "_8"]
    if len(merged) != 5:
        print(f"[split] WARNING: got {len(merged)} pieces, not 5 — naming by index anyway", file=sys.stderr)
        letter_names = letter_names[: len(merged)]
    for (p, c, s), name in zip(merged, letter_names):
        print(f"[split] {p.name} → {name}  center_x={c[0]:.2f} w={s[0]:.2f}", file=sys.stderr)
        p.name = name
        p.data.name = name + "_mesh"
    gem_candidate[0].name = "Gem"
    gem_candidate[0].data.name = "Gem_mesh"

# Clean up: decimate, shade smooth, center origin --------------------------
for obj in bpy.data.objects:
    if obj.type != "MESH":
        continue
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    # Gem keeps more detail — its 4-point silhouette suffers most from decimation.
    ratio = DECIMATE_RATIO if obj.name != "Gem" else min(1.0, DECIMATE_RATIO * 2.0)
    pre_verts = len(obj.data.vertices)
    if ratio > 0 and ratio < 1:
        mod = obj.modifiers.new(name="Decimate", type="DECIMATE")
        mod.ratio = ratio
        bpy.ops.object.modifier_apply(modifier=mod.name)
        post_verts = len(obj.data.vertices)
        print(f"[split] decimate {obj.name} (ratio {ratio:.2f}): {pre_verts} -> {post_verts} verts", file=sys.stderr)

    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="MEDIAN")
    for poly in obj.data.polygons:
        poly.use_smooth = True

if not KEEP_MATERIALS:
    for obj in bpy.data.objects:
        if obj.type == "MESH":
            obj.data.materials.clear()

# Export --------------------------------------------------------------------
print(f"[split] exporting {OUT} (keep_materials={KEEP_MATERIALS})", file=sys.stderr)
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    export_materials="EXPORT" if KEEP_MATERIALS else "NONE",
    export_image_format="AUTO" if KEEP_MATERIALS else "NONE",
    export_apply=True,
    export_yup=True,
    use_selection=False,
    export_normals=True,
    export_extras=False,
    export_cameras=False,
    export_lights=False,
)
stat = os.stat(OUT)
print(f"[split] wrote {OUT} ({stat.st_size/1024:.1f} KB)", file=sys.stderr)

# Summary
print("\n[split] final objects:", file=sys.stderr)
for obj in bpy.data.objects:
    if obj.type == "MESH":
        c = world_bbox_center(obj)
        s = bbox_size(obj)
        print(
            f"  - {obj.name}: verts={len(obj.data.vertices)} "
            f"center=({c[0]:.2f},{c[1]:.2f},{c[2]:.2f}) "
            f"size=({s[0]:.2f},{s[1]:.2f},{s[2]:.2f})",
            file=sys.stderr,
        )
