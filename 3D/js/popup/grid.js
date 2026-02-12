export function showGridPopup(toolbar) {
  const popupContainer = toolbar.createPopupContainer('gridPopup', toolbar.buttons[1].name);
  const popup = popupContainer.querySelector('canvas');
  const ctx = popup.getContext('2d');

  ctx.fillStyle = '#a0a0a0';
  ctx.fillRect(0, 0, popup.width, popup.height);

  const rows = [
    { label: 'Create new grid board here', box: true, title: true },
    { label: 'Enter n° x size', type: 'input', key: 'x' },
    { label: 'Enter n° y size', type: 'input', key: 'y' },
    { label: 'Enter n° z size', type: 'input', key: 'z' },
    { label: 'Draw grid by click to =>', icon: 'draw', key: 'draw' },
    { label: 'Delete current grid :', icon: 'trash', key: 'trash' },
  ];

  const startY = 76;
  const rowHeight = 76;
  const colX = 30;

  const values = { x: 3, y: 3, z: 3 };

  rows.forEach((row, index) => {
    const y = startY + index * rowHeight;

    if (row.box) {
      const box = document.createElement('div');
      box.style.position = 'absolute';
      box.style.left = '10px';
      box.style.top = `${y - 30}px`;
      box.style.width = `${popup.width - 26}px`;
      box.style.height = `${rowHeight * (row.title ? 5 : 1)}px`;
      box.style.border = '2px solid #fff';
      box.style.zIndex = '1001';
      box.style.pointerEvents = 'none';
      popupContainer.appendChild(box);
    }

    const label = document.createElement('div');
    label.textContent = row.label;
    label.style.position = 'absolute';
    label.style.left = `${colX}px`;
    label.style.top = `${y - 2}px`;
    label.style.font = '22px Pixellari';
    label.style.color = '#000';
    label.style.zIndex = '1001';
    label.style.pointerEvents = 'none';
    popupContainer.appendChild(label);

    if (row.type === 'input') {
      const input = createInputField(popupContainer, y, 3);
      input.addEventListener('change', (e) => {
        values[row.key] = parseInt(e.target.value || '0', 10);
      });
    }

    if (row.icon) {
      const iconButton = document.createElement('img');
      iconButton.src = `../assets/ic_${row.icon}.png`;
      iconButton.style.position = 'absolute';
      iconButton.style.left = `${popup.width - 94}px`;
      iconButton.style.top = `${y - 14}px`;
      iconButton.style.width = '50px';
      iconButton.style.height = '50px';
      iconButton.style.cursor = 'pointer';
      iconButton.style.zIndex = '1002';
      popupContainer.appendChild(iconButton);

      iconButton.addEventListener('click', () => {
        if (row.key === 'draw') {
          toolbar.mainApp.createNewBoard(values.x, values.y, values.z);
        } else if (row.key === 'trash') {
          toolbar.mainApp.clearBoard();
        }
        if (toolbar.isMobile) {
          toolbar.closePopup('grid');
        }
      });
    }
  });
}

function createInputField(popupContainer, y, defaultValue) {
  const input = document.createElement('input');
  input.type = 'number';
  input.value = defaultValue;
  input.style.position = 'absolute';
  input.style.left = 'calc(100% - 120px)';
  input.style.top = `${y}px`;
  input.style.width = '80px';
  input.style.height = '24px';
  input.style.border = '1px solid #000';
  input.style.backgroundColor = '#fff';
  input.style.fontSize = '22px';
  input.style.fontFamily = 'Pixellari';
  input.style.color = '#000';
  input.style.zIndex = '1002';
  input.classList.add('popup-input');
  popupContainer.appendChild(input);
  return input;
}
