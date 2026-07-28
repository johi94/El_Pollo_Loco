/**
 * @description Mixin that adds all drawing and rendering related methods to the World class.
 */
Object.assign(World.prototype, {

  /**
   * @description Main game loop. Advances all game state by the elapsed time
   * since the last frame (unless paused), then clears the canvas and redraws
   * all game objects. Driven by a single requestAnimationFrame chain instead
   * of many independent setIntervals, so movement/animation stay in sync with
   * rendering and don't rely on browser timer precision. Throttled to
   * `frameInterval` (30fps) so update+redraw work doesn't run at the display's
   * full native refresh rate, which is 120Hz+ on ProMotion MacBooks.
   * @param {number} [timestamp] - The frame timestamp provided by requestAnimationFrame
   */
  draw(timestamp = performance.now()) {
    this.animationFrame = requestAnimationFrame((ts) => this.draw(ts));
    if (this.lastFrameTime && timestamp - this.lastFrameTime < this.frameInterval) return;
    const dt = this.lastFrameTime ? Math.min(timestamp - this.lastFrameTime, 100) : 0;
    this.lastFrameTime = timestamp;
    if (!gamePaused) this.update(dt);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    this.drawGameObjects();
    this.drawStatusBars();
  },

  /**
   * @description Draws all background objects with camera offset applied.
   * Objects far outside the visible camera range are skipped, same as
   * the dynamic game objects, since each background layer is a full
   * canvas-sized draw and only ~2 of the level's segments are ever visible.
   */
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects.filter((o) => this.isOnScreen(o)));
    this.ctx.translate(-this.camera_x, 0);
  },

  /**
   * @description Draws all dynamic game objects (clouds, coins, bottles,
   * character, enemies, throwables) with camera offset applied. Objects far
   * outside the visible camera range are skipped to avoid unnecessary draw calls.
   */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.clouds.filter((o) => this.isOnScreen(o)));
    this.addObjectsToMap(this.level.coins.filter((o) => this.isOnScreen(o)));
    this.addObjectsToMap(this.level.bottles.filter((o) => this.isOnScreen(o)));
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies.filter((o) => this.isOnScreen(o)));
    this.addObjectsToMap(this.throwableObjects.filter((o) => this.isOnScreen(o)));
    this.ctx.translate(-this.camera_x, 0);
  },

  /**
   * @description Checks whether an object is within (or near) the visible
   * camera range, used to skip drawing objects that are far off-screen.
   * @param {DrawableObject} obj - The object to check
   * @returns {boolean} True if the object is on or near screen
   */
  isOnScreen(obj) {
    const cameraX = -this.camera_x;
    return (
      obj.x + obj.width > cameraX - 100 &&
      obj.x < cameraX + this.canvas.width + 100
    );
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