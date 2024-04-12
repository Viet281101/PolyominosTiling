
class MainApp {
	constructor() {
		this.createContent();
		this.applyStyles();
	};
	createContent() {
		const title = document.createElement('h1');
		title.textContent = "Pavages de Polyominos";
		document.body.appendChild(title);

		const two_btn = document.createElement('a');
		two_btn.textContent = two_btn.title = "2D Version";
		two_btn.href = "./2D/index.html";
		two_btn.className = "button";
		document.body.appendChild(two_btn);

		const three_btn = document.createElement('a');
		three_btn.textContent = three_btn.title = "3D Version";
		three_btn.href = "./3D/index.html";
		three_btn.className = "button";
		document.body.appendChild(three_btn);
	};
	applyStyles() {
		Object.assign(document.body.style, {
			height: '100%',
			margin: '0',
			fontFamily: 'Arial, sans-serif',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center'
		});

		const title = document.querySelector('h1');
		Object.assign(title.style, { marginBottom: '20px' });

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
			button.addEventListener('mouseover', (e) => {e.target.style.backgroundColor = '#45a049'; });
			button.addEventListener('mouseout', (e) => {e.target.style.backgroundColor = '#4CAF50'; });
		});
	};
};

const main_app = new MainApp();

