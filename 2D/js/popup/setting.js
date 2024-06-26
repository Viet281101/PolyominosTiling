export function showSettingsPopup(toolbar) {
	const popupContainer = toolbar.createPopupContainer('settingsPopup', toolbar.buttons[4].name);
	const popup = popupContainer.querySelector('canvas');
	const ctx = popup.getContext('2d');

	ctx.fillStyle = '#a0a0a0';
	ctx.fillRect(0, 0, popup.width, popup.height);

	const rows = [
		{ label: 'Quick Play Settings', box: true, title: true },
		{ label: 'Reset Polyominoes Position', icon: 'reset' },
		{ label: 'Mix Position of Polyominoes', icon: 'shuffle' },
		{ label: 'Delete All Polyominoes', icon: 'trash' },
		{ label: 'Delete Polyominoes Outside', icon: 'trash' },
	];

	const startY = 76;
	const rowHeight = 76;
	const colX = 30;

	rows.forEach((row, index) => {
		const y = startY + index * rowHeight;
		if (row.box) {
			ctx.strokeStyle = '#fff';
			ctx.strokeRect(10, (y - 30), (popup.width - 20), (rowHeight * (row.title ? 5 : 1)));
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
			attachSettingClickEvent(toolbar, popup, row, y);
		}
	});

	popup.addEventListener('touchstart', (e) => {
		handleTouchClick(e, toolbar, rows, popup, startY, rowHeight);
	});
	popup.addEventListener('mousemove', (e) => {
		const rect = popup.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		let cursor = 'default';
		rows.forEach((row, index) => {
			const y = startY + index * rowHeight;
			if (row.icon && toolbar.isInside(mouseX, mouseY, { x: popup.width - 94, y: y - 14, width: 50, height: 50 })) {
				cursor = 'pointer';
			}
		});
		popup.style.cursor = cursor;
	});
};

function attachSettingClickEvent(toolbar, popup, row, y) {
	popup.addEventListener('click', (e) => {
		const rect = popup.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		if (toolbar.isInside(mouseX, mouseY, { x: popup.width - 94, y: y - 14, width: 50, height: 50 })) {
			switch (row.label) {
				case 'Reset Polyominoes Position': toolbar.mainApp.resetBoard(); break;
				case 'Mix Position of Polyominoes': toolbar.mainApp.mixPosition(); break;
				case 'Delete All Polyominoes': toolbar.mainApp.deleteAllPolyominos(); break;
				case 'Delete Polyominoes Outside': toolbar.mainApp.deleteAllBlocksOutsideGrid(); break;
			}
			if (toolbar.isMobile) toolbar.closePopup('settings');
		}
	});
};

function handleTouchClick(e, toolbar, rows, popup, startY, rowHeight) {
	const rect = popup.getBoundingClientRect();
	const touchX = e.touches[0].clientX - rect.left;
	const touchY = e.touches[0].clientY - rect.top;

	rows.forEach((row, index) => {
		const y = startY + index * rowHeight;
		if (row.icon && toolbar.isInside(touchX, touchY, { x: popup.width - 94, y: y - 14, width: 50, height: 50 })) {
			switch (row.label) {
				case 'Reset Polyominoes Position': toolbar.mainApp.resetBoard(); break;
				case 'Mix Position of Polyominoes': toolbar.mainApp.mixPosition(); break;
				case 'Delete All Polyominoes': toolbar.mainApp.deleteAllPolyominos(); break;
				case 'Delete Polyominoes Outside': toolbar.mainApp.deleteAllBlocksOutsideGrid(); break;
			}
			if (toolbar.isMobile) toolbar.closePopup('settings');
		}
	});
};
