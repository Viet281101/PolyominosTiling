#!/usr/bin/env python3
"""
Generate full Vietnamese glyph coverage for Pixellari.ttf.

Usage examples:
  python3 generate_vietnamese_full.py
  python3 generate_vietnamese_full.py --input Pixellari.ttf --output Pixellari-VI.ttf
  python3 generate_vietnamese_full.py --force
  fontforge -script generate_vietnamese_full.py --input Pixellari.ttf --output Pixellari-VI.ttf
"""

from __future__ import annotations

import argparse
import os
import sys
import unicodedata
from typing import Dict, List, Sequence, Tuple

try:
    import fontforge
    import psMat
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Missing dependency: fontforge Python module.\n"
        "Run with FontForge Python (e.g. `fontforge -script ...`) or install python-fontforge."
    ) from exc


TONE_GRAVE = "\u0300"
TONE_ACUTE = "\u0301"
TONE_HOOK = "\u0309"
TONE_TILDE = "\u0303"
TONE_DOT = "\u0323"
TONE_MARKS = {TONE_GRAVE, TONE_ACUTE, TONE_HOOK, TONE_TILDE, TONE_DOT}

SHAPE_CIRC = "\u0302"
SHAPE_BREVE = "\u0306"
SHAPE_HORN = "\u031B"

VIETNAMESE_REQUIRED = (
    "aàáảãạăằắẳẵặâầấẩẫậbcdđeèéẻẽẹêềếểễệghiìíỉĩị"
    "klmnoòóỏõọôồốổỗộơờớởỡợpqrstuùúủũụưừứửữựvxyỳýỷỹỵ"
    "AÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬBCDĐEÈÉẺẼẸÊỀẾỂỄỆGHIÌÍỈĨỊ"
    "KLMNOÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢPQRSTUÙÚỦŨỤƯỪỨỬỮỰVXYỲÝỶỸỴ"
)

# These glyphs are rebuilt even without --force so i/I accent behavior stays correct.
ALWAYS_REBUILD = set("ìíĩỉịÌÍĨỈỊ")


def _nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s)


def build_vietnamese_charset() -> List[str]:
    seen = set()
    ordered_unique: List[str] = []
    for ch in VIETNAMESE_REQUIRED:
        if ch not in seen:
            seen.add(ch)
            ordered_unique.append(ch)
    return ordered_unique


def glyph_exists(font, codepoint: int) -> bool:
    try:
        _ = font[codepoint].glyphname
        return True
    except Exception:
        return False


def glyph_has_data(glyph) -> bool:
    try:
        if len(glyph.references) > 0:
            return True
    except Exception:
        pass
    try:
        return not glyph.foreground.isEmpty()
    except Exception:
        return False


def copy_glyph_data(dst, src) -> None:
    dst.clear()
    dst.foreground = src.foreground.dup()
    dst.width = src.width


def normalize_generated_glyph(glyph) -> None:
    try:
        glyph.round()
    except Exception:
        pass
    try:
        glyph.removeOverlap()
    except Exception:
        pass
    try:
        glyph.round()
    except Exception:
        pass


def contour_bbox(contour) -> Tuple[float, float, float, float]:
    xs = [p.x for p in contour]
    ys = [p.y for p in contour]
    return (min(xs), min(ys), max(xs), max(ys))


def filter_layer_contours(layer, keep_fn):
    filtered = layer.dup()
    to_delete: List[int] = []
    for i, contour in enumerate(filtered):
        if not keep_fn(contour_bbox(contour)):
            to_delete.append(i)
    for i in reversed(to_delete):
        del filtered[i]
    return filtered


def extract_top_mark_layer(font, donor_name: str, donor_base_name: str, right_only: bool = False):
    donor = font[donor_name]
    donor_base = font[donor_base_name]
    _, _, base_x2, base_y2 = donor_base.boundingBox()
    base_x1, _, _, _ = donor_base.boundingBox()
    base_center_x = (base_x1 + base_x2) / 2.0

    donor_layer = donor.foreground.dup()
    top_layer = filter_layer_contours(
        donor_layer,
        lambda bb: bb[3] > base_y2 + 1.0,
    )
    if right_only:
        top_layer = filter_layer_contours(
            top_layer,
            lambda bb: ((bb[0] + bb[2]) / 2.0) > base_center_x,
        )
    return top_layer


def layer_bbox_center_x(layer) -> float:
    x1, _, x2, _ = layer.boundingBox()
    return (x1 + x2) / 2.0


