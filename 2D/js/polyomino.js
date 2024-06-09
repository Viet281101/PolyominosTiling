import { Polyomino, SHAPES, getRandomColor } from '../polyomino.js';

export function showPolyominoPopup(toolbar) {
	const popupContainer = toolbar.createPopupContainer('polyominoPopup', toolbar.buttons[0].name);

	const shapes = Object.keys(SHAPES);
	const shapeSize = 24;
	const padding = 90;

	const popup = popupContainer.querySelector('canvas');
	const ctx = popup.getContext('2d');
	const width = popup.width;
	const height = popup.height;

	ctx.fillStyle = '#a0a0a0';
	ctx.fillRect(0, 0, width, height);

	const polyominoes = [];

	shapes.forEach((shape, index) => {
		const y = 50 + index * (shapeSize + padding) + shapeSize / 2;
		ctx.fillStyle = '#d1d1d1';
		ctx.fillRect(10, y - shapeSize / 2, 180, shapeSize + 20);
		ctx.strokeStyle = '#000';
		ctx.strokeRect(10, y - shapeSize / 2, 180, shapeSize + 20);

		ctx.font = '20px Pixellari';
		ctx.fillStyle = '#000';
		ctx.fillText(shape.replace(/_/g, ' '), 15, y + 7);

		const polyomino = new Polyomino(SHAPES[shape].map(row => [...row]), 200, y - shapeSize / 2, getRandomColor(), toolbar.mainApp, shape.replace(/_/g, ' '));
		polyomino.draw(ctx, shapeSize, false);
		polyomino.x = 200;
		polyomino.y = y - shapeSize / 2;
		polyomino.width = shapeSize * polyomino.shape[0].length;
		polyomino.height = shapeSize * polyomino.shape.length;

		polyominoes.push({ polyomino, shape, shapeSize, y });
	});

	popup.addEventListener('mousemove', (e) => {
		const rect = popup.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		let cursor = 'default';

		polyominoes.forEach(({ polyomino, y }) => {
			const leftColumnRect = { x: 10, y: y - shapeSize / 2, width: 180, height: shapeSize + 20 };
			const rightColumnRect = { x: polyomino.x, y: polyomino.y, width: polyomino.width, height: polyomino.height };

			if (toolbar.isInside(mouseX, mouseY, leftColumnRect) || toolbar.isInside(mouseX, mouseY, rightColumnRect)) {
				cursor = 'pointer';
			}
		});

		popup.style.cursor = cursor;
	});

	popup.addEventListener('click', (e) => {
		const rect = popup.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const getRandomPosition = (max) => Math.floor(Math.random() * max);

		const canvasPaddingX = getRandomPosition(window.innerWidth < 600 ? 300 : 1200) + ((window.innerWidth < 600) ? 0 : 45);
		const canvasPaddingY = getRandomPosition(170) + ((window.innerHeight < 600) ? 45 : 0);

		polyominoes.forEach(({ polyomino, shape, shapeSize, y }) => {
			const leftColumnRect = { x: 10, y: y - shapeSize / 2, width: 180, height: shapeSize + 20 };
			const rightColumnRect = { x: polyomino.x, y: polyomino.y, width: polyomino.width, height: polyomino.height };

			if (toolbar.isInside(mouseX, mouseY, leftColumnRect) || toolbar.isInside(mouseX, mouseY, rightColumnRect)) {
				const newPolyomino = new Polyomino(SHAPES[shape].map(row => [...row]), canvasPaddingX, canvasPaddingY, getRandomColor(), toolbar.mainApp, shape.replace(/_/g, ' '));
				toolbar.mainApp.polyominoes.push(newPolyomino);
				toolbar.mainApp.redraw();
				if (toolbar.isMobile) {toolbar.closePopup('polyomino');}
			}
		});
	});
};
