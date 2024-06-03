export function backtrackingAutoTiling(polyominoes, gridBoard, placePolyomino, removePolyomino, redraw) {
	const polyominoesCopy = [...polyominoes]; // Clone des polyominos pour ne pas les modifier
	polyominoesCopy.sort((a, b) => b.shape.flat().reduce((acc, val) => acc + val) - a.shape.flat().reduce((acc, val) => acc + val)); // trie par taille
	let index = 0;

	function placeNextPolyomino() {
		if (index >= polyominoesCopy.length) {
			console.log("Pavage Réussi!");
			return;
		}

		const polyomino = polyominoesCopy[index];
		const originalColor = polyomino.color; // Sauvegarde de la couleur d'origine
		polyomino.color = '#FFFF99'; // Couleur jaune fade pour montrer la selection
		redraw(); 

		setTimeout(() => {
			let placed = false;

			for (let row = 0; row < gridBoard.rows && !placed; row++) {
				for (let col = 0; col < gridBoard.cols && !placed; col++) {
					const originalX = polyomino.x;
					const originalY = polyomino.y;
					polyomino.x = col * gridBoard.gridSize + gridBoard.gridOffsetX;
					polyomino.y = row * gridBoard.gridSize + gridBoard.gridOffsetY;

					if (gridBoard.isInBounds(polyomino) && !gridBoard.isOverlapping(polyomino)) {
						placePolyomino(polyomino);
						placed = true;
					} else {
						polyomino.x = originalX;
						polyomino.y = originalY;
					}
				}
			}

			// On remet la couleur d'origine
			polyomino.color = originalColor;
			redraw();

			if (placed) {
				index++;
				setTimeout(placeNextPolyomino, 1000); //Appel rzcursif avec un delai d'une seconde
			} else {
				console.log("Pavage Échoué!");
			}
		}, 1000); // Delai une seconde pour montrer la selection avant le placement
	};

	placeNextPolyomino();
};
