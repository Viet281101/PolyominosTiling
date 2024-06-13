export function showSolvePopup(toolbar) {
	const popupContainer = toolbar.createPopupContainer('solvePopup', toolbar.buttons[2].name);
	const popup = popupContainer.querySelector('canvas');
	const ctx = popup.getContext('2d');

	ctx.fillStyle = '#a0a0a0';
	ctx.fillRect(0, 0, popup.width, popup.height);

	const rows = [
		{ label: 'Auto tiling the Polyominoes blocks', title: true },
		{ label: '1) Backtracking method :', underline: true, icon: '../assets/ic_solution.png', description: 'Backtracking places polyominoes on a grid, checking validity, and backtracks when stuck, ensuring no overlaps and full coverage. Usually runs in order of placing the larger blocks first, then the smaller.' },
		{ label: '2) Brute force method :', underline: true, icon: '../assets/ic_solution.png', description: 'Brute force tries all possible combinations of polyominoes on the grid to find a solution. It is guaranteed to find a solution if one exists but is computationally expensive and slow for large grids.' },
		{ label: '3) Random method :', underline: true, icon: '../assets/ic_solution.png', description: 'The random method places polyominoes randomly on the grid. It is fast but does not guarantee a solution or full coverage. It is useful for generating quick and varied patterns.' },
		{ label: '4) Random backtracking :', underline: true, icon: '../assets/ic_solution.png', description: 'Random backtracking combines random placement with backtracking to find a solution. It is more efficient than brute force but less predictable than pure backtracking.' },
		{ label: '5) Full Automatic Tiling :', underline: true, icon: '../assets/ic_solution.png', description: 'Automatically fills the grid using user-selected pieces from outside the grid, such as filling the grid entirely with monominoes if only one monomino is chosen.' }
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
			} else {
				line = testLine;
			}
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
				icon.src = row.icon;
				icon.onload = () => {
					ctx.drawImage(icon, popup.width - 94, y - 14, 50, 50);
				};
				clickAreas.push({ index, rect: { x: popup.width - 94, y: y - 14, width: 50, height: 50 }, type: 'icon' });
			}

			clickAreas.push({ index, rect: { x: colX, y, width: popup.width - colX - 100, height: rowHeight }, type: 'label' });

			if (dropdowns[index] && dropdowns[index].expanded) {
				ctx.font = '16px Pixellari';
				ctx.fillStyle = '#000';
				const linesCount = wrapText(ctx, dropdowns[index].description, colX + 20, y + 55, maxWidth, 20);
				yOffset += linesCount * 20;
			}
		});
	};

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
					break;
				case '2) Brute force method :':
					toolbar.mainApp.bruteForceTiling();
					break;
				case '3) Random method :':
					toolbar.mainApp.randomTiling();
					break;
				case '4) Random backtracking :':
					toolbar.mainApp.randomBacktrackingTiling();
					break;
				case '5) Full Automatic Tiling :':
					toolbar.mainApp.fullAutoTiling();
					break;
			}
			if (toolbar.isMobile) toolbar.closePopup('solve');
		}
	});
};
