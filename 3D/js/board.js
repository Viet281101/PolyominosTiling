import * as THREE from 'three';

export class Board {
  constructor(scene, size = { x: 10, y: 10, z: 10 }) {
    this.scene = scene;
    this.size = size;
    this.grid = new THREE.Group();
    this.innerGrid = new THREE.Group();
    this.showInnerGrid = false;
    this.showOuterGrid = true;

    this.createGridBox(size);

    this.scene.add(this.grid);
    if (this.showInnerGrid) {
      this.scene.add(this.innerGrid);
    }
  }

  createGridBox(size) {
    const gridMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const gridStep = 1;

    for (let i = -size.x / 2; i <= size.x / 2; i += gridStep) {
      this.addLine(
        gridMaterial,
        [i, -size.y / 2, -size.z / 2],
        [i, size.y / 2, -size.z / 2],
        this.grid
      );
      this.addLine(
        gridMaterial,
        [i, -size.y / 2, size.z / 2],
        [i, size.y / 2, size.z / 2],
        this.grid
      );
      this.addLine(
        gridMaterial,
        [i, -size.y / 2, -size.z / 2],
        [i, -size.y / 2, size.z / 2],
        this.grid
      );
      this.addLine(
        gridMaterial,
        [i, size.y / 2, -size.z / 2],
        [i, size.y / 2, size.z / 2],
        this.grid
      );
    }

    for (let j = -size.y / 2; j <= size.y / 2; j += gridStep) {
      this.addLine(
        gridMaterial,
        [-size.x / 2, j, -size.z / 2],
        [size.x / 2, j, -size.z / 2],
        this.grid
      );
      this.addLine(
        gridMaterial,
        [-size.x / 2, j, size.z / 2],
        [size.x / 2, j, size.z / 2],
        this.grid
      );
      this.addLine(
        gridMaterial,
        [-size.x / 2, j, -size.z / 2],
        [-size.x / 2, j, size.z / 2],
        this.grid
      );
      this.addLine(
        gridMaterial,
        [size.x / 2, j, -size.z / 2],
        [size.x / 2, j, size.z / 2],
        this.grid
      );
    }

    for (let k = -size.z / 2; k <= size.z / 2; k += gridStep) {
      this.addLine(
        gridMaterial,
        [-size.x / 2, -size.y / 2, k],
        [size.x / 2, -size.y / 2, k],
        this.grid
      );
      this.addLine(
        gridMaterial,
        [-size.x / 2, size.y / 2, k],
        [size.x / 2, size.y / 2, k],
        this.grid
      );
      this.addLine(
        gridMaterial,
        [-size.x / 2, -size.y / 2, k],
        [-size.x / 2, size.y / 2, k],
        this.grid
      );
      this.addLine(
        gridMaterial,
        [size.x / 2, -size.y / 2, k],
        [size.x / 2, size.y / 2, k],
        this.grid
      );
    }

    for (let x = -size.x / 2 + gridStep; x < size.x / 2; x += gridStep) {
      for (let y = -size.y / 2 + gridStep; y < size.y / 2; y += gridStep) {
        for (let z = -size.z / 2 + gridStep; z < size.z / 2; z += gridStep) {
          this.addLine(gridMaterial, [x, y, -size.z / 2], [x, y, size.z / 2], this.innerGrid);
          this.addLine(gridMaterial, [x, -size.y / 2, z], [x, size.y / 2, z], this.innerGrid);
          this.addLine(gridMaterial, [-size.x / 2, y, z], [size.x / 2, y, z], this.innerGrid);
        }
      }
    }
  }

  addLine(material, start, end, group) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(...start),
      new THREE.Vector3(...end),
    ]);
    const line = new THREE.Line(geometry, material);
    group.add(line);
  }

  toggleInnerGrid(show) {
    this.showInnerGrid = show;
    if (show) {
      this.scene.add(this.innerGrid);
    } else {
      this.scene.remove(this.innerGrid);
    }
  }

  toggleOuterGrid(show) {
    this.showOuterGrid = show;
    if (show) {
      this.scene.add(this.grid);
    } else {
      this.scene.remove(this.grid);
    }
  }

  clearGrid() {
    while (this.grid.children.length > 0) {
      this.grid.remove(this.grid.children[0]);
    }
    while (this.innerGrid.children.length > 0) {
      this.innerGrid.remove(this.innerGrid.children[0]);
    }
    this.scene.remove(this.grid);
    this.scene.remove(this.innerGrid);
  }
}
