/**
 * Performs backtracking auto tiling on a grid board using the given polyominoes.
 *
 * @param {Array} polyominoes - The array of polyominoes to be placed on the grid board.
 * @param {GridBoard} gridBoard - The grid board object representing the grid on which the polyominoes will be placed.
 * @param {Function} placePolyomino - The function to place a polyomino on the grid board.
 * @param {Function} removePolyomino - The function to remove a polyomino from the grid board.
 * @param {Function} redraw - The function to redraw the grid board after placing or removing a polyomino.
 * @param {Function} message - An optional callback function to be called when the tiling is complete.
 * @return {void} This function does not return anything.
 */
export function backtrackingAutoTiling(polyominoes, gridBoard, placePolyomino, removePolyomino, redraw, message) {
	const polyominoesCopy = [...polyominoes];
	polyominoesCopy.sort((a, b) => b.shape.flat().reduce((acc, val) => acc + val) - a.shape.flat().reduce((acc, val) => acc + val));
	let index = 0;

	function placeNextPolyomino() {
		if (index >= polyominoesCopy.length) {
			console.log("Pavage Réussi!");
			if (message) { message(); }
			return;
		}
		const polyomino = polyominoesCopy[index];
		const originalColor = polyomino.color;
		polyomino.color = '#FFFF99';
		redraw();
		setTimeout(() => {
			let placed = false;
			let rotationAttempts = 0;
			while (!placed && rotationAttempts < 4) {
				for (let row = 0; row < gridBoard.rows && !placed; row++) {
					for (let col = 0; col < gridBoard.cols && !placed; col++) {
						const originalX = polyomino.x;
						const originalY = polyomino.y;
						polyomino.x = col * gridBoard.gridSize + gridBoard.gridOffsetX;
						polyomino.y = row * gridBoard.gridSize + gridBoard.gridOffsetY;
	
						if (gridBoard.isInBounds(polyomino) && !gridBoard.isOverlapping(polyomino)) {
							placePolyomino(polyomino);
							placed = true;
						} else { polyomino.x = originalX; polyomino.y = originalY; }
					}
				}
				if (!placed) { polyomino.rotateRight(); rotationAttempts++; }
			}
			polyomino.color = originalColor;
			redraw();
			index++;
			placeNextPolyomino();
		}, 1000);
	}
	placeNextPolyomino();
}; 

/**
 * Random tiling of polyominoes blocks to the grid board.
 *
 * @param {Object} gridBoard - The grid board object.
 * @param {Array} polyominoes - The array of polyominoes.
 * @param {Function} placePolyomino - The function to place a polyomino on the grid board.
 * @param {Function} redraw - The function to redraw the grid board.
 * @param {Function} [message] - An optional function to display a message.
 * @return {void}
 */
export function randomTiling(gridBoard, polyominoes, placePolyomino, redraw , message) {
	const polyominoesCopy = [...polyominoes];
	let consecutiveFails = 0;

	while (polyominoesCopy.length > 0 && consecutiveFails < 100) {
		let polyomino = polyominoesCopy.pop();
		let placed = false;

		for (let attempt = 0; attempt < 100; attempt++) {
			const originalX = polyomino.x;
			const originalY = polyomino.y;
			const randomX = Math.floor(Math.random() * gridBoard.cols);
			const randomY = Math.floor(Math.random() * gridBoard.rows);

			polyomino.x = randomX * gridBoard.gridSize + gridBoard.gridOffsetX;
			polyomino.y = randomY * gridBoard.gridSize + gridBoard.gridOffsetY;

			if (gridBoard.isInBounds(polyomino) && !gridBoard.isOverlapping(polyomino)) {
				placePolyomino(polyomino);
				polyomino.isPlaced = true;
				placed = true;
				break;
			} else { polyomino.x = originalX; polyomino.y = originalY; }
		}
		if (!placed) { consecutiveFails++; polyominoesCopy.push(polyomino); }
		else {consecutiveFails = 0; }
	}
	redraw();
	if (message) message();
}

