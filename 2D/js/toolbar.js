import { showPolyominoPopup } from './popup/polyomino.js';
import { showGridPopup } from './popup/grid.js';
import { showSolvePopup } from './popup/solve.js';
import { showTutorialPopup } from './popup/tutorial.js';
import { showSettingsPopup } from './popup/setting.js';

export class Toolbar {
  constructor(mainApp) {
    this.mainApp = mainApp;
    this.isMobile = this.checkIfMobile();

    this.popupOpen = false;
    this.currentPopupType = null;
    this.currentPopupElement = null;
    this.currentCloseIcon = null;

    this.documentListenersAttached = false;
    this.homeButtonRect = { x: 5, y: 5, width: 40, height: 40 };
    this.lastTouchTime = 0;

    this.buttons = this.createButtons();
    this.setupCanvas();
    this.preloadIcons();
    this.createTooltip();
    this.drawToolbar();
    this.addEventListeners();
  }

  checkIfMobile() {
    return window.innerWidth <= 800;
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.isMobile ? window.innerWidth : 50;
    this.canvas.height = this.isMobile ? 50 : window.innerHeight;
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0';
    this.canvas.style.top = '0';
    this.canvas.style.zIndex = '999';
    document.body.appendChild(this.canvas);
  }

  preloadImage(src) {
    const img = new Image();
    img.src = src;
    img.onload = () => this.drawToolbar();
    return img;
  }

  preloadIcons() {
    this.homeImage = this.preloadImage('../assets/icons/home.png');
    this.buttons.forEach((button) => {
      button.image = this.preloadImage(button.icon);
    });
  }

  createButtons() {
    return [
      {
        name: 'Create Polyomino',
        icon: '../assets/icons/plus.png',
        action: () => this.togglePopup('polyomino'),
        description: 'To select available Polyomino blocks.\nAdd directly to canvas.',
      },
      {
        name: 'Grid Settings',
        icon: '../assets/icons/table.png',
        action: () => this.togglePopup('grid'),
        description: 'To change the grid settings.\nAdjust rows, columns, and size.',
      },
      {
        name: 'Solving Polyomino',
        icon: '../assets/icons/solving.png',
        action: () => this.togglePopup('solve'),
        description: 'To solve the polyomino puzzle.\nUse different algorithms to solve.',
      },
      {
        name: 'Tutorial',
        icon: '../assets/icons/question.png',
        action: () => this.togglePopup('tutorial'),
        description: 'To view the tutorial.\nLearn how to use the application.',
      },
      {
        name: 'Settings',
        icon: '../assets/icons/setting.png',
        action: () => this.togglePopup('settings'),
        description: 'To adjust application settings.\nChange colors, tooltips, and more.',
      },
    ];
  }

  createTooltip() {
    this.tooltipToolbar = !this.isMobile;
    this.tooltip = document.createElement('div');
    this.tooltip.style.position = 'absolute';
    this.tooltip.style.backgroundColor = '#fff';
    this.tooltip.style.border = '1px solid #000';
    this.tooltip.style.padding = '5px';
    this.tooltip.style.display = 'none';
    this.tooltip.style.whiteSpace = 'pre';
    this.tooltip.style.zIndex = '1001';
    document.body.appendChild(this.tooltip);
  }

  drawToolbar() {
    if (!this.ctx) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.isMobile) {
      this.drawTopToolbar();
    } else {
      this.drawSideToolbar();
    }

