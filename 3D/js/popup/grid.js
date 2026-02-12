import { GRID_POPUP_CONSTANTS, GRID_POPUP_ROWS } from '../constants.js';

function applyStyles(element, styles) {
  Object.assign(element.style, styles);
}

export class GridPopup {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.popupContainer = null;
    this.popup = null;
    this.values = { ...GRID_POPUP_CONSTANTS.INITIAL_VALUES };
  }

  render() {
    this.popupContainer = this.toolbar.createPopupContainer('gridPopup', this.toolbar.buttons[1].name);
    this.popup = this.popupContainer.querySelector('canvas');
    const ctx = this.popup.getContext('2d');
    ctx.fillStyle = GRID_POPUP_CONSTANTS.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, this.popup.width, this.popup.height);

    GRID_POPUP_ROWS.forEach((row, index) => {
      this.renderRow(row, index);
    });
  }

  renderRow(row, index) {
    const { LAYOUT, FONT, COLORS, INITIAL_VALUES } = GRID_POPUP_CONSTANTS;
    const y = LAYOUT.START_Y + index * LAYOUT.ROW_HEIGHT;

    if (row.box) {
      const box = document.createElement('div');
      applyStyles(box, {
        position: 'absolute',
        left: `${LAYOUT.BOX_LEFT}px`,
        top: `${y + LAYOUT.BOX_TOP_OFFSET}px`,
        width: `${this.popup.width - LAYOUT.BOX_WIDTH_OFFSET}px`,
        height: `${LAYOUT.ROW_HEIGHT * (row.title ? 5 : 1)}px`,
        border: LAYOUT.BOX_BORDER,
        zIndex: LAYOUT.BOX_Z_INDEX,
        pointerEvents: 'none',
      });
      this.popupContainer.appendChild(box);
    }

    const label = document.createElement('div');
    label.textContent = row.label;
    applyStyles(label, {
      position: 'absolute',
      left: `${LAYOUT.LABEL_X}px`,
      top: `${y + LAYOUT.LABEL_TOP_OFFSET}px`,
      font: FONT.LABEL,
      color: COLORS.LABEL,
      zIndex: LAYOUT.BOX_Z_INDEX,
      pointerEvents: 'none',
    });
    this.popupContainer.appendChild(label);

    if (row.type === 'input') {
      const input = this.createInputField(y, INITIAL_VALUES[row.key]);
      input.addEventListener('change', (event) => {
        this.values[row.key] = parseInt(event.target.value || '0', 10);
      });
    }

    if (row.icon) {
      this.createIconButton(y, row.icon, () => this.handleAction(row.key));
    }
  }

  createInputField(y, defaultValue) {
    const { LAYOUT, COLORS } = GRID_POPUP_CONSTANTS;
    const input = document.createElement('input');
    input.type = 'number';
    input.value = defaultValue;
    applyStyles(input, {
      position: 'absolute',
      left: LAYOUT.INPUT_LEFT,
      top: `${y}px`,
      width: `${LAYOUT.INPUT_WIDTH}px`,
      height: `${LAYOUT.INPUT_HEIGHT}px`,
      border: LAYOUT.INPUT_BORDER,
      backgroundColor: COLORS.INPUT_BACKGROUND,
      fontSize: `${LAYOUT.INPUT_FONT_SIZE}px`,
      fontFamily: 'Pixellari',
      color: COLORS.INPUT_TEXT,
      zIndex: LAYOUT.CONTENT_Z_INDEX,
    });
    input.classList.add('popup-input');
    this.popupContainer.appendChild(input);
    return input;
  }

  createIconButton(y, iconName, onClick) {
    const { LAYOUT } = GRID_POPUP_CONSTANTS;
    const iconButton = document.createElement('img');
    iconButton.src = `../assets/ic_${iconName}.png`;
    applyStyles(iconButton, {
      position: 'absolute',
      left: `${this.popup.width - LAYOUT.ICON_LEFT_OFFSET}px`,
      top: `${y + LAYOUT.ICON_TOP_OFFSET}px`,
      width: `${LAYOUT.ICON_SIZE}px`,
      height: `${LAYOUT.ICON_SIZE}px`,
      cursor: 'pointer',
      zIndex: LAYOUT.CONTENT_Z_INDEX,
    });
    iconButton.addEventListener('click', onClick);
    this.popupContainer.appendChild(iconButton);
  }

  handleAction(actionKey) {
    if (actionKey === 'draw') {
      this.toolbar.mainApp.createNewBoard(this.values.x, this.values.y, this.values.z);
    } else if (actionKey === 'trash') {
      this.toolbar.mainApp.clearBoard();
    }

    if (this.toolbar.isMobile) {
      this.toolbar.closePopup('grid');
    }
  }
}

export function showGridPopup(toolbar) {
  const popup = new GridPopup(toolbar);
  popup.render();
  return popup;
}
