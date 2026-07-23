/**
 * @class ThrowableObject
 * @extends MovableObject
 * @description Represents a throwable salsa bottle that flies through the air,
 * rotates during flight and splashes on impact with an enemy or the ground.
 */
class ThrowableObject extends MovableObject {

  /** @type {boolean} Whether the bottle is currently in splash state */
  splashing = false;

  /** @type {Audio} Sound played when the bottle splashes */
  soundSplash = new Audio("audio/bottle_splash.mp3");

  /** @type {string[]} Animation frames for the rotating bottle in flight */
  BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  
  /** @type {string[]} Animation frames for the bottle splash effect */
  BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * @constructor
   * @param {number} x - The initial x position of the bottle
   * @param {number} y - The initial y position of the bottle
   */
  constructor(x, y) {
    super();
    this.height = 100;
    this.width = 80;
    this.loadImage("img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
    this.loadImages(this.BOTTLE_ROTATION);
    this.loadImages(this.BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.speedY = 30;
  }

  /**
   * @description Advances the bottle's flight: applies gravity, moves it
   * forward and plays the rotation or splash animation depending on state.
   * Called once per frame from the world's central game loop.
   * @param {number} dt - The elapsed time since the last frame in milliseconds
   */
  update(dt) {
    this.updateGravity(dt);
    tickTimer(this.timers, "move", 25, dt, () => {
      if (!this.splashing) this.x += 10;
    });
    tickTimer(this.timers, "animation", 100, dt, () => {
      if (this.splashing) {
        this.playAnimation(this.BOTTLE_SPLASH);
      } else {
        this.playAnimation(this.BOTTLE_ROTATION);
      }
    });
  }

/**
   * @description Triggers the splash state on impact. Resets the animation,
   * stops forward movement and plays the splash sound.
   */
splash() {          
    this.splashing = true;
    this.currentImage = 0;
    this.soundSplash.volume = 0.5;
    this.soundSplash.muted = soundEffectsMuted;
    this.soundSplash.play(); 
  }
}
