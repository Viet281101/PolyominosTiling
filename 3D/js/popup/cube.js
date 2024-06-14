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
	ctx.font = '20px Pixellari';
	ctx.fillStyle = '#000';
	ctx.fillText('N° cubes: n = ', startX, startY);
	createInputField(popupContainer, 140, startY - 20, 1);

	ctx.fillText('Position x:', startX, startY + size);
	createInputField(popupContainer, 110, (startY + size) - 20, 0);
	ctx.fillText('y:', 170, startY + size);
	createInputField(popupContainer, 190, (startY + size) - 20, 0);
	ctx.fillText('z:', 250, startY + size);
	createInputField(popupContainer, 270, (startY + size) - 20, 0);

	const { scene, camera, renderer, cubes, highlightCubes, selectedIndex } = create3DCanvas(popupContainer);

	createTextZone(ctx, 10, 660, popup.width - 20, 150, 'Polycube Info...');

	createButton(ctx, 'Save', 10, 820);
	createButton(ctx, 'Create', 100, 820);

	createNavigationButtons(popupContainer, ctx, scene, cubes, highlightCubes, selectedIndex);

	popup.addEventListener('click', (e) => {
		const rect = popup.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		if (isInside(mouseX, mouseY, { x: 10, y: 820, width: 80, height: 24 })) {
			savePolycubeInfo();
		} else if (isInside(mouseX, mouseY, { x: 100, y: 820, width: 80, height: 24 })) {
			const n = parseInt(popupContainer.querySelectorAll('input[type="number"]')[0].value);
			const positionInputs = Array.from(popupContainer.querySelectorAll('input[type="number"]')).slice(1);
			const position = positionInputs.map(input => parseInt(input.value));
			const cubesData = cubes.map(cube => cube.position.toArray());

			toolbar.mainApp.addPolycube({ n, cubes: cubesData, color: 0x00ff00, position: { x: position[0], y: position[1], z: position[2] } });
		}
	});

	const nInput = popupContainer.querySelectorAll('input[type="number"]')[0];
	nInput.addEventListener('change', () => {
		const n = parseInt(nInput.value);
		updateHighlightedCubes(scene, cubes, highlightCubes, n);
	});
};

function isInside(x, y, rect) {
	return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
};

function savePolycubeInfo() {

};

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
};

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
	let selectedIndex = 0;

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

	const animate = function () {
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	};
	animate();
	return { scene, camera, renderer, cubes, highlightCubes, selectedIndex };
};

function updateHighlightedCubes(scene, cubes, highlightCubes, n) {
	highlightCubes.forEach(cube => scene.remove(cube));
	highlightCubes.length = 0;

	if (cubes.length >= n) { return; }

	const offsetPositions = [
		new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0),
		new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0),
		new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
	];

	cubes.forEach(cube => {
		offsetPositions.forEach(offset => {
			const newPosition = cube.position.clone().add(offset);
			if (!cubes.some(c => c.position.equals(newPosition)) && !highlightCubes.some(c => c.position.equals(newPosition))) {
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
	updateHighlightColors(highlightCubes, 0);
};

function createTextZone(ctx, x, y, width, height, text) {
	ctx.fillStyle = '#fff';
	ctx.fillRect(x, y, width, height);
	ctx.strokeStyle = '#000';
	ctx.strokeRect(x, y, width, height);
	ctx.fillStyle = '#000';
	ctx.font = '18px Pixellari';
	ctx.fillText(text, x + 10, y + 20);
};

function createButton(ctx, label, x, y, width = 80, height = 24) {
	ctx.fillStyle = '#00f';
	ctx.fillRect(x, y, width, height);
	ctx.strokeStyle = '#000';
	ctx.strokeRect(x, y, width, height);
	ctx.fillStyle = '#fff';
	ctx.font = '18px Pixellari';
	ctx.fillText(label, x + 10, y + 18);
};

function createNavigationButtons(popupContainer, ctx, scene, cubes, highlightCubes, selectedIndex) {
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
		button.addEventListener('click', () => handleButtonClick(index, scene, highlightCubes, cubes, selectedIndex));
		buttonContainer.appendChild(button);
	});
};

function handleButtonClick(index, scene, highlightCubes, cubes, selectedIndex) {
	const n = parseInt(document.querySelector('input[type="number"]').value);
	switch (index) {
		case 0:
			selectedIndex = (selectedIndex > 0) ? selectedIndex - 1 : highlightCubes.length - 1;
			break;
		case 1:
			selectedIndex = (selectedIndex < highlightCubes.length - 1) ? selectedIndex + 1 : 0;
			break;
		case 2:
			if (highlightCubes.length > 0) {
				const selectedCube = highlightCubes[selectedIndex];
				selectedCube.material.opacity = 1.0;
				selectedCube.material.transparent = false;
				selectedCube.material.color.set(0x00ff00);
				cubes.push(selectedCube);
				highlightCubes.splice(selectedIndex, 1);
				if (selectedIndex >= highlightCubes.length) {
					selectedIndex = highlightCubes.length - 1;
				}
				if (cubes.length >= n) {
					highlightCubes.forEach(cube => scene.remove(cube));
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
	updateHighlightColors(highlightCubes, selectedIndex);
};

function updateHighlightColors(highlightCubes, selectedIndex) {
	highlightCubes.forEach((cube, index) => {
		cube.material.color.set(index === selectedIndex ? 0x0000ff : 0x00ff00);
	});
};
