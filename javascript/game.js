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
  document.getElementById("pauseBtn").style.display = "block";
  hideAllScreens();
  initLevel();
  init();
  playBackgroundMusic();
  showMobileControls();
}

function resetGame() {
  clearAllIntervals();
  if (world) {
    world.stopAllSounds();
    world.stopGame();
    document.getElementById("pauseBtn").style.display = "none";
    gamePaused = false;
  }
  stopBackgroundMusic();
  document.getElementById("mobileControls").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
  document.getElementById("startScreen").style.display = "block";
  document.getElementById("resetBtn").style.display = "none";
  document.getElementById("muteMusicBtn").style.display = "block"; 
  document.getElementById("muteSndBtn").style.display = "block"; 
  document.getElementById("enter-fullscreen").style.display = "block";
}

function togglePause() {
  document.activeElement.blur();
  gamePaused = !gamePaused;
  if (gamePaused) {
    document.getElementById("pauseBtn").textContent = "▶";
    backgroundMusic.pause();
    if (world) world.stopAllSounds();
  } else {
    document.getElementById("pauseBtn").textContent = "⏸";
    playBackgroundMusic();
  }
}

function showGameOver() {
  clearAllIntervals();
  if (world) world.stopGame();
  stopBackgroundMusic();
  playGameOverSound();
  document.getElementById("resetBtn").style.display = "none";
  document.getElementById("enter-fullscreen").style.display = "none";
  document.getElementById("muteMusicBtn").style.display = "none";
  document.getElementById("muteSndBtn").style.display = "none";
  document.getElementById("mobileControls").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("pauseBtn").style.display = "none";
}

function showWin() {
  clearAllIntervals();
  if (world) world.stopGame();
  stopBackgroundMusic();
  playGameWonSound();
  document.getElementById("resetBtn").style.display = "none";
  document.getElementById("enter-fullscreen").style.display = "none";
  document.getElementById("muteMusicBtn").style.display = "none";
  document.getElementById("muteSndBtn").style.display = "none";
  document.getElementById("mobileControls").style.display = "none";
  document.getElementById("winScreen").style.display = "block";
  document.getElementById("pauseBtn").style.display = "none";
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
  playBackgroundMusic();
  showMobileControls();
  document.getElementById("resetBtn").style.display = "block";
  document.getElementById("enter-fullscreen").style.display = "block";
  document.getElementById("muteMusicBtn").style.display = "block";
  document.getElementById("muteSndBtn").style.display = "block";
  document.getElementById("pauseBtn").style.display = "block";
  gamePaused = false;
}

function hideAllScreens() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
}

// #start-region mobile controls
function showMobileControls() {
  if (window.innerWidth <= 720) {
    document.getElementById("mobileControls").style.display = "flex";
  }
}

function initMobileControls() {
  document.getElementById("mobileControls").style.display = "none";
  document.getElementById("btnLeft").addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (!gamePaused) keyboard.LEFT = true;
  });
  document.getElementById("btnLeft").addEventListener("touchend", () => {
    keyboard.LEFT = false;
  });

  document.getElementById("btnRight").addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (!gamePaused) keyboard.RIGHT = true;
  });
  document.getElementById("btnRight").addEventListener("touchend", () => {
    keyboard.RIGHT = false;
  });

  document.getElementById("btnJump").addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (!gamePaused) keyboard.SPACE = true;
  });
  document.getElementById("btnJump").addEventListener("touchend", () => {
    keyboard.SPACE = false;
  });

  document.getElementById("btnThrow").addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (!gamePaused) keyboard.D = true;
  });
  document.getElementById("btnThrow").addEventListener("touchend", () => {
    keyboard.D = false;
  });
  // #end-region mobile controls
}
