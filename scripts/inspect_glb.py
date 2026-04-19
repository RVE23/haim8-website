"""Quick structural inspection of a GLB file via Blender — no export.

Run:
  blender -b -P scripts/inspect_glb.py -- public/haim8-raw.glb
"""
from __future__ import annotations
import sys
import os

import bpy

args = sys.argv
try:
    idx = args.index("--")
    target = args[idx + 1]
except (ValueError, IndexError):
    target = "public/haim8-raw.glb"

if not os.path.isabs(target):
    target = os.path.join(os.getcwd(), target)

# Clear scene
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)

print(f"\n[inspect] importing {target}", file=sys.stderr)
bpy.ops.import_scene.gltf(filepath=target)

print("\n[inspect] objects in scene:", file=sys.stderr)
for obj in bpy.data.objects:
    mesh_info = ""
    if obj.type == "MESH":
        m = obj.data
        bbox = obj.bound_box
        xs = [v[0] for v in bbox]
        ys = [v[1] for v in bbox]
        zs = [v[2] for v in bbox]
        mesh_info = (
            f" | verts={len(m.vertices)} polys={len(m.polygons)}"
            f" | bbox x={min(xs):.2f}..{max(xs):.2f}"
            f" y={min(ys):.2f}..{max(ys):.2f}"
            f" z={min(zs):.2f}..{max(zs):.2f}"
        )
    print(f"  - {obj.name} [{obj.type}]{mesh_info}", file=sys.stderr)

# Try loose-parts separation to see how many distinct pieces exist
meshes = [o for o in bpy.data.objects if o.type == "MESH"]
if meshes:
    print(f"\n[inspect] attempting loose-parts separation on first mesh ({meshes[0].name})...", file=sys.stderr)
    bpy.ops.object.select_all(action="DESELECT")
    meshes[0].select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.mesh.separate(type="LOOSE")
    bpy.ops.object.mode_set(mode="OBJECT")
    parts = [o for o in bpy.data.objects if o.type == "MESH"]
    print(f"[inspect] loose-parts count: {len(parts)}", file=sys.stderr)
    parts_sorted = sorted(parts, key=lambda o: (-(o.location.z + o.dimensions.z / 2),
                                                   o.location.x + o.dimensions.x / 2))
    for p in parts_sorted[:20]:
        bbox = p.bound_box
        xs = [v[0] for v in bbox]
        ys = [v[1] for v in bbox]
        zs = [v[2] for v in bbox]
        cx = (min(xs) + max(xs)) / 2 + p.location.x
        cy = (min(ys) + max(ys)) / 2 + p.location.y
        cz = (min(zs) + max(zs)) / 2 + p.location.z
        print(
            f"  - {p.name} verts={len(p.data.vertices)} "
            f"w={max(xs)-min(xs):.2f} h={max(ys)-min(ys):.2f} d={max(zs)-min(zs):.2f} "
            f"center=({cx:.2f},{cy:.2f},{cz:.2f})",
            file=sys.stderr,
        )
