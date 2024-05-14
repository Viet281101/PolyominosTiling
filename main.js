class MainApp {
	constructor() {
		this.canvas = document.getElementById('myCanvas');
		this.ctx = this.canvas.getContext('2d');
		this.buttons = [];
		this.loadIconPage();
		this.resizeCanvas();
		this.drawContent();
		this.addEventListeners();

		// Resize canvas on window resize
		window.addEventListener('resize', () => {
			this.resizeCanvas();
			this.drawContent();
		});
		const html = document.querySelector('html');
		Object.assign(html.style, { overflow: 'hidden', height: '100%', width: '100%', margin: '0', padding: '0', });
	};
	loadIconPage() {
		let icon_page = document.createElement('link');
		icon_page.rel = 'shortcut icon';
		icon_page.href = './assets/icon.png';
		document.head.appendChild(icon_page);
	};
	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	};
	drawContent() {
		// Clear canvas
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw title
		this.ctx.font = '30px Arial';
		this.ctx.textAlign = 'center';
		this.ctx.fillText('Pavages de Polyominos', this.canvas.width / 2, 50);

		// Draw buttons
		this.buttons = [];  // Clear previous buttons
		this.drawButton('2D Version', this.canvas.width / 2, 150, () => { window.location.href = './2D/index.html'; });
		this.drawButton('3D Version', this.canvas.width / 2, 250, () => { window.location.href = './3D/index.html'; });
	};
	drawButton(text, x, y, onClick) {
		const buttonWidth = 200;
		const buttonHeight = 50;

		this.ctx.fillStyle = '#4CAF50';
		this.ctx.fillRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight);

		this.ctx.fillStyle = '#fff';
		this.ctx.font = '20px Arial';
		this.ctx.fillText(text, x, y);

		this.buttons.push({ text, x, y, width: buttonWidth, height: buttonHeight, onClick });
	};
	addEventListeners() {
		this.canvas.addEventListener('click', (e) => {
			const rect = this.canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			this.buttons.forEach(button => {
				if (mouseX > button.x - button.width / 2 &&
					mouseX < button.x + button.width / 2 &&
					mouseY > button.y - button.height / 2 &&
					mouseY < button.y + button.height / 2) {
					button.onClick();
				}
			});
		});
		this.canvas.addEventListener('mousemove', (e) => {
			const rect = this.canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			let cursor = 'default';
			this.buttons.forEach(button => {
				if (mouseX > button.x - button.width / 2 &&
					mouseX < button.x + button.width / 2 &&
					mouseY > button.y - button.height / 2 &&
					mouseY < button.y + button.height / 2) {
					cursor = 'pointer';
				}
			});
			this.canvas.style.cursor = cursor;
		});
	};
};

const main_app = new MainApp();
