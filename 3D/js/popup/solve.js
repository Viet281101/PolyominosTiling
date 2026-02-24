import { SOLVE_POPUP_CONSTANTS, SOLVE_POPUP_ROWS } from '../constants.js';

function applyStyles(element, styles) {
  Object.assign(element.style, styles);
}

export class SolvePopup {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.popupContainer = null;
    this.popup = null;
  }

  render() {
    this.popupContainer = this.toolbar.createPopupContainer(
      'solvePopup',
      this.toolbar.buttons[2].name
    );
    this.popup = this.popupContainer.querySelector('canvas');
    const ctx = this.popup.getContext('2d');
    const { LAYOUT, FONT, COLORS } = SOLVE_POPUP_CONSTANTS;

    ctx.fillStyle = SOLVE_POPUP_CONSTANTS.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, this.popup.width, this.popup.height);

    const content = document.createElement('div');
    applyStyles(content, {
      position: 'absolute',
      left: `${LAYOUT.CONTENT_LEFT}px`,
      top: `${LAYOUT.CONTENT_TOP}px`,
      width: `${this.popup.width - LAYOUT.CONTENT_WIDTH_OFFSET}px`,
      paddingBottom: `${LAYOUT.CONTENT_PADDING_BOTTOM}px`,
      zIndex: LAYOUT.CONTENT_Z_INDEX,
    });
    this.popupContainer.appendChild(content);

    SOLVE_POPUP_ROWS.forEach((row) => {
      const item = document.createElement('div');
      applyStyles(item, {
        position: 'relative',
        marginBottom: `${LAYOUT.ITEM_MARGIN_BOTTOM}px`,
      });
      content.appendChild(item);

      const header = document.createElement('div');
      header.textContent = row.label;
      applyStyles(header, {
        font: row.title ? FONT.TITLE : FONT.HEADER,
        color: COLORS.TEXT,
        lineHeight: LAYOUT.HEADER_LINE_HEIGHT,
        paddingRight: row.icon ? `${LAYOUT.HEADER_ICON_PADDING_RIGHT}px` : '0',
        cursor: row.title ? 'default' : 'pointer',
        textDecoration: row.underline ? 'underline' : 'none',
      });
      item.appendChild(header);

      let description = null;
      if (row.description) {
        description = document.createElement('div');
        description.textContent = row.description;
        applyStyles(description, {
          display: 'none',
          marginTop: `${LAYOUT.DESCRIPTION_MARGIN_TOP}px`,
          marginLeft: `${LAYOUT.DESCRIPTION_MARGIN_LEFT}px`,
          font: FONT.DESCRIPTION,
          color: COLORS.TEXT,
          whiteSpace: 'normal',
          lineHeight: LAYOUT.DESCRIPTION_LINE_HEIGHT,
        });
        item.appendChild(description);
      }

      if (row.icon) {
        const iconButton = document.createElement('img');
        iconButton.src = `../assets/icons/${row.icon}.png`;
        applyStyles(iconButton, {
          position: 'absolute',
          right: '0',
          top: `${LAYOUT.ICON_TOP}px`,
          width: `${LAYOUT.ICON_SIZE}px`,
          height: `${LAYOUT.ICON_SIZE}px`,
          cursor: 'pointer',
        });
        item.appendChild(iconButton);

        iconButton.addEventListener('click', (event) => {
          event.stopPropagation();
          this.handleAction(row.actionKey);
          if (this.toolbar.isMobile) {
            this.toolbar.closePopup('solve');
          }
        });
      }

      if (!row.title && description) {
        header.addEventListener('click', () => {
          description.style.display = description.style.display === 'none' ? 'block' : 'none';
        });
      }
    });
  }

  handleAction(actionKey) {
    if (!actionKey) {
      return;
    }
    console.log(actionKey);
  }
}

export function showSolvePopup(toolbar) {
  const popup = new SolvePopup(toolbar);
  popup.render();
  return popup;
}
