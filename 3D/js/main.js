import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Board } from './board.js';
import { GUIController } from './gui.js';

class MainApp {
	constructor() {
		this.init();
		this.animate();
	};

	init() {
		Object.assign(document.body.style, { margin: '0', padding: '0', overflow: 'hidden' });
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		this.camera.position.z = 15;

		this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('myCanvas') });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor('#c3c3c3');

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.board = new Board(this.scene);
		this.guiController = new GUIController(this);

		window.addEventListener('resize', this.onWindowResize.bind(this), false);
	};

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	};

	updateGridSize(size) {
		this.board.grid.scale.set(size / 10, size / 10, size / 10);
	};

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.renderer.render(this.scene, this.camera);
	};
};

const app = new MainApp();
