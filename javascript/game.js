/** @type {HTMLCanvasElement} The main game canvas element */
let canvas;

/** @type {World} The current game world instance */
let world;

/** @type {Keyboard} The keyboard input handler */
let keyboard = new Keyboard();

/** @type {boolean} Whether the info modal is currently open */
let infoOpen = false;

/**
 * Initializes the game world by retrieving the canvas element
 * and creating a new World instance.
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
}

// #start-region EventListeners

/** 
 * Sets the corresponding keyboard state to true when a key is pressed.
 * Also updates the character's lastMovement timestamp when D is pressed.
 */
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

/**
 * Resets the corresponding keyboard state to false when a key is released.
 */
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

/**
 * Prevents default touch behavior on the canvas to avoid unwanted scrolling during gameplay.
 */
document.getElementById("canvas").addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
  },
  { passive: false },
);

/**
 * Closes the info modal when the user clicks on the backdrop outside the modal content.
 */
document.getElementById("infoModal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("infoModal")) toggleInfo();
});

/**
 * Prevents the default cancel behavior of the dialog element and closes
 * the info modal properly via toggleInfo when the ESC key is pressed.
 */
document.getElementById("infoModal").addEventListener("cancel", (e) => {
  e.preventDefault();
  if (infoOpen) toggleInfo();
});

// #end-region EventListeners

// #start-region helpers

/**
 * Sets the CSS display property of an element by its ID.
 * @param {string} id - The ID of the HTML element
 * @param {string} value - The display value to set (e.g. 'block', 'none', 'flex')
 */
function setDisplay(id, value) {
  document.getElementById(id).style.display = value;
}

/**
 * Stops all sounds and intervals in the current world and sets it to null.
 */
function stopWorld() {
  if (world) {
    world.stopAllSounds();
    world.stopGame();
    world = null;
  }
}

/**
 * Binds touch events to a mobile button to simulate keyboard input.
 * @param {string} id - The ID of the mobile button element
 * @param {string} key - The keyboard key to simulate (e.g. 'LEFT', 'SPACE')
 */
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

/**
 * Starts a new game by clearing all intervals, initializing the level
 * and world, and showing the game UI.
 */
function startGame() {
  clearAllIntervals();
  hideAllScreens();
  initLevel();
  init();
  playBackgroundMusic();
  showMobileControls();
  showGameUI();
}

/**
 * Resets the game to the start screen state.
 * Stops the world, clears all intervals and shows the start screen UI.
 */
function resetGame() {
  gamePaused = false;
  clearAllIntervals();
  stopWorld();
  infoOpen = false;
  stopBackgroundMusic();
  resetPauseBtn();
  showStartScreenUI();
}

/**
 * Shows the start screen and hides all game UI elements.
 */
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
  if (window.innerWidth > 1180) {
    setDisplay("enter-fullscreen", "block");
  }
}

/**
 * Removes the paused state from the pause button.
 */
function resetPauseBtn() {
  document.getElementById("pauseBtn").classList.remove("paused");
}

/**
 * Restarts the game by stopping the current world and starting a fresh one.
 */
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

/**
 * Shows all in-game UI buttons (reset, fullscreen, mute, pause, info).
 */
function showGameUI() {
  setDisplay("resetBtn", "block");
  if (window.innerWidth > 1180) {
    setDisplay("enter-fullscreen", "block");
  } else {
    setDisplay("enter-fullscreen", "none");
  }
  setDisplay("muteMusicBtn", "block");
  setDisplay("muteSndBtn", "block");
  setDisplay("pauseBtn", "block");
  setDisplay("infoBtn", "block");
}

/**
 * Hides the start screen, game over screen and win screen.
 */
function hideAllScreens() {
  setDisplay("startScreen", "none");
  setDisplay("gameOverScreen", "none");
  setDisplay("winScreen", "none");
}

// #end-region game-flow

// #start-region game-state

/**
 * Toggles the game pause state. Pauses or resumes background music
 * and all world sounds accordingly.
 */
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

/**
 * Ends the game and shows the game over screen.
 */
function showGameOver() {
  endGame();
  playGameOverSound();
  setDisplay("gameOverScreen", "block");
}

/**
 * Ends the game and shows the win screen.
 */
function showWin() {
  endGame();
  playGameWonSound();
  setDisplay("winScreen", "block");
}

/**
 * Ends the current game session by clearing all intervals, stopping the world
 * and hiding all in-game UI elements.
 */
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

/**
 * Shows the mobile controls if the screen width is 1180px or less.
 */
function showMobileControls() {
  if (window.innerWidth <= 1180) {
    setDisplay("mobileControls", "flex");
  }
}

/**
 * Initializes all mobile control buttons by hiding the controls
 * and binding touch events to keyboard inputs.
 */
function initMobileControls() {
  setDisplay("mobileControls", "none");
  bindMobileButton("btnLeft", "LEFT");
  bindMobileButton("btnRight", "RIGHT");
  bindMobileButton("btnJump", "SPACE");
  bindMobileButton("btnThrow", "D");
}

// #end-region mobile controls

/**
 * Toggles the info modal open or closed.
 * Automatically pauses the game when the modal opens and resumes when it closes.
 */
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
