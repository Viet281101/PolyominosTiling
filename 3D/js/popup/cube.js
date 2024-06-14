import { create3DPopup } from './popup3d.js';

export function createCubePopup(toolbar) {
	const popupContainer = toolbar.createPopupContainer('cubePopup', toolbar.buttons[0].name);
	const popup = popupContainer.querySelector('canvas');
	const ctx = popup.getContext('2d');

	ctx.fillStyle = '#a0a0a0';
	ctx.fillRect(0, 0, popup.width, popup.height);

	const rows = [
		{ label: 'Enter values to make Polycubes', box: true, title: true },
		{ label: 'N° squares per cube:  n = ', type: 'input' },
		{ label: 'Position X: ', type: 'input' },
		{ label: 'Position Y: ', type: 'input' },
		{ label: 'Position Z: ', type: 'input' },
		{ label: 'Open 3D Editor : ', button: true },
		{ label: 'Selected Coordinates:', textZone: true }
	];

	const startY = 76;
	const rowHeight = 76;
	const colX = 20;
	let n = 1;
	let position = { x: 0, y: 0, z: 0 };
	let coordinates = [];

	rows.forEach((row, index) => {
		const y = startY + index * rowHeight;
		if (row.box) {
			ctx.strokeStyle = '#fff';
			ctx.strokeRect(10, (y - 30), (popup.width - 20), (rowHeight * (row.title ? 5 : 1)));
		}
		ctx.font = '22px Pixellari';
		ctx.fillStyle = '#000';
		ctx.fillText(row.label, colX, y + 20);

		if (row.type === 'input') {
			let defaultValue;
			if (index === 1) { defaultValue = n; }
			else if (index === 2) { defaultValue = position.x; }
			else if (index === 3) { defaultValue = position.y; }
			else if (index === 4) { defaultValue = position.z; }
			createInputField(popupContainer, y, defaultValue);
		}
		if (row.button) {
			createButton(popupContainer, y, 'Editor', () => {
				toolbar.is3DPopupOpen = true;
				create3DPopup(toolbar, n, (coords) => {
					coordinates = coords;
					console.log('Selected Coordinates:', coordinates);
					updateTextZone(popupContainer, coordinates);
					toolbar.is3DPopupOpen = false;
				});
			});
		}
		if (row.textZone) { createTextZone(popupContainer, y); }
	});

	popupContainer.querySelectorAll('input[type="number"]').forEach((input, index) => {
		input.addEventListener('change', (e) => {
			if (index === 0) n = parseInt(e.target.value);
			if (index === 1) position.x = parseInt(e.target.value);
			if (index === 2) position.y = parseInt(e.target.value);
			if (index === 3) position.z = parseInt(e.target.value);
		});
	});

	popup.addEventListener('mousemove', (e) => {
		const rect = popup.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		let cursor = 'default';

		rows.forEach((row, index) => {
			const y = startY + index * rowHeight;
			if (row.button && toolbar.isInside(mouseX, mouseY, { x: popup.width - 120, y: y - 14, width: 110, height: 30 })) {
				cursor = 'pointer';
			}
		});

		popup.style.cursor = cursor;
	});

	createButton(popupContainer, startY + (rows.length * rowHeight) + rowHeight, 'Create Cube', () => {
		if (coordinates.length === 0) {
			alert('Please select coordinates in the 3D Editor first!');
			return;
		}
		toolbar.mainApp.addPolycube({ n, cubes: coordinates, color: 0x00ff00, position });
		toolbar.closePopup('cube');
	});
};

function createInputField(popupContainer, y, defaultValue) {
	const input = document.createElement('input');
	input.type = 'number';
	input.value = defaultValue;
	input.style.position = 'absolute';
	input.style.left = 'calc(100% - 90px)';
	input.style.top = `${y}px`;
	input.style.width = '60px';
	input.style.height = '24px';
	input.style.border = '1px solid #000';
	input.style.backgroundColor = '#fff';
	input.style.fontSize = '22px';
	input.style.fontFamily = 'Pixellari';
	input.style.color = '#000';
	input.style.zIndex = '1001';
	input.classList.add('popup-input');
	popupContainer.appendChild(input);
};

function createButton(popupContainer, y, label, onClick) {
	const button = document.createElement('button');
	button.innerText = label;
	button.style.position = 'absolute';
	button.style.left = 'calc(100% - 180px)';
	button.style.top = `${y}px`;
	button.style.width = '160px';
	button.style.height = '30px';
	button.style.border = '1px solid #000';
	button.style.backgroundColor = '#fff';
	button.style.fontSize = '20px';
	button.style.fontFamily = 'Pixellari';
	button.style.color = '#0000ff';
	button.style.zIndex = '1001';
	button.style.cursor = 'pointer';
	button.addEventListener('click', onClick);
	button.classList.add('popup-button');
	popupContainer.appendChild(button);
};

function createTextZone(popupContainer, y) {
	const textZone = document.createElement('div');
	textZone.style.position = 'absolute';
	textZone.style.left = '20px';
	textZone.style.top = `${y + 30}px`;
	textZone.style.width = 'calc(100% - 40px)';
	textZone.style.height = '100px';
	textZone.style.border = '1px solid #000';
	textZone.style.backgroundColor = '#fff';
	textZone.style.fontSize = '16px';
	textZone.style.fontFamily = 'Pixellari';
	textZone.style.color = '#000';
	textZone.style.overflowY = 'scroll';
	textZone.style.zIndex = '1001';
	textZone.classList.add('popup-textzone');
	popupContainer.appendChild(textZone);
};

function updateTextZone(popupContainer, coordinates) {
	const textZone = popupContainer.querySelector('.popup-textzone');
	textZone.innerHTML = coordinates.map(coord => `(${coord[0]}, ${coord[1]}, ${coord[2]})`).join('<br>');
};
