
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
   * @type {Object.<string, HTMLCanvasElement>}
   * @description Class-wide cache of images pre-scaled to a target size, keyed by
   * "path__WxH". Drawing a pre-scaled canvas 1:1 avoids the per-frame resampling
   * cost of ctx.drawImage() scaling a much larger source image down every frame.
   */
  static scaledImageCache = {};

  /**
   * @description Returns a canvas containing the given image pre-scaled to the
   * requested size, creating and caching it on first use. The canvas is returned
   * immediately and filled in once the source image has loaded.
   * @param {string} path - The file path of the image to load
   * @param {number} width - The target width in pixels
   * @param {number} height - The target height in pixels
   * @returns {HTMLCanvasElement} A canvas pre-scaled to width x height
   */
  getScaledImage(path, width, height) {
    const key = `${path}__${width}x${height}`;
    if (DrawableObject.scaledImageCache[key]) {
      return DrawableObject.scaledImageCache[key];
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    DrawableObject.scaledImageCache[key] = canvas;
    const source = new Image();
    source.onload = () => {
      canvas.getContext("2d").drawImage(source, 0, 0, width, height);
    };
    source.src = path;
    return canvas;
  }

  /**
   * @description Loads a single image from the given path, pre-scaled to the
   * object's current width/height, and sets it as the current image.
   * @param {string} path - The file path of the image to load
   */
  loadImage(path) {
    this.img = this.getScaledImage(path, this.width, this.height);
  }

  /**
   * @description Draws the current image onto the canvas at the object's position and size.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context to draw on
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * @description Preloads an array of images, pre-scaled to the object's current
   * width/height, and stores them in the image cache.
   * @param {string[]} array - The file paths of the images to preload
   */
  loadImages(array) {
    array.forEach((path) => {
      this.imageCache[path] = this.getScaledImage(path, this.width, this.height);
    });
  }
}
