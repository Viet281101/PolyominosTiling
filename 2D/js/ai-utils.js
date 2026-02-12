/**
 * Wait until next browser frame.
 * @returns {Promise<void>}
 */
export function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

/**
 * Wait for a duration without blocking the main thread.
 * @param {number} durationMs
 * @returns {Promise<void>}
 */
export async function waitMs(durationMs) {
  if (durationMs <= 0) {
    return;
  }

  const start = performance.now();
  while (performance.now() - start < durationMs) {
    await nextFrame();
  }
}

/**
 * Redraw and keep the current visual step visible for a short duration.
 * @param {Function} redraw
 * @param {number} durationMs
 * @returns {Promise<void>}
 */
export async function animateStep(redraw, durationMs) {
  redraw();
  await waitMs(durationMs);
}

/**
 * Yield periodically to keep UI responsive during heavy loops.
 * @param {{count: number}} counter
 * @param {number} frameBudget
 * @returns {Promise<void>}
 */
export async function maybeYield(counter, frameBudget) {
  counter.count += 1;
  if (counter.count >= frameBudget) {
    counter.count = 0;
    await nextFrame();
  }
}

/**
 * Snapshot mutable placement state for later restore.
 * @param {Array} polyominoes
 * @returns {Array<{x:number,y:number,isPlaced:boolean}>}
 */
export function snapshotPolyominoStates(polyominoes) {
  return polyominoes.map((p) => ({ x: p.x, y: p.y, isPlaced: p.isPlaced }));
}

/**
 * Restore polyomino placement state.
 * @param {Array} polyominoes
 * @param {Array<{x:number,y:number,isPlaced:boolean}>} states
 */
export function restorePolyominoStates(polyominoes, states) {
  polyominoes.forEach((p, i) => {
    p.x = states[i].x;
    p.y = states[i].y;
    p.isPlaced = states[i].isPlaced;
  });
}

/**
 * In-place Fisher-Yates shuffle.
 * @param {Array} array
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Check if a polyomino can be placed on (x, y) without mutating its final position.
 * @param {Object} gridBoard
 * @param {Object} polyomino
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
export function canPlaceOnGrid(gridBoard, polyomino, x, y) {
  const originalX = polyomino.x;
  const originalY = polyomino.y;

  polyomino.x = x;
  polyomino.y = y;

  const canPlace = gridBoard.isInBounds(polyomino) && !gridBoard.isOverlapping(polyomino);

  polyomino.x = originalX;
  polyomino.y = originalY;

  return canPlace;
}

/**
 * Try to place one polyomino by scanning all cells and 4 rotations.
 * @param {Object} gridBoard
 * @param {Object} polyomino
 * @param {Function} placePolyomino
 * @param {{count:number}} counter
 * @param {number} frameBudget
 * @returns {Promise<boolean>}
 */
export async function tryPlaceWithRotations(
  gridBoard,
  polyomino,
  placePolyomino,
  counter,
  frameBudget
) {
  const startX = polyomino.x;
  const startY = polyomino.y;

  for (let rotation = 0; rotation < 4; rotation++) {
    for (let row = 0; row < gridBoard.rows; row++) {
      for (let col = 0; col < gridBoard.cols; col++) {
        await maybeYield(counter, frameBudget);

        const x = col * gridBoard.gridSize + gridBoard.gridOffsetX;
        const y = row * gridBoard.gridSize + gridBoard.gridOffsetY;

        polyomino.x = x;
        polyomino.y = y;

        if (gridBoard.isInBounds(polyomino) && !gridBoard.isOverlapping(polyomino)) {
          placePolyomino(polyomino);
          polyomino.isPlaced = true;
          return true;
        }

        polyomino.x = startX;
        polyomino.y = startY;
      }
    }

    polyomino.rotateRight();
  }

  polyomino.x = startX;
  polyomino.y = startY;
  return false;
}
