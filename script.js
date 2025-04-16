window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";

  const clearBtn = document.getElementById('clear');
  const predictBtn = document.getElementById('predict');
  const output = document.getElementById('output');
  const URL = "https://teachablemachine.withgoogle.com/models/5Pgnhz02_/";
  let model;

  let drawing = false;

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mousemove', draw);

  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchend', endDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });

  function getPos(e) {
    if (e.touches) {
      return [e.touches[0].clientX - canvas.offsetLeft, e.touches[0].clientY - canvas.offsetTop];
    }
    return [e.offsetX, e.offsetY];
  }

  function startDraw(e) {
    drawing = true;
    const [x, y] = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(e) {
    if (!drawing) return;
    const [x, y] = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDraw() {
    drawing = false;
    ctx.closePath();
  }

  clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    output.textContent = 'Canvas cleared!';
  });

  async function loadModel() {
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
    console.log("Model loaded");
  }

  loadModel();

  predictBtn.addEventListener('click', async () => {
    const image = new Image();
    image.src = canvas.toDataURL();
    image.onload = async () => {
      const prediction = await model.predict(image);
      prediction.sort((a, b) => b.probability - a.probability);
      output.textContent = `You drew: ${prediction[0].className} (${(prediction[0].probability * 100).toFixed(1)}%)`;
    };
  });
});