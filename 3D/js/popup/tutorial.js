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
      description: `Click this icon to open a menu.\n\nSteps to create a Polycube:\n\n1. Enter the desired number of cubes in the 'N° cubes' input field.\n2. Enter the position coordinates (x, y, z) for the Polycube.\n3. Use the 'Previous' [ic_arrow_left] and 'Next' [ic_arrow_right] buttons to navigate through highlighted cubes.\n4. Click 'Select' [ic_select] to add the highlighted cube to your Polycube.\n5. Click 'Undo' [ic_reset] to remove the last added cube.\n6. Click 'Create' to finalize and create the Polycube.\n7. Click 'Clear' to reset the Polycube creation and start over.\n8. Use the 'Info' button to display current Polycube information.`,
    },
    {
      label: '2) Manipulate the Polycubes :',
      underline: true,
      description: `Click to any Polycube on the scene to select it.\n\nAfter selecting a Polycube, you can:\n\n1. Use the [ic_left_click] 'Left Mouse Button' to rotate the Polycube.\n2. Use the [ic_right_click] 'Right Mouse Button' to move the Polycube.\n\nCustom visible views of Polycubes with DAT.GUI :\n\n1. Click 'polycubeVisible' to show or hide the selected Polycube on the scene.\n2. Click 'allCubesVisible' to show or hide all Polycubes on the scene.`,
    },
    {
      label: '3) Grid Board Settings',
      underline: true,
      icon: 'table',
      description: `This menu lets you delete and or create the new grid.\n\n1. Click [ic_trash] 'Delete current grid' to delete the grid.\n2. Enter (x, y, z) sizes for the grid. Click [ic_draw] to create a new grid.`,
    },
    {
      label: '4) Manipulate the Grid Board :',
      underline: true,
      description: `You can only control the grid through camera perspective with Orbit Controls :\n\n1. Use the [ic_left_click] 'Left Mouse Button' to rotate the grid.\n2. Use the [ic_right_click] 'Right Mouse Button' to move the grid.\n3. Use the 'Center Mouse Button' to zoom the grid.\n\nCustom visible views of grid with DAT.GUI :\n\n1. Click 'showInnerGrid' to show the grid's inner grid.\n2. Click 'showOuterGrid' to show the grid's outer grid. But this is already shown by default.`,
    },
    {
      label: '5) Use Settings :',
      underline: true,
      icon: 'setting',
      description: `In this menu, you can:\n\n1. Click [ic_trash] 'Delete Selected Polycube' to delete the Polycube that you are currently selected.`,
    },
  ];

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

  const content = document.createElement('div');
  content.style.position = 'absolute';
  content.style.left = '14px';
  content.style.top = '54px';
  content.style.width = `${popup.width - 28}px`;
  content.style.paddingBottom = '24px';
  content.style.zIndex = '1002';
  popupContainer.appendChild(content);

  rows.forEach((row) => {
    const item = document.createElement('div');
    item.style.position = 'relative';
    item.style.marginBottom = '14px';
    content.appendChild(item);

    const header = document.createElement('div');
    header.textContent = row.label;
    header.style.font = row.title ? '23px Pixellari' : '21px Pixellari';
    header.style.color = '#000050';
    header.style.lineHeight = '1.3';
    header.style.paddingRight = row.icon ? '52px' : '0';
    if (row.underline) header.style.textDecoration = 'underline';
    if (!row.title) header.style.cursor = 'pointer';
    item.appendChild(header);

    if (row.icon) {
      const icon = document.createElement('img');
      icon.src = `../assets/ic_${row.icon}.png`;
      icon.style.position = 'absolute';
      icon.style.right = '0';
      icon.style.top = '-2px';
      icon.style.width = '38px';
      icon.style.height = '38px';
      icon.style.pointerEvents = 'none';
      item.appendChild(icon);
    }

    if (row.description) {
      const description = document.createElement('div');
      description.style.display = 'none';
      description.style.marginTop = '8px';
      description.style.marginLeft = '12px';
      description.style.font = '20px Pixellari';
      description.style.color = '#000';
      description.style.lineHeight = '1.25';
      item.appendChild(description);
      renderTutorialDescription(description, row.description, icons);

      header.addEventListener('click', () => {
        description.style.display = description.style.display === 'none' ? 'block' : 'none';
      });
    }
  });
}

function renderTutorialDescription(container, text, icons) {
  const lines = text.split('\n');
  lines.forEach((line) => {
    const lineNode = document.createElement('div');
    lineNode.style.margin = '0 0 6px 0';
    if (line.trim().length === 0) {
      lineNode.innerHTML = '&nbsp;';
      container.appendChild(lineNode);
      return;
    }

    const parts = line.trim().split(' ');
    parts.forEach((part, index) => {
      const iconPath = icons[part];
      if (iconPath) {
        const img = document.createElement('img');
        img.src = iconPath;
        img.style.width = '20px';
        img.style.height = '20px';
        img.style.verticalAlign = 'text-bottom';
        img.style.margin = '0 4px';
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
