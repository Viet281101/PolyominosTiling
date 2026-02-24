export const MAIN_CONSTANTS = {
  CAMERA: {
    FOV: 75,
    NEAR: 0.1,
    FAR: 1000,
    DEFAULT_Z: 15,
  },
  RENDERER: {
    PIXEL_RATIO_MAX: 1.5,
    CLEAR_COLOR: '#c3c3c3',
  },
  FPS: {
    SAMPLE_MS: 500,
  },
  INTERACTION: {
    DRAG_SCALE: 0.01,
  },
  GRID: {
    SIZE: 1,
    ROTATION_SNAP_STEP: Math.PI / 2,
    POSITION_KEY_PRECISION: 1000,
  },
};

export const TOOLBAR_CONSTANTS = {
  MOBILE_BREAKPOINT: 800,
  CANVAS_Z_INDEX: '2',
  TOOLTIP_Z_INDEX: '9001',
  TOOLBAR_BG_COLOR: '#333',
  DESKTOP_WIDTH: 50,
  MOBILE_HEIGHT: 50,
  BUTTON_SPACING: 60,
  BUTTON_OUTER_SIZE: 40,
  BUTTON_ICON_SIZE: 30,
  BUTTON_ICON_OFFSET: 10,
  BUTTON_STROKE_OFFSET: 5,
  MOBILE_LEFT_PADDING: 64,
  MOBILE_RIGHT_PADDING: 12,
  HOME_BUTTON_RECT: { x: 10, y: 10, width: 40, height: 40 },
  INITIAL_LAYOUT_PASSES: 3,
  POPUP_IDS: ['cubePopup', 'gridPopup', 'solvePopup', 'tutorialPopup', 'settingsPopup'],
  HOME_REDIRECT_PATH: '../index.html',
};

export const CUBE_POPUP_CONSTANTS = {
  BACKGROUND_COLOR: '#a0a0a0',
  FORM: {
    START_X: 20,
    START_Y: 80,
    ROW_SPACING: 60,
    HEADER_SPACING_OFFSET: 10,
    INPUT_SIZE: 24,
    INPUT_WIDTH: 40,
    INPUT_BORDER: '1px solid #000',
    INPUT_FONT_SIZE: 22,
    LABEL_FONT: '22px Pixellari',
  },
  PREVIEW: {
    CANVAS_WIDTH: 346,
    CANVAS_HEIGHT: 400,
    TOP: 172,
    LEFT: 10,
    BORDER: '2px solid #000',
    BACKGROUND_COLOR: 0x646464,
    CAMERA: {
      FOV: 75,
      NEAR: 0.1,
      FAR: 1000,
      Z: 5,
    },
    LIGHT: {
      COLOR: 0xffffff,
      INTENSITY: 1,
      POSITION: { x: 0, y: 1, z: 1 },
    },
  },
  NAV: {
    TOP: 580,
    HEIGHT: 46,
    WIDTH: 350,
    LEFT: 10,
    LABEL_FONT: '14px Pixellari',
    ICON_SIZE: 40,
  },
  ACTION: {
    TOP: 800,
    HEIGHT: 32,
    WIDTH: 350,
    LEFT: 10,
    GAP: 8,
    BUTTON_WIDTH: 110,
    BUTTON_HEIGHT: 32,
    BUTTON_FONT: '22px Pixellari',
    BUTTON_BORDER: '1px solid #000',
  },
  TEXT_ZONE: {
    X: 10,
    Y: 660,
    WIDTH_OFFSET: 48,
    HEIGHT: 84,
    PADDING: 10,
    BORDER: '3px solid #000',
    FONT_SIZE: 18,
  },
  LAYER: {
    FORM_Z_INDEX: '1001',
    CONTENT_Z_INDEX: '1002',
  },
  COLORS: {
    BLACK: '#000',
    WHITE: '#fff',
    ACTION_BUTTON_BG: '#00f',
    ACTION_BUTTON_TEXT: '#fff',
    CUBE_COLOR: 0x00ff00,
    EDGE_COLOR: 0x000000,
    HIGHLIGHT_COLOR: 0x0000ff,
    HIGHLIGHT_DIM_OPACITY: 0.2,
  },
};

