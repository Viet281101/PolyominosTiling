import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Board } from './board.js';
import { GUIController } from './gui.js';
import { Toolbar } from './toolbar.js';
import { Polycube } from './polycube.js';

class MainApp {
  constructor() {
    this.selectedPolycube = null;
    this.isDragging = false;
    this.isRightClick = false;
    this.polys = [];

    this.animate = this.animate.bind(this);

    this.frameCount = 0;
    this.lastFpsSampleTime = performance.now();
    this.isPageHidden = document.hidden;
    this.needsRender = true;
    this.rafId = null;
    this.isCameraInteracting = false;
    this.showFpsDebug = true;
    this.raycaster = new THREE.Raycaster();
    this.mouseNdc = new THREE.Vector2();
    this.dragMoveVector = new THREE.Vector3();
    this.pickableMeshes = [];
    this.meshToPolycube = new WeakMap();

    this.init();
    this.requestRender();
    this.eventListener();
  }

  init() {
    Object.assign(document.body.style, {
      margin: '0',
      padding: '0',
      overflow: 'hidden',
    });
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 15;

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('myCanvas'),
      antialias: false,
      powerPreference: 'low-power',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.setClearColor('#c3c3c3');

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener('change', () => this.requestRender());
    this.controls.addEventListener('start', () => {
      this.isCameraInteracting = true;
    });
    this.controls.addEventListener('end', () => {
      this.isCameraInteracting = false;
      this.requestRender();
      this.fpsLabel.textContent = 'FPS: 0';
    });

    this.board = new Board(this.scene, { x: 3, y: 3, z: 3 });
    this.guiController = new GUIController(this);
    this.toolbar = new Toolbar(this);

    this.createFpsDebugLabel();
  }

  createFpsDebugLabel() {
    this.fpsLabel = document.createElement('div');
    this.fpsLabel.id = 'fps-debug-label';
    this.fpsLabel.textContent = 'FPS: --';
    this.fpsLabel.style.display = this.showFpsDebug ? 'block' : 'none';
    document.body.appendChild(this.fpsLabel);
  }

  toggleFpsDebugLabel(visible) {
    this.showFpsDebug = visible;
    if (this.fpsLabel) {
      this.fpsLabel.style.display = visible ? 'block' : 'none';
    }
  }

