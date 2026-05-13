let canvas; // willhold reference to HTML-element
let world;
let keyboard = new Keyboard();



// calls method to reach out to canvas and unite it with a variable
// 2 variables are getting called with init function: canvas and world
function init() {
  canvas = document.getElementById("canvas"); // "grabs" element with id="canvas" and stores it in canvas variable
  world = new World(canvas, keyboard); // world gets canvas as argument / new Object world gets canvas as variable
}

// #start-region EventListeners
document.addEventListener("keydown", (event) => {
  if (event.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (event.keyCode == 38) {
    keyboard.UP = true;
  }
  if (event.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (event.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (event.keyCode == 68) {
    keyboard.D = true;
    if (world.character) {
      world.character.lastMovement = new Date().getTime();
    }
  }
});

document.addEventListener("keyup", (event) => {
  if (event.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (event.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (event.keyCode == 38) {
    keyboard.UP = false;
  }
  if (event.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (event.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (event.keyCode == 68) {
    keyboard.D = false;
  }
});
// #end-region EventListeners

function startGame() {
  clearAllIntervals();
  document.getElementById("resetBtn").style.display = "block";
  hideAllScreens();
  initLevel();
  init();
  playBackgroundMusic();
}

function resetGame() {
  clearAllIntervals();
  if (world) {
    world.stopAllSounds();
    world.stopGame();
  }
  stopBackgroundMusic();
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
  document.getElementById("resetBtn").style.display = "none";
}

function showGameOver() {
  clearAllIntervals(); 
  if (world) world.stopGame();
  stopBackgroundMusic();
  playGameOverSound();
  document.getElementById("gameOverScreen").style.display = "block";
}

function showWin() {
  clearAllIntervals(); 
  if (world) world.stopGame();
  stopBackgroundMusic();
  playGameWonSound();
  document.getElementById("winScreen").style.display = "block";
}

function restartGame() {
  clearAllIntervals();
  if (world) {
    world.stopAllSounds();
    world.stopGame();
  }
  hideAllScreens();
  initLevel();
  init();
}

function hideAllScreens() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
}


