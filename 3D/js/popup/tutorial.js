import { TUTORIAL_POPUP_CONSTANTS, TUTORIAL_POPUP_ROWS, TUTORIAL_ICON_MAP } from '../constants.js';

function applyStyles(element, styles) {
  Object.assign(element.style, styles);
}

export class TutorialPopup {
  constructor(toolbar) {
    this.toolbar = toolbar;
    this.popupContainer = null;
    this.popup = null;
  }

  render() {
    this.popupContainer = this.toolbar.createPopupContainer(
      'tutorialPopup',
      this.toolbar.buttons[3].name
    );
    this.popup = this.popupContainer.querySelector('canvas');
    const ctx = this.popup.getContext('2d');
    const { LAYOUT, FONT, COLORS } = TUTORIAL_POPUP_CONSTANTS;

    ctx.fillStyle = TUTORIAL_POPUP_CONSTANTS.BACKGROUND_COLOR;
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

    TUTORIAL_POPUP_ROWS.forEach((row) => {
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
        color: COLORS.HEADER,
        lineHeight: LAYOUT.HEADER_LINE_HEIGHT,
        paddingRight: row.icon ? `${LAYOUT.HEADER_ICON_PADDING_RIGHT}px` : '0',
        cursor: row.title ? 'default' : 'pointer',
        textDecoration: row.underline ? 'underline' : 'none',
      });
      item.appendChild(header);

      if (row.icon) {
        const icon = document.createElement('img');
        icon.src = `../assets/icons/${row.icon}.png`;
        applyStyles(icon, {
          position: 'absolute',
          right: '0',
          top: `${LAYOUT.ICON_TOP}px`,
          width: `${LAYOUT.ICON_SIZE}px`,
          height: `${LAYOUT.ICON_SIZE}px`,
          pointerEvents: 'none',
        });
        item.appendChild(icon);
      }

      if (row.description) {
        const description = document.createElement('div');
        applyStyles(description, {
          display: 'none',
          marginTop: `${LAYOUT.DESCRIPTION_MARGIN_TOP}px`,
          marginLeft: `${LAYOUT.DESCRIPTION_MARGIN_LEFT}px`,
          font: FONT.DESCRIPTION,
          color: COLORS.DESCRIPTION,
          lineHeight: LAYOUT.DESCRIPTION_LINE_HEIGHT,
        });
        item.appendChild(description);
        this.renderDescription(description, row.description, LAYOUT);

        header.addEventListener('click', () => {
          description.style.display = description.style.display === 'none' ? 'block' : 'none';
        });
      }
    });
  }

  renderDescription(container, text, layout) {
    const lines = text.split('\n');
    lines.forEach((line) => {
      const lineNode = document.createElement('div');
      lineNode.style.margin = `0 0 ${layout.LINE_MARGIN_BOTTOM}px 0`;

      if (line.trim().length === 0) {
        lineNode.innerHTML = '&nbsp;';
        container.appendChild(lineNode);
        return;
      }

      const parts = line.trim().split(' ');
      parts.forEach((part, index) => {
        const iconPath = TUTORIAL_ICON_MAP[part];
        if (iconPath) {
          const img = document.createElement('img');
          img.src = iconPath;
          applyStyles(img, {
            width: `${layout.INLINE_ICON_SIZE}px`,
            height: `${layout.INLINE_ICON_SIZE}px`,
            verticalAlign: 'text-bottom',
            margin: layout.INLINE_ICON_MARGIN,
          });
          lineNode.appendChild(img);
        } else {
          const span = document.createElement('span');
          span.textContent = part;
          lineNode.appendChild(span);
        }

        if (index < parts.length - 1) {
          lineNode.appendChild(document.createTextNode(' '));
        }
      });
      container.appendChild(lineNode);
    });
  }
}

export function showTutorialPopup(toolbar) {
  const popup = new TutorialPopup(toolbar);
  popup.render();
  return popup;
}
