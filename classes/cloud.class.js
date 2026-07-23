/**
 * @class Cloud
 * @extends MovableObject
 * @description Represents a cloud in the background that moves continuously to the left
 * and resets to the right side of the level when it goes off screen.
 */
class Cloud extends MovableObject {

  /** @type {number} The y position of the cloud */
  y = 25;
  
  /** @type {number} The width of the cloud */
  width = 400; 

  /** @type {number} The height of the cloud */
  height = 400; 

  /** @type {string[]} Images for the cloud */
  CLOUD_IMAGES = [
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
  ];

  /**
   * @constructor
   * @param {number} x - The initial x position of the cloud
   */
  constructor(x) {
    super().loadImage(this.CLOUD_IMAGES[0]);
    this.x = x;
  }

  /**
   * @description Moves the cloud continuously to the left.
   * Resets to x position 2600 when the cloud moves off the left edge of the screen.
   * @param {number} dt - The elapsed time since the last frame in milliseconds
   */
  update(dt) {
    tickTimer(this.timers, "move", 1000 / 60, dt, () => {
      this.moveLeft();
      if (this.x < -this.width) {
        this.x = 2600;
      }
    });
  }
}
