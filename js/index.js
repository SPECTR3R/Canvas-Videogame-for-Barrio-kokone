const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

window.onload = () => {
  canvas.style = 'display: none;';
  const goFS = document.getElementById('goFS');
  goFS.addEventListener(
    'click',
    () => {
      openFullscreen();
      goFS.style = 'display: none;';
      canvas.style = 'display: block;';
      setTimeout((board.interval = setInterval(updategame, 1000 / 60)), 3000);
    },
    false
  );
};

class Board {
  constructor() {
    // Dimension properties
    this.y = 0;
    this.x = 0;
    this.width = canvas.width;
    this.height = canvas.height;
    // Animation properties
    this.state = 'load';
    this.interval = undefined;
    this.speed = 1;
    // Images
    this.imgSrtart = new Image();
    this.imgSrtart.src = ' ./images/startScreenBG.svg';
    this.imgInstructions1 = new Image();
    this.imgInstructions1.src = ' ./images/instructions1.svg';
    this.imgInstructions2 = new Image();
    this.imgInstructions2.src = ' ./images/instructions2.svg';
    this.imgRoad = new Image();
    this.imgRoad.src = './images/road.png';
    this.imgGameOver = new Image();
    this.imgGameOver.src = './images/gameOver.svg';
    this.imgGameWin = new Image();
    this.imgGameWin.src = './images/gameWin.svg';
    // Inmediately load start screen
    this.imgSrtart.onload = () => {
      this.state = 'load';
    };
  }
  clean() {
    ctx.clearRect(0, 0, this.width, this.height);
  }
  drawBg() {
    switch (this.state) {
      case 'instructions1':
        this.clean();
        ctx.drawImage(this.imgInstructions1, 0, 0);
        break;
      case 'instructions2':
        this.clean();
        ctx.drawImage(this.imgInstructions2, 0, 0);
        break;
      case 'road':
        this.clean();
        this.animateRoad();
        break;
      case 'gameOver':
        this.clean();
        ctx.drawImage(this.imgGameOver, 0, 0);
        break;
      case 'gameWin':
        this.clean();
        ctx.drawImage(this.imgGameWin, 0, 0);
        break;
      default:
        this.clean();
        ctx.drawImage(this.imgSrtart, 0, 0);
        break;
    }
  }
  animateRoad() {
    this.y += this.speed;
    if (this.y > this.height) this.y = 0;
    ctx.drawImage(this.imgRoad, 0, this.y, this.width, this.height);
    ctx.drawImage(this.imgRoad, 0, this.y - this.height, this.width, this.height);
  }
}

class Covid {
  constructor(context) {
    this.width = 50;
    this.height = 50;
    this.viruses = [{}];
    this.score = 0;
    this.level = 1;
    this.frames = 0;
    this.imgCovid = new Image();
    this.imgCovid.src = ' ./images/covid.png';
  }
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  drawCovid() {
    //create covid
    if (this.frames > this.randomNumber(100, 300) && this.score < 40) {
      this.viruses.push({
        width: this.width,
        height: this.height,
        x: this.randomNumber(49, 260),
        y: 0,
      });
      this.frames = 0;
    }
    // draw viruses
    this.viruses.forEach((virus, index, arr) => {
      if (virus.y > canvas.height) {
        arr.shift();
        this.score++;
      }
      this.level = this.score > 30 ? 2.5 : this.score > 15 ? 2 : 1;
      virus.y += this.level;
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px arial';
      ctx.fillText(`puntos: ${this.score}`, 50, 30);
      ctx.drawImage(this.imgCovid, virus.x, virus.y, virus.width, virus.height);
    });
  }
}

