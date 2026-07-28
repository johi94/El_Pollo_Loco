/**
 * @class World
 * @description Manages the game world including rendering, collisions,
 * game state and all game objects.
 */
class World {

  /** @type {Character} The player character */
  character = new Character();

  /** @type {Level} The current level */
  level = level1;

  /** @type {HTMLCanvasElement} The game canvas */
  canvas;

  /** @type {CanvasRenderingContext2D} The 2D rendering context */
  ctx;

  /** @type {Keyboard} The keyboard input handler */
  keyboard;

  /** @type {number} Camera offset on the x-axis */
  camera_x = 0;

  /** @type {StatusBar} Health status bar */
  statusBar = new StatusBar();

  /** @type {StatusBarCoins} Coin status bar */
  statusBarCoins = new StatusBarCoins();

  /** @type {StatusBarBottles} Bottle status bar */
  statusBarBottles = new StatusBarBottles();

  /** @type {StatusBarEndboss} Endboss health status bar */
  statusBarEndboss = new StatusBarEndboss();

  /** @type {boolean} Whether the endboss health bar is visible */
  endbossBarVisible = false;

  /** @type {ThrowableObject[]} Array of currently thrown bottles */
  throwableObjects = [];

  /** @type {boolean} Cooldown flag to prevent rapid bottle throwing */
  bottleThrown = false;

  /** @type {boolean} Whether the game over screen has been shown */
  gameOverShown = false;

  /** @type {boolean} Whether the win screen has been shown */
  winShown = false;

  /** @type {boolean} Whether the game has been won */
  gameWon = false;

  /** @type {boolean} Whether the death sound has already been played */
  deadSoundPlayed = false;

  /** @type {number[]} Array of active interval IDs for this world */
  intervals = [];

  /** @type {number} The current animation frame request ID */
  animationFrame;

  /** @type {number|null} Timestamp of the previous frame, used to compute delta time */
  lastFrameTime = null;

  /** @type {Object.<string, number>} Accumulated time per fixed-step timer, keyed by name */
  timers = {};

  /** @type {Audio} Sound played when collecting a bottle */
  soundBottleCollect = new Audio("audio/bottle_pickup.mp3");

  /** @type {Audio} Sound played when collecting a coin */
  soundCoinCollect = new Audio("audio/collect_coin.mp3");

  /** @type {Audio} Sound played when the character is hurt */
  soundHurt = new Audio("audio/pepe_hurt.mp3");

  /** @type {Audio} Sound played when the character dies */
  soundDead = new Audio("audio/pepe_dead.mp3");

  /** @type {Audio} Sound played when throwing a bottle */
  soundBottleThrow = new Audio("audio/throw_bottle.mp3");

  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas - The game canvas element
   * @param {Keyboard} keyboard - The keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d", { alpha: false });
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.draw();
  }

  /**
   * @description Assigns the world reference to the character and all enemies,
   * so they can access world properties like keyboard and camera.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  /**
   * @description Creates a managed interval that is tracked for later cleanup.
   * @param {Function} fn - The function to execute on each interval
   * @param {number} time - The interval duration in milliseconds
   * @returns {number} The interval ID
   */
  addInterval(fn, time) {
    let id = setInterval(fn, time);
    this.intervals.push(id);
    return id;
  }

  /**
   * @description Stops all world intervals and cancels the animation frame.
   */
  stopGame() {
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];
    cancelAnimationFrame(this.animationFrame);
  }
}