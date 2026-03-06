import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createInitialState,
  nextFoodPosition,
  queueDirection,
  tick,
  togglePause
} from '../src/game/snake.js'

test('moves snake forward on tick', () => {
  const state = createInitialState(8)
  const moved = tick(state)

  assert.deepEqual(moved.snake[0], { x: state.snake[0].x + 1, y: state.snake[0].y })
  assert.equal(moved.score, 0)
})

test('grows and increments score when eating food', () => {
  const state = createInitialState(8)
  const withFoodAhead = {
    ...state,
    food: { x: state.snake[0].x + 1, y: state.snake[0].y }
  }

  const moved = tick(withFoodAhead, () => 0)

  assert.equal(moved.snake.length, state.snake.length + 1)
  assert.equal(moved.score, 1)
  assert.notDeepEqual(moved.food, withFoodAhead.food)
})

test('ends game on wall collision', () => {
  const state = {
    ...createInitialState(5),
    snake: [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }],
    direction: 'right',
    queuedDirection: 'right'
  }

  const moved = tick(state)
  assert.equal(moved.gameOver, true)
})

test('prevents immediate reverse direction', () => {
  const state = createInitialState(10)
  const queued = queueDirection(state, 'left')

  assert.equal(queued.queuedDirection, 'right')
})

test('toggles pause and blocks movement while paused', () => {
  const state = createInitialState(8)
  const paused = togglePause(state)
  const moved = tick(paused)

  assert.equal(paused.paused, true)
  assert.deepEqual(moved, paused)
})

test('spawns food only on free cells', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 }
  ]
  const food = nextFoodPosition(2, snake, () => 0)

  assert.deepEqual(food, { x: 1, y: 1 })
})
