let canvas; // willhold reference to HTML-element
let world;
let keyboard = new Keyboard();
let infoOpen = false;

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

// no scrolling during play
document.getElementById("canvas").addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
  },
  { passive: false },
);

document.getElementById("infoModal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("infoModal")) toggleInfo();
});

document.getElementById("infoModal").addEventListener("cancel", (e) => {
  e.preventDefault();
  if (infoOpen) toggleInfo();
});
// #end-region EventListeners

function startGame() {
  clearAllIntervals();
  document.getElementById("resetBtn").style.display = "block";
  document.getElementById("pauseBtn").style.display = "block";
  document.getElementById("infoBtn").style.display = "block";
  hideAllScreens();
  initLevel();
  init();
  playBackgroundMusic();
  showMobileControls();
}

function resetGame() {
  gamePaused = false;
  clearAllIntervals();
  if (world) {
    world.stopAllSounds();
    world.stopGame();
    world = null; 
  }
  infoOpen = false;
  stopBackgroundMusic();
  document.getElementById("pauseBtn").style.display = "none";
  document.getElementById("pauseBtn").classList.remove("paused");
  document.getElementById("infoBtn").style.display = "none";
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
  document.getElementById("pauseBtn").classList.toggle("paused");
  if (gamePaused) {
    backgroundMusic.pause();
    if (world) world.stopAllSounds();
  } else {
    playBackgroundMusic();
  }
}

function showGameOver() {
  clearAllIntervals();
  if (world) {
    world.stopAllSounds(); 
    world.stopGame();
  }
  stopBackgroundMusic();
  playGameOverSound();
  document.getElementById("resetBtn").style.display = "none";
  document.getElementById("enter-fullscreen").style.display = "none";
  document.getElementById("muteMusicBtn").style.display = "none";
  document.getElementById("muteSndBtn").style.display = "none";
  document.getElementById("mobileControls").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("pauseBtn").style.display = "none";
  document.getElementById("infoBtn").style.display = "none";
}

function showWin() {
  clearAllIntervals();
  if (world) {
    world.stopAllSounds(); 
    world.stopGame();
  }
  stopBackgroundMusic();
  playGameWonSound();
  document.getElementById("resetBtn").style.display = "none";
  document.getElementById("enter-fullscreen").style.display = "none";
  document.getElementById("muteMusicBtn").style.display = "none";
  document.getElementById("muteSndBtn").style.display = "none";
  document.getElementById("mobileControls").style.display = "none";
  document.getElementById("winScreen").style.display = "block";
  document.getElementById("pauseBtn").style.display = "none";
  document.getElementById("infoBtn").style.display = "none";
}

function restartGame() {
  gamePaused = false;
  clearAllIntervals();
  if (world) {
    world.stopAllSounds();
    world.stopGame();
    world = null;
  }
  gamePaused = false;
  document.getElementById("pauseBtn").classList.remove("paused");
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
  document.getElementById("infoBtn").style.display = "block";
}

function hideAllScreens() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("winScreen").style.display = "none";
}

function toggleInfo() {
  document.activeElement.blur();
  const modal = document.getElementById("infoModal");
  infoOpen = !infoOpen;
  if (infoOpen) {
    modal.showModal();
    if (!gamePaused && world) togglePause();
  } else {
    modal.close();
    if (gamePaused && world) togglePause(); // ← world-Check verhindert playBackgroundMusic ohne Spiel
  }
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
