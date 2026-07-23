/**
 * @class Chicken
 * @extends BaseChicken
 * @description Represents a normal chicken enemy.
 */
class Chicken extends BaseChicken {

  /** @type {number} The y position of the chicken */
  y = 360;

  /** @type {number} The width of the chicken */
  width = 60;

  /** @type {number} The height of the chicken */
  height = 60;

  /** @type {Audio} Looping sound played while the chicken is alive and visible */
  sound = new Audio("audio/chicken_sound.mp3");

  /** @type {Audio} Sound played when the chicken dies */
  soundDead = new Audio("audio/chicken_dead.mp3");

  /** @type {string[]} Animation frames for the walking animation */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /** @type {string} Image shown when the chicken is dead */
  IMAGE_DEAD = "img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  /**
   * @constructor
   * @param {number} [x=250 + Math.random() * 500] - The initial x position
   */
  constructor(x = 250 + Math.random() * 500) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = x;
    this.speed = 0.15 + Math.random() * 0.25;
    this.sound.loop = true;
    this.sound.volume = 0.5;
    this.sound.muted = soundEffectsMuted;
  }
}
