export function backtrackingAutoTiling(polyominoes, gridBoard, placePolyomino, removePolyomino, redraw, message) {
	const polyominoesCopy = [...polyominoes]; // Clone des polyominos pour ne pas les modifier
	polyominoesCopy.sort((a, b) => b.shape.flat().reduce((acc, val) => acc + val) - a.shape.flat().reduce((acc, val) => acc + val)); // trie par taille
	let index = 0;

	function placeNextPolyomino() {
		if (index >= polyominoesCopy.length) {
			console.log("Pavage Réussi!");
			if (message) {
				message();
			 } // Appel du message de fin de fonction
			return;
		}

		const polyomino = polyominoesCopy[index];
		const originalColor = polyomino.color; // Sauvegarde de la couleur d'origine
		polyomino.color = '#FFFF99'; // Couleur jaune fade pour montrer la sélection
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
						} else {
							polyomino.x = originalX;
							polyomino.y = originalY;
						}
					}
				}

				if (!placed) {
					polyomino.rotateRight();
					rotationAttempts++;
				}
			}

			polyomino.color = originalColor; // Remet la couleur d'origine
			redraw();

			if (placed) {
				index++;
				setTimeout(placeNextPolyomino, 1000); // Appel récursif avec un délai d'une seconde
			} else {
				index++;
				placeNextPolyomino(); // Passer à la pièce suivante si aucune orientation ne fonctionne
			}
		}, 1000); // Délai d'une seconde pour montrer la sélection avant le placement
	}

	placeNextPolyomino();
}; 


export function randomTiling(gridBoard, polyominoes, placePolyomino, redraw , message) {
    const polyominoesCopy = [...polyominoes]; // Cloner les polyominos pour ne pas les modifier
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
            } else {
                // Reinitialisation des coordonnees du polyomino pour la prochaine tentative
                polyomino.x = originalX;
                polyomino.y = originalY;
            }
        }

        if (!placed) {
            consecutiveFails++;
            polyominoesCopy.push(polyomino); // Remise des polyominos non placés dans la liste
        } else {
            consecutiveFails = 0;
        }
    }

    redraw(); // mise à jour de l'affichage après le placement aléatoire des polyominos
	if (message) message(); // Appel du message de fin de fonciton
};


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
    }

    function placeAllPolyominoes(index) {
        if (index >= polyominoes.length) {
            return true; // tous place 
        }

        const polyomino = polyominoes[index];
        let placed = false;

        for (let row = 0; row < gridBoard.rows; row++) {
            for (let col = 0; col < gridBoard.cols; col++) {
                for (let rotation = 0; rotation < 4; rotation++) { //test avec rotation
                    const x = col * gridBoard.gridSize + gridBoard.gridOffsetX;
                    const y = row * gridBoard.gridSize + gridBoard.gridOffsetY;

                    if (canPlace(polyomino, x, y)) {
                        const originalX = polyomino.x;
                        const originalY = polyomino.y;

                        polyomino.x = x;
                        polyomino.y = y;
                        placePolyomino(polyomino);
                        polyomino.isPlaced = true;

                        if (placeAllPolyominoes(index + 1)) {
                            return true;
                        }

                        // annuler placement 
                        polyomino.x = originalX;
                        polyomino.y = originalY;
                        polyomino.isPlaced = false;
                        gridBoard.removePolyomino(polyomino); 
                    }
                    polyomino.rotateRight(); // Rotation
                }
            }
        }

        return placeAllPolyominoes(index + 1); // prochain piece
    };

    // on vide pas la grille pour eviter des obstacles 
    const originalStates = polyominoes.map(p => ({
        x: p.x,
        y: p.y,
        isPlaced: p.isPlaced
    }));

    if (placeAllPolyominoes(0)) {
        console.log("placement ok");
        redraw();
        if (message) 
			{
				message();
			} 
    } else {
        // si pas de solution on remet a letat inital
        polyominoes.forEach((p, i) => {
            p.x = originalStates[i].x;
            p.y = originalStates[i].y;
            p.isPlaced = originalStates[i].isPlaced;
        });
        console.log("rien trouve");
        redraw();
    }
};


export function randomBacktrackingTiling(polyominoes, gridBoard, placePolyomino, removePolyomino, redraw, message) {
    const polyominoesCopy = [...polyominoes]; // Cloner les polyominos pour ne pas les modifier

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    //On melange l'ordre des polyominos
    shuffleArray(polyominoesCopy);

    let index = 0;

    function placeNextPolyomino() {
        if (index >= polyominoesCopy.length) {
            console.log("Pavage Réussi!");
            if (message)
				{
					message();
				} //message de fin
            return;
        }

        const polyomino = polyominoesCopy[index];
        const originalColor = polyomino.color; // Sauvegarde de la couleur d'origine
        polyomino.color = '#FFFF99'; // Couleur jaune fade pour montrer la sélection
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
                        } else {
                            polyomino.x = originalX;
                            polyomino.y = originalY;
                        }
                    }
                }

                if (!placed) {
                    polyomino.rotateRight();
                    rotationAttempts++;
                }
            }

            polyomino.color = originalColor; // Remet la couleur d'origine
            redraw();

            if (placed) {
                index++;
                setTimeout(placeNextPolyomino, 1000); // Appel récursif avec un délai d'une seconde
            } else {
                // Backtrack
                index--;
                const lastPolyomino = polyominoesCopy[index];
                removePolyomino(lastPolyomino);
                setTimeout(placeNextPolyomino, 1000); // Reessaie de placer le polyomino précédent
            }
        }, 1000); // Délai d'une seconde pour montrer la sélection avant le placement
    }
    placeNextPolyomino();
};
