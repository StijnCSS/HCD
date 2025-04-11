window.addEventListener('load', () => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  

  // resizing
  function resizeCanvas() {
    const container = document.querySelector(".sketchpad");
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    canvas.width = bounds.width - 32;
    canvas.height = bounds.height;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // variables
  let painting = false;

  function startPosition(e) {
    painting = true;
    draw(e); // draw the first point
  }

  function finishedPosition() {
    painting = false;
    ctx.beginPath(); // reset the path so lines don’t connect
  }

  function draw(e) {
    if (!painting) return;

    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  
  // event listeners (use pointer events for stylus/touch support)
  canvas.addEventListener('pointerdown', startPosition);
  canvas.addEventListener('pointerup', finishedPosition);
  canvas.addEventListener('pointermove', draw);

  const resetButton = document.getElementById('resetButton');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

});