window.addEventListener('load', () => {
  let lastInputTime = Date.now();
  let isCheckingIdle = false;
  let shiftMode = false;
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";

  const clearBtn = document.getElementById('clear');
  const typedText = document.getElementById('typedText');
  const copyBtn = document.getElementById('copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(typedText.value)
        .then(() => console.log('Text copied to clipboard')) //debugin
        .catch(err => console.error('Error copying text: ', err)); //debugin
    });
  }

  // Spatie button
  const spaceBtn = document.getElementById('space');
  if (spaceBtn) {
    spaceBtn.addEventListener('click', () => {
      typedText.value += ' ';
    });
  }
  // Backspace button
  const clearTextBtn = document.getElementById('clearText');
  if (clearTextBtn) {
    clearTextBtn.addEventListener('click', () => {
      typedText.value = '';
    });
  }
  // shift button
  const shiftBtn = document.getElementById('shift');
  if (shiftBtn) {
    shiftBtn.addEventListener('click', () => {
      shiftMode = !shiftMode;
      shiftBtn.classList.toggle('active', shiftMode);
    });
  }

  let drawing = false;
  let modelReady = false;
  let predictionTimeout;


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
  lastInputTime = Date.now();
    const [x, y] = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
  
  async function predictFromCanvas() {
    if (!modelReady || !model) return;

    const image = new Image();
    image.src = canvas.toDataURL();
    image.onload = async () => {
      const prediction = await model.predict(image);
      console.log("FULL prediction array:", prediction);
      prediction.sort((a, b) => b.probability - a.probability);
      const char = prediction[0].className;
      typedText.value += shiftMode ? char.toUpperCase() : char.toLowerCase();
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
  }


  function endDraw() {
    drawing = false;
    ctx.closePath();
    if (predictionTimeout) clearTimeout(predictionTimeout);
    if (!isCheckingIdle) {
      isCheckingIdle = true;
      checkIdle();
    }
  }

// Clear button haalt 1 teken weg 
  clearBtn.addEventListener('click', () => {
    typedText.value = typedText.value.slice(0, -1);
  });

  // Load Teachable Machine model
  const URL = "https://teachablemachine.withgoogle.com/models/-uYpKMTS7/";
  let model;

  async function loadModel() {
    if (typeof tmImage === 'undefined') {
      console.error("Teachable Machine library not loaded yet.");
      return;
    }
  
    model = await tmImage.load(URL + "model.json", URL + "metadata.json");
    modelReady = true;
    
    console.log("Model loaded");
  }

  // Wait for tmImage to be defined before calling loadModel
const waitForTM = setInterval(() => {
    if (typeof tmImage !== 'undefined') {
      clearInterval(waitForTM);
      loadModel();
    }
  }, 100); // check every 100ms

  function checkIdle() {
    const now = Date.now();
    if (now - lastInputTime >= 500) {
      isCheckingIdle = false;
      predictFromCanvas();
    } else {
      requestAnimationFrame(checkIdle);
    }
  }
});
