// This is one of the ways to interpret Recamán Sequence with sound and graphics
// Check out Numberphile YouTube channel to discover more about the interpretation and the sequence: https://youtu.be/FGC5TdIiT9U
// This was made using p5.js library tutorials by Daniel Shiffman
// You can find the tutorials on Daniel's YouTube channel: http://youtube.com/thecodingtrain

/**
* Represents an arc
* @param {number} start - starting point on the horizontal axis,
where we begin to draw an arc
* @param {number} end - ending point on the horizontal axis,
 where we end to draw an arc
* @param {number} direction - can be 0 or -1. If it is 0, then an arc
* is drawn to the up, if it is -1, then an arc is drawn to
the down
* @param {string} color - arc stroke color
**/
function Arc(start, end, direction, color="#ff83a4") {
  this._start = start;
  this._end = end;
  this._direction = direction;
  this._color = color;
};

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
};

/**
* Performes setup, step and draw
* @return {object}
**/
function setStepDraw() {
  that = {};

  let landMarks = [];
  let sequence = [];
  let currPos = 0;

  let visualizationButton = document.getElementById('visualization-button');
  let soundButton = document.getElementById("sound-button");
  let soundOnIcon = document.getElementById("sound-on");
  let soundOffIcon = document.getElementById("sound-off");

  visualizationButton.addEventListener("click", () => {
      if (visualizationButton.clicked === "true") {
          visualizationButton.clicked = "false";
          turnSoundOff(soundButton, soundOnIcon, soundOffIcon);
          } else {
              visualizationButton.clicked = "true";
          }
  });

  soundButton.addEventListener("click", () => {
          if (visualizationButton.clicked === "true") {
              if (soundButton.clicked === "true") {
                turnSoundOff(soundButton, soundOnIcon, soundOffIcon);
              } else {
                turnSoundOn(soundButton, soundOnIcon, soundOffIcon);
              }
           }
  }, false);

  function turnSoundOff(btn, iconOn, iconOff) {
    btn.clicked = "false";
    iconOn.style.display = "none";
    iconOff.style.display = "block";
  }

  function turnSoundOn(btn, iconOn, iconOff) {
    btn.clicked = "true";
    iconOn.style.display = "block";
    iconOff.style.display = "none";
  }

  /**
  * Creates a canvas, an oscillator and an envelope,
  * marks current point as one that is landed on
  **/
  that.setup = function() {
      setCanvas("sketchContainer", 300, 400);
      let [
           oscillator,
           envelope
          ] = setSound(0.001, 0.2, 0.2, 0.5, 1.0, 0);

      canvas.style.margin="0px";
      frameRate(5);

      landMarks[currPos] = true; // mark that we've landed on the spot
      sequence.push(currPos);
  };

  let biggestPos = 0;
  let numberOfSteps = 1;
  let arcs = []; // Here we collect arcs that we're drawin

  /**
  * Creates an arc, marks the next position as one that's
    landed on
  **/
  that.step = function() {
      let nextPos = currPos - numberOfSteps;
      if (nextPos < 0 || landMarks[nextPos]) {
          // There are no negative numbers in the sequence
          // and we can't land on a spot that has been landed on before, so
          nextPos = currPos + numberOfSteps; // we go forward from currPos spot by numberOfSteps
      }

      landMarks[nextPos] = true; // Mark the spot as one we've landed on
      sequence.push(nextPos);

      let arc = new Arc(currPos, nextPos, numberOfSteps % 2);
      arcs.push(arc);
      currPos = nextPos;

      let frequnecy = pow(2, ((currPos-2) % 80 - 50) / 12)  * 440;
      oscillator.freq(frequnecy);

      if(soundButton.clicked === "true"){
          envelope.play();
      }

      if (currPos > biggestPos) {
          biggestPos = currPos;
      }
      numberOfSteps++;
  };

  /**
  * Draws an arc
  **/
  that.draw = function() {
      if (visualizationButton.clicked === "true") {
          that.step();
      }
      translate(0, height / 2);
      scale(width / biggestPos);
      background("#fff");

      arcs.forEach(arc => arc.show());
  };
  return that;
};

let creator = setStepDraw();

/**
* Defines initial environment properties
**/
function setup() {
  creator.setup();
};

/**
* Continuously executes the lines of code contained inside its block until the program is stopped
**/
function draw() {
  creator.draw();
};

/**
* Creates a canvas
* @param {string} parentId - id of the canvas parent getElementById
* @param {number} minHeight - canvas height for small screens
* @param {number} maxHight - canvas height for large screens
**/
function setCanvas(parentId, minHeight, maxHeight) {
  let canvas = createCanvas(windowWidth, minHeight);
  canvas.parent(parentId);

  if (window.width > 376) {
      canvas = createCanvas(windowWidth, maxHeight);
      canvas.parent(parentId);
  }
};

/**
* Creates an envelope and an oscillator
* @param {number} attackTime - time until envelope reaches attackLevel
* @param {number} decayTime - time until envelope reaches decayLevel.
* @param {number} susRatio - ratio between attackLevel and
  releaseLevel, on a scale from 0 to 1, where 1.0 = attackLevel,
  0.0 = releaseLevel. The susRatio determines the decayLevel
  and the level at which the sustain portion of the envelope
  will sustain.
* @param {number} releaseTime - duration of the release
  portion of the envelope.
* @param {number} attackLevel - Level once attack is complete.
* @param {number} releaseLevel - level at the end of the release.
* @return {array} - [oscillator, envelope]
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

  return [oscillator, envelope];
};
