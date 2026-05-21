/**
 * @class BackgroundObject
 * @extends MovableObject
 * @description Represents a static background layer in the level.
 * Used to create a parallax-style background with multiple image layers.
 */
class BackgroundObject extends MovableObject {

   /** @type {number} The width of the background object */
   width = 720;

   /** @type {number} The height of the background object */
   height = 480;
   
   /**
   * @constructor
   * @param {string} imagePath - The file path of the background image to display
   * @param {number} x - The x position of the background object
   */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;             
    }
}


 

