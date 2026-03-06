export const GRID_SIZE = 16
export const INITIAL_DIRECTION = 'right'

const DIRECTION_VECTORS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
}

const OPPOSITE_DIRECTIONS = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
}

export function createInitialState(gridSize = GRID_SIZE) {
  const center = Math.floor(gridSize / 2)

  return {
    gridSize,
    snake: [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center }
    ],
    direction: INITIAL_DIRECTION,
    queuedDirection: INITIAL_DIRECTION,
    food: { x: center + 3, y: center },
    score: 0,
    gameOver: false,
    paused: false
  }
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTION_VECTORS[nextDirection] || state.gameOver) {
    return state
  }

  const activeDirection = state.queuedDirection || state.direction
  if (OPPOSITE_DIRECTIONS[activeDirection] === nextDirection) {
    return state
  }

  return {
    ...state,
    queuedDirection: nextDirection
  }
}

export function nextFoodPosition(gridSize, snake, randomFn = Math.random) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`))
  const freeCells = []

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const key = `${x},${y}`
      if (!occupied.has(key)) {
        freeCells.push({ x, y })
      }
    }
  }

  if (freeCells.length === 0) {
    return null
  }

  const index = Math.floor(randomFn() * freeCells.length)
  return freeCells[index]
}

export function tick(state, randomFn = Math.random) {
  if (state.gameOver || state.paused) {
    return state
  }

  const direction = state.queuedDirection || state.direction
  const vector = DIRECTION_VECTORS[direction]
  const head = state.snake[0]
  const nextHead = {
    x: head.x + vector.x,
    y: head.y + vector.y
  }

  const hitWall =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= state.gridSize ||
    nextHead.y >= state.gridSize

  if (hitWall) {
    return {
      ...state,
      direction,
      gameOver: true
    }
  }

  const ateFood = nextHead.x === state.food.x && nextHead.y === state.food.y
  const currentSnake = ateFood ? state.snake : state.snake.slice(0, -1)
  const hitBody = currentSnake.some(
    (segment) => segment.x === nextHead.x && segment.y === nextHead.y
  )

  if (hitBody) {
    return {
      ...state,
      direction,
      gameOver: true
    }
  }

  const grownSnake = [nextHead, ...state.snake]
  const nextSnake = ateFood ? grownSnake : grownSnake.slice(0, -1)
  const nextFood = ateFood
    ? nextFoodPosition(state.gridSize, nextSnake, randomFn)
    : state.food

  return {
    ...state,
    direction,
    queuedDirection: direction,
    snake: nextSnake,
    food: nextFood,
    score: state.score + (ateFood ? 1 : 0),
    gameOver: nextFood === null
  }
}

export function togglePause(state) {
  if (state.gameOver) {
    return state
  }

  return {
    ...state,
    paused: !state.paused
  }
}

export function directionFromKey(key) {
  const normalized = key.toLowerCase()
  const map = {
    arrowup: 'up',
    w: 'up',
    arrowdown: 'down',
    s: 'down',
    arrowleft: 'left',
    a: 'left',
    arrowright: 'right',
    d: 'right'
  }

  return map[normalized] || null
}
