export function showTutorialPopup(toolbar) {
	const popupContainer = toolbar.createPopupContainer('tutorialPopup', toolbar.buttons[3].name);
	const popup = popupContainer.querySelector('canvas');
	const ctx = popup.getContext('2d');

	ctx.fillStyle = '#a0a0a0';
	ctx.fillRect(0, 0, popup.width, popup.height);

	const rows = [
		{ label: 'How to interact with this version', title: true },
		{ label: '1) Create Any Polycube :', underline: true, icon: 'plus', description: 'Click this icon to open a menu. Enter the number of cubes for the Polycube you want to create.' },
	];

	const startY = 60;
	const rowHeight = 60;
	const colX = 30;
	const maxWidth = 300;

	const dropdowns = {};
	let clickAreas = [];

	rows.forEach((row, index) => {
		const y = startY + index * rowHeight;
		ctx.font = '21px Pixellari';
		ctx.fillStyle = '#000';
		ctx.fillText(row.label, colX, y + 20);

		if (row.icon) {
			const icon = new Image();
			icon.src = `../assets/ic_${row.icon}.png`;
			icon.onload = () => {
				ctx.drawImage(icon, popup.width - 94, y - 10, 40, 40);
			};
		}
		if (row.description) { dropdowns[index] = { description: row.description, expanded: true, y: y + 40 }; }
	});

	popup.addEventListener('mousemove', (e) => {
		const rect = popup.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		let cursor = 'default';

		clickAreas.forEach(area => {
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

		clickAreas.forEach(area => {
			if (toolbar.isInside(mouseX, mouseY, area.rect) && !rows[area.index].title) {
				if (dropdowns[area.index]) {
					dropdowns[area.index].expanded = !dropdowns[area.index].expanded;
					redrawPopup();
				}
			}
		});
	});

	function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
		const words = text.split(' ');
		let line = '';
		const lines = [];

		for (let n = 0; n < words.length; n++) {
			let testLine = line + words[n] + ' ';
			let metrics = ctx.measureText(testLine);
			let testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				lines.push(line);
				line = words[n] + ' ';
			} else { line = testLine; }
		}
		lines.push(line);
		lines.forEach((line, index) => {
			ctx.fillText(line, x, y + index * lineHeight);
		});
		return lines.length;
	};

	function redrawPopup() {
		ctx.clearRect(0, 0, popup.width, popup.height);
		ctx.fillStyle = '#a0a0a0';
		ctx.fillRect(0, 0, popup.width, popup.height);

		let yOffset = 0;
		clickAreas = [];
		rows.forEach((row, index) => {
			const y = startY + index * rowHeight + yOffset;
			ctx.font = '21px Pixellari';
			ctx.fillStyle = '#000';
			ctx.fillText(row.label, colX, y + 20);
			if (row.underline) {
				ctx.beginPath();
				ctx.moveTo(colX, y + 25);
				ctx.lineTo(colX + ctx.measureText(row.label).width, y + 25);
				ctx.stroke();
			}
			if (row.icon) {
				const icon = new Image();
				icon.src = `../assets/ic_${row.icon}.png`;
				icon.onload = () => {
					ctx.drawImage(icon, popup.width - 94, y - 10, 40, 40);
				};
				clickAreas.push({ index, rect: { x: popup.width - 94, y: y - 14, width: 50, height: 50 }, type: 'icon' });
			}
			clickAreas.push({ index, rect: { x: colX, y, width: popup.width - colX - 100, height: rowHeight }, type: 'label' });
			if (dropdowns[index] && dropdowns[index].expanded) {
				ctx.font = '18px Pixellari';
				ctx.fillStyle = '#000';
				const linesCount = wrapText(ctx, dropdowns[index].description, colX + 20, y + 55, maxWidth, 20);
				yOffset += linesCount * 20;
			}
		});
	};
	redrawPopup();
};
