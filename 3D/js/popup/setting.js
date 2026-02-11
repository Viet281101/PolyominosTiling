export function showSettingsPopup(toolbar) {
  const popupContainer = toolbar.createPopupContainer('settingsPopup', toolbar.buttons[4].name);
  const popup = popupContainer.querySelector('canvas');
  const ctx = popup.getContext('2d');

  ctx.fillStyle = '#a0a0a0';
  ctx.fillRect(0, 0, popup.width, popup.height);

  const rows = [
    { label: 'Quick settings', box: true, title: true },
    { label: 'Delete Selected Polycube', icon: 'trash' },
  ];

  const startY = 76;
  const rowHeight = 76;
  const colX = 30;

  rows.forEach((row, index) => {
    const y = startY + index * rowHeight;
    if (row.box) {
      ctx.strokeStyle = '#fff';
      ctx.strokeRect(10, y - 30, popup.width - 20, rowHeight * (row.title ? 4 : 1));
    }
    ctx.font = '20px Pixellari';
    ctx.fillStyle = '#000';
    ctx.fillText(row.label, colX, y + 20);

    if (row.icon) {
      const icon = new Image();
      icon.src = `../assets/ic_${row.icon}.png`;
      icon.onload = () => {
        ctx.drawImage(icon, popup.width - 94, y - 14, 50, 50);
      };
    }
  });

  popup.addEventListener('mousemove', (e) => {
    const rect = popup.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    let cursor = 'default';
    rows.forEach((row, index) => {
      const y = startY + index * rowHeight;
      if (
        row.icon &&
        toolbar.isInside(mouseX, mouseY, { x: popup.width - 94, y: y - 14, width: 50, height: 50 })
      ) {
        cursor = 'pointer';
      }
    });
    popup.style.cursor = cursor;
  });

  popup.addEventListener('click', (e) => {
    const rect = popup.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    rows.forEach((row, index) => {
      const y = startY + index * rowHeight;
      if (
        row.icon &&
        toolbar.isInside(mouseX, mouseY, { x: popup.width - 94, y: y - 14, width: 50, height: 50 })
      ) {
        switch (index) {
          case 1:
            toolbar.mainApp.deleteSelectedPolycube();
            break;
        }
        if (toolbar.isMobile) {
          toolbar.closePopup('grid');
        }
      }
    });
  });
}
