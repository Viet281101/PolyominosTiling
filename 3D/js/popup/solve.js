export function showSolvePopup(toolbar) {
	const popupContainer = toolbar.createPopupContainer('solvePopup', toolbar.buttons[2].name);
	const popup = popupContainer.querySelector('canvas');
	const ctx = popup.getContext('2d');

	ctx.fillStyle = '#a0a0a0';
	ctx.fillRect(0, 0, popup.width, popup.height);
	const rows = [
		{ label: 'Auto tiling the Polyominoes blocks', title: true },
		{ label: '1) First-Fit Algorithm', underline: true, icon: 'solution', description: 'First-Fit tries to place polyominoes in the grid in order of increasing area. It is guaranteed to find a solution if one exists but is computationally expensive and slow for large grids.' },
		{ label: '2) Best-Fit Algorithm', underline: true, icon: 'solution', description: 'Best-Fit places each polyomino into the tightest spot that fits, minimizing the wasted space. It can be more efficient than First-Fit but still may not be optimal for large grids.' },
		{ label: '3) Next-Fit Algorithm', underline: true, icon: 'solution', description: 'Next-Fit attempts to place polyominoes in the next available space, moving to a new region when a block cannot fit. It is faster but often less efficient than First-Fit and Best-Fit.' },
		{ label: '4) Genetic Algorithms (GA)', underline: true, icon: 'solution', description: 'Genetic Algorithms use evolutionary techniques to explore a wide range of solutions, combining and mutating them to find a highly optimized arrangement. This approach is useful for very complex grids.' },
		{ label: '5) Simulated Annealing (SA)', underline: true, icon: 'solution', description: 'Simulated Annealing uses probabilistic techniques to explore solutions, allowing occasional steps backward to escape local optima. It is effective for finding near-optimal solutions in large search spaces.' },
		{ label: '6) Tabu Search method', underline: true, icon: 'solution', description: 'Tabu Search uses memory structures to avoid cycling back to previously explored solutions, helping to explore new areas of the solution space more effectively.' },
		{ label: '7) Branch & Bound method', underline: true, icon: 'solution', description: 'Branch and Bound systematically explores the solution space, using bounds to prune large sections and find the optimal solution. It is highly accurate but can be slow for very large grids.' },
		{ label: '8) Greedy Algorithm', underline: true, icon: 'solution', description: 'Greedy Algorithms make the best local choice at each step, aiming for a quick, though often suboptimal, solution. They are fast and simple but may not find the best overall arrangement.' },
		{ label: '9) Constraint Programming', underline: true, icon: 'solution', description: 'Constraint Programming uses constraints to limit the search space and find solutions that satisfy all constraints. It is powerful for problems with many complex constraints.' },
		{ label: '10) Backtracking method', underline: true, icon: 'solution', description: 'Backtracking is a recursive algorithm that explores all possible solutions to a problem. It is useful for finding solutions to problems with many possible solutions.' },
	];

	const startY = 60;
	const rowHeight = 60;
	const colX = 30;
	const maxWidth = 300;

	const dropdowns = {};
	let clickAreas = [];
	let iconClickAreas = [];

	rows.forEach((row, index) => {
		const y = startY + index * rowHeight;
		ctx.font = '21px Pixellari';
		ctx.fillStyle = '#000';
		ctx.fillText(row.label, colX, y + 20);

		if (row.icon) {
			const icon = new Image();
			icon.src = `../assets/ic_${row.icon}.png`;
			icon.onload = () => {
				ctx.drawImage(icon, (popup.width - 64), y - 14, 50, 50);
			};
		}
		if (row.description) { dropdowns[index] = { description: row.description, expanded: false, y: y + 40 }; }
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
		iconClickAreas.forEach(area => {
			if (toolbar.isInside(mouseX, mouseY, area.rect)) {
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

		iconClickAreas.forEach(area => {
			if (toolbar.isInside(mouseX, mouseY, area.rect)) {
				handleIconClick(area.index);
			}
		});
	});

	function handleIconClick(index) {
		switch (rows[index].label) {
			case '1) First-Fit Algorithm': console.log('firstFit'); break;
			case '2) Best-Fit Algorithm': console.log('bestFit'); break;
			case '3) Next-Fit Algorithm': console.log('nextFit'); break;
			case '4) Genetic Algorithms (GA)': console.log('genetic'); break;
			case '5) Simulated Annealing (SA)': console.log('simulated'); break;
			case '6) Tabu Search method': console.log('tabu'); break;
			case '7) Branch & Bound method': console.log('branch'); break;
			case '8) Greedy Algorithm': console.log('greedy'); break;
			case '9) Constraint Programming': console.log('constraint'); break;
			case '10) Backtracking method': console.log('backtracking'); break;
		}
		if (toolbar.isMobile) toolbar.closePopup('solve');
	};

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
		iconClickAreas = [];
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
					ctx.drawImage(icon, (popup.width - 64), y - 14, 50, 50);
				};
				iconClickAreas.push({ index, rect: { x: (popup.width - 64), y: y - 14, width: 50, height: 50 } });
			}
			clickAreas.push({ index, rect: { x: colX, y, width: popup.width - colX - 100, height: rowHeight }, type: 'label' });
			if (dropdowns[index] && dropdowns[index].expanded) {
				ctx.font = '16px Pixellari';
				ctx.fillStyle = '#000';
				const linesCount = wrapText(ctx, dropdowns[index].description, colX + 20, y + 55, maxWidth, 20);
				yOffset += linesCount * 20;
			}
		});
	}
	redrawPopup();
};
