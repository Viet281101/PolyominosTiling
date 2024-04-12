class MainApp {
	constructor() {
		this.loadIconPage();
		this.createContent();
		this.applyStyles();
	};
	loadIconPage() {
		let icon_page = document.createElement('link');
		icon_page.rel = 'shortcut icon';
		icon_page.href = './assets/icon.png';
		document.head.appendChild(icon_page);
	};
	createContent() {
		const container = document.createElement('div');
		container.className = 'content';
		document.body.appendChild(container);

		const title = document.createElement('h1');
		title.textContent = "Pavages de Polyominos";
		container.appendChild(title);

		const buttonConfigs = [
			{ text: "2D Version", href: "./2D/index.html" },
			{ text: "3D Version", href: "./3D/index.html" }
		];
		buttonConfigs.forEach(config => {
			const button = document.createElement('a');
			button.textContent = button.title = config.text;
			button.href = config.href;
			button.className = "button";
			container.appendChild(button);
		});
	};
	applyStyles() {
		Object.assign(document.body.style, {
			height: '100%', margin: '0',
			alignItems: 'center', justifyContent: 'center',
			fontFamily: 'Arial, sans-serif'
		});

		const container = document.querySelector('.content');
		Object.assign(container.style, {
			display: 'flex', flexDirection: 'column', zIndex: '2',
			alignItems: 'center', justifyContent: 'center'
		});

		const title = document.querySelector('h1');
		Object.assign(title.style, { marginBottom: '20px', marginTop: '20px' });

		const buttons = document.querySelectorAll('.button');
		buttons.forEach(button => {
			button.style.backgroundColor = '#4CAF50';
			Object.assign(button.style, {
				fontSize: '20px',
				padding: '10px 20px',
				margin: '10px',
				cursor: 'pointer',
				textDecoration: 'none',
				color: 'white',
				border: 'none', borderRadius: '5px',
				transition: 'background-color 0.3s ease'
			});
			button.addEventListener('mouseover', (e) => { e.target.style.backgroundColor = '#45a049'; });
			button.addEventListener('mouseout', (e) => { e.target.style.backgroundColor = '#4CAF50'; });
		});
	};
};

const main_app = new MainApp();
