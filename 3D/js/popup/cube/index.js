import { CUBE_POPUP_CONSTANTS } from '../../constants.js';
import { CubePopupView } from './view.js';
import { CubePreview3D } from './preview.js';

export class CubePopup {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.view = new CubePopupView(toolbar);
    this.preview = null;
    this.selectedIndex = 0;
  }

  render() {
    const previewCanvas = this.view.render({
      onNChange: (n) => this.handleNChange(n),
      onNavigate: (index) => this.handleNavigation(index),
      onInfo: () => this.showPolycubeInfo(),
      onClear: () => this.resetPopup(),
      onCreate: () => this.createPolycube(),
    });

    this.preview = new CubePreview3D(previewCanvas);
    this.preview.initialize();
    this.view.attachCleanup(() => this.cleanup());
  }

  cleanup() {
    if (this.preview) {
      this.preview.cleanup();
    }
  }

  handleNChange(n) {
    this.preview.updateHighlightedCubes(n);
    this.selectedIndex = this.preview.getHighlightCount() > 0 ? 0 : -1;
    this.preview.updateHighlightColors(this.selectedIndex);
  }

  showPolycubeInfo() {
    const [x, y, z] = this.view.getPositionValues();
    const cubesData = this.preview.getCubesData();
    let infoText = `Position: [${x}, ${y}, ${z}]\nCubes:\n`;
    cubesData.forEach((cube, index) => {
      infoText += `  ${index + 1}: [${cube.join(', ')}]\n`;
    });
    this.view.setInfoText(infoText);
  }

  resetPopup() {
    this.view.resetInputs();
    this.view.setDefaultInfoText();
    this.preview.reset();
    this.selectedIndex = 0;
  }

  createPolycube() {
    const expectedCubeCount = this.view.getNValue();
    const [x, y, z] = this.view.getPositionValues();

    if (expectedCubeCount !== this.preview.getCubeCount()) {
      this.view.setNValue(this.preview.getCubeCount());
    }

    this.toolbar.mainApp.addPolycube({
      n: this.preview.getCubeCount(),
      cubes: this.preview.getCubesData(),
      color: CUBE_POPUP_CONSTANTS.COLORS.CUBE_COLOR,
      position: { x, y, z },
    });

    if (this.toolbar.isMobile) {
      this.toolbar.closePopup('cube');
    }
  }

  handleNavigation(index) {
    const maxCubes = this.view.getNValue();
    const highlightCount = this.preview.getHighlightCount();

    switch (index) {
      case 0:
        if (highlightCount > 0) {
          this.selectedIndex = this.selectedIndex > 0 ? this.selectedIndex - 1 : highlightCount - 1;
        }
        break;
      case 1:
        if (highlightCount > 0) {
          this.selectedIndex = this.selectedIndex < highlightCount - 1 ? this.selectedIndex + 1 : 0;
        }
        break;
      case 2:
        this.selectedIndex = this.preview.selectHighlightedCube(this.selectedIndex, maxCubes);
        break;
      case 3:
        this.preview.undoLastCube(maxCubes);
        this.clampSelectedIndex();
        break;
    }

    this.preview.updateHighlightColors(this.selectedIndex);
  }

  clampSelectedIndex() {
    const highlightCount = this.preview.getHighlightCount();
    if (highlightCount === 0) {
      this.selectedIndex = -1;
      return;
    }
    if (this.selectedIndex >= highlightCount) {
      this.selectedIndex = highlightCount - 1;
    }
    if (this.selectedIndex < 0) {
      this.selectedIndex = 0;
    }
  }
}

export function createCubePopup(toolbar) {
  const popup = new CubePopup(toolbar);
  popup.render();
  return popup;
}
