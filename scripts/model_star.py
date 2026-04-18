"""Build the HAIM8 4-point glass star as a proper Blender mesh and export .glb.

Run headlessly:
  blender -b -P scripts/model_star.py

The exported mesh keeps a basic material — R3F overrides it with a full
MeshPhysicalMaterial (transmission, iridescence, clearcoat) at runtime for
the expensive glass effects that glTF doesn't reliably transport.
"""
from __future__ import annotations
import math
import os
import sys

import bpy
import bmesh

OUT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "public",
    "star.glb",
)

# 1. Wipe default scene ----------------------------------------------------
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for block in list(bpy.data.meshes):
    bpy.data.meshes.remove(block)
for block in list(bpy.data.materials):
    bpy.data.materials.remove(block)

# 2. Build asymmetric 4-point sparkle geometry -----------------------------
# Matches the HAIM8 reference gem: NS points long, EW points shorter,
# narrow inner radius for that sharp sparkle silhouette.
OUTER_NS = 1.0   # long vertical points (top, bottom)
OUTER_EW = 0.58  # shorter horizontal points (left, right)
INNER = 0.16     # narrow waist for sharp sparkle
DEPTH = 0.28

mesh = bpy.data.meshes.new("Star")
obj = bpy.data.objects.new("Star", mesh)
bpy.context.collection.objects.link(obj)

bm = bmesh.new()
top_verts = []
bot_verts = []
# 8 vertices alternating outer/inner, starting at top (N point)
for i in range(8):
    angle = (i * math.tau / 8) - math.pi / 2
    if i % 2 == 0:
        # outer point: alternate between NS long and EW short
        # i=0 → N (long), i=2 → E (short), i=4 → S (long), i=6 → W (short)
        r = OUTER_NS if i % 4 == 0 else OUTER_EW
    else:
        r = INNER
    x, y = r * math.cos(angle), r * math.sin(angle)
    top_verts.append(bm.verts.new((x, y, DEPTH / 2)))
    bot_verts.append(bm.verts.new((x, y, -DEPTH / 2)))
steps = 8

bm.verts.ensure_lookup_table()
bm.faces.new(top_verts)
bm.faces.new(list(reversed(bot_verts)))
for i in range(steps):
    a, b = top_verts[i], top_verts[(i + 1) % steps]
    c, d = bot_verts[(i + 1) % steps], bot_verts[i]
    bm.faces.new([a, b, c, d])

bm.normal_update()
bm.to_mesh(mesh)
bm.free()

# 3. Bevel + subdivision for smooth glass edges ----------------------------
bpy.context.view_layer.objects.active = obj
obj.select_set(True)

bevel = obj.modifiers.new(name="Bevel", type="BEVEL")
bevel.width = 0.055
bevel.segments = 6
bevel.profile = 0.7
bevel.limit_method = "ANGLE"
bevel.angle_limit = math.radians(30)

subsurf = obj.modifiers.new(name="Subsurf", type="SUBSURF")
subsurf.levels = 2
subsurf.render_levels = 3

bpy.ops.object.modifier_apply(modifier="Bevel")
bpy.ops.object.modifier_apply(modifier="Subsurf")

for poly in obj.data.polygons:
    poly.use_smooth = True

# 4. Base material (transmission/iridescence handled by R3F at runtime) ----
mat = bpy.data.materials.new("GlassBase")
mat.use_nodes = True
nt = mat.node_tree
for n in list(nt.nodes):
    nt.nodes.remove(n)

bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
# Signal blue tint
bsdf.inputs["Base Color"].default_value = (0.231, 0.510, 0.965, 1.0)
bsdf.inputs["Metallic"].default_value = 0.05
bsdf.inputs["Roughness"].default_value = 0.06
# IOR key name varies between Blender versions — set defensively
try:
    bsdf.inputs["IOR"].default_value = 1.52
except KeyError:
    pass
try:
    bsdf.inputs["Transmission Weight"].default_value = 0.85
except KeyError:
    try:
        bsdf.inputs["Transmission"].default_value = 0.85
    except KeyError:
        pass
try:
    bsdf.inputs["Coat Weight"].default_value = 1.0
    bsdf.inputs["Coat Roughness"].default_value = 0.04
except KeyError:
    pass

out = nt.nodes.new("ShaderNodeOutputMaterial")
nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
obj.data.materials.append(mat)

# 5. Center + export -------------------------------------------------------
obj.location = (0, 0, 0)
bpy.context.view_layer.update()

os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    export_materials="EXPORT",
    export_apply=False,
    export_yup=True,
    use_selection=False,
    export_normals=True,
    export_tangents=False,
    export_cameras=False,
    export_lights=False,
)
stat = os.stat(OUT)
print(f"[model_star] wrote {OUT} ({stat.st_size/1024:.1f} KB)", file=sys.stderr)
