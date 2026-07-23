/**
 * @class BaseChicken
 * @extends MovableObject
 * @description Base class for all chicken enemies. Provides shared logic
 * for movement, animation, sound and death handling.
 */
class BaseChicken extends MovableObject {

  /** @type {boolean} Whether the chicken has been killed */
  chickenDead = false;

  /** @type {boolean} Whether the chicken should be removed from the level */
  markedForDeletion = false;

  /**
   * @type {{top: number, bottom: number, left: number, right: number}}
   * @description Collision offset to fine-tune the hitbox
   */
  offset = {
    top: 0,
    bottom: 0,
    left: 5,
    right: 5,
  };

  /**
   * @description Kills the chicken, switches to the dead image,
   * stops movement and plays the death sound.
   * Marks it for deletion after 500ms.
   */
  die() {
    this.chickenDead = true;
    this.loadImage(this.IMAGE_DEAD);
    this.speed = 0;
    this.sound.pause();
    this.sound.currentTime = 0;
    this.soundDead.volume = 0.5;
    this.soundDead.muted = soundEffectsMuted;
    this.soundDead.play();
    setTimeout(() => {
      this.markedForDeletion = true;
    }, 500);
  }

  /**
   * @description Advances movement and animation state for the chicken by the
   * given elapsed time. Called once per frame from the world's central game loop.
   * @param {number} dt - The elapsed time since the last frame in milliseconds
   */
  update(dt) {
    tickTimer(this.timers, "move", 1000 / 60, dt, () => {
      if (!this.chickenDead) {
        this.moveLeft();
      }
      this.updateSound();
    });
    tickTimer(this.timers, "animation", 200, dt, () => {
      if (!this.chickenDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    });
  }

  /**
   * @description Plays or pauses the walking sound based on visibility and alive state.
   */
  updateSound() {
    if (this.isVisible() && !this.chickenDead) {
      if (this.sound.paused) {
        const promise = this.sound.play();
        if (promise !== undefined) {
          promise.catch(() => {});
        }
      }
    } else {
      this.sound.pause();
    }
  }

  /**
   * @description Checks if the chicken is within the visible camera range.
   * @returns {boolean} True if the chicken is currently visible on screen
   */
  isVisible() {
    if (!world) return false;
    const cameraX = -world.camera_x;
    return this.x > cameraX - 100 && this.x < cameraX + 820;
  }
}