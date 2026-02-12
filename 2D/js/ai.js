import {
  animateStep,
  canPlaceOnGrid,
  maybeYield,
  restorePolyominoStates,
  shuffleArray,
  snapshotPolyominoStates,
  tryPlaceWithRotations,
} from './ai-utils.js';

const FRAME_BUDGET = 300;
const DEMO_HIGHLIGHT_MS = 300;
const DEMO_PLACE_MS = 300;
const DEMO_BACKTRACK_MS = 300;

/**
 * Place polyominoes from largest to smallest by scanning the grid.
 * This is a greedy visual solver (not exhaustive backtracking).
 *
 * @param {Array} polyominoes
 * @param {Object} gridBoard
 * @param {Function} placePolyomino
 * @param {Function} _removePolyomino Kept for API compatibility.
 * @param {Function} redraw
 * @param {Function} [message]
 * @returns {Promise<void>}
 */
export async function backtrackingAutoTiling(
  polyominoes,
  gridBoard,
  placePolyomino,
  _removePolyomino,
  redraw,
  message
) {
  const counter = { count: 0 };
  const polyominoesCopy = [...polyominoes];

  polyominoesCopy.sort(
    (a, b) =>
      b.shape.flat().reduce((acc, val) => acc + val) -
      a.shape.flat().reduce((acc, val) => acc + val)
  );

  for (let index = 0; index < polyominoesCopy.length; index++) {
    const polyomino = polyominoesCopy[index];
    const originalColor = polyomino.color;

    polyomino.color = '#FFFF99';
    await animateStep(redraw, DEMO_HIGHLIGHT_MS);

    const placed = await tryPlaceWithRotations(
      gridBoard,
      polyomino,
      placePolyomino,
      counter,
      FRAME_BUDGET
    );

    polyomino.color = originalColor;
    if (!placed) {
      polyomino.isPlaced = false;
    }

    await animateStep(redraw, DEMO_PLACE_MS);
  }

  if (message) {
    message();
  }
}

/**
 * Try random positions for each polyomino until success or fail threshold.
 *
 * @param {Object} gridBoard
 * @param {Array} polyominoes
 * @param {Function} placePolyomino
 * @param {Function} redraw
 * @param {Function} [message]
 * @returns {Promise<void>}
 */
export async function randomTiling(gridBoard, polyominoes, placePolyomino, redraw, message) {
  const counter = { count: 0 };
  const polyominoesCopy = [...polyominoes];
  let consecutiveFails = 0;

  while (polyominoesCopy.length > 0 && consecutiveFails < 100) {
    const polyomino = polyominoesCopy.pop();
    let placed = false;

    for (let attempt = 0; attempt < 100; attempt++) {
      await maybeYield(counter, FRAME_BUDGET);

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
        await animateStep(redraw, DEMO_PLACE_MS);
        break;
      }

      polyomino.x = originalX;
      polyomino.y = originalY;
    }

    if (!placed) {
      consecutiveFails += 1;
      polyominoesCopy.push(polyomino);
    } else {
      consecutiveFails = 0;
    }
  }

  redraw();
  if (message) {
    message();
  }
}

/**
 * Exhaustive recursive placement over all cells and rotations.
 *
 * @param {Object} gridBoard
 * @param {Array} polyominoes
 * @param {Function} placePolyomino
 * @param {Function} redraw
 * @param {Function} [message]
 * @returns {Promise<void>}
 */
export async function bruteForceTiling(gridBoard, polyominoes, placePolyomino, redraw, message) {
  const counter = { count: 0 };

  async function placeAllPolyominoes(index) {
    if (index >= polyominoes.length) {
      return true;
    }

    const polyomino = polyominoes[index];

    for (let row = 0; row < gridBoard.rows; row++) {
      for (let col = 0; col < gridBoard.cols; col++) {
        for (let rotation = 0; rotation < 4; rotation++) {
          await maybeYield(counter, FRAME_BUDGET);

          const x = col * gridBoard.gridSize + gridBoard.gridOffsetX;
          const y = row * gridBoard.gridSize + gridBoard.gridOffsetY;

          if (canPlaceOnGrid(gridBoard, polyomino, x, y)) {
            const originalX = polyomino.x;
            const originalY = polyomino.y;

            polyomino.x = x;
            polyomino.y = y;
            placePolyomino(polyomino);
            polyomino.isPlaced = true;
            await animateStep(redraw, DEMO_PLACE_MS);

            if (await placeAllPolyominoes(index + 1)) {
              return true;
            }

            polyomino.x = originalX;
            polyomino.y = originalY;
            polyomino.isPlaced = false;
            gridBoard.removePolyomino(polyomino);
            await animateStep(redraw, DEMO_BACKTRACK_MS);
          }

          polyomino.rotateRight();
        }
      }
    }

    return false;
  }

  const originalStates = snapshotPolyominoStates(polyominoes);
  const solved = await placeAllPolyominoes(0);

  if (!solved) {
    restorePolyominoStates(polyominoes, originalStates);
  }

  redraw();
  if (solved && message) {
    message();
  }
}