export const GRID_POPUP_CONSTANTS = {
  BACKGROUND_COLOR: '#a0a0a0',
  INITIAL_VALUES: { x: 3, y: 3, z: 3 },
  LAYOUT: {
    START_Y: 76,
    ROW_HEIGHT: 76,
    LABEL_X: 30,
    LABEL_TOP_OFFSET: -2,
    BOX_LEFT: 10,
    BOX_TOP_OFFSET: -30,
    BOX_WIDTH_OFFSET: 26,
    BOX_BORDER: '2px solid #fff',
    BOX_Z_INDEX: '1001',
    CONTENT_Z_INDEX: '1002',
    ICON_LEFT_OFFSET: 94,
    ICON_TOP_OFFSET: -14,
    ICON_SIZE: 50,
    INPUT_LEFT: 'calc(100% - 120px)',
    INPUT_WIDTH: 80,
    INPUT_HEIGHT: 24,
    INPUT_BORDER: '1px solid #000',
    INPUT_FONT_SIZE: 22,
  },
  FONT: {
    LABEL: '22px Pixellari',
  },
  COLORS: {
    LABEL: '#000',
    INPUT_BACKGROUND: '#fff',
    INPUT_TEXT: '#000',
  },
};

export const SETTINGS_POPUP_CONSTANTS = {
  BACKGROUND_COLOR: '#a0a0a0',
  LAYOUT: {
    START_Y: 76,
    ROW_HEIGHT: 76,
    LABEL_X: 30,
    LABEL_TOP_OFFSET: -2,
    BOX_LEFT: 10,
    BOX_TOP_OFFSET: -30,
    BOX_WIDTH_OFFSET: 26,
    BOX_ROWS: 4,
    BOX_BORDER: '2px solid #fff',
    BOX_Z_INDEX: '1001',
    CONTENT_Z_INDEX: '1002',
    ICON_LEFT_OFFSET: 94,
    ICON_TOP_OFFSET: -14,
    ICON_SIZE: 50,
  },
  FONT: {
    TITLE: '20px Pixellari',
    LABEL: '20px Pixellari',
  },
  COLORS: {
    TEXT: '#000',
  },
};

export const SOLVE_POPUP_CONSTANTS = {
  BACKGROUND_COLOR: '#a0a0a0',
  LAYOUT: {
    CONTENT_LEFT: 14,
    CONTENT_TOP: 54,
    CONTENT_WIDTH_OFFSET: 28,
    CONTENT_PADDING_BOTTOM: 24,
    CONTENT_Z_INDEX: '1002',
    ITEM_MARGIN_BOTTOM: 14,
    HEADER_LINE_HEIGHT: '1.3',
    HEADER_ICON_PADDING_RIGHT: 58,
    DESCRIPTION_MARGIN_TOP: 8,
    DESCRIPTION_MARGIN_LEFT: 12,
    DESCRIPTION_LINE_HEIGHT: '1.35',
    ICON_TOP: -4,
    ICON_SIZE: 42,
  },
  FONT: {
    TITLE: '23px Pixellari',
    HEADER: '21px Pixellari',
    DESCRIPTION: '16px Pixellari',
  },
  COLORS: {
    TEXT: '#000',
  },
};

export const TUTORIAL_POPUP_CONSTANTS = {
  BACKGROUND_COLOR: '#a0a0a0',
  LAYOUT: {
    CONTENT_LEFT: 14,
    CONTENT_TOP: 54,
    CONTENT_WIDTH_OFFSET: 28,
    CONTENT_PADDING_BOTTOM: 24,
    CONTENT_Z_INDEX: '1002',
    ITEM_MARGIN_BOTTOM: 14,
    HEADER_LINE_HEIGHT: '1.3',
    HEADER_ICON_PADDING_RIGHT: 52,
    DESCRIPTION_MARGIN_TOP: 8,
    DESCRIPTION_MARGIN_LEFT: 12,
    DESCRIPTION_LINE_HEIGHT: '1.25',
    ICON_TOP: -2,
    ICON_SIZE: 38,
    INLINE_ICON_SIZE: 20,
    INLINE_ICON_MARGIN: '0 4px',
    LINE_MARGIN_BOTTOM: 6,
  },
  FONT: {
    TITLE: '23px Pixellari',
    HEADER: '21px Pixellari',
    DESCRIPTION: '20px Pixellari',
  },
  COLORS: {
    HEADER: '#000050',
    DESCRIPTION: '#000',
  },
};

