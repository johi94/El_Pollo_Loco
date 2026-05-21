/**
 * @class Smallchicken
 * @extends BaseChicken
 * @description Represents a small chicken enemy. Faster than a regular chicken.
 */
class Smallchicken extends BaseChicken {

  /** @type {number} The y position of the small chicken */
  y = 360;

  /** @type {number} The width of the small chicken */
  width = 60;

  /** @type {number} The height of the small chicken */
  height = 60;

  /** @type {Audio} Looping sound played while the small chicken is alive and visible */
  sound = new Audio("audio/small_chicken.mp3");

  /** @type {Audio} Sound played when the small chicken dies */
  soundDead = new Audio("audio/small_chicken_dead.mp3");

  /** @type {string[]} Animation frames for the walking animation */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /** @type {string} Image shown when the small chicken is dead */
  IMAGE_DEAD = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";

  /**
   * @constructor
   * @param {number} [x=1000 + Math.random() * 200] - The initial x position
   */
  constructor(x = 1000 + Math.random() * 200) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = x;
    this.speed = 1 + Math.random() * 0.25;
    this.sound.loop = true;
    this.sound.volume = 0.2;
    this.sound.muted = soundEffectsMuted;
    const promise = this.sound.play();
    if (promise !== undefined) {
      promise.catch(() => {});
    }
    this.animate();
  }
}