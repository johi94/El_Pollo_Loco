/**
 * @class Character
 * @extends MovableObject
 * @description Represents the player character Pepe. Handles movement, jumping,
 * animations, sound effects and idle states.
 */
class Character extends MovableObject {
  /** @type {number} The y position of the character */
  y = 80;

  /** @type {number} The width of the character */
  width = 130;

  /** @type {number} The height of the character */
  height = 250;

  /** @type {number} The horizontal movement speed */
  speed = 10;

  /** @type {number} The current energy/health of the character (0-100) */
  energy = 100;

  /** @type {number} The current coin count (0-100) */
  coins = 0;

  /** @type {number} The current bottle count (0-100) */
  bottles = 0;

  /** @type {number} Duration in seconds the character remains in hurt state after a hit */
  hurtDuration = 1;

  /** @type {boolean} Whether the character was in the air in the previous frame */
  wasInAir = false;

  /** @type {boolean} Whether the character should be removed from the level */
  markedForDeletion = false;

  /** @type {boolean} Whether the character is currently invincible after stomping an enemy */
  isInvincible = false;

  /** @type {number} Timestamp of the last movement input */
  lastMovement = new Date().getTime();

  /** @type {Audio} Sound played when the character jumps */
  soundJump = new Audio("audio/jump.mp3");

  /** @type {Audio} Sound played while the character is walking */
  soundWalk = new Audio("audio/pepe_walk.mp3");

  /** @type {Audio} Sound played during short idle state */
  soundIdle = new Audio("audio/pepe_idle_humming.mp3");

  /** @type {Audio} Sound played during long idle state */
  soundLongIdle = new Audio("audio/pepe_snoring.mp3");

  /** @type {World} Reference to the game world */
  world;

  /**
   * @type {{top: number, bottom: number, left: number, right: number}}
   * @description Collision offset to fine-tune the hitbox
   */
  offset = {
    top: 120,
    bottom: 5,
    left: 30,
    right: 30,
  };

