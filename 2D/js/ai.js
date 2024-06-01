
export function autoTiling(polyominoes, gridBoard, placePolyomino, removePolyomino) {
    const polyominoesCopy = [...polyominoes]; // Clone des polyominos pour ne pas les modifier
    polyominoesCopy.sort((a, b) => b.shape.flat().reduce((acc, val) => acc + val) - a.shape.flat().reduce((acc, val) => acc + val)); // trie par taille
    if (tryPlacePolyominoes(0, polyominoesCopy, gridBoard, placePolyomino, removePolyomino)) {
        console.log("Pavage Reussi!");
    } else {
        console.log("Pavage Echouer!");
    }
};

function tryPlacePolyominoes(index, polyominoes, gridBoard, placePolyomino, removePolyomino) {
    if (index >= polyominoes.length) {
        return true; // Tous les polyominos sont place
    }

    const polyomino = polyominoes[index];

    for (let row = 0; row < gridBoard.rows; row++) {
        for (let col = 0; col < gridBoard.cols; col++) {
            const originalX = polyomino.x;
            const originalY = polyomino.y;
            polyomino.x = col * gridBoard.gridSize + gridBoard.gridOffsetX;
            polyomino.y = row * gridBoard.gridSize + gridBoard.gridOffsetY;

            if (gridBoard.isInBounds(polyomino) && !gridBoard.isOverlapping(polyomino)) {
                placePolyomino(polyomino);
                if (tryPlacePolyominoes(index + 1, polyominoes, gridBoard, placePolyomino, removePolyomino)) {
                    return true;
                }
                removePolyomino(polyomino);
            }

            polyomino.x = originalX;
            polyomino.y = originalY;
        }
    }

    return false;
};
