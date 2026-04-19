"""Render the textured haim8.glb to a transparent-background PNG for the
mobile hero fallback.

The mobile site shows `public/haim8-noBG.png` instead of the 3D scene
(R3F is gated above 768 px). Each time the GLB is regenerated, the PNG
should be re-rendered so the look stays in sync.

Run:
  blender -b -P scripts/render_hero_png.py
  blender -b -P scripts/render_hero_png.py -- public/haim8.glb public/haim8-noBG.png 1600 720
"""
from __future__ import annotations
import math
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

SRC = _extra[0] if len(_extra) > 0 else os.path.join(ROOT, "public", "haim8.glb")
OUT = _extra[1] if len(_extra) > 1 else os.path.join(ROOT, "public", "haim8-noBG.png")
WIDTH = int(_extra[2]) if len(_extra) > 2 else 1600
HEIGHT = int(_extra[3]) if len(_extra) > 3 else 720

if not os.path.isabs(SRC):
    SRC = os.path.join(ROOT, SRC)
if not os.path.isabs(OUT):
    OUT = os.path.join(ROOT, OUT)

print(f"[render] SRC={SRC} OUT={OUT} {WIDTH}x{HEIGHT}", file=sys.stderr)

# --- Scene reset ----------------------------------------------------------
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
for block in list(bpy.data.meshes):
    bpy.data.meshes.remove(block)
for block in list(bpy.data.materials):
    bpy.data.materials.remove(block)

bpy.ops.import_scene.gltf(filepath=SRC)

# --- Camera ---------------------------------------------------------------
cam_data = bpy.data.cameras.new("Cam")
cam_data.type = "PERSP"
cam_data.lens = 50  # 50mm — neutral, matches a roughly 38° FOV at 720p
cam = bpy.data.objects.new("Cam", cam_data)
bpy.context.collection.objects.link(cam)
cam.location = (0, -3.5, 0.05)
cam.rotation_euler = (math.radians(90), 0, 0)
bpy.context.scene.camera = cam

# --- Lighting (matches the site's 3D scene roughly) -----------------------
key = bpy.data.objects.new("Key", bpy.data.lights.new("Key", "AREA"))
key.location = (3, -3, 4)
key.rotation_euler = (math.radians(50), math.radians(20), 0)
key.data.energy = 600
key.data.size = 4
bpy.context.collection.objects.link(key)

fill = bpy.data.objects.new("Fill", bpy.data.lights.new("Fill", "AREA"))
fill.location = (-4, -2, 2)
fill.data.energy = 250
fill.data.color = (0.79, 0.55, 1.0)  # purple wash
fill.data.size = 6
bpy.context.collection.objects.link(fill)

# --- Render settings ------------------------------------------------------
scene = bpy.context.scene
scene.render.engine = "CYCLES"
try:
    scene.cycles.device = "GPU"
except Exception:
    pass
scene.cycles.samples = 96
scene.render.resolution_x = WIDTH
scene.render.resolution_y = HEIGHT
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.compression = 90
scene.render.filepath = OUT

# Frame the logo in shot
mesh_objs = [o for o in bpy.data.objects if o.type == "MESH"]
if mesh_objs:
    bpy.ops.object.select_all(action="DESELECT")
    for o in mesh_objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = mesh_objs[0]
    # Re-aim camera at geometry center so the framing isn't off if origins shift
    xs = []; ys = []; zs = []
    for o in mesh_objs:
        for v in o.bound_box:
            wv = o.matrix_world @ type(o.location)((v[0], v[1], v[2]))
            xs.append(wv.x); ys.append(wv.y); zs.append(wv.z)
    cx = (min(xs) + max(xs)) / 2
    cy = (min(ys) + max(ys)) / 2
    cz = (min(zs) + max(zs)) / 2
    cam.location = (cx, cy - 3.2, cz + 0.05)
    print(f"[render] geometry center=({cx:.2f},{cy:.2f},{cz:.2f})", file=sys.stderr)

print(f"[render] rendering {WIDTH}x{HEIGHT} samples={scene.cycles.samples}", file=sys.stderr)
bpy.ops.render.render(write_still=True)
sz = os.path.getsize(OUT) if os.path.exists(OUT) else 0
print(f"[render] wrote {OUT} ({sz/1024:.1f} KB)", file=sys.stderr)
