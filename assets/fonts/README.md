# Fonts Workflow (Vietnamese Glyphs)

This folder contains the source font and scripts to check/generate full Vietnamese glyph coverage for the project.

## Folder Structure

- `Pixellari.ttf`: the base font currently used in the game.
- `generate_vietnamese_full.py`: main script to create/overwrite missing Vietnamese glyphs.
- `check_vietnamese_missing.py`: quick check for missing Vietnamese glyphs in the font.
- `check_glyphs.py`: prints all glyph names available in the font.
- `requirements.txt`: minimal dependencies for Python scripts related to font processing.

## Environment Requirements

The scripts use **FontForge Python bindings** (`fontforge`, `psMat`).

1. Install system dependencies (recommended on Ubuntu/Debian):

```bash
sudo apt update
sudo apt install fontforge python3-fontforge
```

2. (Optional) create a virtual environment if you want isolated Python package management.

## How to Run

Run commands from the `assets/fonts` folder.

### 1) Check missing glyphs before generating

```bash
python3 check_vietnamese_missing.py
```

### 2) Generate full Vietnamese glyph coverage

```bash
python3 generate_vietnamese_full.py
```

Default output: `Pixellari-Vietnamese.ttf`.

Useful options:

```bash
python3 generate_vietnamese_full.py --input Pixellari.ttf --output Pixellari-Vietnamese.ttf
python3 generate_vietnamese_full.py --force
fontforge -script generate_vietnamese_full.py --input Pixellari.ttf --output Pixellari-Vietnamese.ttf
```

- `--force`: overwrite Vietnamese glyphs even if they already exist (useful when regenerating from a previously generated font).

### 3) Check again after generating

```bash
python3 check_vietnamese_missing.py
```

If generation is fully successful, the final number of missing glyphs should be `0`.

## Glyph Composition Logic (Summary)

`generate_vietnamese_full.py` builds glyphs by **composing** from existing glyph parts in the font:

- Decomposes Vietnamese characters with NFD to identify:
  - base letter (`a`, `e`, `o`, `u`, `i`, ...)
  - shape marks (`breve`, `circumflex`, `horn`)
  - tone marks (`grave`, `acute`, `hook`, `tilde`, `dot below`)
- Builds the shaped base first (for example `ă`, `â`, `ê`, `ô`, `ơ`, `ư`), then applies tone marks.
- For `ơ/ư`, the script constructs the horn automatically if the base font does not provide those glyphs.
- For lowercase `i` with top marks, the script uses `dotlessi` to avoid dot overlap.
- Marks are aligned by bounding boxes and Pixellari's pixel grid, then rounded and overlap-cleaned.

## Adding New Glyph Sets Beyond Vietnamese

1. Open `generate_vietnamese_full.py`.
2. Update the target character set (`VIETNAMESE_REQUIRED`) or add a new constant for another language.
3. If new marks or placement rules are needed:
   - add/update rules in `parse_decomposition`, `shape_base_char`, or `ensure_composed_vietnamese_glyph`.
   - reuse existing helpers (`add_layer_with_alignment`, `add_hook_above`, `add_dot_below`, ...).
4. Regenerate the font and re-run the missing glyph check.

## Notes

- `requirements.txt` only documents minimal Python-level dependencies. In practice, `fontforge` is usually installed via the OS package manager.
- Avoid committing generated font output files for local experiments; commit only after validating rendering in the game.
