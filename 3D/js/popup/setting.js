import { SETTINGS_POPUP_CONSTANTS, SETTINGS_POPUP_CONTENT } from '../constants.js';

function applyStyles(element, styles) {
  Object.assign(element.style, styles);
}

export class SettingsPopup {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.popupContainer = null;
    this.popup = null;
  }

  render() {
    this.popupContainer = this.toolbar.createPopupContainer(
      'settingsPopup',
      this.toolbar.buttons[4].name
    );
    this.popup = this.popupContainer.querySelector('canvas');
    const ctx = this.popup.getContext('2d');
    const { LAYOUT, FONT, COLORS } = SETTINGS_POPUP_CONSTANTS;

    ctx.fillStyle = SETTINGS_POPUP_CONSTANTS.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, this.popup.width, this.popup.height);

    const box = document.createElement('div');
    applyStyles(box, {
      position: 'absolute',
      left: `${LAYOUT.BOX_LEFT}px`,
      top: `${LAYOUT.START_Y + LAYOUT.BOX_TOP_OFFSET}px`,
      width: `${this.popup.width - LAYOUT.BOX_WIDTH_OFFSET}px`,
      height: `${LAYOUT.ROW_HEIGHT * LAYOUT.BOX_ROWS}px`,
      border: LAYOUT.BOX_BORDER,
      zIndex: LAYOUT.BOX_Z_INDEX,
      pointerEvents: 'none',
    });
    this.popupContainer.appendChild(box);

    const title = document.createElement('div');
    title.textContent = SETTINGS_POPUP_CONTENT.TITLE;
    applyStyles(title, {
      position: 'absolute',
      left: `${LAYOUT.LABEL_X}px`,
      top: `${LAYOUT.START_Y + LAYOUT.LABEL_TOP_OFFSET}px`,
      font: FONT.TITLE,
      color: COLORS.TEXT,
      zIndex: LAYOUT.BOX_Z_INDEX,
      pointerEvents: 'none',
    });
    this.popupContainer.appendChild(title);

    const rowLabel = document.createElement('div');
    rowLabel.textContent = SETTINGS_POPUP_CONTENT.ACTION_LABEL;
    applyStyles(rowLabel, {
      position: 'absolute',
      left: `${LAYOUT.LABEL_X}px`,
      top: `${LAYOUT.START_Y + LAYOUT.ROW_HEIGHT + LAYOUT.LABEL_TOP_OFFSET}px`,
      font: FONT.LABEL,
      color: COLORS.TEXT,
      zIndex: LAYOUT.BOX_Z_INDEX,
      pointerEvents: 'none',
    });
    this.popupContainer.appendChild(rowLabel);

    const iconButton = document.createElement('img');
    iconButton.src = `../assets/ic_${SETTINGS_POPUP_CONTENT.ACTION_ICON}.png`;
    applyStyles(iconButton, {
      position: 'absolute',
      left: `${this.popup.width - LAYOUT.ICON_LEFT_OFFSET}px`,
      top: `${LAYOUT.START_Y + LAYOUT.ROW_HEIGHT + LAYOUT.ICON_TOP_OFFSET}px`,
      width: `${LAYOUT.ICON_SIZE}px`,
      height: `${LAYOUT.ICON_SIZE}px`,
      cursor: 'pointer',
      zIndex: LAYOUT.CONTENT_Z_INDEX,
    });
    this.popupContainer.appendChild(iconButton);

    iconButton.addEventListener('click', () => this.handleDeleteSelected());
  }

  handleDeleteSelected() {
    this.toolbar.mainApp.deleteSelectedPolycube();
    if (this.toolbar.isMobile) {
      this.toolbar.closePopup('settings');
    }
  }
}

export function showSettingsPopup(toolbar) {
  const popup = new SettingsPopup(toolbar);
  popup.render();
  return popup;
}
