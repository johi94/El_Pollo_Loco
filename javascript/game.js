let canvas;
let world;
let keyboard = new Keyboard();
let infoOpen = false;

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
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

// #start-region helpers
function setDisplay(id, value) {
  document.getElementById(id).style.display = value;
}

function stopWorld() {
  if (world) {
    world.stopAllSounds();
    world.stopGame();
    world = null;
  }
}

function bindMobileButton(id, key) {
  document.getElementById(id).addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (!gamePaused) keyboard[key] = true;
  });
  document.getElementById(id).addEventListener("touchend", () => {
    keyboard[key] = false;
  });
}
// #end-region helpers

// #start-region game-flow
function startGame() {
  clearAllIntervals();
  hideAllScreens();
  initLevel();
  init();
  playBackgroundMusic();
  showMobileControls();
  showGameUI();
}

function resetGame() {
  gamePaused = false;
  clearAllIntervals();
  stopWorld();
  infoOpen = false;
  stopBackgroundMusic();
  resetPauseBtn();
  showStartScreenUI();
}

function showStartScreenUI() {
  setDisplay("pauseBtn", "none");
  setDisplay("infoBtn", "none");
  setDisplay("mobileControls", "none");
  setDisplay("gameOverScreen", "none");
  setDisplay("winScreen", "none");
  setDisplay("startScreen", "block");
  setDisplay("resetBtn", "none");
  setDisplay("muteMusicBtn", "block");
  setDisplay("muteSndBtn", "block");
  setDisplay("enter-fullscreen", "block");
}

function resetPauseBtn() {
  document.getElementById("pauseBtn").classList.remove("paused");
}

function restartGame() {
  gamePaused = false;
  clearAllIntervals();
  stopWorld();
  resetPauseBtn();
  hideAllScreens();
  initLevel();
  init();
  playBackgroundMusic();
  showMobileControls();
  showGameUI();
}

function showGameUI() {
  setDisplay("resetBtn", "block");
  setDisplay("enter-fullscreen", "block");
  setDisplay("muteMusicBtn", "block");
  setDisplay("muteSndBtn", "block");
  setDisplay("pauseBtn", "block");
  setDisplay("infoBtn", "block");
}

function hideAllScreens() {
  setDisplay("startScreen", "none");
  setDisplay("gameOverScreen", "none");
  setDisplay("winScreen", "none");
}
// #end-region game-flow

// #start-region game-state
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
  endGame();
  playGameOverSound();
  setDisplay("gameOverScreen", "block");
}

function showWin() {
  endGame();
  playGameWonSound();
  setDisplay("winScreen", "block");
}

function endGame() {
  clearAllIntervals();
  stopWorld();
  stopBackgroundMusic();
  setDisplay("resetBtn", "none");
  setDisplay("enter-fullscreen", "none");
  setDisplay("muteMusicBtn", "none");
  setDisplay("muteSndBtn", "none");
  setDisplay("mobileControls", "none");
  setDisplay("pauseBtn", "none");
  setDisplay("infoBtn", "none");
}
// #end-region game-state

// #start-region mobile controls

function showMobileControls() {
  if (window.innerWidth <= 720) {
    setDisplay("mobileControls", "flex");
  }
}

function initMobileControls() {
  setDisplay("mobileControls", "none");
  bindMobileButton("btnLeft", "LEFT");
  bindMobileButton("btnRight", "RIGHT");
  bindMobileButton("btnJump", "SPACE");
  bindMobileButton("btnThrow", "D");
}

// #end-region mobile controls

function toggleInfo() {
  document.activeElement.blur();
  const modal = document.getElementById("infoModal");
  infoOpen = !infoOpen;
  if (infoOpen) {
    modal.showModal();
    if (!gamePaused && world) togglePause();
  } else {
    modal.close();
    if (gamePaused && world) togglePause();
  }
}
