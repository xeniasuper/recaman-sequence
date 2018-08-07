var attackLevel = 1.0;
var releaseLevel = 0;
var attackTime = 0.001;
var decayTime = 0.2;
var susPercent = 0.2;
var releaseTime = 0.5;

let numbers = [];
let numberOfSteps = 1;
let sequence = [];
let index = 0;


let arcs = [];

let biggest = 0;

class Arc {
  constructor(start, end, direction) {
    this.start = start;
    this.end = end;
    this.direction = direction;
  }

  show() {
    let diameter = abs(this.end - this.start);
    let x = (this.end + this.start) / 2;
    stroke("#fae");
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
    createCanvas(windowWidth, windowHeight);
    frameRate(5);
    
    envelope = new p5.Env();
    envelope.setADSR(attackTime, decayTime, susPercent, releaseTime);
    envelope.setRange(attackLevel, releaseLevel);
    
    oscillator = new p5.Oscillator();
    oscillator.setType('sine');
    oscillator.amp(envelope);
    oscillator.start();
  
    numbers[index] = true;
    sequence.push(index);
}

function step() {
  let next = index - numberOfSteps;
  if (next < 0 || numbers[next]) {
    next = index + numberOfSteps;
  }
  numbers[next] = true;
  sequence.push(next);

  let anArc = new Arc(index, next, numberOfSteps % 2);
  arcs.push(anArc);
  index = next;
  
  let freq = pow(2, (index % 80 - 49) / 12)  * 440;
    
  oscillator.freq(freq);
  envelope.play();

  if (index > biggest) {
    biggest = index;
  }

  numberOfSteps++;
}

function draw() {
  step();
  translate(0, height / 2);
  scale(width / biggest);
  background('#fff');

  for (let anArc of arcs) {
    anArc.show();
  }
}
