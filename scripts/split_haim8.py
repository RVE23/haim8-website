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


# Classify: gem is the piece with highest Z center; letters are at lower Z ---
parts_info = [(p, world_bbox_center(p), bbox_size(p)) for p in parts]
# Sort by Z desc — first is the gem candidate
parts_info.sort(key=lambda t: -t[1][2])
gem_candidate = parts_info[0]
letters_info = parts_info[1:]
print(f"[split] gem candidate: {gem_candidate[0].name} center_z={gem_candidate[1][2]:.2f}", file=sys.stderr)

# Merge i-dot into i-body: the two letter pieces closest in X that aren't wide
# heuristic: if two pieces have centers within 0.08 units on X AND their widths
# are both < 0.2, they're the i-body + i-dot
letters_info.sort(key=lambda t: t[1][0])  # sort left-to-right by x
merged: list[tuple] = []
skip_next = False
for i, (p, c, s) in enumerate(letters_info):
    if skip_next:
        skip_next = False
        continue
    if i + 1 < len(letters_info):
        p2, c2, s2 = letters_info[i + 1]
        if abs(c[0] - c2[0]) < 0.08 and s[0] < 0.20 and s2[0] < 0.20:
            # merge p2 into p
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

print(f"[split] after merge: {len(merged)} letter pieces (expect 5)", file=sys.stderr)

letter_names = ["H", "A", "I", "M", "_8"]
if len(merged) != 5:
    print(f"[split] WARNING: got {len(merged)} pieces, not 5 — naming by index anyway", file=sys.stderr)
    letter_names = letter_names[: len(merged)]

# Rename letters
for (p, c, s), name in zip(merged, letter_names):
    print(f"[split] {p.name} → {name}  center_x={c[0]:.2f} w={s[0]:.2f}", file=sys.stderr)
    p.name = name
    p.data.name = name + "_mesh"

# Rename gem
gem_candidate[0].name = "Gem"
gem_candidate[0].data.name = "Gem_mesh"

# Clean up: decimate, shade smooth, center origin --------------------------
for obj in bpy.data.objects:
    if obj.type != "MESH":
        continue
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

    pre_verts = len(obj.data.vertices)
    if DECIMATE_RATIO > 0 and DECIMATE_RATIO < 1:
        mod = obj.modifiers.new(name="Decimate", type="DECIMATE")
        mod.ratio = DECIMATE_RATIO
        bpy.ops.object.modifier_apply(modifier=mod.name)
        post_verts = len(obj.data.vertices)
        print(f"[split] decimate {obj.name}: {pre_verts} -> {post_verts} verts", file=sys.stderr)

    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="MEDIAN")
    for poly in obj.data.polygons:
        poly.use_smooth = True

# Strip materials — R3F applies glass at runtime
for obj in bpy.data.objects:
    if obj.type == "MESH":
        obj.data.materials.clear()

# Export --------------------------------------------------------------------
print(f"[split] exporting {OUT}", file=sys.stderr)
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    export_materials="NONE",
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