export const GRID_POPUP_ROWS = [
  { label: 'Create new grid board here', box: true, title: true },
  { label: 'Enter n° x size', type: 'input', key: 'x' },
  { label: 'Enter n° y size', type: 'input', key: 'y' },
  { label: 'Enter n° z size', type: 'input', key: 'z' },
  { label: 'Draw grid by click to =>', icon: 'draw', key: 'draw' },
  { label: 'Delete current grid :', icon: 'trash', key: 'trash' },
];

export const SETTINGS_POPUP_CONTENT = {
  TITLE: 'Quick settings',
  ACTION_LABEL: 'Delete Selected Polycube',
  ACTION_ICON: 'trash',
};

export const SOLVE_POPUP_ROWS = [
  { label: 'Auto tiling the Polycube blocks', title: true },
  {
    label: '1) First-Fit Algorithm',
    underline: true,
    icon: 'solution',
    actionKey: 'firstFit',
    description:
      'First-Fit tries to place Polycube blocks into the grid in the order they are given, placing each in the first available space that fits. It is simple and quick, but may not always be efficient for large grids.',
  },
  {
    label: '2) Best-Fit Algorithm',
    underline: true,
    icon: 'solution',
    actionKey: 'bestFit',
    description:
      'Best-Fit places each Polycube block into the tightest spot that fits, minimizing the wasted space. It is often more efficient than First-Fit but can still be suboptimal for large grids.',
  },
  {
    label: '3) Next-Fit Algorithm',
    underline: true,
    icon: 'solution',
    actionKey: 'nextFit',
    description:
      'Next-Fit attempts to place Polycube blocks in the next available space, moving to a new region when a block cannot fit. It is faster than First-Fit and Best-Fit but usually less space-efficient.',
  },
  {
    label: '4) Genetic Algorithms (GA)',
    underline: true,
    icon: 'solution',
    actionKey: 'genetic',
    description:
      'Genetic Algorithms use evolutionary techniques to explore a wide range of solutions, combining and mutating them to find a highly optimized arrangement. This approach is effective for very complex grids with large solution spaces.',
  },
  {
    label: '5) Simulated Annealing (SA)',
    underline: true,
    icon: 'solution',
    actionKey: 'simulated',
    description:
      'Simulated Annealing uses probabilistic techniques to explore solutions, occasionally allowing worse solutions to escape local optima. It is effective for finding near-optimal solutions in large search spaces.',
  },
  {
    label: '6) Tabu Search method',
    underline: true,
    icon: 'solution',
    actionKey: 'tabu',
    description:
      'Tabu Search uses memory structures to avoid revisiting previously explored solutions, helping to explore new areas of the solution space more effectively. It is useful for escaping local optima.',
  },
  {
    label: '7) Branch & Bound method',
    underline: true,
    icon: 'solution',
    actionKey: 'branch',
    description:
      'Branch and Bound systematically explores the solution space, using bounds to prune large sections and find the optimal solution. It is highly accurate but can be computationally intensive for very large grids.',
  },
  {
    label: '8) Greedy Algorithm',
    underline: true,
    icon: 'solution',
    actionKey: 'greedy',
    description:
      'Greedy Algorithms make the best local choice at each step, aiming for a quick, though often suboptimal, solution. They are fast and simple, but may not find the best overall arrangement.',
  },
  {
    label: '9) Constraint Programming',
    underline: true,
    icon: 'solution',
    actionKey: 'constraint',
    description:
      'Constraint Programming uses constraints to limit the search space and find solutions that satisfy all constraints. It is powerful for problems with many complex and interdependent constraints.',
  },
  {
    label: '10) Backtracking method',
    underline: true,
    icon: 'solution',
    actionKey: 'backtracking',
    description:
      'Backtracking is a recursive algorithm that explores all possible solutions to a problem, backtracking when a solution path fails. It is useful for finding solutions to problems with many possible solutions, but can be slow for large grids.',
  },
  {
    label: '11) Particle Swarm Optimization',
    underline: true,
    icon: 'solution',
    actionKey: 'pso',
    description:
      'PSO uses a population of particles that move through the solution space to find optimal solutions, based on their own experience and the experience of neighboring particles. It is effective for continuous optimization problems.',
  },
  {
    label: '12) Ant Colony Optimization',
    underline: true,
    icon: 'solution',
    actionKey: 'aco',
    description:
      'ACO uses artificial ants to explore the solution space and deposit pheromones on paths they find good, guiding subsequent ants to better solutions. It is effective for combinatorial optimization problems.',
  },
  {
    label: '13) Harmony Search (HS)',
    underline: true,
    icon: 'solution',
    actionKey: 'harmony',
    description:
      'HS mimics the process of musical improvisation to find a harmonious solution, using a harmony memory to store good solutions and generate new solutions through random changes and memory considerations.',
  },
  {
    label: '14) Bee Algorithm (BA)',
    underline: true,
    icon: 'solution',
    actionKey: 'bee',
    description:
      'BA simulates the foraging behavior of bees to explore the solution space, using scout bees to explore new areas and worker bees to exploit known good areas.',
  },
  {
    label: '15) Differential Evolution (DE)',
    underline: true,
    icon: 'solution',
    actionKey: 'de',
    description:
      'DE optimizes problems by iteratively improving a candidate solution with regard to a given measure of quality, using differential variations to guide the search process.',
  },
];