/**
 * Randomized ordering with backtracking-style fallback.
 *
 * @param {Array} polyominoes
 * @param {Object} gridBoard
 * @param {Function} placePolyomino
 * @param {Function} removePolyomino
 * @param {Function} redraw
 * @param {Function} [message]
 * @returns {Promise<void>}
 */
export async function randomBacktrackingTiling(
  polyominoes,
  gridBoard,
  placePolyomino,
  removePolyomino,
  redraw,
  message
) {
  const counter = { count: 0 };
  const polyominoesCopy = [...polyominoes];
  shuffleArray(polyominoesCopy);

  let index = 0;

  while (index < polyominoesCopy.length) {
    await maybeYield(counter, FRAME_BUDGET);

    const polyomino = polyominoesCopy[index];
    const originalColor = polyomino.color;

    polyomino.color = '#FFFF99';
    await animateStep(redraw, DEMO_HIGHLIGHT_MS);

    const placed = await tryPlaceWithRotations(
      gridBoard,
      polyomino,
      placePolyomino,
      counter,
      FRAME_BUDGET
    );
    polyomino.color = originalColor;

    if (placed) {
      index += 1;
      await animateStep(redraw, DEMO_PLACE_MS);
      continue;
    }

    if (index === 0) {
      polyomino.isPlaced = false;
      break;
    }

    const previous = polyominoesCopy[index - 1];
    removePolyomino(previous);
    previous.isPlaced = false;
    index -= 1;
    await animateStep(redraw, DEMO_BACKTRACK_MS);
  }

  if (message) {
    message();
  }
}

/**
 * Exhaustive placement variant used by the full automatic mode.
 *
 * @param {Object} gridBoard
 * @param {Array} polyominoes
 * @param {Function} placePolyomino
 * @param {Function} _removePolyomino Kept for API compatibility.
 * @param {Function} redraw
 * @param {Function} _duplicatePolyomino Kept for API compatibility.
 * @param {Function} [message]
 * @returns {Promise<void>}
 */
export async function fullAutoTiling(
  gridBoard,
  polyominoes,
  placePolyomino,
  _removePolyomino,
  redraw,
  _duplicatePolyomino,
  message
) {
  const counter = { count: 0 };

  async function placeAllPolyominoes(index) {
    if (index >= polyominoes.length) {
      return true;
    }

    const polyomino = polyominoes[index];

    for (let row = 0; row < gridBoard.rows; row++) {
      for (let col = 0; col < gridBoard.cols; col++) {
        for (let rotation = 0; rotation < 4; rotation++) {
          await maybeYield(counter, FRAME_BUDGET);

          const x = col * gridBoard.gridSize + gridBoard.gridOffsetX;
          const y = row * gridBoard.gridSize + gridBoard.gridOffsetY;

          if (canPlaceOnGrid(gridBoard, polyomino, x, y)) {
            const originalX = polyomino.x;
            const originalY = polyomino.y;

            polyomino.x = x;
            polyomino.y = y;
            placePolyomino(polyomino);
            polyomino.isPlaced = true;
            await animateStep(redraw, DEMO_PLACE_MS);

            if (await placeAllPolyominoes(index + 1)) {
              return true;
            }

            polyomino.x = originalX;
            polyomino.y = originalY;
            polyomino.isPlaced = false;
            gridBoard.removePolyomino(polyomino);
            await animateStep(redraw, DEMO_BACKTRACK_MS);
          }

          polyomino.rotateRight();
        }
      }
    }

    return false;
  }

  const originalStates = snapshotPolyominoStates(polyominoes);
  const solved = await placeAllPolyominoes(0);

  if (!solved) {
    restorePolyominoStates(polyominoes, originalStates);
  }

  redraw();
  if (solved && message) {
    message();
  }
}
