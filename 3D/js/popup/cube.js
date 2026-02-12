import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createCubePopup(toolbar) {
  const popupContainer = toolbar.createPopupContainer('cubePopup', toolbar.buttons[0].name);
  const popup = popupContainer.querySelector('canvas');
  const ctx = popup.getContext('2d');

  ctx.fillStyle = '#a0a0a0';
  ctx.fillRect(0, 0, popup.width, popup.height);

  const startX = 20;
  const startY = 80;
  const size = 60;
  const headerSpacingOffset = 10;
  const row1Y = startY - 20 + headerSpacingOffset;
  const row2Y = startY + size - 20 + headerSpacingOffset;

  createLabel(popupContainer, 'N° cubes: n =', startX, row1Y);
  createInputField(popupContainer, 160, row1Y, 1);

  createLabel(popupContainer, 'Position x:', startX, row2Y);
  createInputField(popupContainer, 120, row2Y, 0);
  createLabel(popupContainer, 'y:', 180, row2Y);
  createInputField(popupContainer, 200, row2Y, 0);
  createLabel(popupContainer, 'z:', 260, row2Y);
  createInputField(popupContainer, 280, row2Y, 0);

  const { scene, camera, renderer, cubes, highlightCubes, controls, cleanup } =
    create3DCanvas(popupContainer);
  popupContainer.__cleanup = cleanup;

  createTextZone(popupContainer, 10, 660, popup.width - 48, 84, 'Polycube Info...');

  const state = { selectedIndex: 0 };

  createNavigationButtons(popupContainer, ctx, scene, cubes, highlightCubes, state);
  createActionButtons(
    popupContainer,
    toolbar,
    scene,
    cubes,
    highlightCubes,
    state,
    controls
  );

  const nInput = popupContainer.querySelectorAll('input[type="number"]')[0];
  nInput.addEventListener('change', () => {
    const n = parseInt(nInput.value);
    updateHighlightedCubes(scene, cubes, highlightCubes, n);
    state.selectedIndex = 0;
    updateHighlightColors(highlightCubes, state.selectedIndex);
  });
}

function showPolycubeInfo(popupContainer, cubes) {
  const positionInputs = Array.from(popupContainer.querySelectorAll('input[type="number"]')).slice(
    1
  );
  const position = positionInputs.map((input) => parseInt(input.value));
  const cubesData = cubes.map((cube) => cube.position.toArray());
  const textZone = popupContainer.querySelector('.text-zone');
  let infoText = `Position: [${position.join(', ')}]\nCubes:\n`;
  cubesData.forEach((cube, index) => {
    infoText += `  ${index + 1}: [${cube.join(', ')}]\n`;
  });
  textZone.innerText = infoText;
}

function resetCubePopup(popupContainer, scene, cubes, highlightCubes, state, controls) {
  const inputs = popupContainer.querySelectorAll('input[type="number"]');
  inputs.forEach((input) => (input.value = 0));
  inputs[0].value = 1;

  const textZone = popupContainer.querySelector('.text-zone');
  textZone.innerText = 'Polycube Info...';
  cubes.forEach((cube) => scene.remove(cube));
  highlightCubes.forEach((cube) => scene.remove(cube));
  cubes.length = 0;
  highlightCubes.length = 0;

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const cube = new THREE.Mesh(geometry, material);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
  cube.add(edges);
  scene.add(cube);
  cubes.push(cube);
  controls.reset();
  state.selectedIndex = 0;
}

function createInputField(popupContainer, x, y, defaultValue) {
  const input = document.createElement('input');
  input.type = 'number';
  input.value = defaultValue;
  input.style.position = 'absolute';
  input.style.left = `${x}px`;
  input.style.top = `${y}px`;
  input.style.width = '40px';
  input.style.height = '24px';
  input.style.border = '1px solid #000';
  input.style.backgroundColor = '#fff';
  input.style.fontSize = '22px';
  input.style.fontFamily = 'Pixellari';
  input.style.color = '#000';
  input.style.zIndex = '1001';
  input.classList.add('popup-input');
  popupContainer.appendChild(input);
}

