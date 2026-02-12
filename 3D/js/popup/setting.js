export function showSettingsPopup(toolbar) {
  const popupContainer = toolbar.createPopupContainer('settingsPopup', toolbar.buttons[4].name);
  const popup = popupContainer.querySelector('canvas');
  const ctx = popup.getContext('2d');

  ctx.fillStyle = '#a0a0a0';
  ctx.fillRect(0, 0, popup.width, popup.height);

  const startY = 76;
  const rowHeight = 76;
  const colX = 30;

  const box = document.createElement('div');
  box.style.position = 'absolute';
  box.style.left = '10px';
  box.style.top = `${startY - 30}px`;
  box.style.width = `${popup.width - 26}px`;
  box.style.height = `${rowHeight * 4}px`;
  box.style.border = '2px solid #fff';
  box.style.zIndex = '1001';
  box.style.pointerEvents = 'none';
  popupContainer.appendChild(box);

  const title = document.createElement('div');
  title.textContent = 'Quick settings';
  title.style.position = 'absolute';
  title.style.left = `${colX}px`;
  title.style.top = `${startY - 2}px`;
  title.style.font = '20px Pixellari';
  title.style.color = '#000';
  title.style.zIndex = '1001';
  title.style.pointerEvents = 'none';
  popupContainer.appendChild(title);

  const rowLabel = document.createElement('div');
  rowLabel.textContent = 'Delete Selected Polycube';
  rowLabel.style.position = 'absolute';
  rowLabel.style.left = `${colX}px`;
  rowLabel.style.top = `${startY + rowHeight - 2}px`;
  rowLabel.style.font = '20px Pixellari';
  rowLabel.style.color = '#000';
  rowLabel.style.zIndex = '1001';
  rowLabel.style.pointerEvents = 'none';
  popupContainer.appendChild(rowLabel);

  const iconButton = document.createElement('img');
  iconButton.src = '../assets/ic_trash.png';
  iconButton.style.position = 'absolute';
  iconButton.style.left = `${popup.width - 94}px`;
  iconButton.style.top = `${startY + rowHeight - 14}px`;
  iconButton.style.width = '50px';
  iconButton.style.height = '50px';
  iconButton.style.cursor = 'pointer';
  iconButton.style.zIndex = '1002';
  popupContainer.appendChild(iconButton);

  iconButton.addEventListener('click', () => {
    toolbar.mainApp.deleteSelectedPolycube();
    if (toolbar.isMobile) {
      toolbar.closePopup('settings');
    }
  });
}
