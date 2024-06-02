export function showGridPopup(toolbar) {
	const popupContainer = toolbar.createPopupContainer('gridPopup', toolbar.buttons[1].name);
	const popup = popupContainer.querySelector('canvas');
	const ctx = popup.getContext('2d');

	ctx.fillStyle = '#a0a0a0';
	ctx.fillRect(0, 0, popup.width, popup.height);

	const rows = [
		{ label: 'Create new grid board here', box: true, title: true },
		{ label: 'Enter n° rows', type: 'input' },
		{ label: 'Enter n° columns', type: 'input' },
		{ label: 'Draw grid by click to 👉', icon: '../assets/ic_draw.png' },
		{ label: 'Delete current grid :', icon: '../assets/ic_trash.png' },
		{ label: 'Blacken the cells :', icon: '../assets/ic_blackend_cell.png' }
	];

	const startY = 72;
	const rowHeight = 72;
	const colX = 30;

	rows.forEach((row, index) => {
		const y = startY + index * rowHeight;
		if (row.box) {
			ctx.strokeStyle = '#fff';
			ctx.strokeRect(10, (y - 30), (popup.width - 20), (rowHeight * (row.title ? 4 : 1)));
		}
		ctx.font = '22px Pixellari';
		ctx.fillStyle = '#000';
		ctx.fillText(row.label, colX, y + 20);

		if (row.icon) {
			const icon = new Image();
			icon.src = row.icon;
			icon.onload = () => {
				ctx.drawImage(icon, popup.width - 94, y - 14, 50, 50);
			};
		} else if (row.type === 'input') {
			toolbar.createInputField(popupContainer, y);
		}
	});
};