def add_layer_with_alignment(
    target_layer,
    mark_layer,
    donor_base_glyph,
    target_base_glyph,
    y_anchor: str = "top",
    scale_x: float = 1.0,
    y_offset: float = 0.0,
):
    moved = mark_layer.dup()
    if scale_x != 1.0:
        mx1, my1, mx2, my2 = moved.boundingBox()
        mcx = (mx1 + mx2) / 2.0
        mcy = (my1 + my2) / 2.0
        moved.transform(psMat.translate(-mcx, -mcy))
        moved.transform(psMat.scale(scale_x, 1.0))
        moved.transform(psMat.translate(mcx, mcy))

    donor_x1, donor_y1, donor_x2, donor_y2 = donor_base_glyph.boundingBox()
    target_x1, target_y1, target_x2, target_y2 = target_base_glyph.boundingBox()

    dx = ((target_x1 + target_x2) / 2.0) - ((donor_x1 + donor_x2) / 2.0)
    if y_anchor == "top":
        dy = target_y2 - donor_y2 + y_offset
    elif y_anchor == "bottom":
        dy = target_y1 - donor_y1 + y_offset
    else:
        dy = y_offset

    moved.transform(psMat.translate(dx, dy))
    target_layer += moved
    return target_layer


def add_dot_below(target_layer, base_glyph, period_glyph):
    dot = period_glyph.foreground.dup()
    dot_x1, dot_y1, dot_x2, _ = dot.boundingBox()
    base_x1, base_y1, base_x2, _ = base_glyph.boundingBox()
    dx = ((base_x1 + base_x2) / 2.0) - ((dot_x1 + dot_x2) / 2.0)
    # Keep one 64-unit gap below baseline for Pixellari's pixel grid.
    dy = (base_y1 - 192.0) - dot_y1
    dot.transform(psMat.translate(dx, dy))
    target_layer += dot
    return target_layer


def add_hook_above(target_layer, base_glyph, comma_glyph, y_lift: float = 0.0):
    hook = comma_glyph.foreground.dup()
    # Mirror comma upward to get a compact hook shape that matches stroke style.
    hook.transform(psMat.scale(1.0, -1.0))
    hook_x1, hook_y1, hook_x2, _ = hook.boundingBox()
    base_x1, _, base_x2, base_y2 = base_glyph.boundingBox()
    dx = ((base_x1 + base_x2) / 2.0 + 32.0) - ((hook_x1 + hook_x2) / 2.0)
    # Keep hook close to the main top accent zone; avoids over-tall stacks.
    dy = (base_y2 - 64.0 + y_lift) - hook_y1
    hook.transform(psMat.translate(dx, dy))
    target_layer += hook
    return target_layer


def add_horn_right(target_layer, base_glyph, comma_glyph):
    horn = comma_glyph.foreground.dup()
    horn_x1, horn_y1, horn_x2, _ = horn.boundingBox()
    base_x1, _, base_x2, base_y2 = base_glyph.boundingBox()

    # Place horn at top-right shoulder while keeping inside advance width.
    dx = (base_x2 - 32.0) - ((horn_x1 + horn_x2) / 2.0)
    dy = (base_y2 - 64.0) - horn_y1
    horn.transform(psMat.translate(dx, dy))
    target_layer += horn
    return target_layer


def ensure_horn_base(font, ch: str, comma_glyph) -> bool:
    cp = ord(ch)
    if glyph_exists(font, cp) and glyph_has_data(font[cp]):
        return True

    mapping = {
        "ơ": "o",
        "ư": "u",
        "Ơ": "O",
        "Ư": "U",
    }
    if ch not in mapping:
        return False

    base_name = mapping[ch]
    base = font[base_name]

    dst = font.createChar(cp)
    layer = base.foreground.dup()
    layer = add_horn_right(layer, base, comma_glyph)

    dst.clear()
    dst.foreground = layer
    dst.width = base.width
    normalize_generated_glyph(dst)
    return glyph_has_data(dst)


def parse_decomposition(ch: str) -> Tuple[str, List[str], List[str]]:
    nfd = unicodedata.normalize("NFD", ch)
    base = nfd[0]
    shape_marks: List[str] = []
    tone_marks: List[str] = []
    for mark in nfd[1:]:
        if mark in TONE_MARKS:
            tone_marks.append(mark)
        elif mark in {SHAPE_BREVE, SHAPE_CIRC, SHAPE_HORN}:
            shape_marks.append(mark)
    return base, shape_marks, tone_marks


def shape_base_char(base: str, shape_marks: Sequence[str]) -> str:
    has_circ = SHAPE_CIRC in shape_marks
    has_breve = SHAPE_BREVE in shape_marks
    has_horn = SHAPE_HORN in shape_marks
    if has_horn:
        if base == "o":
            return "ơ"
        if base == "u":
            return "ư"
        if base == "O":
            return "Ơ"
        if base == "U":
            return "Ư"
    if has_breve:
        return _nfc(base + SHAPE_BREVE)
    if has_circ:
        return _nfc(base + SHAPE_CIRC)
    return base