/**
 * Tries to tile the grid with polyominoes using brute force.
 *
 * @param {GridBoard} gridBoard - The grid to be tiled.
 * @param {Array<Polyomino>} polyominoes - The polyominoes to be placed on the grid.
 * @param {Function} placePolyomino - The function to place a polyomino on the grid.
 * @param {Function} redraw - The function to redraw the grid.
 * @param {Function} [message] - An optional function to be called when the tiling is successful.
 * @return {void}
 */
export function bruteForceTiling(gridBoard, polyominoes, placePolyomino, redraw, message) {
	function canPlace(polyomino, x, y) {
		const originalX = polyomino.x;
		const originalY = polyomino.y;
		polyomino.x = x;
		polyomino.y = y;
		if (gridBoard.isInBounds(polyomino) && !gridBoard.isOverlapping(polyomino)) {
			polyomino.x = originalX;
			polyomino.y = originalY;
			return true;
		}
		polyomino.x = originalX;
		polyomino.y = originalY;
		return false;
	};

	function placeAllPolyominoes(index) {
		if (index >= polyominoes.length) { return true; }
		const polyomino = polyominoes[index];

		for (let row = 0; row < gridBoard.rows; row++) {
			for (let col = 0; col < gridBoard.cols; col++) {
				for (let rotation = 0; rotation < 4; rotation++) {
					const x = col * gridBoard.gridSize + gridBoard.gridOffsetX;
					const y = row * gridBoard.gridSize + gridBoard.gridOffsetY;

					if (canPlace(polyomino, x, y)) {
						const originalX = polyomino.x;
						const originalY = polyomino.y;

						polyomino.x = x;
						polyomino.y = y;
						placePolyomino(polyomino);
						polyomino.isPlaced = true;

						if (placeAllPolyominoes(index + 1)) { return true; }

						polyomino.x = originalX;
						polyomino.y = originalY;
						polyomino.isPlaced = false;
						gridBoard.removePolyomino(polyomino); 
					}
					polyomino.rotateRight();
				}
			}
		}
		return placeAllPolyominoes(index + 1);
	};

	const originalStates = polyominoes.map(p => ({ x: p.x, y: p.y, isPlaced: p.isPlaced }));
	if (placeAllPolyominoes(0)) {
		console.log("placement ok");
		redraw();
		if (message) { message(); }
	} else {
		polyominoes.forEach((p, i) => {
			p.x = originalStates[i].x;
			p.y = originalStates[i].y;
			p.isPlaced = originalStates[i].isPlaced;
		});
		console.log("rien trouve");
		redraw();
	}
};

/**
 * Random backtracking tiling for a given set of polyominoes on a grid board.
 *
 * @param {Array} polyominoes - The array of polyominoes to be placed on the grid board.
 * @param {GridBoard} gridBoard - The grid board object representing the grid on which the polyominoes will be placed.
 * @param {Function} placePolyomino - The function to place a polyomino on the grid board.
 * @param {Function} removePolyomino - The function to remove a polyomino from the grid board.
 * @param {Function} redraw - The function to redraw the grid board after placing or removing a polyomino.
 * @param {Function} message - An optional callback function to be called when the tiling is complete.
 * @return {void} This function does not return anything.
 */
