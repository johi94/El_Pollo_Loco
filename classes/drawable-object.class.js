
/**
 * @class DrawableObject
 * @description Base class for all drawable game objects. Provides shared logic
 * for loading and rendering images onto the canvas.
 */
class DrawableObject {

  /** @type {number} The x position of the object */
  x = 80;

  /** @type {number} The y position of the object */
  y = 280;

  /** @type {number} The height of the object */
  height = 150;

  /** @type {number} The width of the object */
  width = 100;

  /** @type {HTMLImageElement} The currently displayed image */
  img;

  /** @type {Object.<string, HTMLImageElement>} Cache of preloaded images indexed by path */
  imageCache = {};

  /** @type {number} The index of the currently displayed animation frame */
  currentImage = 0;

  /**
   * @description Loads a single image from the given path and sets it as the current image.
   * @param {string} path - The file path of the image to load
   */
  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementByID('image') <img id="image">
    this.img.src = path;
  }

  /**
   * @description Draws the current image onto the canvas at the object's position and size.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context to draw on
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * @description Preloads an array of images and stores them in the image cache.
   * @param {string[]} array - The file paths of the images to preload
   */
  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
