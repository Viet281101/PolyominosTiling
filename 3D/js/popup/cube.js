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

	const { scene, camera, renderer, cube } = create3DCanvas(popupContainer);

	createTextZone(ctx, 10, 590, popup.width - 20, 150, 'Polycube Info...');

	createButton(ctx, 'Save', 10, 750);
	createButton(ctx, 'Create', 100, 750);

	popup.addEventListener('click', (e) => {
		const rect = popup.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		if (isInside(mouseX, mouseY, { x: 10, y: 750, width: 80, height: 24 })) {
			savePolycubeInfo();
		} else if (isInside(mouseX, mouseY, { x: 100, y: 750, width: 80, height: 24 })) {
			createPolycube(toolbar.mainApp);
		}
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
	canvas3D.width = 370 - 20;
	canvas3D.height = 400;
	canvas3D.style.position = 'absolute';
	canvas3D.style.top = '172px';
	canvas3D.style.left = '10px';
	canvas3D.style.border = '1px solid #000';
	canvas3D.style.zIndex = '1002';
	popupContainer.appendChild(canvas3D);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	const camera = new THREE.PerspectiveCamera(75, canvas3D.width / canvas3D.height, 0.1, 1000);
	camera.position.z = 5;

	const renderer = new THREE.WebGLRenderer({ canvas: canvas3D });
	renderer.setSize(canvas3D.width, canvas3D.height);

	const controls = new OrbitControls(camera, renderer.domElement);

	const geometry = new THREE.BoxGeometry();
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(0, 1, 1).normalize();
	scene.add(light);

	const animate = function () {
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	};
	animate();
	return { scene, camera, renderer, cube };
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
