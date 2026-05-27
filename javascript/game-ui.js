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
 * Removes the paused state from the pause button.
 */
function resetPauseBtn() {
  document.getElementById("pauseBtn").classList.remove("paused");
}

// #end-region helpers

// #start-region game-flow

/**
 * Starts a new game by preloading all assets first,
 * then initializing the level and world.
 */
function startGame() {
  clearAllIntervals();
  hideAllScreens();
  preloadAssets(() => {
    initLevel();
    init();
    playBackgroundMusic();
    showMobileControls();
    showGameUI();
  });
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
  setDisplay("impressumBtn", "none");
  const isTouchDevice = navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    setDisplay("enter-fullscreen", "block");
  }
}

/**
 * Shows all in-game UI buttons (reset, fullscreen, mute, pause, info, impressum).
 */
function showGameUI() {
  setDisplay("resetBtn", "block");
  const isTouchDevice = navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    setDisplay("enter-fullscreen", "block");
  } else {
    setDisplay("enter-fullscreen", "none");
  }
  setDisplay("muteMusicBtn", "block");
  setDisplay("muteSndBtn", "block");
  setDisplay("pauseBtn", "block");
  setDisplay("infoBtn", "block");
  setDisplay("impressumBtn", "block");
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
  setDisplay("impressumBtn", "none");
}

// #end-region game-state