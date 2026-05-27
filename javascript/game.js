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
    event.preventDefault();
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

// #start-region mobile controls

/**
 * Shows the mobile controls and enters fullscreen if the device supports touch input,
 * regardless of screen width.
 */
function showMobileControls() {
  const isTouchDevice = navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    setDisplay("mobileControls", "flex");
    enterFullscreen();
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

// #start-region asset-preloading

/**
 * Collects all character image paths for preloading.
 * @returns {string[]} Array of character image paths
 */
function collectCharacterPaths() {
  return [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
  ];
}

/**
 * Collects all character long idle and movement image paths for preloading.
 * @returns {string[]} Array of character movement image paths
 */
function collectCharacterMovementPaths() {
  return [
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
  ];
}

/**
 * Collects all character jump, hurt and dead image paths for preloading.
 * @returns {string[]} Array of character action image paths
 */
function collectCharacterActionPaths() {
  return [
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];
}

/**
 * Collects all character hurt and dead image paths for preloading.
 * @returns {string[]} Array of character hurt and dead image paths
 */
function collectCharacterHurtDeadPaths() {
  return [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];
}

/**
 * Collects all chicken enemy image paths for preloading.
 * @returns {string[]} Array of chicken image paths
 */
function collectChickenPaths() {
  return [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    "img/3_enemies_chicken/chicken_normal/2_dead/dead.png",
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    "img/3_enemies_chicken/chicken_small/2_dead/dead.png",
  ];
}

/**
 * Collects all endboss walk and alert image paths for preloading.
 * @returns {string[]} Array of endboss walk and alert image paths
 */
function collectEndbossWalkAlertPaths() {
  return [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];
}

/**
 * Collects all endboss attack, hurt and dead image paths for preloading.
 * @returns {string[]} Array of endboss attack, hurt and dead image paths
 */
function collectEndbossActionPaths() {
  return [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];
}

/**
 * Collects all background and cloud image paths for preloading.
 * @returns {string[]} Array of background image paths
 */
function collectBackgroundPaths() {
  return [
    "img/5_background/layers/air.png",
    "img/5_background/layers/3_third_layer/1.png",
    "img/5_background/layers/3_third_layer/2.png",
    "img/5_background/layers/2_second_layer/1.png",
    "img/5_background/layers/2_second_layer/2.png",
    "img/5_background/layers/1_first_layer/1.png",
    "img/5_background/layers/1_first_layer/2.png",
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
  ];
}

/**
 * Collects all bottle image paths for preloading.
 * @returns {string[]} Array of bottle image paths
 */
function collectBottlePaths() {
  return [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];
}

/**
 * Collects all coin and status bar image paths for preloading.
 * @returns {string[]} Array of coin and status bar image paths
 */
function collectCoinStatusPaths() {
  return [
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
  ];
}

/**
 * Collects all remaining status bar image paths for preloading.
 * @returns {string[]} Array of remaining status bar image paths
 */
function collectStatusBarPaths() {
  return [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
  ];
}

/**
 * Combines all asset path collections into a single array for preloading.
 * @returns {string[]} Array of all image paths used in the game
 */
function collectAssetPaths() {
  return [
    ...collectCharacterPaths(),
    ...collectCharacterMovementPaths(),
    ...collectCharacterActionPaths(),
    ...collectCharacterHurtDeadPaths(),
    ...collectChickenPaths(),
    ...collectEndbossWalkAlertPaths(),
    ...collectEndbossActionPaths(),
    ...collectBackgroundPaths(),
    ...collectBottlePaths(),
    ...collectCoinStatusPaths(),
    ...collectStatusBarPaths(),
  ];
}

/**
 * Preloads all game assets and shows a loading screen with a GIF while waiting.
 * Calls the callback once all images have been loaded successfully.
 * @param {Function} callback - Called when all assets are fully loaded
 */
function preloadAssets(callback) {
  const paths = collectAssetPaths();
  let loaded = 0;
  const total = paths.length;
  setDisplay("startScreen", "none");
  setDisplay("loadingScreen", "flex");
  paths.forEach((path) => {
    const img = new Image();
    img.onload = () => {
      loaded++;
      updateLoadingProgress(loaded, total, callback);
    };
    img.onerror = () => {
      loaded++;
      updateLoadingProgress(loaded, total, callback);
    };
    img.src = path;
  });
}

/**
 * Updates the loading progress text and triggers the callback when all assets are loaded.
 * Hides the loading screen and shows the game once loading is complete.
 * @param {number} loaded - The number of assets loaded so far
 * @param {number} total - The total number of assets to load
 * @param {Function} callback - Called when loading is complete
 */
function updateLoadingProgress(loaded, total, callback) {
  const percent = Math.round((loaded / total) * 100);
  document.getElementById("loadingProgress").textContent =
    `Loading... ${percent}%`;
  if (loaded === total) {
    setDisplay("loadingScreen", "none");
    callback();
  }
}

// #end-region asset-preloading

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

/**
 * Initializes a fallback for the headline title image.
 * If the image fails to load, it is hidden and the h1 fallback text is shown instead.
 */
function initHeadlineFallback() {
  const img = document.getElementById("titelImg");
  img.addEventListener("error", () => {
    img.style.display = "none";
    document.getElementById("headline-fallback").style.display = "block";
  });
}

/**
 * Opens the impressum page in a new browser tab.
 */
function openImpressum() {
  window.open("impressum.html", "_blank");
}
