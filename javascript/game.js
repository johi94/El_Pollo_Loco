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
    if (world && world.character) {
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