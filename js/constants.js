export const TETRIS_CONFIG = {
  CANVAS_WIDTH: 300,
  CANVAS_HEIGHT: 600,
  BLOCK_SIZE: 30,
  DROP_INTERVAL_MS: 1000,
};

export const KEYBOARD_KEYS = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_DOWN: 'ArrowDown',
  ARROW_UP: 'ArrowUp',
};

export const TETRIMINOS = [
  { shape: [[1, 1, 1, 1]], color: 'cyan' },
  {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: 'blue',
  },
  {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: 'orange',
  },
  {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: 'gold',
  },
  {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    color: 'green',
  },
  {
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: 'purple',
  },
  {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    color: 'red',
  },
];

export const POLYOMINO_TYPES = ['domino', 'tromino', 'tetromino', 'pentomino'];

export const POLYOMINO_CONFIG = {
  CELL_SIZE: 30,
  MIN_SPEED: 1,
  MAX_SPEED: 1.5,
  MAX_OUT_OF_BOUNDS_FRAMES: 30,
  OUT_OF_BOUNDS_MARGIN_MULTIPLIER: 4,
};

export const POLYOMINO_SHAPES = {
  domino: [[[1, 1]], [[1], [1]]],
  tromino: [
    [[1, 1, 1]], // I
    [[1], [1], [1]], // I
    [
      [1, 1],
      [1, 0],
    ], // L
    [
      [1, 1],
      [0, 1],
    ], // J
  ],
  tetromino: [
    [[1, 1, 1, 1]], // I
    [
      [1, 1],
      [1, 1],
    ], // O
    [
      [1, 1, 1],
      [0, 1, 0],
    ], // T
    [
      [1, 1, 0],
      [0, 1, 1],
    ], // S
    [
      [0, 1, 1],
      [1, 1, 0],
    ], // Z
    [
      [1, 1, 1],
      [1, 0, 0],
    ], // L
    [
      [1, 1, 1],
      [0, 0, 1],
    ], // J
  ],
  pentomino: [
    [[1, 1, 1, 1, 1]], // I
    [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ], // L
    [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ], // T
    [
      [1, 1, 1],
      [1, 1, 0],
    ], // P
    [
      [1, 1, 1],
      [0, 1, 1],
    ], // F
    [
      [1, 1, 1, 1],
      [0, 0, 1, 0],
    ], // T
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ], // Y
    [
      [0, 1, 1],
      [1, 1, 0],
      [1, 0, 0],
    ], // S
    [
      [1, 1],
      [1, 1],
      [1, 0],
    ], // U
    [
      [1, 0, 1],
      [1, 1, 1],
    ], // X
    [
      [1, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ], // T
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ], // W
  ],
};
