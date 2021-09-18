import { Universe, Cell } from 'wasm-game-of-life';
import { memory } from 'wasm-game-of-life/wasm_game_of_life_bg';

const universe = Universe.new(50, 50);
const width = universe.get_width();
const height = universe.get_height();

const CELL_SIZE = 15;
const GRID_COLOR = '#CCCCCC';
const DEAD_COLOR = '#FFFFFF';
const ALIVE_COLOR = '#000000';

const canvas = document.getElementById('game-of-life-canvas');
const playPauseButton = document.getElementById('play-pause');

canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

let isPaused = true;

const ctx = canvas.getContext('2d');

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  for (let y = 0; y <= width; y++) {
    ctx.moveTo(y * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(y * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  for (let x = 0; x <= height; x++) {
    ctx.moveTo(0, x * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, x * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => {
  return row * width + column;
};

const bitIsSet = (n, arr) => {
  const byte = Math.floor(n / 8);
  const mask = 1 << n % 8;
  return (arr[byte] & mask) === mask;
};

const drawCells = () => {
  const cellsPtr = universe.get_cells();
  const cells = new Uint8Array(memory.buffer, cellsPtr, (width * height) / 8);

  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = getIndex(row, col);

      ctx.fillStyle = bitIsSet(idx, cells) ? ALIVE_COLOR : DEAD_COLOR;

      ctx.fillRect(
        col * (CELL_SIZE + 1) + 1,
        row * (CELL_SIZE + 1) + 1,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }

  ctx.stroke();
};

const renderLoop = () => {
  universe.tick();

  drawGrid();
  drawCells();
};

let interval = null;

const play = () => {
  playPauseButton.textContent = '⏸';
  isPaused = false;
  interval = setInterval(() => renderLoop(), 30);
};

const pause = () => {
  playPauseButton.textContent = '▶';
  isPaused = true;
  clearInterval(interval);
};

playPauseButton.addEventListener('click', () => {
  if (isPaused) {
    play();
  } else {
    pause();
  }
});

drawGrid();
drawCells();
play();
