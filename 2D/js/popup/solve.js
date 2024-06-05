export function showSolvePopup(toolbar) {
	const popupContainer = toolbar.createPopupContainer('solvePopup', toolbar.buttons[2].name);
	const popup = popupContainer.querySelector('canvas');
	const ctx = popup.getContext('2d');

	ctx.fillStyle = '#a0a0a0';
	ctx.fillRect(0, 0, popup.width, popup.height);

	const rows = [
		{ label: 'Auto tiling the Polyominoes blocks', title: true },
		{ label: '1) Backtracking method :', icon: '../assets/ic_solution.png', description: 'Backtracking places polyominoes on a grid, checking validity, and backtracks when stuck, ensuring no overlaps and full coverage. Usually runs in order of placing the larger blocks first, then the smaller.' },
		{ label: '2) Brute force method :', icon: '../assets/ic_solution.png', description: 'Brute force tries all possible combinations of polyominoes on the grid to find a solution. It is guaranteed to find a solution if one exists but is computationally expensive and slow for large grids.' },
		{ label: '3) Random method :', icon: '../assets/ic_solution.png', description: 'The random method places polyominoes randomly on the grid. It is fast but does not guarantee a solution or full coverage. It is useful for generating quick and varied patterns.' },
		{ label: '4) Random backtracking :', icon: '../assets/ic_solution.png', description: 'Random backtracking combines random placement with backtracking to find a solution. It is more efficient than brute force but less predictable than pure backtracking.' }
	];

	const startY = 60;
	const rowHeight = 60;
	const colX = 30;
	const maxWidth = 300;

	const dropdowns = {};

	rows.forEach((row, index) => {
		const y = startY + index * rowHeight;
		ctx.font = '20px Pixellari';
		ctx.fillStyle = '#000';
		ctx.fillText(row.label, colX, y + 20);

		if (row.icon) {
			const icon = new Image();
			icon.src = row.icon;
			icon.onload = () => {
				ctx.drawImage(icon, popup.width - 94, y - 14, 50, 50);
			};
			attachSolveClickEvent(toolbar, popup, row, y);
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

		rows.forEach((row, index) => {
			const y = startY + index * rowHeight;
			if (toolbar.isInside(mouseX, mouseY, { x: colX, y: y, width: popup.width - colX - 100, height: rowHeight })) {
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
			if (toolbar.isInside(mouseX, mouseY, { x: colX, y: y, width: popup.width - colX - 100, height: rowHeight })) {
				if (dropdowns[index]) {
					dropdowns[index].expanded = !dropdowns[index].expanded;
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
			} else {
				line = testLine;
			}
		}
		lines.push(line);
		lines.forEach((line, index) => {
			ctx.fillText(line, x, y + index * lineHeight);
		});
		return lines.length;
	}

	function redrawPopup() {
		ctx.clearRect(0, 0, popup.width, popup.height);
		ctx.fillStyle = '#a0a0a0';
		ctx.fillRect(0, 0, popup.width, popup.height);

		let yOffset = 0;
		rows.forEach((row, index) => {
			const y = startY + index * rowHeight + yOffset;
			ctx.font = '20px Pixellari';
			ctx.fillStyle = '#000';
			ctx.fillText(row.label, colX, y + 20);

			if (row.icon) {
				const icon = new Image();
				icon.src = row.icon;
				icon.onload = () => {
					ctx.drawImage(icon, popup.width - 94, y - 14, 50, 50);
				};
			}

			if (dropdowns[index] && dropdowns[index].expanded) {
				ctx.font = '16px Pixellari';
				ctx.fillStyle = '#000';
				const linesCount = wrapText(ctx, dropdowns[index].description, colX + 20, y + 50, maxWidth, 20);
				yOffset += linesCount * 20;
			}
		});
	}

	redrawPopup();
};

function attachSolveClickEvent(toolbar, popup, row, y) {
	popup.addEventListener('click', (e) => {
		const rect = popup.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		if (toolbar.isInside(mouseX, mouseY, { x: popup.width - 94, y: y - 14, width: 50, height: 50 })) {
			switch (row.label) {
				case '1) Backtracking method :':
					toolbar.mainApp.backtrackingAutoTiling();
					if (toolbar.isMobile) {toolbar.closePopup('solve');}
					break;

				case '2) Brute force method :':
					if (toolbar.isMobile) {toolbar.closePopup('solve');}
					break;

				case '3) Random method :':
					if (toolbar.isMobile) {toolbar.closePopup('solve');}
					break;

				case '4) Random backtracking :':
					if (toolbar.isMobile) {toolbar.closePopup('solve');}
					break;
			}
		}
	});
};
