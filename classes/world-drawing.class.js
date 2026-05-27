/**
 * @description Mixin that adds all drawing and rendering related methods to the World class.
 */
Object.assign(World.prototype, {

  /**
   * @description Main render loop. Clears the canvas and redraws all game objects each frame.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    this.drawGameObjects();
    this.drawStatusBars();
    this.animationFrame = requestAnimationFrame(() => this.draw());
  },

  /**
   * @description Draws all background objects with camera offset applied.
   */
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
  },

  /**
   * @description Draws all dynamic game objects (clouds, coins, bottles,
   * character, enemies, throwables) with camera offset applied.
   */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  },

  /**
   * @description Draws all status bars. The endboss bar is only shown
   * after first contact.
   */
  drawStatusBars() {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
    if (this.endbossBarVisible) {
      this.addToMap(this.statusBarEndboss);
    }
  },

  /**
   * @description Draws an array of objects onto the canvas.
   * @param {DrawableObject[]} objects - The objects to draw
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  },

  /**
   * @description Draws a single object onto the canvas.
   * Flips the image horizontally if the object is moving in the other direction.
   * @param {MovableObject} movableObject - The object to draw
   */
  addToMap(movableObject) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject);
    }
    movableObject.draw(this.ctx);
    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
    }
  },

  /**
   * @description Flips the canvas context horizontally to mirror an object's image.
   * @param {MovableObject} movableObject - The object to flip
   */
  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  },

  /**
   * @description Restores the canvas context after flipping an image.
   * @param {MovableObject} movableObject - The object to restore
   */
  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  },
});