# 🖍️ Scribly — Toegankelijk Tekentoetsenbord
### Erik heeft een fysieke beperking waardoor hij moeite heeft om op plekken waar veel beweging is van externe bronnen zijn toetsenbord te gebruiken. Erik wilt een oplossing waardoor hij een toetsenbord heeft waardoor hij zo min mogelijk hoeft te tikken en fouten te corrigeren. Ik ga daarom voor Erik een toetsenbord ontwikkelen waar hij letter kan tekenen. Het grote oppervlak helpt met fouten minimaliseren.

## Week 1 Proof of concept
![proof of concept](/images/v1.png)
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

 
 
 ## Test 02 zonder Erik maar wel in de trein
 ![Week02test](/images/Week%202.png)
 Ik heb mijn 2e versie getest. In deze versie heb ik veel meer feedback toegevoegd. Je ziet onder de het canvas een tekst dat laat zien wat de machine learning denkt. en ik heb in de heading toegeovegd wat de bedoel is. 'draw a letter with your finger'. De feedback die ik kreeg was dat de canvas erg hoog op de pagina staat en dat de buttons klein zijn en moeilijk om te lezen. Een probleem dat ik had was dat alle inputs die ik deed allemaal dezelfde response gaven. er stond steeds `you drew: C(90,0%)`. Na een heleboel testen en te checken wat het canvas precies naar de back-end stuurde kwam ik erachter dat alleen de zwarte lijnen gestuurd werden zonder de witte achtergrond. Mijn machine learning is getrained op een zwarte lijn met een witte achtergrond.
 ````ctx.fillStyle = "#fff";````
 Door 1 regel JS toe te dat het canvas een witte background gaf kreeg ik opeens wel de juiste resultaten.
 
 ## week 3 BUTTONS BUTTONS
 ![my styling](/images/styling.png)
 In deze week heb de laatste core functionaliteiten toegevoegd om de app compleet te maken. In week 2 was het typen allemaal goed geintegreerd en was er al wat feedback. Er miste nog wat core functionaliteit zoals. 
 - Caps
 - lock
 - Wissen
 - Kopiëren 
 - spatie
 - backspace
 - Duidelijke output  
 
 ```` js
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
  
    const copyBtn = document.getElementById('copy');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(typedText.value)
        .then(() => console.log('Text copied to clipboard')) //debugin
        .catch(err => console.error('Error copying text: ', err)); //debugin
    });
  }
````  

 ## Feedback week 3 en de toekomst
 ![changes Week 03](/images/aanpassingenW3.png)
 Ik had getest met Erik in het lokaal. Hij vond het nice geworden. De buttons waren duidelijk voor hem en de active state was goed. De flow was leuk en het ging voor nu allemaal snel genoeg. De output was alleen erg klein nog daar had hij moeite mee om te lezen dus die heb ik aangepast. `groter en meer contrast`
 
 #### De dingen die hij graag in de toekomst zou willen zien zijn 
 - Meerdere letters in 1 canvas.
 - Aan kunnen passen heoalng het duurt 
 voordat de input verzonden wordt met een 
 slider.
 - woorden herkennen
 
 Wat ik zelf nog toe zou willen voegen als ik nog door zou gaan met dit project is een echte goeie database die letters en leestekens consistent kan herkennen.  
 Ik zou de ervaring nog leuker willen maken door gimmick dingen toe te voegen zoals een regenboog pen of emojis etc
 
 # Conclusie
 Ik heb bij dit project de nadruk op een LEUKE manier van typen. Ik heb me echt gefocussed op één concept omdat ik dit helemaal goed werkend wilde maken. Ik vond het jammer dat we eigenlijk niet echt goed hebben kunnen testen met Erik maar  

ik ben wel blij dat Erik enthousiast was over mijn idee en dat het idee ook goed is gelukt.