export const TUTORIAL_POPUP_ROWS = [
  { label: 'How to interact with this version', title: true },
  {
    label: '1) Create Any Polycube',
    underline: true,
    icon: 'plus',
    description:
      "Click this icon to open a menu.\n\nSteps to create a Polycube:\n\n1. Enter the desired number of cubes in the 'N° cubes' input field.\n2. Enter the position coordinates (x, y, z) for the Polycube.\n3. Use the 'Previous' [icons/arrow_left] and 'Next' [icons/arrow_right] buttons to navigate through highlighted cubes.\n4. Click 'Select' [icons/select] to add the highlighted cube to your Polycube.\n5. Click 'Undo' [icons/reset] to remove the last added cube.\n6. Click 'Create' to finalize and create the Polycube.\n7. Click 'Clear' to reset the Polycube creation and start over.\n8. Use the 'Info' button to display current Polycube information.",
  },
  {
    label: '2) Manipulate the Polycubes :',
    underline: true,
    description:
      "Click to any Polycube on the scene to select it.\n\nAfter selecting a Polycube, you can:\n\n1. Use the [icons/left_click] 'Left Mouse Button' to rotate the Polycube.\n2. Use the [icons/right_click] 'Right Mouse Button' to move the Polycube.\n\nCustom visible views of Polycubes with DAT.GUI :\n\n1. Click 'polycubeVisible' to show or hide the selected Polycube on the scene.\n2. Click 'allCubesVisible' to show or hide all Polycubes on the scene.",
  },
  {
    label: '3) Grid Board Settings',
    underline: true,
    icon: 'table',
    description:
      "This menu lets you delete and or create the new grid.\n\n1. Click [icons/trash] 'Delete current grid' to delete the grid.\n2. Enter (x, y, z) sizes for the grid. Click [icons/draw] to create a new grid.",
  },
  {
    label: '4) Manipulate the Grid Board :',
    underline: true,
    description:
      "You can only control the grid through camera perspective with Orbit Controls :\n\n1. Use the [icons/left_click] 'Left Mouse Button' to rotate the grid.\n2. Use the [icons/right_click] 'Right Mouse Button' to move the grid.\n3. Use the 'Center Mouse Button' to zoom the grid.\n\nCustom visible views of grid with DAT.GUI :\n\n1. Click 'showInnerGrid' to show the grid's inner grid.\n2. Click 'showOuterGrid' to show the grid's outer grid. But this is already shown by default.",
  },
  {
    label: '5) Use Settings :',
    underline: true,
    icon: 'setting',
    description:
      "In this menu, you can:\n\n1. Click [icons/trash] 'Delete Selected Polycube' to delete the Polycube that you are currently selected.",
  },
];

export const TUTORIAL_ICON_MAP = {
  '[icons/arrow_left]': '../assets/icons/arrow_left.png',
  '[icons/arrow_right]': '../assets/icons/arrow_right.png',
  '[icons/select]': '../assets/icons/select.png',
  '[icons/reset]': '../assets/icons/reset.png',
  '[icons/left_click]': '../assets/icons/left_click.png',
  '[icons/right_click]': '../assets/icons/right_click.png',
  '[icons/trash]': '../assets/icons/trash.png',
  '[icons/draw]': '../assets/icons/draw.png',
};