function createLabel(popupContainer, text, x, y) {
  const label = document.createElement('div');
  label.textContent = text;
  label.style.position = 'absolute';
  label.style.left = `${x}px`;
  label.style.top = `${y}px`;
  label.style.font = '22px Pixellari';
  label.style.lineHeight = '24px';
  label.style.height = '24px';
  label.style.color = '#000';
  label.style.zIndex = '1001';
  label.style.pointerEvents = 'none';
  popupContainer.appendChild(label);
}

function create3DCanvas(popupContainer) {
  const canvas3D = document.createElement('canvas');
  canvas3D.width = 370 - 24;
  canvas3D.height = 400;
  canvas3D.style.position = 'absolute';
  canvas3D.style.top = '172px';
  canvas3D.style.left = '10px';
  canvas3D.style.border = '2px solid #000';
  canvas3D.style.zIndex = '1002';
  popupContainer.appendChild(canvas3D);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x646464);

  const camera = new THREE.PerspectiveCamera(75, canvas3D.width / canvas3D.height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas3D });
  renderer.setSize(canvas3D.width, canvas3D.height);

  const controls = new OrbitControls(camera, renderer.domElement);

  const cubes = [];
  const highlightCubes = [];

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });

  const cube = new THREE.Mesh(geometry, material);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
  cube.add(edges);
  scene.add(cube);
  cubes.push(cube);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 1, 1).normalize();
  scene.add(light);

  let rafId = null;
  let disposed = false;
  const animate = function () {
    if (disposed) return;
    rafId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
  const cleanup = () => {
    disposed = true;
    if (rafId !== null) cancelAnimationFrame(rafId);
    controls.dispose();
    cubes.forEach((cube) => {
      cube.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    });
    highlightCubes.forEach((cube) => {
      cube.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
    });
    renderer.dispose();
  };
  return { scene, camera, renderer, cubes, highlightCubes, controls, cleanup };
}

function updateHighlightedCubes(scene, cubes, highlightCubes, n) {
  highlightCubes.forEach((cube) => scene.remove(cube));
  highlightCubes.length = 0;

  if (cubes.length >= n) {
    return;
  }

  const offsetPositions = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
  ];

  cubes.forEach((cube) => {
    offsetPositions.forEach((offset) => {
      const newPosition = cube.position.clone().add(offset);
      if (
        !cubes.some((c) => c.position.equals(newPosition)) &&
        !highlightCubes.some((c) => c.position.equals(newPosition))
      ) {
        const newCube = cube.clone();
        newCube.position.copy(newPosition);
        newCube.material = newCube.material.clone();
        newCube.material.color.set(0x0000ff);
        newCube.material.opacity = 0.2;
        newCube.material.transparent = true;
        newCube.visible = true;
        scene.add(newCube);
        highlightCubes.push(newCube);
      }
    });
  });

  highlightCubes.forEach((cube, index) => {
    cube.material.color.set(index === 0 ? 0x0000ff : 0x00ff00);
  });
}

function createTextZone(popupContainer, x, y, width, height, text) {
  const textZone = document.createElement('div');
  textZone.className = 'text-zone';
  textZone.style.position = 'absolute';
  textZone.style.left = `${x}px`;
  textZone.style.top = `${y}px`;
  textZone.style.width = `${width}px`;
  textZone.style.height = `${height}px`;
  textZone.style.overflowY = 'auto';
  textZone.style.backgroundColor = '#fff';
  textZone.style.border = '3px solid #000';
  textZone.style.fontSize = '18px';
  textZone.style.fontFamily = 'Pixellari';
  textZone.style.color = '#000';
  textZone.style.padding = '10px';
  textZone.innerText = text;
  popupContainer.appendChild(textZone);
}

