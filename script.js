const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const canvasContainerWidth = window.innerWidth * 0.9;
  const canvasContainerHeight = window.innerHeight * 0.8;
  canvas.width = canvasContainerWidth;
  canvas.height = canvasContainerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let drawing = false;
let resetTimeout;

function scheduleCanvasReset() {
  clearTimeout(resetTimeout);
  resetTimeout = setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 1000); // 1 second of inactivity
}

canvas.addEventListener('pointerdown', (e) => {
  drawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
  scheduleCanvasReset();
});

canvas.addEventListener('pointermove', (e) => {
  if (!drawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
  scheduleCanvasReset();
});

canvas.addEventListener('pointerup', () => {
  drawing = false;
});

canvas.addEventListener('pointerleave', () => {
  drawing = false;
});

const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Prevent touch scrolling
canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
canvas.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });