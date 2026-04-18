"""Process the 3D glassmorphic HAIM8 logo into individual letters + gem.

Steps:
1. Background removal via rembg (isanet u2net model).
2. Crop to opaque bounding box.
3. Detect vertical alpha gaps between letters to slice H / A / I / M / 8.
4. Detect the gem (star) above the letter row and save separately.

Outputs written next to this script:
  haim8-noBG.png, haim8-H.png, haim8-A.png, haim8-I.png, haim8-M.png, haim8-8.png, haim8-gem.png
"""
from __future__ import annotations

import io
import sys
from pathlib import Path

import numpy as np
from PIL import Image

SRC = Path("/Users/raesamuel/HAIM8/HAIM8 Marketing/haim8-logo-3d-glass-v6.png")
OUT_DIR = Path(__file__).resolve().parent
ALPHA_EMPTY_THRESHOLD = 6
MIN_SEGMENT_WIDTH = 30

def remove_bg(src_path: Path) -> Image.Image:
    """Run rembg; return RGBA PIL image with transparent background."""
    from rembg import remove
    with open(src_path, "rb") as f:
        data = f.read()
    out = remove(data, alpha_matting=True, alpha_matting_foreground_threshold=240,
                 alpha_matting_background_threshold=10, alpha_matting_erode_size=2)
    return Image.open(io.BytesIO(out)).convert("RGBA")


def tight_crop(im: Image.Image) -> Image.Image:
    """Crop to the bbox of opaque pixels."""
    arr = np.array(im)
    alpha = arr[..., 3]
    ys, xs = np.where(alpha > ALPHA_EMPTY_THRESHOLD)
    if len(xs) == 0:
        return im
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def split_letters_and_gem(im: Image.Image) -> dict[str, Image.Image]:
    """Split into gem (top row) and five letters (H, A, I, M, 8)."""
    arr = np.array(im)
    alpha = arr[..., 3]
    h, w = alpha.shape

    # Row-wise mass: find the vertical gap between gem (top) and letter row (bottom).
    row_mass = (alpha > ALPHA_EMPTY_THRESHOLD).sum(axis=1)
    # Heuristic: gem sits above; find a row with zero mass that separates the two clusters.
    nonzero_rows = np.where(row_mass > 0)[0]
    if len(nonzero_rows) == 0:
        raise RuntimeError("No opaque pixels detected")
    y_top = nonzero_rows[0]
    y_bot = nonzero_rows[-1]

    # Find the widest internal horizontal band of empty rows.
    gap_start, gap_end, gap_len = -1, -1, 0
    cur_start = -1
    for y in range(y_top, y_bot + 1):
        if row_mass[y] <= ALPHA_EMPTY_THRESHOLD:
            if cur_start < 0:
                cur_start = y
        else:
            if cur_start >= 0:
                length = y - cur_start
                if length > gap_len:
                    gap_len = length
                    gap_start, gap_end = cur_start, y
                cur_start = -1

    # If we found a meaningful vertical gap, split there; otherwise assume no gem.
    gem_img = None
    letters_img = im
    if gap_len > 15 and gap_start > 20:
        gem_box = (0, 0, w, gap_start)
        letters_box = (0, gap_end, w, h)
        gem_img = tight_crop(im.crop(gem_box))
        letters_img = tight_crop(im.crop(letters_box))

    # Letter splitting: for the letter row, find vertical (column) gaps.
    arr_l = np.array(letters_img)
    alpha_l = arr_l[..., 3]
    col_mass = (alpha_l > ALPHA_EMPTY_THRESHOLD).sum(axis=0)
    lh, lw = alpha_l.shape

    # Contiguous opaque runs
    runs: list[tuple[int, int]] = []
    cur_s = -1
    for x in range(lw):
        if col_mass[x] > ALPHA_EMPTY_THRESHOLD:
            if cur_s < 0:
                cur_s = x
        else:
            if cur_s >= 0:
                runs.append((cur_s, x))
                cur_s = -1
    if cur_s >= 0:
        runs.append((cur_s, lw))

    # Merge tiny runs caused by shadow/noise; keep the widest 5 (H, A, I, M, 8).
    runs = [(s, e) for s, e in runs if (e - s) >= 4]
    if len(runs) > 5:
        # If we got too many segments, the letters may have internal splits (e.g. A's gap).
        # Sort by width desc and keep top-5, then reorder left-to-right.
        runs.sort(key=lambda se: (se[1] - se[0]), reverse=True)
        runs = sorted(runs[:5], key=lambda se: se[0])

    letter_names = ["H", "A", "I", "M", "8"]
    letters: dict[str, Image.Image] = {}
    if len(runs) == 5:
        for name, (s, e) in zip(letter_names, runs):
            pad = 8
            x0 = max(0, s - pad)
            x1 = min(lw, e + pad)
            letters[name] = tight_crop(letters_img.crop((x0, 0, x1, lh)))
    else:
        print(f"WARN: expected 5 letter runs, got {len(runs)}. Falling back to uniform split.", file=sys.stderr)
        seg_w = lw // 5
        for idx, name in enumerate(letter_names):
            x0 = idx * seg_w
            x1 = (idx + 1) * seg_w if idx < 4 else lw
            letters[name] = tight_crop(letters_img.crop((x0, 0, x1, lh)))

    result = {"haim8-noBG": tight_crop(im), "haim8-letters": letters_img}
    if gem_img is not None:
        result["haim8-gem"] = gem_img
    for name, img in letters.items():
        result[f"haim8-{name}"] = img
    return result


def main() -> None:
    if not SRC.exists():
        print(f"Source not found: {SRC}", file=sys.stderr)
        sys.exit(1)
    print(f"Reading {SRC}")
    print("Removing background with rembg (first run downloads u2net model ~170MB)...")
    im_noBG = remove_bg(SRC)
    im_noBG = tight_crop(im_noBG)
    print(f"Transparent logo: {im_noBG.size}")

    pieces = split_letters_and_gem(im_noBG)
    for name, img in pieces.items():
        out = OUT_DIR / f"{name}.png"
        img.save(out, optimize=True)
        print(f"  wrote {out.name} {img.size}")


if __name__ == "__main__":
    main()
