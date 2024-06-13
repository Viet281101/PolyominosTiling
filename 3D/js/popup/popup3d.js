import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function create3DPopup(toolbar, n, callback) {
	const popupContainer = document.createElement('div');
	popupContainer.style.position = 'fixed';
	popupContainer.style.top = '50%';
	popupContainer.style.left = '50%';
	popupContainer.style.transform = 'translate(-50%, -50%)';
	popupContainer.style.width = '80%';
	popupContainer.style.height = '80%';
	popupContainer.style.border = '3px solid #000';
	popupContainer.style.backgroundColor = '#fff';
	popupContainer.style.zIndex = '1000';
	document.body.appendChild(popupContainer);

	const closeButton = document.createElement('button');
	closeButton.innerText = 'Close';
	closeButton.style.position = 'absolute';
	closeButton.style.top = '10px';
	closeButton.style.right = '10px';
	closeButton.style.zIndex = '1001';
	closeButton.style.cursor = 'pointer';
	closeButton.addEventListener('click', () => {
		document.body.removeChild(popupContainer);
	});
	popupContainer.appendChild(closeButton);

	const saveButton = document.createElement('button');
	saveButton.innerText = 'Save';
	saveButton.style.position = 'absolute';
	saveButton.style.top = '10px';
	saveButton.style.right = '80px';
	saveButton.style.zIndex = '1001';
	saveButton.style.cursor = 'pointer';
	saveButton.addEventListener('click', () => {
		callback(selectedCubes);
		document.body.removeChild(popupContainer);
	});
	popupContainer.appendChild(saveButton);

	const canvas = document.createElement('canvas');
	canvas.width = popupContainer.clientWidth;
	canvas.height = popupContainer.clientHeight;
	popupContainer.appendChild(canvas);

	const renderer = new THREE.WebGLRenderer({ canvas });
	renderer.setSize(canvas.width, canvas.height);

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
	camera.position.set(5, 5, 5);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;

	const gridHelper = new THREE.GridHelper(20, 20);
	scene.add(gridHelper);

	const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
	const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
	const selectedCubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });

	let selectedCubes = [];

	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	function onMouseClick(event) {
		mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
		mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);

		const intersects = raycaster.intersectObjects(scene.children);
		if (intersects.length > 0) {
			const intersect = intersects[0];
			const position = new THREE.Vector3().copy(intersect.point).floor().addScalar(0.5);

			const existingCube = selectedCubes.find(cube => cube.position.equals(position));
			if (existingCube) {
				scene.remove(existingCube);
				selectedCubes = selectedCubes.filter(cube => !cube.position.equals(position));
			} else if (selectedCubes.length < n) {
				const cube = new THREE.Mesh(cubeGeometry, selectedCubeMaterial);
				cube.position.copy(position);
				scene.add(cube);
				selectedCubes.push(cube);
			}
		}
	}

	canvas.addEventListener('click', onMouseClick);

	function animate() {
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	}

	animate();
};
