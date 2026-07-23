/**
 * @class Bottle
 * @extends DrawableObject
 * @description Represents a collectible salsa bottle in the level.
 * Increases the player's bottle count when collected.
 */
class Bottle extends DrawableObject {

  /**
   * @type {{top: number, bottom: number, left: number, right: number}}
   * @description Collision offset to fine-tune the hitbox
   */
  offset = { top: 45, bottom: 10, left: 45, right: 45 };

  /** @type {string[]} Images for the bottle on the ground */
  BOTTLE_IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];
  
  /**
   * @constructor
   * @param {number} x - The x position of the bottle
   * @param {number} y - The y position of the bottle
   * @param {number} [imageIndex=0] - The index of the bottle image to display (0 or 1)
   */
  constructor(x, y, imageIndex = 0) {
    super();
    this.width = 100;
    this.height = 80;
    this.loadImages(this.BOTTLE_IMAGES);
    this.img = this.imageCache[this.BOTTLE_IMAGES[imageIndex]];
    this.x = x;
    this.y = y;
  }
}
