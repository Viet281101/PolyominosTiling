export function showTutorialPopup(toolbar) {
	const popupContainer = toolbar.createPopupContainer('tutorialPopup', toolbar.buttons[3].name);
	const popup = popupContainer.querySelector('canvas');
	const ctx = popup.getContext('2d');

	ctx.fillStyle = '#a0a0a0';
	ctx.fillRect(0, 0, popup.width, popup.height);

	const rows = [
		{ label: 'Auto Tiling the Polyominoes Blocks', title: true },
		{ 	label: '1) Create Any Polyomino :',  underline: true, icon: '../assets/ic_plus.png', description: 'Click this icon to open a menu. Select the polyomino you want to spawn it on the field. Drag and drop it onto the grid.' },
		{ 	label: '2) Manipulate the Polyominoes :', underline: true, 	icon: '../assets/ic_solution.png', 
			description: 'Each polyomino has an interactive menu. Click on the polyomino to : \n - rotate left or rotate right \n - flip \n - duplicate \n(the clone will appear below \n the piece selected in another color) \n - or delete.' },
		{ 	label: '3) Grid Settings :', underline: true, icon: '../assets/ic_table.png', description: 'This menu lets you create a new board by setting the grid\'s length and height. Click        to create the grid. \n Options include : \n - deleting the grid \n - blocking cells to prevent polyomino placement \n - creating automatically random \n black cells \n - Clear all black cells \n - and swapping black and empty cells.          ' 	},
		{ 	label: '4) Solving Grid :', underline: true, icon: '../assets/ic_solving.png', description: 'Click this menu to use various AI solvers. Descriptions are available for each solver; just click to read them.' },
		{ 
			label: '5) Use Settings :',  
			underline: true, 
			icon: '../assets/ic_solution.png', 
			description: 'This section facilitates user testing. In this menu, you can: \n - Reset the position \n of the polyominoes to their original spawn points.\n - Shuffle the positions \n of the polyominoes on the field, useful if duplicated pieces overlap.\n - Delete all polyominoes \n from the field and the grid.'
		}
	];
	

	const subIcons = [
		{ path: '../assets/ic_rotate_right.png', x: 245, y: 339 },
		{ path: '../assets/ic_rotate_left.png', x: 285, y: 339},
		{ path: '../assets/ic_flip.png', x: 95, y: 357},
		{ path: '../assets/ic_duplicate.png', x: 135, y: 375},
		{ path: '../assets/ic_trash.png', x: 135, y: 440},
		{ path: '../assets/ic_draw.png', x: 80, y: 560},

		{ path: '../assets/ic_trash.png', x: 182, y: 597},
		{ path: '../assets/ic_blacken_cell.png', x: 310, y: 620},
		{ path: '../assets/ic_random_blacken_cell.png', x: 275, y: 655},

		{ path: '../assets/ic_whiten.png', x: 220, y: 697},
		{ path: '../assets/ic_invert_blacken.png', x: 320, y: 717},
		
		{ path: '../assets/ic_reset.png', x: 200, y: 975},
		{ path: '../assets/ic_shuffle.png', x: 210, y: 1037},
		{ path: '../assets/ic_trash.png', x: 250, y: 1107},
		

	];

	
	const startY = 60;
	const rowHeight = 60;
	const colX = 25;
	const maxWidth = 280;

	const dropdowns = {};
	let clickAreas = [];

	rows.forEach((row, index) => {
		const y = startY + index * rowHeight;
		ctx.font = '21px Pixellari';
		ctx.fillStyle = '#000';
		ctx.fillText(row.label, colX, y + 20);

		
		if (row.description) {
			dropdowns[index] = { description: row.description, expanded: true, y: y + 40 };
		}
	});


	function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
		const paragraphs = text.split('\n');
		let totalLines = 0;
	
		paragraphs.forEach(paragraph => {
			const words = paragraph.split(' ');
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
				ctx.fillText(line, x, y + totalLines * lineHeight + index * lineHeight);
			});
			totalLines += lines.length;
		});
	
		return totalLines;
	}
	

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
					ctx.drawImage(icon, popup.width - 64, y - 14, 50, 50);
				};
				clickAreas.push({ index, rect: { x: popup.width - 94, y: y - 14, width: 50, height: 50 }, type: 'icon' });
			}

			subIcons.forEach(subIcon => {
				if (subIcon.path ) {
					const subIconImage = new Image();
					subIconImage.src = subIcon.path;
					subIconImage.onload = () => {
						ctx.drawImage(subIconImage, subIcon.x, subIcon.y, 25, 25);
					};
				}
			});
			

			clickAreas.push({ index, rect: { x: colX, y, width: popup.width - colX - 100, height: rowHeight }, type: 'label' });

			if (dropdowns[index] && dropdowns[index].expanded) {
				ctx.font = '16px Pixellari';
				ctx.fillStyle = '#000';
				const linesCount = wrapText(ctx, dropdowns[index].description, colX + 15, y + 55, maxWidth, 20);
				yOffset += linesCount * 20;
			}
		});
	};

	redrawPopup();
};

