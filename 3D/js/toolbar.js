import { createCubePopup } from './popup/cube.js';
import { showGridPopup } from './popup/grid.js';
import { showSolvePopup } from './popup/solve.js';
import { showTutorialPopup } from './popup/tutorial.js';
import { showSettingsPopup } from './popup/setting.js';

export class Toolbar {
  constructor(mainApp) {
    this.mainApp = mainApp;
    this.isMobile = this.checkIfMobile();
    this.iconCache = new Map();
    this.documentListenersAttached = false;
    this.currentPopupType = null;
    this.currentPopupElement = null;
    this.handleCanvasMouseMoveBound = (e) => this.handleCanvasMouseMove(e);
    this.handleCanvasMouseLeaveBound = () => this.handleCanvasMouseLeave();
    this.handleCanvasClickBound = (e) => this.handleCanvasClick(e);
    this.handleDocumentClickBound = (e) => this.handleDocumentClick(e);
    this.setupCanvas();
    this.buttons = this.createButtons();
    this.popupOpen = false;
    this.currentCloseIcon = null;
    this.homeButtonRect = this.isMobile
      ? { x: 10, y: 10, width: 40, height: 40 }
      : { x: 10, y: 10, width: 40, height: 40 };
    this.createTooltip();
    this.drawToolbar();
    this.addEventListeners();
    this.addHomeButton();

    requestAnimationFrame(() => this.resizeToolbar());
    window.addEventListener('load', () => this.resizeToolbar(), { once: true });
    setTimeout(() => this.resizeToolbar(), 120);
    setTimeout(() => this.resizeToolbar(), 360);
  }

