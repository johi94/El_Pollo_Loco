/**
 * @class Coin
 * @extends DrawableObject
 * @description Represents a collectible coin in the level.
 * Increases the player's coin count when collected.
 */
class Coin extends DrawableObject {

  /**
   * @type {{top: number, bottom: number, left: number, right: number}}
   * @description Collision offset to fine-tune the hitbox
   */
  offset = { top: 45, bottom: 45, left: 45, right: 45 };

  /** @type {string[]} Images for the coin */
  COIN_IMAGES = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  /**
   * @constructor
   * @param {number} x - The x position of the coin
   * @param {number} y - The y position of the coin
   */
  constructor(x, y) {
    super();
    this.loadImages(this.COIN_IMAGES);
    this.img = this.imageCache[this.COIN_IMAGES[0]];
    this.x = x;
    this.y = y;
    this.width = 180;
    this.height = 180;
  }
}
