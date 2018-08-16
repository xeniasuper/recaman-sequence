// Xenia Fedorova, 2018
// This is one of the ways to interpret Recamán Sequence with sound and graphics
// Check out Numberphile YouTube channel to discover more about the interpretation and the sequence: https://youtu.be/FGC5TdIiT9U
// This was made using p5.js library tutorials by Daniel Shiffman 
// You can find the tutorials on Daniel's YouTube channel: http://youtube.com/thecodingtrain


// The section below is sound parameters that are requred by p5.js sound library
let attackLevel = 1.0;
let releaseLevel = 0;
let attackTime = 0.001;
let decayTime = 0.2;
let susPercent = 0.2;
let releaseTime = 0.5;

let numbers = [];
let numberOfSteps = 1;
let sequence = [];
let index = 0;


let arcs = []; // Here we collect arcs that we're drawing

class Arc {
  constructor(start, end, direction) {
    this.start = start;
    this.end = end;
    this.direction = direction;
  }

  show() {
    let diameter = abs(this.end - this.start);
    let x = (this.end + this.start) / 2;
    
    stroke("#ff83a4");
    strokeWeight(0.5);
    noFill();
    
    if (this.direction === 0) {
        arc(x, 0, diameter, diameter, PI, 0);
    } else {
        arc(x, 0, diameter, diameter, 0, PI);
    }
  }
}

function setup() {
    let canvas = createCanvas(windowWidth, 300);
    canvas.parent("sketch-container");
    if (window.width < 1024) {
        let canvas = createCanvas(windowWidth, 300);
        canvas.parent("sketchContainer");
    } 
  
    canvas.style.margin="0px";

    
    frameRate(5);
    
    envelope = new p5.Env();
    envelope.setADSR(attackTime, decayTime, susPercent, releaseTime);
    envelope.setRange(attackLevel, releaseLevel);
    
    oscillator = new p5.Oscillator();
    oscillator.setType("sine");
    oscillator.amp(envelope);
    oscillator.start();
  
    numbers[index] = true;
    
    sequence.push(index);
}

let biggest = 0;

function step() {
    let next = index - numberOfSteps;
    if (next < 0 || numbers[next]) {
        // There are no negative numbers in the sequence 
        // and we can't land on a spot that has been landed on before, so
        next = index + numberOfSteps; // we go forward from index spot by numberOfSteps
    }
  
    numbers[next] = true; // Mark the spot as one we landed on
    sequence.push(next);

    let anArc = new Arc(index, next, numberOfSteps % 2);
    arcs.push(anArc);
  
    index = next;
  
    let frequnecy = pow(2, ((index-2) % 80 - 50) / 12)  * 440;
    
    oscillator.freq(frequnecy);
    
    let soundButton = document.getElementById("soundButton");
    if(soundButton.clicked === "true"){
        envelope.play();
    }
    
    if (index > biggest) {
        biggest = index;
    }
    
    numberOfSteps++;
}

let soundOnIcon = document.getElementById("soundOn");
let soundOffIcon = document.getElementById("soundOff");

soundButton.addEventListener("click", function(){
        if(soundButton.clicked === "true"){
            soundButton.clicked = "false";
            soundOnIcon.style.display = "none";
            soundOffIcon.style.display = "inline-block";
        } else {
            soundButton.clicked = "true";
            soundOnIcon.style.display = "inline-block";
            soundOffIcon.style.display = "none";
            
        };    
}, false);

let visualizationButton = document.getElementById('visualizationButton');
visualizationButton.addEventListener("click", function(){
    if (visualizationButton.clicked === "true"){
        visualizationButton.clicked = "false";
        } else {
            visualizationButton.clicked = "true";
        }
});

function draw() {
    if (visualizationButton.clicked === "true") {
        step();
    }  
    translate(0, height / 2);
    scale(width / biggest);
    background("#fff");

    for (let anArc of arcs) {
            anArc.show();
    }
}