function createActionButtons(popupContainer, toolbar, scene, cubes, highlightCubes, state, controls) {
  const buttonContainer = document.createElement('div');
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.left = '10px';
  buttonContainer.style.top = '800px';
  buttonContainer.style.width = '350px';
  buttonContainer.style.height = '32px';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '8px';
  buttonContainer.style.zIndex = '1002';
  popupContainer.appendChild(buttonContainer);

  const createActionButton = (label, onClick) => {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.width = '110px';
    button.style.height = '32px';
    button.style.border = '1px solid #000';
    button.style.backgroundColor = '#00f';
    button.style.color = '#fff';
    button.style.font = '22px Pixellari';
    button.style.cursor = 'pointer';
    button.addEventListener('click', onClick);
    buttonContainer.appendChild(button);
  };

  createActionButton('Info', () => showPolycubeInfo(popupContainer, cubes));
  createActionButton('Clear', () =>
    resetCubePopup(popupContainer, scene, cubes, highlightCubes, state, controls)
  );
  createActionButton('Create', () => {
    const nInput = popupContainer.querySelectorAll('input[type="number"]')[0];
    const n = parseInt(nInput.value);
    const positionInputs = Array.from(popupContainer.querySelectorAll('input[type="number"]')).slice(
      1
    );
    const position = positionInputs.map((input) => parseInt(input.value));
    const cubesData = cubes.map((cube) => cube.position.toArray());
    if (n !== cubes.length) {
      nInput.value = cubes.length;
    }
    toolbar.mainApp.addPolycube({
      n: cubes.length,
      cubes: cubesData,
      color: 0x00ff00,
      position: { x: position[0], y: position[1], z: position[2] },
    });
    if (toolbar.isMobile) toolbar.closePopup('cube');
  });
}

function createNavigationButtons(popupContainer, ctx, scene, cubes, highlightCubes, state) {
  const buttonContainer = document.createElement('div');
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.top = '580px';
  buttonContainer.style.left = '10px';
  buttonContainer.style.width = '350px';
  buttonContainer.style.height = '46px';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-between';
  buttonContainer.style.alignItems = 'center';
  popupContainer.appendChild(buttonContainer);

  const labels = ['Previous', 'Next', 'Select', 'Undo'];
  const icons = ['arrow_left', 'arrow_right', 'select', 'reset'];

  labels.forEach((label, index) => {
    const labelText = document.createElement('span');
    labelText.style.font = '14px Pixellari';
    labelText.textContent = label;
    buttonContainer.appendChild(labelText);

    const button = document.createElement('img');
    button.src = `../assets/ic_${icons[index]}.png`;
    button.width = 40;
    button.height = 40;
    button.style.cursor = 'pointer';
    button.addEventListener('click', () =>
      handleButtonClick(index, scene, highlightCubes, cubes, state)
    );
    buttonContainer.appendChild(button);
  });
}

function handleButtonClick(index, scene, highlightCubes, cubes, state) {
  const n = parseInt(document.querySelector('input[type="number"]').value);
  switch (index) {
    case 0:
      state.selectedIndex =
        state.selectedIndex > 0 ? state.selectedIndex - 1 : highlightCubes.length - 1;
      break;
    case 1:
      state.selectedIndex =
        state.selectedIndex < highlightCubes.length - 1 ? state.selectedIndex + 1 : 0;
      break;
    case 2:
      if (highlightCubes.length > 0) {
        const selectedCube = highlightCubes[state.selectedIndex];
        selectedCube.material.opacity = 1.0;
        selectedCube.material.transparent = false;
        selectedCube.material.color.set(0x00ff00);
        cubes.push(selectedCube);
        highlightCubes.splice(state.selectedIndex, 1);
        if (state.selectedIndex >= highlightCubes.length) {
          state.selectedIndex = highlightCubes.length - 1;
        }
        if (cubes.length >= n) {
          highlightCubes.forEach((cube) => scene.remove(cube));
          highlightCubes.length = 0;
        } else {
          updateHighlightedCubes(scene, cubes, highlightCubes, n);
        }
      }
      break;
    case 3:
      if (cubes.length > 1) {
        const removedCube = cubes.pop();
        scene.remove(removedCube);
        updateHighlightedCubes(scene, cubes, highlightCubes, n);
      }
      break;
  }
  updateHighlightColors(highlightCubes, state.selectedIndex);
}

function updateHighlightColors(highlightCubes, selectedIndex) {
  highlightCubes.forEach((cube, index) => {
    cube.material.color.set(index === selectedIndex ? 0x0000ff : 0x00ff00);
  });
}
