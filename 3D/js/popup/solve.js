export function showSolvePopup(toolbar) {
  const popupContainer = toolbar.createPopupContainer('solvePopup', toolbar.buttons[2].name);
  const popup = popupContainer.querySelector('canvas');
  const ctx = popup.getContext('2d');

  ctx.fillStyle = '#a0a0a0';
  ctx.fillRect(0, 0, popup.width, popup.height);

  const rows = [
    { label: 'Auto tiling the Polycube blocks', title: true },
    {
      label: '1) First-Fit Algorithm',
      underline: true,
      icon: 'solution',
      description:
        'First-Fit tries to place Polycube blocks into the grid in the order they are given, placing each in the first available space that fits. It is simple and quick, but may not always be efficient for large grids.',
    },
    {
      label: '2) Best-Fit Algorithm',
      underline: true,
      icon: 'solution',
      description:
        'Best-Fit places each Polycube block into the tightest spot that fits, minimizing the wasted space. It is often more efficient than First-Fit but can still be suboptimal for large grids.',
    },
    {
      label: '3) Next-Fit Algorithm',
      underline: true,
      icon: 'solution',
      description:
        'Next-Fit attempts to place Polycube blocks in the next available space, moving to a new region when a block cannot fit. It is faster than First-Fit and Best-Fit but usually less space-efficient.',
    },
    {
      label: '4) Genetic Algorithms (GA)',
      underline: true,
      icon: 'solution',
      description:
        'Genetic Algorithms use evolutionary techniques to explore a wide range of solutions, combining and mutating them to find a highly optimized arrangement. This approach is effective for very complex grids with large solution spaces.',
    },
    {
      label: '5) Simulated Annealing (SA)',
      underline: true,
      icon: 'solution',
      description:
        'Simulated Annealing uses probabilistic techniques to explore solutions, occasionally allowing worse solutions to escape local optima. It is effective for finding near-optimal solutions in large search spaces.',
    },
    {
      label: '6) Tabu Search method',
      underline: true,
      icon: 'solution',
      description:
        'Tabu Search uses memory structures to avoid revisiting previously explored solutions, helping to explore new areas of the solution space more effectively. It is useful for escaping local optima.',
    },
    {
      label: '7) Branch & Bound method',
      underline: true,
      icon: 'solution',
      description:
        'Branch and Bound systematically explores the solution space, using bounds to prune large sections and find the optimal solution. It is highly accurate but can be computationally intensive for very large grids.',
    },
    {
      label: '8) Greedy Algorithm',
      underline: true,
      icon: 'solution',
      description:
        'Greedy Algorithms make the best local choice at each step, aiming for a quick, though often suboptimal, solution. They are fast and simple, but may not find the best overall arrangement.',
    },
    {
      label: '9) Constraint Programming',
      underline: true,
      icon: 'solution',
      description:
        'Constraint Programming uses constraints to limit the search space and find solutions that satisfy all constraints. It is powerful for problems with many complex and interdependent constraints.',
    },
    {
      label: '10) Backtracking method',
      underline: true,
      icon: 'solution',
      description:
        'Backtracking is a recursive algorithm that explores all possible solutions to a problem, backtracking when a solution path fails. It is useful for finding solutions to problems with many possible solutions, but can be slow for large grids.',
    },
    {
      label: '11) Particle Swarm Optimization',
      underline: true,
      icon: 'solution',
      description:
        'PSO uses a population of particles that move through the solution space to find optimal solutions, based on their own experience and the experience of neighboring particles. It is effective for continuous optimization problems.',
    },
    {
      label: '12) Ant Colony Optimization',
      underline: true,
      icon: 'solution',
      description:
        'ACO uses artificial ants to explore the solution space and deposit pheromones on paths they find good, guiding subsequent ants to better solutions. It is effective for combinatorial optimization problems.',
    },
    {
      label: '13) Harmony Search (HS)',
      underline: true,
      icon: 'solution',
      description:
        'HS mimics the process of musical improvisation to find a harmonious solution, using a harmony memory to store good solutions and generate new solutions through random changes and memory considerations.',
    },
    {
      label: '14) Bee Algorithm (BA)',
      underline: true,
      icon: 'solution',
      description:
        'BA simulates the foraging behavior of bees to explore the solution space, using scout bees to explore new areas and worker bees to exploit known good areas.',
    },
    {
      label: '15) Differential Evolution (DE)',
      underline: true,
      icon: 'solution',
      description:
        'DE optimizes problems by iteratively improving a candidate solution with regard to a given measure of quality, using differential variations to guide the search process.',
    },
  ];

  const content = document.createElement('div');
  content.style.position = 'absolute';
  content.style.left = '14px';
  content.style.top = '54px';
  content.style.width = `${popup.width - 28}px`;
  content.style.paddingBottom = '24px';
  content.style.zIndex = '1002';
  popupContainer.appendChild(content);

  rows.forEach((row, index) => {
    const item = document.createElement('div');
    item.style.position = 'relative';
    item.style.marginBottom = '14px';
    content.appendChild(item);

    const header = document.createElement('div');
    header.textContent = row.label;
    header.style.font = row.title ? '23px Pixellari' : '21px Pixellari';
    header.style.color = '#000';
    header.style.lineHeight = '1.3';
    header.style.paddingRight = row.icon ? '58px' : '0';
    if (row.underline) header.style.textDecoration = 'underline';
    if (!row.title) header.style.cursor = 'pointer';
    item.appendChild(header);

    let description = null;
    if (row.description) {
      description = document.createElement('div');
      description.textContent = row.description;
      description.style.display = 'none';
      description.style.marginTop = '8px';
      description.style.marginLeft = '12px';
      description.style.font = '16px Pixellari';
      description.style.color = '#000';
      description.style.whiteSpace = 'normal';
      description.style.lineHeight = '1.35';
      item.appendChild(description);
    }

    if (row.icon) {
      const iconButton = document.createElement('img');
      iconButton.src = `../assets/ic_${row.icon}.png`;
      iconButton.style.position = 'absolute';
      iconButton.style.right = '0';
      iconButton.style.top = '-4px';
      iconButton.style.width = '42px';
      iconButton.style.height = '42px';
      iconButton.style.cursor = 'pointer';
      item.appendChild(iconButton);

      iconButton.addEventListener('click', (event) => {
        event.stopPropagation();
        handleIconClick(row.label);
        if (toolbar.isMobile) toolbar.closePopup('solve');
      });
    }

    if (!row.title && description) {
      header.addEventListener('click', () => {
        description.style.display = description.style.display === 'none' ? 'block' : 'none';
      });
    }

    if (index === 0 && description) {
      description.style.display = 'block';
    }
  });
}

function handleIconClick(label) {
  switch (label) {
    case '1) First-Fit Algorithm':
      console.log('firstFit');
      break;
    case '2) Best-Fit Algorithm':
      console.log('bestFit');
      break;
    case '3) Next-Fit Algorithm':
      console.log('nextFit');
      break;
    case '4) Genetic Algorithms (GA)':
      console.log('genetic');
      break;
    case '5) Simulated Annealing (SA)':
      console.log('simulated');
      break;
    case '6) Tabu Search method':
      console.log('tabu');
      break;
    case '7) Branch & Bound method':
      console.log('branch');
      break;
    case '8) Greedy Algorithm':
      console.log('greedy');
      break;
    case '9) Constraint Programming':
      console.log('constraint');
      break;
    case '10) Backtracking method':
      console.log('backtracking');
      break;
    case '11) Particle Swarm Optimization':
      console.log('pso');
      break;
    case '12) Ant Colony Optimization':
      console.log('aco');
      break;
    case '13) Harmony Search (HS)':
      console.log('harmony');
      break;
    case '14) Bee Algorithm (BA)':
      console.log('bee');
      break;
    case '15) Differential Evolution (DE)':
      console.log('de');
      break;
  }
}