def ensure_composed_vietnamese_glyph(
    font,
    ch: str,
    mark_layers: Dict[str, object],
    force_overwrite: bool,
) -> bool:
    cp = ord(ch)
    if (not force_overwrite) and (ch not in ALWAYS_REBUILD) and glyph_exists(font, cp) and glyph_has_data(font[cp]):
        return True

    base, shape_marks, tone_marks = parse_decomposition(ch)
    shaped = shape_base_char(base, shape_marks)

    # Ensure horn bases first because Pixellari does not ship o-horn/u-horn.
    if SHAPE_HORN in shape_marks:
        if not ensure_horn_base(font, shaped, mark_layers["comma"]):
            return False

    shaped_cp = ord(shaped)
    if not glyph_exists(font, shaped_cp) or not glyph_has_data(font[shaped_cp]):
        return False

    base_glyph = font[shaped_cp]
    # Vietnamese lowercase i drops the top dot only for top marks (grave/acute/hook/tilde).
    if base == "i" and tone_marks and (tone_marks[0] != TONE_DOT):
        base_glyph = font["dotlessi"]
    base_width = base_glyph.width
    dst = font.createChar(cp)
    layer = base_glyph.foreground.dup()

    if tone_marks:
        tone = tone_marks[0]
        is_upper = base.isupper()
        if tone == TONE_GRAVE:
            mark = mark_layers["grave_upper"] if is_upper else mark_layers["grave_lower"]
            donor = font["A"] if is_upper else font["a"]
            y_offset = 64.0 if base == "I" else 0.0
            layer = add_layer_with_alignment(layer, mark, donor, base_glyph, y_anchor="top", y_offset=y_offset)
        elif tone == TONE_ACUTE:
            mark = mark_layers["acute_upper"] if is_upper else mark_layers["acute_lower"]
            donor = font["A"] if is_upper else font["a"]
            y_offset = 64.0 if base == "I" else 0.0
            layer = add_layer_with_alignment(layer, mark, donor, base_glyph, y_anchor="top", y_offset=y_offset)
        elif tone == TONE_TILDE:
            if base == "I":
                mark = mark_layers["tilde_i_upper"]
                donor = font["I"]
            elif base == "i":
                mark = mark_layers["tilde_lower"]
                donor = font["a"]
            else:
                mark = mark_layers["tilde_upper"] if is_upper else mark_layers["tilde_lower"]
                donor = font["A"] if is_upper else font["a"]
            scale_x = 0.75 if base == "i" else 1.0
            y_offset = 64.0 if base == "I" else 0.0
            layer = add_layer_with_alignment(
                layer, mark, donor, base_glyph, y_anchor="top", scale_x=scale_x, y_offset=y_offset
            )
        elif tone == TONE_HOOK:
            y_lift = 64.0 if base == "I" else 0.0
            layer = add_hook_above(layer, base_glyph, font["comma"], y_lift=y_lift)
        elif tone == TONE_DOT:
            layer = add_dot_below(layer, base_glyph, font["period"])

    dst.clear()
    dst.foreground = layer
    dst.width = base_width
    normalize_generated_glyph(dst)
    return glyph_has_data(dst)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate Vietnamese glyphs for Pixellari with manual pixel-grid composition."
    )
    parser.add_argument(
        "--input",
        default="Pixellari.ttf",
        help="Input TTF path (default: Pixellari.ttf)",
    )
    parser.add_argument(
        "--output",
        default="Pixellari-Vietnamese.ttf",
        help="Output TTF path (default: Pixellari-Vietnamese.ttf)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite Vietnamese glyphs even if they already exist (useful when regenerating from a previously generated font).",
    )
    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Input font not found: {args.input}", file=sys.stderr)
        return 1

    font = fontforge.open(args.input)

    mark_layers: Dict[str, object] = {
        "grave_lower": extract_top_mark_layer(font, "agrave", "a"),
        "acute_lower": extract_top_mark_layer(font, "aacute", "a"),
        "tilde_lower": extract_top_mark_layer(font, "atilde", "a"),
        "grave_upper": extract_top_mark_layer(font, "Agrave", "A"),
        "acute_upper": extract_top_mark_layer(font, "Aacute", "A"),
        "tilde_upper": extract_top_mark_layer(font, "Atilde", "A"),
        "tilde_i_upper": extract_top_mark_layer(font, "Itilde", "I"),
        "comma": font["comma"],
    }

    required = build_vietnamese_charset()
    missing_before = []
    for ch in required:
        cp = ord(ch)
        if (not glyph_exists(font, cp)) or (not glyph_has_data(font[cp])):
            missing_before.append(ch)

    created: List[str] = []
    failed: List[str] = []
    for ch in required:
        if ensure_composed_vietnamese_glyph(font, ch, mark_layers, force_overwrite=args.force):
            created.append(ch)
        else:
            failed.append(ch)

    still_missing = []
    for ch in required:
        cp = ord(ch)
        if (not glyph_exists(font, cp)) or (not glyph_has_data(font[cp])):
            still_missing.append(ch)

    font.generate(args.output)
    font.close()

    print(f"Input: {args.input}")
    print(f"Output: {args.output}")
    print(f"Vietnamese required: {len(required)}")
    print(f"Missing before: {len(missing_before)}")
    print(f"Created now: {len(created)}")
    print(f"Failed to build: {len(failed)}")
    print(f"Still missing after generate: {len(still_missing)}")

    if still_missing:
        print("Missing codepoints:")
        for ch in still_missing:
            cp = ord(ch)
            print(f"  U+{cp:04X} {ch} {unicodedata.name(ch, 'UNKNOWN')}")
        return 2

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
