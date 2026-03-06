import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref
} from 'https://unpkg.com/vue@3.5.13/dist/vue.esm-browser.js'
import {
  GRID_SIZE,
  createInitialState,
  directionFromKey,
  queueDirection,
  tick,
  togglePause
} from '../game/snake.js'

const TICK_MS = 140

export default {
  setup() {
    const gameState = ref(createInitialState())
    let intervalId = null

    const cells = computed(() => {
      const snakeSet = new Set(gameState.value.snake.map((segment) => `${segment.x},${segment.y}`))
      const result = []
      for (let y = 0; y < GRID_SIZE; y += 1) {
        for (let x = 0; x < GRID_SIZE; x += 1) {
          const key = `${x},${y}`
          let type = 'empty'
          if (gameState.value.food && gameState.value.food.x === x && gameState.value.food.y === y) {
            type = 'food'
          }
          if (snakeSet.has(key)) {
            type = 'snake'
          }
          result.push({ key, type })
        }
      }
      return result
    })

    function stopTicker() {
      if (intervalId !== null) {
        window.clearInterval(intervalId)
        intervalId = null
      }
    }

    function startTicker() {
      stopTicker()
      intervalId = window.setInterval(() => {
        gameState.value = tick(gameState.value)
      }, TICK_MS)
    }

    function restartGame() {
      gameState.value = createInitialState()
    }

    function handleDirection(direction) {
      gameState.value = queueDirection(gameState.value, direction)
    }

    function handlePause() {
      gameState.value = togglePause(gameState.value)
    }

    function handleKeydown(event) {
      const direction = directionFromKey(event.key)
      if (event.key === ' ') {
        event.preventDefault()
        handlePause()
        return
      }
      if (!direction) {
        return
      }
      event.preventDefault()
      handleDirection(direction)
    }

    onMounted(() => {
      window.addEventListener('keydown', handleKeydown)
      startTicker()
    })

    onBeforeUnmount(() => {
      window.removeEventListener('keydown', handleKeydown)
      stopTicker()
    })

    return {
      gameState,
      cells,
      handleDirection,
      handlePause,
      restartGame
    }
  },
  template: `
    <section class="snake-page">
      <h1>Snake</h1>
      <p class="status-row">
        <span>Score: {{ gameState.score }}</span>
        <span v-if="gameState.paused">Paused</span>
        <span v-else-if="gameState.gameOver">Game over</span>
        <span v-else>Running</span>
      </p>

      <div class="board" role="grid" aria-label="Snake board">
        <div v-for="cell in cells" :key="cell.key" :class="['cell', cell.type]"></div>
      </div>

      <div class="controls">
        <button type="button" @click="handleDirection('up')">↑</button>
        <div class="horizontal-controls">
          <button type="button" @click="handleDirection('left')">←</button>
          <button type="button" @click="handleDirection('down')">↓</button>
          <button type="button" @click="handleDirection('right')">→</button>
        </div>
      </div>

      <div class="actions">
        <button type="button" @click="handlePause" :disabled="gameState.gameOver">
          {{ gameState.paused ? 'Resume' : 'Pause' }}
        </button>
        <button type="button" @click="restartGame">Restart</button>
      </div>

      <p class="help-text">Controls: Arrow keys / WASD, Space for pause.</p>
    </section>
  `
}