  /** @type {string[]} Animation frames for the walking state */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  /** @type {string[]} Animation frames for the jumping state */
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  /** @type {string[]} Animation frames for the death state */
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  /** @type {string[]} Animation frames for the hurt state */
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  /** @type {string[]} Animation frames for the short idle state */
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /** @type {string[]} Animation frames for the long idle state */
  IMAGES_LONGIDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /**
   * @constructor
   * @description Loads all animation images, applies gravity and starts the animation loop.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONGIDLE);
  }

  // #start-region animation

  /**
   * @description Advances all movement, animation and gravity state for the
   * character by the given elapsed time. Called once per frame from the world's
   * central game loop instead of relying on independent setIntervals.
   * @param {number} dt - The elapsed time since the last frame in milliseconds
   */
  update(dt) {
    this.updateGravity(dt);
    tickTimer(this.timers, "move", 1000 / 60, dt, () => {
      this.movementCharacter();
      this.landingCharacter();
      this.world.camera_x = -this.x + 100;
    });
    tickTimer(this.timers, "animation", 100, dt, () => {
      if (this.isDead()) return;
      this.animationCharacter();
    });
    tickTimer(this.timers, "dead", 300, dt, () => this.tickDeadAnimation());
    tickTimer(this.timers, "hurt", 500, dt, () => {
      if (this.isDead()) return;
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      }
    });
    tickTimer(this.timers, "idle", 600, dt, () => {
      if (this.isDead()) return;
      this.handleIdleState();
    });
  }

  /**
   * @description Handles all movement input for the current frame.
   * Skips movement if the character is dead or the game is won.
   */
  movementCharacter() {
    if (this.isDead()) return;
    if (this.world.gameWon) return;
    this.handleHorizontalMovement();
    this.handleJump();
  }

  /**
   * @description Handles left and right movement based on keyboard input.
   * Pauses the walk sound when no horizontal key is pressed.
   */
  handleHorizontalMovement() {
    if (this.isMovingRight()) {
      this.moveRight();
    } else if (this.isMovingLeft()) {
      this.moveLeft();
    } else {
      this.soundWalk.pause();
      this.soundWalk.currentTime = 0;
    }
  }

  /**
   * @description Triggers a jump if the space key is pressed and the character is on the ground.
   */
  handleJump() {
    if (this.isJumping()) {
      this.soundWalk.pause();
      this.soundWalk.currentTime = 0;
      this.jump();
    }
  }

  /**
   * @description Checks whether the character should move right.
   * @returns {boolean} True if the right key is pressed and the level end has not been reached
   */
  isMovingRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  /**
   * @description Moves the character to the right and plays the walk sound.
   */
  moveRight() {
    super.moveRight();
    this.otherDirection = false;
    this.lastMovement = new Date().getTime();
    this.playWalkSound();
  }

  /**
   * @description Checks whether the character should move left.
   * @returns {boolean} True if the left key is pressed and the left boundary has not been reached
   */
  isMovingLeft() {
    return this.world.keyboard.LEFT && this.x > -600;
  }

  /**
   * @description Moves the character to the left and plays the walk sound.
   */
  moveLeft() {
    super.moveLeft();
    this.otherDirection = true;
    this.lastMovement = new Date().getTime();
    this.playWalkSound();
  }

  /**
   * @description Checks whether the character should jump.
   * @returns {boolean} True if space is pressed and the character is on the ground
   */
  isJumping() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }

  /**
   * @description Makes the character jump and plays the jump sound.
   */
  jump() {
    super.jump();
    this.lastMovement = new Date().getTime();
    this.playSound(this.soundJump, 0.3);
  }

  /**
   * @description Detects when the character lands after being in the air
   * and resets the animation to the idle frame.
   */
  landingCharacter() {
    if (this.isDead()) return;
    if (this.wasInAir && !this.isAboveGround()) {
      this.img = this.imageCache["img/2_character_pepe/1_idle/idle/I-1.png"];
      this.currentImage = 0;
      this.lastMovement = new Date().getTime();
    }
    this.wasInAir = this.isAboveGround();
  }

  /**
   * @description Plays the jumping or walking animation based on the current state.
   * Skips animation if the game is won.
   */
  animationCharacter() {
    if (this.world.gameWon) return;
    if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  /**
   * @description Plays the death animation frame by frame and marks the
   * character for deletion when the animation finishes. Safe to call
   * repeatedly after finishing; it just keeps showing the last dead frame.
   */
  tickDeadAnimation() {
    if (!this.isDead()) return;
    if (this.deadFrame === undefined) this.deadFrame = 0;
    if (this.deadFrame < this.IMAGES_DEAD.length) {
      this.img = this.imageCache[this.IMAGES_DEAD[this.deadFrame]];
      this.deadFrame++;
    } else {
      this.img = this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
      this.markedForDeletion = true;
    }
  }

  /**
   * Determines the current idle state based on time since last movement
   * and plays the appropriate animation and sound.
   * Switches to long idle after 15 seconds of inactivity,
   * otherwise plays the default idle animation immediately.
   */
  handleIdleState() {
    const idleTime = (new Date().getTime() - this.lastMovement) / 1000;
    if (idleTime > 15) {
      this.playLongIdle();
    } else {
      this.playIdle();
    }
  }

  // #end-region animation

  //  #start-region soundEffetcs character

  /**
   * @description Plays a sound at the given volume, optionally resetting playback.
   * @param {Audio} sound - The audio object to play
   * @param {number} [volume=0.3] - The volume level (0.0 to 1.0)
   * @param {boolean} [resetTime=true] - Whether to reset playback to the beginning
   */
  playSound(sound, volume = 0.3, resetTime = true) {
    sound.volume = volume;
    sound.muted = soundEffectsMuted;
    if (resetTime) sound.currentTime = 0;
    sound.play();
  }

  /**
   * @description Plays the long idle animation and sound when the character
   * has been inactive for more than 15 seconds.
   */
  playLongIdle() {
    this.playAnimation(this.IMAGES_LONGIDLE);
    this.soundIdle.pause();
    this.soundIdle.currentTime = 0;
    if (this.soundLongIdle.paused) {
      this.playSound(this.soundLongIdle, 0.3, false);
    }
  }

  /**
   * @description Plays the short idle animation and sound when the character
   * has been inactive for more than 1 second.
   */
  playIdle() {
    this.playAnimation(this.IMAGES_IDLE);
    if (this.soundIdle.paused) {
      this.playSound(this.soundIdle, 0.3, false);
    }
  }

  /**
   * @description Stops all idle sounds and resets their playback position.
   */
  stopIdleSounds() {
    this.soundIdle.pause();
    this.soundIdle.currentTime = 0;
    this.soundLongIdle.pause();
    this.soundLongIdle.currentTime = 0;
  }

  /**
   * @description Plays the walk sound if the character is on the ground and the sound is paused.
   */
  playWalkSound() {
    if (this.soundWalk.paused && !this.isAboveGround()) {
      this.playSound(this.soundWalk, 0.3, false);
    }
  }

  //  #end-region soundEffetcs character

  /**
   * @description Makes the character temporarily invincible for 500ms
   * after stomping an enemy.
   */
  setInvincible() {
    this.isInvincible = true;
    setTimeout(() => {
      this.isInvincible = false;
    }, 500);
  }
}
