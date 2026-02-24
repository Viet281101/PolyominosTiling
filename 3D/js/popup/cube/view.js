import { CUBE_POPUP_CONSTANTS } from '../../constants.js';
import { NAV_ITEMS, FORM_FIELD_LAYOUT, applyStyles, parseNumberInput } from './helpers.js';

export class CubePopupView {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.popupContainer = null;
    this.numberInputs = [];
    this.textZone = null;
  }

  render({ onNChange, onNavigate, onInfo, onClear, onCreate }) {
    this.popupContainer = this.toolbar.createPopupContainer(
      'cubePopup',
      this.toolbar.buttons[0].name
    );

    const popup = this.popupContainer.querySelector('canvas');
    const ctx = popup.getContext('2d');
    ctx.fillStyle = CUBE_POPUP_CONSTANTS.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, popup.width, popup.height);

    this.renderFormFields(onNChange);
    const previewCanvas = this.createPreviewCanvas();
    this.createTextZone(
      popup.width - CUBE_POPUP_CONSTANTS.TEXT_ZONE.WIDTH_OFFSET,
      'Polycube Info...'
    );
    this.createNavigationButtons(onNavigate);
    this.createActionButtons({ onInfo, onClear, onCreate });

    return previewCanvas;
  }

  attachCleanup(cleanup) {
    this.popupContainer.__cleanup = cleanup;
  }

  renderFormFields(onNChange) {
    const startY = CUBE_POPUP_CONSTANTS.FORM.START_Y;
    const rowSpacing = CUBE_POPUP_CONSTANTS.FORM.ROW_SPACING;
    const rowOffset = CUBE_POPUP_CONSTANTS.FORM.HEADER_SPACING_OFFSET;
    const inputOffset = CUBE_POPUP_CONSTANTS.FORM.INPUT_SIZE;

    FORM_FIELD_LAYOUT.forEach((field, index) => {
      const rowY =
        field.row === 1
          ? startY - inputOffset + rowOffset
          : startY + rowSpacing - inputOffset + rowOffset;

      this.createLabel(field.label, field.labelX, rowY);
      const input = this.createInputField(field.inputX, rowY, field.defaultValue);

      if (index === 0) {
        input.addEventListener('change', () => onNChange(this.getNValue()));
      }
    });
  }

  createInputField(x, y, defaultValue) {
    const input = document.createElement('input');
    input.type = 'number';
    input.value = defaultValue;
    applyStyles(input, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${CUBE_POPUP_CONSTANTS.FORM.INPUT_WIDTH}px`,
      height: `${CUBE_POPUP_CONSTANTS.FORM.INPUT_SIZE}px`,
      border: CUBE_POPUP_CONSTANTS.FORM.INPUT_BORDER,
      backgroundColor: CUBE_POPUP_CONSTANTS.COLORS.WHITE,
      fontSize: `${CUBE_POPUP_CONSTANTS.FORM.INPUT_FONT_SIZE}px`,
      fontFamily: 'Pixellari',
      color: CUBE_POPUP_CONSTANTS.COLORS.BLACK,
      zIndex: CUBE_POPUP_CONSTANTS.LAYER.FORM_Z_INDEX,
    });
    input.classList.add('popup-input');
    this.popupContainer.appendChild(input);
    this.numberInputs.push(input);
    return input;
  }

  createLabel(text, x, y) {
    const label = document.createElement('div');
    label.textContent = text;
    applyStyles(label, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      font: CUBE_POPUP_CONSTANTS.FORM.LABEL_FONT,
      lineHeight: `${CUBE_POPUP_CONSTANTS.FORM.INPUT_SIZE}px`,
      height: `${CUBE_POPUP_CONSTANTS.FORM.INPUT_SIZE}px`,
      color: CUBE_POPUP_CONSTANTS.COLORS.BLACK,
      zIndex: CUBE_POPUP_CONSTANTS.LAYER.FORM_Z_INDEX,
      pointerEvents: 'none',
    });
    this.popupContainer.appendChild(label);
  }

  createPreviewCanvas() {
    const canvas3D = document.createElement('canvas');
    canvas3D.width = CUBE_POPUP_CONSTANTS.PREVIEW.CANVAS_WIDTH;
    canvas3D.height = CUBE_POPUP_CONSTANTS.PREVIEW.CANVAS_HEIGHT;
    applyStyles(canvas3D, {
      position: 'absolute',
      top: `${CUBE_POPUP_CONSTANTS.PREVIEW.TOP}px`,
      left: `${CUBE_POPUP_CONSTANTS.PREVIEW.LEFT}px`,
      border: CUBE_POPUP_CONSTANTS.PREVIEW.BORDER,
      zIndex: CUBE_POPUP_CONSTANTS.LAYER.CONTENT_Z_INDEX,
    });
    this.popupContainer.appendChild(canvas3D);
    return canvas3D;
  }

  createTextZone(width, text) {
    const textZone = document.createElement('div');
    textZone.className = 'text-zone';
    applyStyles(textZone, {
      position: 'absolute',
      left: `${CUBE_POPUP_CONSTANTS.TEXT_ZONE.X}px`,
      top: `${CUBE_POPUP_CONSTANTS.TEXT_ZONE.Y}px`,
      width: `${width}px`,
      height: `${CUBE_POPUP_CONSTANTS.TEXT_ZONE.HEIGHT}px`,
      overflowY: 'auto',
      backgroundColor: CUBE_POPUP_CONSTANTS.COLORS.WHITE,
      border: CUBE_POPUP_CONSTANTS.TEXT_ZONE.BORDER,
      fontSize: `${CUBE_POPUP_CONSTANTS.TEXT_ZONE.FONT_SIZE}px`,
      fontFamily: 'Pixellari',
      color: CUBE_POPUP_CONSTANTS.COLORS.BLACK,
      padding: `${CUBE_POPUP_CONSTANTS.TEXT_ZONE.PADDING}px`,
    });
    textZone.innerText = text;
    this.popupContainer.appendChild(textZone);
    this.textZone = textZone;
  }

  createNavigationButtons(onNavigate) {
    const buttonContainer = document.createElement('div');
    applyStyles(buttonContainer, {
      position: 'absolute',
      top: `${CUBE_POPUP_CONSTANTS.NAV.TOP}px`,
      left: `${CUBE_POPUP_CONSTANTS.NAV.LEFT}px`,
      width: `${CUBE_POPUP_CONSTANTS.NAV.WIDTH}px`,
      height: `${CUBE_POPUP_CONSTANTS.NAV.HEIGHT}px`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    });
    this.popupContainer.appendChild(buttonContainer);

    NAV_ITEMS.forEach((item, index) => {
      const label = document.createElement('span');
      label.textContent = item.label;
      applyStyles(label, { font: CUBE_POPUP_CONSTANTS.NAV.LABEL_FONT });
      buttonContainer.appendChild(label);

      const icon = document.createElement('img');
      icon.src = `../assets/icons/${item.icon}.png`;
      icon.width = CUBE_POPUP_CONSTANTS.NAV.ICON_SIZE;
      icon.height = CUBE_POPUP_CONSTANTS.NAV.ICON_SIZE;
      icon.style.cursor = 'pointer';
      icon.addEventListener('click', () => onNavigate(index));
      buttonContainer.appendChild(icon);
    });
  }

  createActionButtons({ onInfo, onClear, onCreate }) {
    const buttonContainer = document.createElement('div');
    applyStyles(buttonContainer, {
      position: 'absolute',
      left: `${CUBE_POPUP_CONSTANTS.ACTION.LEFT}px`,
      top: `${CUBE_POPUP_CONSTANTS.ACTION.TOP}px`,
      width: `${CUBE_POPUP_CONSTANTS.ACTION.WIDTH}px`,
      height: `${CUBE_POPUP_CONSTANTS.ACTION.HEIGHT}px`,
      display: 'flex',
      gap: `${CUBE_POPUP_CONSTANTS.ACTION.GAP}px`,
      zIndex: CUBE_POPUP_CONSTANTS.LAYER.CONTENT_Z_INDEX,
    });
    this.popupContainer.appendChild(buttonContainer);

    const actionMap = [
      { label: 'Info', handler: onInfo },
      { label: 'Clear', handler: onClear },
      { label: 'Create', handler: onCreate },
    ];

    actionMap.forEach(({ label, handler }) => {
      const button = document.createElement('button');
      button.textContent = label;
      applyStyles(button, {
        width: `${CUBE_POPUP_CONSTANTS.ACTION.BUTTON_WIDTH}px`,
        height: `${CUBE_POPUP_CONSTANTS.ACTION.BUTTON_HEIGHT}px`,
        border: CUBE_POPUP_CONSTANTS.ACTION.BUTTON_BORDER,
        backgroundColor: CUBE_POPUP_CONSTANTS.COLORS.ACTION_BUTTON_BG,
        color: CUBE_POPUP_CONSTANTS.COLORS.ACTION_BUTTON_TEXT,
        font: CUBE_POPUP_CONSTANTS.ACTION.BUTTON_FONT,
        cursor: 'pointer',
      });
      button.addEventListener('click', handler);
      buttonContainer.appendChild(button);
    });
  }

  getNValue() {
    return parseNumberInput(this.numberInputs[0], 1);
  }

  getPositionValues() {
    return this.numberInputs.slice(1).map((input) => parseNumberInput(input, 0));
  }

  setNValue(value) {
    if (this.numberInputs[0]) {
      this.numberInputs[0].value = value;
    }
  }

  resetInputs() {
    this.numberInputs.forEach((input, index) => {
      input.value = index === 0 ? 1 : 0;
    });
  }

  setInfoText(text) {
    if (this.textZone) {
      this.textZone.innerText = text;
    }
  }

  setDefaultInfoText() {
    this.setInfoText('Polycube Info...');
  }
}
