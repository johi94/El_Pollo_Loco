/**
 * @class MovableObject
 * @extends DrawableObject
 * @description Base class for all movable game objects. Provides shared logic
 * for movement, gravity, collision detection, animation and health management.
 */
class MovableObject extends DrawableObject {

  /** @type {number} The horizontal movement speed */
  speed = 0.15; 

  /** @type {boolean} Whether the object is moving in the opposite direction */
  otherDirection = false;

  /** @type {number} The vertical speed used for jumping and gravity */
  speedY = 0;

  /** @type {number} The gravity acceleration applied each frame */
  acceleration = 2.5;

  /** @type {number} The current energy/health of the object (0-100) */
  energy = 100;

  /** @type {number} Timestamp of the last hit received */
  lastHit = 0;

  /** @type {number} Duration in seconds the object remains in hurt state after a hit */
  hurtDuration = 0.5;

  /**
   * @type {{top: number, bottom: number, left: number, right: number}}
   * @description Collision offset to fine-tune the hitbox
   */
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /** @type {Object.<string, number>} Accumulated time per fixed-step timer, keyed by name */
  timers = {};

  /**
   * @description Applies gravity to the object by reducing speedY in fixed
   * steps of 1000/25ms, accumulated from the per-frame delta time.
   * Only applies when the object is above ground or moving upward.
   * @param {number} dt - The elapsed time since the last frame in milliseconds
   */
  updateGravity(dt) {
    tickTimer(this.timers, "gravity", 1000 / 25, dt, () => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    });
  }

  /**
   * @description Checks whether the object is currently above the ground level.
   * ThrowableObjects always return true so they keep falling.
   * @returns {boolean} True if the object is above the ground
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // throwableObjects should always fall
      return true;
    } else {
      return this.y < 180;
    }
  }

  /**
   * @description Checks whether this object is colliding with another movable object
   * using offset-adjusted bounding box collision detection.
   * @param {MovableObject} movableObject - The object to check collision against
   * @returns {boolean} True if the two objects are colliding
   */
  isColliding(movableObject) {
     return (
    this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
    this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
    this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
    this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom
  );
  }

  /**
   * @description Reduces the object's energy by 20 on hit.
   * Only applies if the object is not currently in hurt state.
   */
  hit() {
    if (this.isHurt()) return;
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * @description Checks whether the object is currently in hurt state.
   * @returns {boolean} True if the object was hit within the hurt duration
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < this.hurtDuration;
  }

  /**
   * @description Checks whether the object has no energy left.
   * @returns {boolean} True if energy is zero
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * @description Advances the animation by one frame from the given image array.
   * @param {string[]} images - The array of image paths to animate through
   */
  playAnimation(images) {
    let index = this.currentImage % images.length;
    let path = images[index];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * @description Moves the object to the left by its speed value.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * @description Moves the object to the right by its speed value.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * @description Makes the object jump by setting a positive vertical speed.
   */
  jump() {
    this.speedY = 30;
  }
}