class Irving {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 100;
    this.width = 40;
    this.height = 50;
    this.speed = 5;
    this.friction = 0.8;
    this.velX = 0;
    this.velY = 0;
    this.imgIrving = new Image();
    this.imgIrving.src = './images/player.png';
    this.imgMigue = new Image();
    this.imgMigue.src = './images/miguelon.png';
    this.migue = { x: 140, y: 20, height: 90, width: 90 };
  }
  draw() {
    ctx.drawImage(this.imgIrving, this.x, this.y, this.width, this.height);
  }
  drawMigue() {
    ctx.drawImage(this.imgMigue, this.migue.x, this.migue.y, this.migue.width, this.migue.height);
  }

  moveIrvingMouse(mouseX, mouseY) {
    let dx = (mouseX - this.x) * 0.125;
    let dy = (mouseY - this.y) * 0.125;
    //calculate the distance
    var distance = Math.sqrt(dx * dx + dy * dy);
    //... and cap it at 5px, so it feels smooth
    if (distance > 5) {
      dx *= 5 / distance;
      dy;
    }
    //now move
    this.x += dx;
    this.y += dy;
    //set boundaries
    if (this.y < 0) this.y = 0;
    if (this.y > canvas.height - this.height) this.y = canvas.height - this.height;
    if (this.x > 315 - this.width) this.x = 315 - this.width;
    if (this.x < 50) this.x = 50;
  }

  crash(obstacle) {
    return (
      obstacle.x < this.x + this.width - 10 &&
      obstacle.x + obstacle.width - 10 > this.x &&
      obstacle.y < this.y + this.height - 10 &&
      obstacle.height + obstacle.y - 10 > this.y
    );
  }
}

// Instances
const board = new Board();
const covid = new Covid();
const irving = new Irving();

// helper variables
let crashFlag = false;
let moving = false;
let mousePos = { x: canvas.width / 2, y: canvas.height };
let lastPos = mousePos;
let keys = [];
let mouseX = irving.x;
let mouseY = irving.y;

// helper functions
const getTouchPos = (canvasDom, touchEvent) => {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top,
  };
};

function openFullscreen (){
  if (document.body.requestFullscreen) {
    document.body.requestFullscreen();
  } else if (document.body.mozRequestFullScreen) {
    /* Firefox */
    document.body.mozRequestFullScreen();
  } else if (document.body.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    document.body.webkitRequestFullscreen();
  } else if (document.body.msRequestFullscreen) {
    /* IE/Edge */
    document.body.msRequestFullscreen();
  }
};

// mouse listeners
canvas.addEventListener('mouseup', e => (moving = false));

canvas.addEventListener('mousemove', e => {
  if (moving) {
    let rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }
});

canvas.addEventListener('mousedown', e => {
  // Buttons
  if (board.state !== 'road') {
    let rect = canvas.getBoundingClientRect();
    clickCoordinates = [Math.floor(e.clientX - rect.left), Math.floor(e.clientY - rect.top)];
    console.log(clickCoordinates);
    if (
      clickCoordinates[0] > 150 &&
      clickCoordinates[0] < 340 &&
      clickCoordinates[1] > 540 &&
      clickCoordinates[1] < 610
    ) {
      switch (board.state) {
        case 'load':
          board.state = 'instructions1';
          break;
        case 'instructions2':
          board.state = 'road';
          break;
        case 'gameOver':
          window.location.reload();
          break;
        case 'gameWin':
          window.location.reload();
          break;
      }
    }
  }

  if (
    clickCoordinates[0] > 150 &&
    clickCoordinates[0] < 340 &&
    clickCoordinates[1] > 55 &&
    clickCoordinates[1] < 130 &&
    board.state === 'instructions1'
  ) {
    board.state = 'instructions2';
  }

  moving = true;
});

// Set up touch events as mouse events for mobile
canvas.addEventListener('touchstart', e => {
  mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchend', e => {
  var mouseEvent = new MouseEvent('mouseup', {});
  canvas.dispatchEvent(mouseEvent);
});
canvas.addEventListener('touchmove', e => {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
  canvas.dispatchEvent(mouseEvent);
});

// Start game
const updategame = () => {
  board.drawBg();
  if (board.state === 'road') {
    covid.drawCovid();
    covid.frames++;
    irving.draw();
    irving.moveIrvingMouse(mouseX, mouseY);
    //check collision
    covid.viruses.forEach(virus => {
      if (irving.crash(virus)) {
        board.state = 'gameOver';
        board.drawBg();
      }
    });
    if (covid.score > 40) {
      irving.drawMigue();
      if (irving.crash(irving.migue)) {
        board.state = 'gameWin';
        board.drawBg();
      }
    }
  }
};