export function randomBacktrackingTiling(polyominoes, gridBoard, placePolyomino, removePolyomino, redraw, message) {
	const polyominoesCopy = [...polyominoes];

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	};

	shuffleArray(polyominoesCopy);
	let index = 0;

	function placeNextPolyomino() {
		if (index >= polyominoesCopy.length) {
			console.log("Pavage Réussi!");
			if (message) { message(); }
			return;
		}

		const polyomino = polyominoesCopy[index];
		const originalColor = polyomino.color;
		polyomino.color = '#FFFF99';
		redraw();

		setTimeout(() => {
			let placed = false;
			let rotationAttempts = 0;

			while (!placed && rotationAttempts < 4) {
				for (let row = 0; row < gridBoard.rows && !placed; row++) {
					for (let col = 0; col < gridBoard.cols && !placed; col++) {
						const originalX = polyomino.x;
						const originalY = polyomino.y;
						polyomino.x = col * gridBoard.gridSize + gridBoard.gridOffsetX;
						polyomino.y = row * gridBoard.gridSize + gridBoard.gridOffsetY;

						if (gridBoard.isInBounds(polyomino) && !gridBoard.isOverlapping(polyomino)) {
							placePolyomino(polyomino); placed = true;
						} else { polyomino.x = originalX; polyomino.y = originalY; }
					}
				}
				if (!placed) { polyomino.rotateRight(); rotationAttempts++; }
			}
			polyomino.color = originalColor;
			redraw();

			if (placed) {
				index++;
				setTimeout(placeNextPolyomino, 1000);
			} else {
				index--;
				const lastPolyomino = polyominoesCopy[index];
				removePolyomino(lastPolyomino);
				setTimeout(placeNextPolyomino, 1000);
			}
		}, 1000);
	};
	placeNextPolyomino();
};


/**
 * Automatic tiling the grid based on polyomino placed on the field by the user.
 *
 * @param {GridBoard} gridBoard - The grid board object representing the grid on which the polyominoes will be placed.
 * @param {Array} polyominoes - The array of polyominoes to be placed on the grid board.
 * @param {Function} placePolyomino - The function to place a polyomino on the grid board.
 * @param {Function} removePolyomino - The function to remove a polyomino from the grid board.
 * @param {Function} redraw - The function to redraw the grid board after placing or removing a polyomino.
 * @param {Function} duplicatePolyomino - The function to duplicate a polyomino.
 * @param {Function} message - An optional callback function to be called when the tiling is complete.
 * @return {void} This function does not return anything.
 */

export function fullAutoTiling(gridBoard, polyominoes, placePolyomino, removePolyomino, redraw, duplicatePolyomino, message) {
	function canPlace(polyomino, x, y) {
		const originalX = polyomino.x;
		const originalY = polyomino.y;
		polyomino.x = x;
		polyomino.y = y;
		if (gridBoard.isInBounds(polyomino) && !gridBoard.isOverlapping(polyomino)) {
			polyomino.x = originalX;
			polyomino.y = originalY;
			return true;
		}
		polyomino.x = originalX;
		polyomino.y = originalY;
		return false;
	};

	function placeAllPolyominoes(index) {
		if (index >= polyominoes.length) { return true; }
		const polyomino = polyominoes[index];

		for (let row = 0; row < gridBoard.rows; row++) {
			for (let col = 0; col < gridBoard.cols; col++) {
				for (let rotation = 0; rotation < 4; rotation++) {
					const x = col * gridBoard.gridSize + gridBoard.gridOffsetX;
					const y = row * gridBoard.gridSize + gridBoard.gridOffsetY;

					if (canPlace(polyomino, x, y)) {
						const originalX = polyomino.x;
						const originalY = polyomino.y;

						polyomino.x = x;
						polyomino.y = y;
						duplicatePolyomino(polyomino);
						placePolyomino(polyomino);
						polyomino.isPlaced = true;

						if (placeAllPolyominoes(index + 1)) { return true; }

						polyomino.x = originalX;
						polyomino.y = originalY;
						polyomino.isPlaced = false;
						gridBoard.removePolyomino(polyomino); 
					}
					polyomino.rotateRight();
				}
			}
		}
		return placeAllPolyominoes(index + 1);
	};

	const originalStates = polyominoes.map(p => ({ x: p.x, y: p.y, isPlaced: p.isPlaced }));
	if (placeAllPolyominoes(0)) {
		console.log("placement ok");
		redraw();
		if (message) { message(); }
	} else {
		polyominoes.forEach((p, i) => {
			p.x = originalStates[i].x;
			p.y = originalStates[i].y;
			p.isPlaced = originalStates[i].isPlaced;
		});
		console.log("rien trouve");
		redraw();
	}
}

