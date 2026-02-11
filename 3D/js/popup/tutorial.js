export function showTutorialPopup(toolbar) {
  const popupContainer = toolbar.createPopupContainer('tutorialPopup', toolbar.buttons[3].name);
  const popup = popupContainer.querySelector('canvas');
  const ctx = popup.getContext('2d');

  ctx.fillStyle = '#a0a0a0';
  ctx.fillRect(0, 0, popup.width, popup.height);

  const rows = [
    { label: 'How to interact with this version', title: true },
    {
      label: '1) Create Any Polycube',
      underline: true,
      icon: 'plus',
      description: `Click this icon to open a menu.\n\nSteps to create a Polycube:\n
			1. Enter the desired number of cubes in the 'N° cubes' input field.\n
			2. Enter the position coordinates (x, y, z) for the Polycube.\n
			3. Use the 'Previous' [ic_arrow_left] and 'Next' [ic_arrow_right] buttons to navigate through highlighted cubes.\n
			4. Click 'Select' [ic_select] to add the highlighted cube to your Polycube.\n
			5. Click 'Undo' [ic_reset] to remove the last added cube.\n
			6. Click 'Create' to finalize and create the Polycube.\n
			7. Click 'Clear' to reset the Polycube creation and start over.\n
			8. Use the 'Info' button to display current Polycube information.\n`,
    },
    {
      label: '2) Manipulate the Polycubes :',
      underline: true,
      description: `Click to any Polycube on the scene to select it.\n\n After selecting a Polycube, you can:\n
			1. Use the [ic_left_click] 'Left Mouse Button' to rotate the Polycube.\n
			2. Use the [ic_right_click] 'Right Mouse Button' to move the Polycube.\n\n\n\nCustom visible views of Polycubes with DAT.GUI :\n
			1. Click 'polycubeVisible' to show or hide the selected Polycube on the scene.\n
			2. Click 'allCubesVisible' to show or hide all Polycubes on the scene.\n`,
    },
    {
      label: '3) Grid Board Settings',
      underline: true,
      icon: 'table',
      description: `This menu lets you delete and or create the new grid.\n
			1. Click [ic_trash] 'Delete current grid' to delete the grid.\n
			2. Enter (x, y, z) sizes for the grid. Click [ic_draw] to create a new grid.\n`,
    },
    {
      label: '4) Manipulate the Grid Board :',
      underline: true,
      description: `You can only control the grid through camera perspective with Orbit Controls :\n
			1. Use the [ic_left_click] 'Left Mouse Button' to rotate the grid.\n
			2. Use the [ic_right_click] 'Right Mouse Button' to move the grid.\n
			3. Use the 'Center Mouse Button' to zoom the grid.\n\n\n\nCustom visible views of grid with DAT.GUI :\n
			1. Click 'showInnerGrid' to show the grid's inner grid.\n
			2. Click 'showOuterGrid' to show the grid's outer grid. But this is already shown by default.\n`,
    },
    {
      label: '5) Use Settings :',
      underline: true,
      icon: 'setting',
      description: `In this menu, you can:\n
			1. Click [ic_trash] 'Delete Selected Polycube' to delete the Polycube that you are currently selected.\n`,
    },
  ];

  const startY = 60;
  const rowHeight = 60;
  const colX = 30;
  const maxWidth = 300;
  const lineHeight = 24;

  const iconSize = 30;
  const iconPadding = 5;
  const icons = {
    '[ic_arrow_left]': '../assets/ic_arrow_left.png',
    '[ic_arrow_right]': '../assets/ic_arrow_right.png',
    '[ic_select]': '../assets/ic_select.png',
    '[ic_reset]': '../assets/ic_reset.png',
    '[ic_left_click]': '../assets/ic_left_click.png',
    '[ic_right_click]': '../assets/ic_right_click.png',
    '[ic_trash]': '../assets/ic_trash.png',
    '[ic_draw]': '../assets/ic_draw.png',
  };

  const dropdowns = {};
  let clickAreas = [];

  rows.forEach((row, index) => {
    const y = startY + index * rowHeight;
    ctx.font = '23px Pixellari';
    ctx.fillStyle = '#000050';
    ctx.fillText(row.label, colX, y + lineHeight);

    if (row.icon) {
      const icon = new Image();
      icon.src = `../assets/ic_${row.icon}.png`;
      icon.onload = () => {
        ctx.drawImage(icon, popup.width - 94, y - 10, 40, 40);
      };
    }
    if (row.description) {
      dropdowns[index] = { description: row.description, expanded: false, y: y + 40 };
    }
  });

  popup.addEventListener('mousemove', (e) => {
    const rect = popup.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    let cursor = 'default';

    clickAreas.forEach((area) => {
      if (toolbar.isInside(mouseX, mouseY, area.rect) && !rows[area.index].title) {
        cursor = 'pointer';
      }
    });
    popup.style.cursor = cursor;
  });

  popup.addEventListener('click', (e) => {
    const rect = popup.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    clickAreas.forEach((area) => {
      if (toolbar.isInside(mouseX, mouseY, area.rect) && !rows[area.index].title) {
        if (dropdowns[area.index]) {
          dropdowns[area.index].expanded = !dropdowns[area.index].expanded;
          redrawPopup();
        }
      }
    });
  });

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, callback) {
    const paragraphs = text.split('\n');
    let line = '';
    const lines = [];
    const iconPositions = [];

    paragraphs.forEach((paragraph) => {
      const words = paragraph.split(' ');
      for (let n = 0; n < words.length; n++) {
        const word = words[n];
        if (icons[word]) {
          lines.push(line);
          iconPositions.push({
            icon: icons[word],
            x: x + ctx.measureText(line).width + iconPadding,
            y: y + lines.length * lineHeight - iconSize / 2 - iconSize,
          });
          line = '';
          continue;
        }
        let testLine = line + word + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      line = '';
    });
    lines.forEach((line, index) => {
      ctx.fillText(line, x, y + index * lineHeight);
    });
    callback(iconPositions);
    return lines.length;
  }

  function redrawPopup() {
    ctx.clearRect(0, 0, popup.width, popup.height);
    ctx.fillStyle = '#a0a0a0';
    ctx.fillRect(0, 0, popup.width, popup.height);

    let yOffset = 0;
    clickAreas = [];
    rows.forEach((row, index) => {
      const y = startY + index * rowHeight + yOffset;
      ctx.font = '23px Pixellari';
      ctx.fillStyle = '#000050';
      ctx.fillText(row.label, colX, y + lineHeight);
      if (row.underline) {
        ctx.beginPath();
        ctx.moveTo(colX, y + lineHeight + 3);
        ctx.lineTo(colX + ctx.measureText(row.label).width, y + lineHeight + 3);
        ctx.stroke();
      }
      if (row.icon) {
        const icon = new Image();
        icon.src = `../assets/ic_${row.icon}.png`;
        icon.onload = () => {
          ctx.drawImage(icon, popup.width - 94, y - 10, 40, 40);
        };
        clickAreas.push({
          index,
          rect: { x: popup.width - 94, y: y - 14, width: 50, height: 50 },
          type: 'icon',
        });
      }
      clickAreas.push({
        index,
        rect: { x: colX, y, width: popup.width - colX - 100, height: rowHeight },
        type: 'label',
      });
      if (dropdowns[index] && dropdowns[index].expanded) {
        ctx.font = '20px Pixellari';
        ctx.fillStyle = '#000';
        const linesCount = wrapText(
          ctx,
          dropdowns[index].description,
          colX + 20,
          y + 55,
          maxWidth,
          lineHeight,
          (iconPositions) => {
            iconPositions.forEach((pos) => {
              const icon = new Image();
              icon.src = pos.icon;
              icon.onload = () => {
                ctx.drawImage(icon, pos.x, pos.y, iconSize, iconSize);
              };
            });
          }
        );
        yOffset += linesCount * lineHeight;
      }
    });
  }
  redrawPopup();
}
