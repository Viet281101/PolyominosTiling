import * as THREE from 'three';

export const NAV_ITEMS = [
  { label: 'Previous', icon: 'arrow_left' },
  { label: 'Next', icon: 'arrow_right' },
  { label: 'Select', icon: 'select' },
  { label: 'Undo', icon: 'reset' },
];

export const FORM_FIELD_LAYOUT = [
  { label: 'N° cubes: n =', labelX: 20, inputX: 160, defaultValue: 1, row: 1 },
  { label: 'Position x:', labelX: 20, inputX: 120, defaultValue: 0, row: 2 },
  { label: 'y:', labelX: 180, inputX: 200, defaultValue: 0, row: 2 },
  { label: 'z:', labelX: 260, inputX: 280, defaultValue: 0, row: 2 },
];

export const PREVIEW_OFFSETS = [
  new THREE.Vector3(1, 0, 0),
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(0, -1, 0),
  new THREE.Vector3(0, 0, 1),
  new THREE.Vector3(0, 0, -1),
];

export function applyStyles(element, styles) {
  Object.assign(element.style, styles);
}

export function parseNumberInput(input, fallback) {
  if (!input) return fallback;
  const parsed = parseInt(input.value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}