  checkIfMobile() {
    return window.innerWidth <= 800;
  }
  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.position = 'fixed';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.display = 'block';
    this.canvas.style.zIndex = '2';
    document.body.appendChild(this.canvas);
    this.setCanvasSize();
  }

  getViewportSize() {
    const width = Math.max(window.innerWidth || 0, document.documentElement.clientWidth || 0, 1);
    const height = Math.max(window.innerHeight || 0, document.documentElement.clientHeight || 0, 1);
    return { width, height };
  }

  setCanvasSize() {
    const { width: viewportWidth, height: viewportHeight } = this.getViewportSize();
    const cssWidth = this.isMobile ? viewportWidth : 50;
    const cssHeight = this.isMobile ? 50 : viewportHeight;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.style.width = `${cssWidth}px`;
    this.canvas.style.height = `${cssHeight}px`;
    this.canvas.width = Math.max(1, Math.floor(cssWidth * pixelRatio));
    this.canvas.height = Math.max(1, Math.floor(cssHeight * pixelRatio));
    this.ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  createButtons() {
    return [
      {
        name: 'Create Polycube',
        icon: '../assets/ic_plus.png',
        action: () => this.togglePopup('cube'),
        description: 'To create a new cube and add it to the scene.',
      },
      {
        name: 'Grid Settings',
        icon: '../assets/ic_table.png',
        action: () => this.togglePopup('grid'),
        description: 'To change the grid settings.',
      },
      {
        name: 'Solving Polycube',
        icon: '../assets/ic_solving.png',
        action: () => this.togglePopup('solve'),
        description: 'To solve the polycube puzzle.\nUse different algorithms to solve.',
      },
      {
        name: 'Tutorial',
        icon: '../assets/ic_question.png',
        action: () => this.togglePopup('tutorial'),
        description: 'To view the tutorial.\nLearn how to use the application.',
      },
      {
        name: 'Settings',
        icon: '../assets/ic_setting.png',
        action: () => this.togglePopup('settings'),
        description: 'To adjust application settings.\nChange colors, tooltips, and more.',
      },
    ];
  }

  createTooltip() {
    this.tooltipToolbar = this.isMobile ? false : true;
    this.tooltip = document.createElement('div');
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.backgroundColor = '#fff';
    this.tooltip.style.border = '1px solid #000';
    this.tooltip.style.padding = '5px';
    this.tooltip.style.display = 'none';
    this.tooltip.style.whiteSpace = 'pre';
    this.tooltip.style.zIndex = '9001';
    document.body.appendChild(this.tooltip);
  }

  drawToolbar() {
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.isMobile ? this.drawToolbarVertical() : this.drawToolbarHorizontal();
  }

  drawToolbarVertical() {
    const totalWidth = this.buttons.length * 60;
    const startX = (this.canvas.width - totalWidth) / 2;

    this.buttons.forEach((button, index) => {
      const x = startX + index * 60;
      button.x = x - 5;
      button.y = 5;
      button.width = 40;
      button.height = 40;
      this.drawIcon(button.icon, x, 10, 30, 30, () => {
        this.ctx.strokeStyle = '#fff';
        this.ctx.strokeRect(x - 5, 5, 40, 40);
      });
    });
  }

  drawToolbarHorizontal() {
    const totalHeight = this.buttons.length * 60;
    const startY = (this.canvas.height - totalHeight) / 2;

    this.buttons.forEach((button, index) => {
      const y = startY + index * 60;
      button.x = 5;
      button.y = y - 5;
      button.width = 40;
      button.height = 40;
      this.drawIcon(button.icon, 10, y, 30, 30, () => {
        this.ctx.strokeStyle = '#fff';
        this.ctx.strokeRect(5, y - 5, 40, 40);
      });
    });
  }

  drawIcon(src, x, y, width, height, drawAfter) {
    let img = this.iconCache.get(src);
    if (!img) {
      img = new Image();
      this.iconCache.set(src, img);
      img.src = src;
    }

    const draw = () => {
      this.ctx.drawImage(img, x, y, width, height);
      if (drawAfter) drawAfter();
    };

    if (img.complete && img.naturalWidth > 0) {
      draw();
    } else {
      img.onload = draw;
    }
  }

  addEventListeners() {
    this.canvas.removeEventListener('mousemove', this.handleCanvasMouseMoveBound);
    this.canvas.removeEventListener('mouseleave', this.handleCanvasMouseLeaveBound);
    this.canvas.removeEventListener('mousedown', this.handleCanvasClickBound);
    this.canvas.removeEventListener('touchstart', this.handleCanvasClickBound);

    this.canvas.addEventListener('mousemove', this.handleCanvasMouseMoveBound);
    this.canvas.addEventListener('mouseleave', this.handleCanvasMouseLeaveBound);
    this.canvas.addEventListener('mousedown', this.handleCanvasClickBound);
    this.canvas.addEventListener('touchstart', this.handleCanvasClickBound);

    if (!this.documentListenersAttached) {
      document.addEventListener('click', this.handleDocumentClickBound);
      document.addEventListener('touchstart', this.handleDocumentClickBound);
      this.documentListenersAttached = true;
    }
  }

  handleCanvasMouseMove(e) {
    let cursor = 'default';
    let foundButton = null;
    this.buttons.forEach((button) => {
      if (this.isInside(e.clientX, e.clientY, button)) {
        cursor = 'pointer';
        foundButton = button;
      }
    });
    if (this.isInside(e.clientX, e.clientY, this.homeButtonRect)) {
      cursor = 'pointer';
      foundButton = { name: 'Home', description: 'Return to the home menu.' };
    }
    this.canvas.style.cursor = cursor;
    if (this.tooltipToolbar && foundButton) {
      this.tooltip.innerHTML = `${foundButton.name}\n\n${foundButton.description}`;
      this.tooltip.style.left = `${e.clientX + 10}px`;
      this.tooltip.style.top = `${e.clientY + 10}px`;
      this.tooltip.style.display = 'block';
    } else {
      this.tooltip.style.display = 'none';
    }
  }

  handleCanvasMouseLeave() {
    this.tooltip.style.display = 'none';
  }

  handleCanvasClick(e) {
    const point = e.touches?.[0] || e.changedTouches?.[0] || e;
    const { clientX: mouseX, clientY: mouseY } = point;
    this.buttons.forEach((button) => {
      if (this.isInside(mouseX, mouseY, button)) {
        button.action();
      }
    });
    if (this.isInside(mouseX, mouseY, this.homeButtonRect)) {
      window.location.href = '../index.html';
    }
  }

  handleDocumentClick(e) {
    if (this.popupOpen) {
      const cubePopup = document.getElementById('cubePopup');
      const gridPopup = document.getElementById('gridPopup');
      const solvePopup = document.getElementById('solvePopup');
      const tutorialPopup = document.getElementById('tutorialPopup');
      const settingsPopup = document.getElementById('settingsPopup');
      if (
        (cubePopup && !cubePopup.contains(e.target) && !this.canvas.contains(e.target)) ||
        (gridPopup && !gridPopup.contains(e.target) && !this.canvas.contains(e.target)) ||
        (solvePopup && !solvePopup.contains(e.target) && !this.canvas.contains(e.target)) ||
        (tutorialPopup && !tutorialPopup.contains(e.target) && !this.canvas.contains(e.target)) ||
        (settingsPopup && !settingsPopup.contains(e.target) && !this.canvas.contains(e.target))
      ) {
        this.closeCurrentPopup();
        this.tooltip.style.display = 'none';
      }
    }
  }

  resizeToolbar() {
    this.updateToolbarLayout();
    this.setCanvasSize();
    this.drawToolbar();
    this.addHomeButton();
  }

  updateToolbarLayout() {
    const wasMobile = this.isMobile;
    this.isMobile = this.checkIfMobile();
    if (wasMobile !== this.isMobile) {
      this.removeCanvas();
      this.setupCanvas();
      this.drawToolbar();
      this.addHomeButton();
      this.addEventListeners();
    }
  }

  removeCanvas() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }

  isInside(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
  }

  addHomeButton() {
    this.drawIcon('../assets/ic_home.png', 10, 10, 30, 30, () => {
      this.ctx.strokeStyle = '#fff';
      this.ctx.strokeRect(5, 5, 40, 40);
    });
  }

  togglePopup(type) {
    if (this.currentPopupType === type) {
      this.closePopup(type);
    } else {
      this.closeCurrentPopup();
      this.showPopup(type);
      this.currentPopupType = type;
    }
  }

  showPopup(type) {
    this.popupOpen = true;
    switch (type) {
      case 'cube':
        createCubePopup(this);
        break;
      case 'grid':
        showGridPopup(this);
        break;
      case 'solve':
        showSolvePopup(this);
        break;
      case 'tutorial':
        showTutorialPopup(this);
        break;
      case 'settings':
        showSettingsPopup(this);
        break;
    }
  }

  createPopupContainer(id, title) {
    const popupContainer = document.createElement('div');
    popupContainer.id = id;
    popupContainer.style.position = 'absolute';
    popupContainer.style.top = this.isMobile ? '50px' : '0';
    popupContainer.style.left = this.isMobile ? '50%' : '238px';
    popupContainer.style.transform = 'translateX(-50%)';
    popupContainer.style.width = '370px';
    popupContainer.style.height = '100%';
    popupContainer.style.border = '3px solid #000';
    popupContainer.style.backgroundColor = '#a0a0a0';
    popupContainer.style.overflowY = 'auto';
    popupContainer.style.zIndex = '1300';
    document.body.appendChild(popupContainer);

    const popup = document.createElement('canvas');
    popup.width = 370;
    popup.height = 4000;
    popupContainer.appendChild(popup);

    const titleElement = document.createElement('h3');
    titleElement.style.position = 'absolute';
    titleElement.style.top = '-10px';
    titleElement.style.left = '50%';
    titleElement.style.transform = 'translateX(-50%)';
    titleElement.style.zIndex = '1301';
    titleElement.style.fontSize = '22px';
    titleElement.style.color = '#00ffaa';
    titleElement.textContent = title;
    popupContainer.appendChild(titleElement);

    this.addCloseIcon();
    this.currentPopupElement = popupContainer;
    return popupContainer;
  }

  addCloseIcon() {
    if (this.currentCloseIcon) {
      document.body.removeChild(this.currentCloseIcon);
    }
    const closeIcon = new Image();
    closeIcon.src = '../assets/ic_close.png';
    closeIcon.style.position = 'fixed';
    closeIcon.style.top = this.isMobile ? '56px' : '10px';
    closeIcon.style.left = this.isMobile ? 'calc(50% + 162px)' : '400px';
    Object.assign(closeIcon.style, {
      cursor: 'pointer',
      zIndex: '1302',
      transform: 'translateX(-50%)',
    });
    closeIcon.addEventListener('click', () => this.closeCurrentPopup());
    document.body.appendChild(closeIcon);
    this.currentCloseIcon = closeIcon;
  }

  closePopup(type) {
    const popup = document.getElementById(`${type}Popup`);
    if (popup) {
      if (typeof popup.__cleanup === 'function') {
        popup.__cleanup();
      }
      document.body.removeChild(popup);
    }
    if (this.currentCloseIcon) {
      document.body.removeChild(this.currentCloseIcon);
      this.currentCloseIcon = null;
    }
    const inputs = document.querySelectorAll('.popup-input');
    inputs.forEach((input) => input.parentElement.removeChild(input));
    this.popupOpen = false;
    this.currentPopupType = null;
    this.currentPopupElement = null;
  }

  closeCurrentPopup() {
    if (this.currentPopupType) {
      this.closePopup(this.currentPopupType);
    }
  }
}