  eventListener() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false);
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this), false);
    this.renderer.domElement.addEventListener(
      'contextmenu',
      (event) => {
        event.preventDefault();
      },
      false
    );
  }

  onVisibilityChange() {
    this.isPageHidden = document.hidden;
    if (!this.isPageHidden) {
      this.lastFpsSampleTime = performance.now();
      this.frameCount = 0;
      this.fpsLabel.textContent = 'FPS: 0';
      this.requestRender();
    } else {
      this.fpsLabel.textContent = 'FPS: paused';
    }
  }

  addPolycube(cubeData) {
    const polycube = new Polycube(cubeData);
    this.scene.add(polycube.group);
    this.polys.push(polycube);
    this.registerPolycubeForPicking(polycube);
    this.requestRender();
  }

  registerPolycubeForPicking(polycube) {
    polycube.group.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        this.pickableMeshes.push(child);
        this.meshToPolycube.set(child, polycube);
      }
    });
  }

  unregisterPolycubeForPicking(polycube) {
    this.pickableMeshes = this.pickableMeshes.filter((mesh) => {
      if (this.meshToPolycube.get(mesh) === polycube) {
        this.meshToPolycube.delete(mesh);
        return false;
      }
      return true;
    });
  }

  positionToKey(position) {
    const rx = Math.round(position.x * 1000) / 1000;
    const ry = Math.round(position.y * 1000) / 1000;
    const rz = Math.round(position.z * 1000) / 1000;
    return `${rx}|${ry}|${rz}`;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    if (this.toolbar) this.toolbar.resizeToolbar();
    if (this.guiController) this.guiController.checkWindowSize();
    this.requestRender();
  }

  requestRender() {
    this.needsRender = true;
    if (this.rafId === null && !this.isPageHidden) {
      this.rafId = requestAnimationFrame(this.animate);
    }
  }

  animate(time = performance.now()) {
    this.rafId = null;

    if (this.isPageHidden) {
      return;
    }

    if (!this.needsRender) {
      return;
    }
    this.needsRender = false;

    this.renderer.render(this.scene, this.camera);
    this.updateFpsLabel(time);

    if (this.controls.enableDamping || this.controls.autoRotate) {
      this.requestRender();
      return;
    }

    if (!this.isCameraInteracting) {
      this.fpsLabel.textContent = 'FPS: 0';
    }
  }

  updateFpsLabel(time) {
    this.frameCount += 1;
    const elapsed = time - this.lastFpsSampleTime;

    if (elapsed >= 500) {
      const fps = (this.frameCount * 1000) / elapsed;
      this.fpsLabel.textContent = `FPS: ${fps.toFixed(1)}`;
      this.frameCount = 0;
      this.lastFpsSampleTime = time;
    }
  }

  onMouseDown(event) {
    event.preventDefault();
    this.mouseNdc.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    this.raycaster.setFromCamera(this.mouseNdc, this.camera);
    const intersects = this.raycaster.intersectObjects(this.pickableMeshes, false);

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      const intersectedPolycube = this.meshToPolycube.get(intersectedObject);
      if (!intersectedPolycube) {
        this.deselectPolycube();
        this.controls.enabled = true;
        this.requestRender();
        return;
      }
      if (intersectedPolycube !== this.selectedPolycube) {
        this.deselectPolycube();
        this.selectPolycube(intersectedPolycube);
      }

      this.isDragging = true;
      this.controls.enabled = false;

      if (event.button === 2) {
        this.isRightClick = true;
      }

      this.lastMousePosition = { x: event.clientX, y: event.clientY };
      this.lastValidPosition = this.selectedPolycube.group.position.clone();
    } else {
      this.deselectPolycube();
      this.controls.enabled = true;
    }
    this.requestRender();
  }

  onMouseMove(event) {
    if (!this.isDragging || !this.selectedPolycube) return;

    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    if (this.isRightClick) {
      const deltaX = event.clientX - this.lastMousePosition.x;
      const deltaY = event.clientY - this.lastMousePosition.y;

      this.dragMoveVector.set(deltaX * 0.01, -deltaY * 0.01, 0);
      this.dragMoveVector.applyQuaternion(this.camera.quaternion);
      this.selectedPolycube.group.position.add(this.dragMoveVector);

      this.lastMousePosition = { x: event.clientX, y: event.clientY };
    } else {
      this.selectedPolycube.group.rotation.y += movementX * 0.01;
      this.selectedPolycube.group.rotation.x += movementY * 0.01;
    }
    this.requestRender();
  }

  onMouseUp(event) {
    if (this.isRightClick && this.selectedPolycube) {
      if (this.snapToGrid(this.selectedPolycube)) {
        this.lastValidPosition = this.selectedPolycube.group.position.clone();
      } else {
        this.selectedPolycube.group.position.copy(this.lastValidPosition);
      }
    }
    this.isDragging = false;
    this.isRightClick = false;
    this.controls.enabled = true;
    this.requestRender();
  }

  selectPolycube(polycube) {
    this.selectedPolycube = polycube;
    this.selectedPolycube.group.children.forEach((child) => {
      if (child instanceof THREE.LineSegments) {
        child.material.color.set(0xffffff);
      }
    });
  }

  deselectPolycube() {
    if (this.selectedPolycube) {
      this.selectedPolycube.group.children.forEach((child) => {
        if (child instanceof THREE.LineSegments) {
          child.material.color.set(0x000000);
        }
      });
      this.selectedPolycube = null;
    }
  }

  snapToGrid(polycube) {
    const gridSize = 1;
    const group = polycube.group;
    const size = this.board.size;

    const offsetX = size.x % 2 === 0 ? gridSize / 2 : 0;
    const offsetY = size.y % 2 === 0 ? gridSize / 2 : 0;
    const offsetZ = size.z % 2 === 0 ? gridSize / 2 : 0;

    const newPosition = new THREE.Vector3(
      Math.round((group.position.x - offsetX) / gridSize) * gridSize + offsetX,
      Math.round((group.position.y - offsetY) / gridSize) * gridSize + offsetY,
      Math.round((group.position.z - offsetZ) / gridSize) * gridSize + offsetZ
    );

    const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(group.quaternion);
    const decomposed = {
      scale: new THREE.Vector3(),
      position: new THREE.Vector3(),
      rotation: new THREE.Quaternion(),
    };
    rotationMatrix.decompose(decomposed.position, decomposed.rotation, decomposed.scale);

    const euler = new THREE.Euler().setFromQuaternion(decomposed.rotation, 'XYZ');
    euler.x = Math.round(euler.x / (Math.PI / 2)) * (Math.PI / 2);
    euler.y = Math.round(euler.y / (Math.PI / 2)) * (Math.PI / 2);
    euler.z = Math.round(euler.z / (Math.PI / 2)) * (Math.PI / 2);

    group.setRotationFromEuler(euler);

    const occupiedPositions = new Set();
    const tempPosition = new THREE.Vector3();
    this.polys.forEach((otherPolycube) => {
      if (otherPolycube === polycube) return;
      otherPolycube.cubeData.cubes.forEach((coord) => {
        const [x, y, z] = coord;
        tempPosition.set(x, y, z);
        tempPosition.applyEuler(otherPolycube.group.rotation);
        tempPosition.add(otherPolycube.group.position);
        occupiedPositions.add(this.positionToKey(tempPosition));
      });
    });

    const newCubeKeys = polycube.cubeData.cubes.map((coord) => {
      const [x, y, z] = coord;
      tempPosition.set(x, y, z);
      tempPosition.applyEuler(group.rotation);
      tempPosition.add(newPosition);
      return this.positionToKey(tempPosition);
    });

    const overlapping = newCubeKeys.some((key) => occupiedPositions.has(key));
    if (overlapping) {
      return false;
    } else {
      group.position.copy(newPosition);
      return true;
    }
  }

  updatePolycubeColor(color) {
    if (this.selectedPolycube) {
      this.selectedPolycube.group.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.color.set(color);
        }
      });
      this.requestRender();
    }
  }
  updatePolycubeOpacity(opacity) {
    if (this.selectedPolycube) {
      this.selectedPolycube.group.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.opacity = opacity;
          child.material.transparent = opacity < 1;
        }
      });
      this.requestRender();
    }
  }

  clearBoard() {
    this.board.clearGrid();
    this.board = null;
    this.requestRender();
  }
  createNewBoard(x, y, z) {
    const showInnerGrid = this.board ? this.board.showInnerGrid : false;
    const showOuterGrid = this.board ? this.board.showOuterGrid : true;
    if (this.board) {
      this.clearBoard();
    }
    this.board = new Board(this.scene, { x, y, z });
    this.board.toggleInnerGrid(showInnerGrid);
    this.board.toggleOuterGrid(showOuterGrid);
    this.requestRender();
  }

  deleteSelectedPolycube() {
    if (this.selectedPolycube) {
      this.unregisterPolycubeForPicking(this.selectedPolycube);
      this.scene.remove(this.selectedPolycube.group);
      const index = this.polys.indexOf(this.selectedPolycube);
      if (index > -1) {
        this.polys.splice(index, 1);
      }
      this.selectedPolycube = null;
      this.requestRender();
    }
  }

  toggleSelectedPolycubeVisibility(visible) {
    if (this.selectedPolycube) {
      this.selectedPolycube.group.visible = visible;
      this.requestRender();
    }
  }

  toggleAllCubesVisibility(visible) {
    this.polys.forEach((polycube) => {
      polycube.group.visible = visible;
    });
    this.requestRender();
  }
}

const app = new MainApp();
