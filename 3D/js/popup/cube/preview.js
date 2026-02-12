import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CUBE_POPUP_CONSTANTS } from '../../constants.js';
import { PREVIEW_OFFSETS } from './helpers.js';

export class CubePreview3D {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.cubes = [];
    this.highlightCubes = [];
    this.rafId = null;
    this.disposed = false;
  }

  initialize() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CUBE_POPUP_CONSTANTS.PREVIEW.BACKGROUND_COLOR);

    const { CAMERA, LIGHT } = CUBE_POPUP_CONSTANTS.PREVIEW;
    this.camera = new THREE.PerspectiveCamera(
      CAMERA.FOV,
      this.canvas.width / this.canvas.height,
      CAMERA.NEAR,
      CAMERA.FAR
    );
    this.camera.position.z = CAMERA.Z;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    const light = new THREE.DirectionalLight(LIGHT.COLOR, LIGHT.INTENSITY);
    light.position.set(LIGHT.POSITION.x, LIGHT.POSITION.y, LIGHT.POSITION.z).normalize();
    this.scene.add(light);

    this.createInitialCube();
    this.animate();
  }

  createInitialCube() {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: CUBE_POPUP_CONSTANTS.COLORS.CUBE_COLOR });
    const edgeMaterial = new THREE.LineBasicMaterial({ color: CUBE_POPUP_CONSTANTS.COLORS.EDGE_COLOR });
    const cube = new THREE.Mesh(geometry, material);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMaterial);
    cube.add(edges);
    this.scene.add(cube);
    this.cubes.push(cube);
  }

  animate = () => {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  getCubeCount() {
    return this.cubes.length;
  }

  getHighlightCount() {
    return this.highlightCubes.length;
  }

  getCubesData() {
    return this.cubes.map((cube) => cube.position.toArray());
  }

  reset() {
    this.clearSceneCubes(this.cubes);
    this.clearSceneCubes(this.highlightCubes);
    this.cubes.length = 0;
    this.highlightCubes.length = 0;
    this.createInitialCube();
    this.controls.reset();
  }

  updateHighlightedCubes(maxCubes) {
    this.clearSceneCubes(this.highlightCubes);
    this.highlightCubes.length = 0;

    if (this.cubes.length >= maxCubes) {
      return;
    }

    this.cubes.forEach((cube) => {
      PREVIEW_OFFSETS.forEach((offset) => {
        const newPosition = cube.position.clone().add(offset);
        const existedInCubes = this.cubes.some((currentCube) =>
          currentCube.position.equals(newPosition)
        );
        const existedInHighlights = this.highlightCubes.some((currentCube) =>
          currentCube.position.equals(newPosition)
        );

        if (!existedInCubes && !existedInHighlights) {
          const newCube = cube.clone();
          newCube.position.copy(newPosition);
          newCube.material = newCube.material.clone();
          newCube.material.color.set(CUBE_POPUP_CONSTANTS.COLORS.HIGHLIGHT_COLOR);
          newCube.material.opacity = CUBE_POPUP_CONSTANTS.COLORS.HIGHLIGHT_DIM_OPACITY;
          newCube.material.transparent = true;
          this.scene.add(newCube);
          this.highlightCubes.push(newCube);
        }
      });
    });
  }

  updateHighlightColors(selectedIndex) {
    this.highlightCubes.forEach((cube, index) => {
      const color =
        index === selectedIndex
          ? CUBE_POPUP_CONSTANTS.COLORS.HIGHLIGHT_COLOR
          : CUBE_POPUP_CONSTANTS.COLORS.CUBE_COLOR;
      cube.material.color.set(color);
    });
  }

  selectHighlightedCube(selectedIndex, maxCubes) {
    if (this.highlightCubes.length === 0 || selectedIndex < 0) {
      return selectedIndex;
    }

    const selectedCube = this.highlightCubes[selectedIndex];
    selectedCube.material.opacity = 1.0;
    selectedCube.material.transparent = false;
    selectedCube.material.color.set(CUBE_POPUP_CONSTANTS.COLORS.CUBE_COLOR);
    this.cubes.push(selectedCube);
    this.highlightCubes.splice(selectedIndex, 1);

    if (selectedIndex >= this.highlightCubes.length) {
      selectedIndex = this.highlightCubes.length - 1;
    }

    if (this.cubes.length >= maxCubes) {
      this.clearSceneCubes(this.highlightCubes);
      this.highlightCubes.length = 0;
      return selectedIndex;
    }

    this.updateHighlightedCubes(maxCubes);
    return selectedIndex;
  }

  undoLastCube(maxCubes) {
    if (this.cubes.length <= 1) {
      return;
    }
    const removedCube = this.cubes.pop();
    this.scene.remove(removedCube);
    this.updateHighlightedCubes(maxCubes);
  }

  clearSceneCubes(cubeList) {
    cubeList.forEach((cube) => this.scene.remove(cube));
  }

  cleanup() {
    this.disposed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.controls) {
      this.controls.dispose();
    }

    const disposeCube = (cube) => {
      cube.traverse((obj) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((material) => material.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    };

    this.cubes.forEach(disposeCube);
    this.highlightCubes.forEach(disposeCube);

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
