import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function create3DPopup(toolbar, n, callback) {
	const popupContainer = document.createElement('div');
	popupContainer.id = 'popup3d';
	popupContainer.style.position = 'fixed';
	popupContainer.style.top = '50%';
	popupContainer.style.left = '50%';
	popupContainer.style.transform = 'translate(-50%, -50%)';
	popupContainer.style.width = '80%';
	popupContainer.style.height = '80%';
	popupContainer.style.border = '3px solid #000';
	popupContainer.style.backgroundColor = '#fff';
	popupContainer.style.zIndex = '2000';
	document.body.appendChild(popupContainer);

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, popupContainer.clientWidth / popupContainer.clientHeight, 0.1, 1000);
	camera.position.z = 10;

	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(popupContainer.clientWidth, popupContainer.clientHeight);
	popupContainer.appendChild(renderer.domElement);

	const controls = new OrbitControls(camera, renderer.domElement);

	const gridHelper = new THREE.GridHelper(20, 20);
	scene.add(gridHelper);

	const selectedCoordinates = [];
	const maxSelections = n;

	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	const handleClick = (event) => {
		mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
		mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
		raycaster.setFromCamera(mouse, camera);

		const intersects = raycaster.intersectObject(gridHelper);

		if (intersects.length > 0 && selectedCoordinates.length < maxSelections) {
			const intersect = intersects[0];
			const point = intersect.point.clone().floor();

			const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
			const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
			const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
			cube.position.set(point.x, point.y, point.z);

			scene.add(cube);
			selectedCoordinates.push([point.x, point.y, point.z]);
		}
	};

	renderer.domElement.addEventListener('click', handleClick);

	const animate = function () {
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	};

	animate();

	const closeButton = document.createElement('button');
	closeButton.innerText = 'Close';
	closeButton.style.position = 'absolute';
	closeButton.style.top = '10px';
	closeButton.style.right = '10px';
	closeButton.style.padding = '10px';
	closeButton.style.zIndex = '2001';
	closeButton.addEventListener('click', () => {
		callback(selectedCoordinates);
		document.body.removeChild(popupContainer);
		toolbar.is3DPopupOpen = false;
	});
	popupContainer.appendChild(closeButton);
};
