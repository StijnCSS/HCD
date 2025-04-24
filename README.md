# 🖍️ Scribly — Toegankelijk Tekentoetsenbord
### Erik heeft een fysieke beperking waardoor hij moeite heeft om op plekken waar veel beweging is van externe bronnen zijn toetsenbord te gebruiken. Erik wilt een oplossing waardoor hij een toetsenbord heeft waardoor hij zo min mogelijk hoeft te tikken en fouten te corrigeren. Ik ga daarom voor Erik een toetsenbord ontwikkelen waar hij letter kan tekenen. Het grote oppervlak helpt met fouten minimaliseren.

## Week 1 Proof of concept
In week 1 heb ik een simpele HTML canvas opgezet met JavaScript waarin je met je vinger of stylus kunt tekenen. Hiermee wilde ik testen of deze manier van invoer bruikbaar is voor Erik, die moeite heeft met kleine toetsenborden door zijn fysieke beperking.

De opzet was bewust eenvoudig: een wit canvas waar Erik op kon tekenen. Er was nog geen herkenning van letters, enkel de mogelijkheid om te tekenen.

```` js
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mousemove', draw);

function getPos(e) {
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
````



## Eerste feedback moment. 
Erikheeft mijn eerste versie van mijn idee getest in de metro. Hij vond het een leuke manier van typen. Het typen ging goed. ik heb nog niet kunnen testen wat voor output de letters allemaal kunnen maar als ik dit goed instel moet het prima te oden zijn. De metro beweegt een stuk minder dan een trein dus ik ben benieuwd hoe het volgende week gaat verlopen, ik hoop niet dat het heftigere bewegen een groot verschil gaat maken. 

### Feedback week 1
De feedback die ik kreeg van Erik dat hij nog wat feedback miste. Op dit moment is het nog maar een blank canvas.

#### Aanpasingen 
Ik heb een field toegevoegd die ervoor zorgt dat je kan zien wat je typt. ook heb ik bij de buttons een active state gemaakt en als je shift indrukt dan blijft het ook staan


### Week 2 Machine Learning
Deze week heb ik Machine Learning geïntegreerd via Teachable Machine. Ik heb een eigen model getraind dat handgeschreven letters herkent. Dit model is toegevoegd aan het canvas zodat Erik nu letters kan tekenen, die vervolgens automatisch worden omgezet naar tekst.

````js
async function predictFromCanvas() {
  if (!modelReady || !model) return;

  const image = new Image();
  image.src = canvas.toDataURL(); // ⬅️ maakt een afbeelding van je tekening

  image.onload = async () => {
    const prediction = await model.predict(image); // ⬅️ gebruikt Teachable Machine model
    prediction.sort((a, b) => b.probability - a.probability);
    const char = prediction[0].className;

    // Zet letter in tekstveld, met hoofdletter of kleine letter afhankelijk van shift
    typedText.value += shiftMode ? char.toUpperCase() : char.toLowerCase();

    // Wis canvas
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
}
````

![MLomgeving](/images/ml.png)
#### obstakels
Tijdens het testen was 