    this.drawHomeButton();
  }

  drawTopToolbar() {
    const preferredGap = 60;
    const minGap = 46;
    const leftInset = this.homeButtonRect.x + this.homeButtonRect.width + 16;
    const rightInset = 8;
    const availableWidth = Math.max(0, this.canvas.width - leftInset - rightInset);

    let gap = preferredGap;
    if (this.buttons.length > 0) {
      gap = Math.min(preferredGap, Math.floor(availableWidth / this.buttons.length));
      gap = Math.max(minGap, gap);
    }

    const totalWidth = this.buttons.length * gap;
    const startX = leftInset + Math.max(0, (availableWidth - totalWidth) / 2);

    this.buttons.forEach((button, index) => {
      const x = startX + index * gap + (gap - 40) / 2;
      const y = 5;

      button.x = x;
      button.y = y;
      button.width = 40;
      button.height = 40;

      this.ctx.strokeStyle = '#fff';
      this.ctx.strokeRect(x, y, 40, 40);
      if (button.image?.complete) {
        this.ctx.drawImage(button.image, x + 5, y + 5, 30, 30);
      }
    });
  }

  drawSideToolbar() {
    const gap = 60;
    const totalHeight = this.buttons.length * gap;
    const startY = (this.canvas.height - totalHeight) / 2;

    this.buttons.forEach((button, index) => {
      const x = 5;
      const y = startY + index * gap - 5;

      button.x = x;
      button.y = y;
      button.width = 40;
      button.height = 40;

      this.ctx.strokeStyle = '#fff';
      this.ctx.strokeRect(x, y, 40, 40);
      if (button.image?.complete) {
        this.ctx.drawImage(button.image, x + 5, y + 5, 30, 30);
      }
    });
  }

  drawHomeButton() {
    this.ctx.strokeStyle = '#fff';
    this.ctx.strokeRect(this.homeButtonRect.x, this.homeButtonRect.y, 40, 40);
    if (this.homeImage?.complete) {
      this.ctx.drawImage(this.homeImage, 10, 10, 30, 30);
    }
  }

  getEventPoint(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    if (e.changedTouches && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  addEventListeners() {
    if (!this.handleCanvasMouseMoveBound) {
      this.handleCanvasMouseMoveBound = (e) => this.handleCanvasMouseMove(e);
      this.handleCanvasLeaveBound = () => {
        this.tooltip.style.display = 'none';
      };
      this.handleCanvasClickBound = (e) => this.handleCanvasClick(e);
      this.handleDocumentClickBound = (e) => this.handleDocumentClick(e);
    }

    this.canvas.addEventListener('mousemove', this.handleCanvasMouseMoveBound);
    this.canvas.addEventListener('mouseleave', this.handleCanvasLeaveBound);
    this.canvas.addEventListener('mousedown', this.handleCanvasClickBound);
    this.canvas.addEventListener('touchstart', this.handleCanvasClickBound);

    if (!this.documentListenersAttached) {
      document.addEventListener('click', this.handleDocumentClickBound);
      document.addEventListener('touchstart', this.handleDocumentClickBound);
      this.documentListenersAttached = true;
    }
  }

  handleCanvasMouseMove(e) {
    const { x: mouseX, y: mouseY } = this.getEventPoint(e);
    let cursor = 'default';
    let foundButton = null;

    this.buttons.forEach((button) => {
      if (this.isInside(mouseX, mouseY, button)) {
        cursor = 'pointer';
        foundButton = button;
      }
    });

    if (this.isInside(mouseX, mouseY, this.homeButtonRect)) {
      cursor = 'pointer';
      foundButton = { name: 'Home', description: 'Return to the home menu.' };
    }

    this.canvas.style.cursor = cursor;

    if (this.tooltipToolbar && foundButton) {
      this.tooltip.innerHTML = `${foundButton.name}\n\n${foundButton.description}`;
      this.tooltip.style.left = `${mouseX + 10}px`;
      this.tooltip.style.top = `${mouseY + 10}px`;
      this.tooltip.style.display = 'block';
    } else {
      this.tooltip.style.display = 'none';
    }
  }

  handleCanvasClick(e) {
    const isTouchEvent = e.type.startsWith('touch');
    if (isTouchEvent) {
      this.lastTouchTime = Date.now();
      e.preventDefault();
    } else if (Date.now() - this.lastTouchTime < 500) {
      return;
    }

    const { x: mouseX, y: mouseY } = this.getEventPoint(e);

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
    if (e.type === 'click' && Date.now() - this.lastTouchTime < 500) {
      return;
    }

    if (!this.popupOpen || !this.currentPopupElement) {
      return;
    }

    if (
      this.currentPopupElement.contains(e.target) ||
      this.canvas.contains(e.target) ||
      (this.currentCloseIcon && this.currentCloseIcon.contains(e.target))
    ) {
      return;
    }

    this.closeCurrentPopup();
    this.tooltip.style.display = 'none';
  }

  resizeToolbar() {
    const layoutChanged = this.updateToolbarLayout();
    this.tooltipToolbar = !this.isMobile;

    if (!layoutChanged) {
      this.canvas.width = this.isMobile ? window.innerWidth : 50;
      this.canvas.height = this.isMobile ? 50 : window.innerHeight;
      this.drawToolbar();
      this.updateCloseIconPosition();
    }
  }

  updateToolbarLayout() {
    const wasMobile = this.isMobile;
    this.isMobile = this.checkIfMobile();

    if (wasMobile === this.isMobile) {
      return false;
    }

    this.removeCanvas();
    this.setupCanvas();
    this.addEventListeners();
    this.drawToolbar();
    this.updateCloseIconPosition();
    return true;
  }

  removeCanvas() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.removeEventListener('mousemove', this.handleCanvasMouseMoveBound);
      this.canvas.removeEventListener('mouseleave', this.handleCanvasLeaveBound);
      this.canvas.removeEventListener('mousedown', this.handleCanvasClickBound);
      this.canvas.removeEventListener('touchstart', this.handleCanvasClickBound);
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }

  isInside(x, y, rect) {
    return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
  }

  togglePopup(type) {
    if (this.currentPopupType === type) {
      this.closePopup(type);
      return;
    }

    this.closeCurrentPopup();
    this.showPopup(type);
    this.currentPopupType = type;
  }

  showPopup(type) {
    this.popupOpen = true;
    switch (type) {
      case 'polyomino':
        showPolyominoPopup(this);
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
      default:
        break;
    }
  }

  createPopupContainer(id, title, canvasHeight = 1800) {
    const popupContainer = document.createElement('div');
    popupContainer.id = id;
    popupContainer.style.position = 'absolute';
    popupContainer.style.top = this.isMobile ? '50px' : '160px';
    popupContainer.style.left = this.isMobile ? '50%' : '238px';
    popupContainer.style.transform = 'translateX(-50%)';
    popupContainer.style.width = '370px';
    popupContainer.style.height = '600px';
    popupContainer.style.border = '3px solid #000';
    popupContainer.style.backgroundColor = '#a0a0a0';
    popupContainer.style.overflowY = 'auto';
    popupContainer.style.zIndex = '1000';
    document.body.appendChild(popupContainer);

    const popup = document.createElement('canvas');
    popup.width = 370;
    popup.height = canvasHeight;
    popupContainer.appendChild(popup);

    const titleElement = document.createElement('h3');
    titleElement.style.position = 'absolute';
    titleElement.style.top = '-12px';
    titleElement.style.left = '50%';
    titleElement.style.transform = 'translateX(-50%)';
    titleElement.style.zIndex = '1001';
    titleElement.style.fontSize = '20px';
    titleElement.style.color = '#00ffaa';
    titleElement.textContent = title;
    popupContainer.appendChild(titleElement);

    this.currentPopupElement = popupContainer;
    this.addCloseIcon();

    return popupContainer;
  }

  addCloseIcon() {
    if (this.currentCloseIcon) {
      document.body.removeChild(this.currentCloseIcon);
    }

    const closeIcon = new Image();
    closeIcon.src = '../assets/icons/close.png';
    closeIcon.style.position = 'fixed';
    Object.assign(closeIcon.style, {
      cursor: 'pointer',
      zIndex: '1001',
      transform: 'translateX(-50%)',
    });

    closeIcon.addEventListener('click', () => this.closeCurrentPopup());
    document.body.appendChild(closeIcon);
    this.currentCloseIcon = closeIcon;
    this.updateCloseIconPosition();
  }

  updateCloseIconPosition() {
    if (!this.currentCloseIcon) {
      return;
    }

    this.currentCloseIcon.style.top = this.isMobile ? '56px' : '166px';
    this.currentCloseIcon.style.left = this.isMobile ? 'calc(50% + 162px)' : '400px';
  }

  closePopup(type) {
    const popup = document.getElementById(`${type}Popup`);
    if (popup) {
      popup.remove();
    }

    if (this.currentCloseIcon) {
      this.currentCloseIcon.remove();
      this.currentCloseIcon = null;
    }

    if (this.currentPopupElement && this.currentPopupElement.id === `${type}Popup`) {
      this.currentPopupElement = null;
    }

    if (this.currentPopupType === type) {
      this.currentPopupType = null;
    }

    this.popupOpen = !!this.currentPopupType;
  }

  closeCurrentPopup() {
    if (this.currentPopupType) {
      this.closePopup(this.currentPopupType);
    }
  }
}
