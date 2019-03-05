// This is one of the ways to interpret Recamán Sequence with sound and graphics
// Check out Numberphile YouTube channel to discover more about the interpretation and the sequence: https://youtu.be/FGC5TdIiT9U
// This was made using p5.js library tutorials by Daniel Shiffman
// You can find the tutorials on Daniel's YouTube channel: http://youtube.com/thecodingtrain

// TODO: I know, that using global variables is a bad practice,
// but in this case I don't know what to to with them :(
// (but I really really want to know how to get rid of them)
// TODO: add docstrings

/**
* Represents an arc
* {number} start - starting point on the horizontal axis,
where we begin to draw an arc
* {number} end - ending point on the horizontal axis,
 where we end to draw an arc
* {number} direction - can be 0 or -1. If it is 0, then an arc
* is drawn to the up, if it is -1, then an arc is drawn to
the down
* {string} color - arc stroke color
**/
function Arc(start, end, direction, color="#ff83a4") {
  this._start = start;
  this._end = end;
  this._direction = direction;
  this._color = color;
}

/**
* Shows an arc
**/
Arc.prototype.show = function(){
  stroke(this._color);
  strokeWeight(0.5);
  noFill();

  let diameter = abs(this._end - this._start);
  let x = (this._end + this._start) / 2;
  if (this._direction === 0) {
      arc(x, 0, diameter, diameter, PI, 0);
  } else {
      arc(x, 0, diameter, diameter, 0, PI);
    }
}


let soundOnIcon = document.getElementById("sound-on");
let soundOffIcon = document.getElementById("sound-off");

let soundButton = document.getElementById("sound-button")
soundButton.addEventListener("click", () => {
        if (soundButton.clicked === "true"){
            soundButton.clicked = "false";
            soundOnIcon.style.display = "none";
            soundOffIcon.style.display = "block";
        } else if (visualizationButton.clicked === "true") {
            soundButton.clicked = "true";
            soundOnIcon.style.display = "block";
            soundOffIcon.style.display = "none";

        };
}, false);

/**
* Creates a canvas
* {string} parentId - id of the canvas parent getElementById
* {number} minHeight - canvas height for small screens
* {number} maxHight - canvas height for large screens
**/
function setCanvas(parentId, minHeight, maxHeight) {
  let canvas = createCanvas(windowWidth, minHeight);
  canvas.parent(parentId);

  if (window.width > 376) {
      canvas = createCanvas(windowWidth, maxHeight);
      canvas.parent(parentId);
  }
}

/**
* Creates an envelope and an oscillator
* {number} attackTime - time until envelope reaches attackLevel
* {number} decayTime - time until envelope reaches decayLevel.
* {number} susRatio - ratio between attackLevel and
  releaseLevel, on a scale from 0 to 1, where 1.0 = attackLevel,
  0.0 = releaseLevel. The susRatio determines the decayLevel
  and the level at which the sustain portion of the envelope
  will sustain.
* {number} releaseTime - duration of the release
  portion of the envelope.
* {number} attackLevel - Level once attack is complete.
* {number} releaseLevel - level at the end of the release.
**/
function setSound(attackTime, decayTime, susRatio, releaseTime,
                  attackLevel, releaseLevel) {
  envelope = new p5.Env();
  envelope.setADSR(attackTime, decayTime, susRatio, releaseTime);
  envelope.setRange(attackLevel, releaseLevel);

  oscillator = new p5.Oscillator();
  oscillator.setType("sine");
  oscillator.amp(envelope);
  oscillator.start();
}

let landMarks = [];
let sequence = [];
let currPos = 0;

function setup() {
    setCanvas("sketchContainer", 300, 400);
    setSound(0.001, 0.2, 0.2, 0.5, 1.0, 0);

    canvas.style.margin="0px";
    frameRate(5);

    landMarks[currPos] = true; // mark that we've landed on the spot
    sequence.push(currPos);
}

let biggestPos = 0;
let numberOfSteps = 1;
let arcs = []; // Here we collect arcs that we're drawin

function step() {
    let nextPos = currPos - numberOfSteps;
    if (nextPos < 0 || landMarks[nextPos]) {
        // There are no negative numbers in the sequence
        // and we can't land on a spot that has been landed on before, so
        nextPos = currPos + numberOfSteps; // we go forward from currPos spot by numberOfSteps
    }

    landMarks[nextPos] = true; // Mark the spot as one we've landed on
    sequence.push(nextPos);

    let anArc = new Arc(currPos, nextPos, numberOfSteps % 2);

    arcs.push(anArc);
    currPos = nextPos;

    // Producing sound
    let frequnecy = pow(2, ((currPos-2) % 80 - 50) / 12)  * 440;
    oscillator.freq(frequnecy);

    if(soundButton.clicked === "true"){
        envelope.play();
    }

    // to make the arcs smaller when a new arc appear
    if (currPos > biggestPos) {
        biggestPos = currPos;
    }
    numberOfSteps++;
}

let visualizationButton = document.getElementById('visualization-button');
visualizationButton.addEventListener("click", () => {
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
    scale(width / biggestPos);
    background("#fff");

    for (let anArc of arcs) {
            anArc.show();
    }
};
