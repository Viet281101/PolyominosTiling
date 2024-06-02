import { Polyomino, SHAPES, getRandomColor } from '../polyomino.js';

export function showPolyominoPopup(toolbar) {
	const popupContainer = toolbar.createPopupContainer('polyominoPopup', toolbar.buttons[0].name);

	const shapes = Object.keys(SHAPES);
	const shapeSize = 30;
	const padding = 80;

	const popup = popupContainer.querySelector('canvas');
	const ctx = popup.getContext('2d');
	const width = popup.width;
	const height = popup.height;

	ctx.fillStyle = '#a0a0a0';
	ctx.fillRect(0, 0, width, height);

	shapes.forEach((shape, index) => {
		const y = 40 + index * (shapeSize + padding) + shapeSize / 2;
		ctx.fillStyle = '#d1d1d1';
		ctx.fillRect(10, y - shapeSize / 2, 180, shapeSize + 20);
		ctx.strokeStyle = '#000';
		ctx.strokeRect(10, y - shapeSize / 2, 180, shapeSize + 20);

		ctx.font = '20px Pixellari';
		ctx.fillStyle = '#0000c4';
		ctx.fillText(shape.replace(/_/g, ' '), 15, y + 7);

		const polyomino = new Polyomino(SHAPES[shape].map(row => [...row]), 200, y - shapeSize / 2, getRandomColor(), toolbar.mainApp);
		polyomino.draw(ctx, shapeSize, false);
		polyomino.x = 200;
		polyomino.y = y - shapeSize / 2;
		polyomino.width = shapeSize * polyomino.shape[0].length;
		polyomino.height = shapeSize * polyomino.shape.length;

		attachPopupClickEvent(toolbar, popup, polyomino, shape, shapeSize, y);
	});

	popup.addEventListener('mousemove', (e) => {
		const rect = popup.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		let cursor = 'default';

		shapes.forEach((shape, index) => {
			const y = 40 + index * (shapeSize + padding) + shapeSize / 2;
			const polyomino = new Polyomino(SHAPES[shape].map(row => [...row]), 200, y - shapeSize / 2, getRandomColor(), toolbar.mainApp);
			if (toolbar.isInside(mouseX, mouseY, polyomino) || toolbar.isInside(mouseX, mouseY, { x: 10, y: y - shapeSize / 2, width: 180, height: shapeSize + 20 })) {
				cursor = 'pointer';
			}
		});

		popup.style.cursor = cursor;
	});
};

function attachPopupClickEvent(toolbar, popup, polyomino, shape, shapeSize, y) {
	popup.addEventListener('click', (e) => {
		const rect = popup.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const onMouseDown = (mousePos) => {
			const newPolyomino = new Polyomino(SHAPES[shape].map(row => [...row]), mousePos.x, mousePos.y, getRandomColor(), toolbar.mainApp);
			toolbar.mainApp.polyominoes.push(newPolyomino);
			toolbar.mainApp.redraw();
			toolbar.closePopup('polyomino');
		};
		if (toolbar.isInside(mouseX, mouseY, polyomino) || toolbar.isInside(mouseX, mouseY, { x: 10, y: y - shapeSize / 2, width: 180, height: shapeSize + 20 })) {
			onMouseDown({ x: mouseX, y: mouseY });
		}
	});
};
