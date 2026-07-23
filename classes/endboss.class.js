/**
 * @class Endboss
 * @extends MovableObject
 * @description Represents the final boss enemy. Has multiple animation states
 * including alertness, attack, hurt and death. Moves towards the player after
 * first contact.
 */
class Endboss extends MovableObject {
  /** @type {number} The height of the endboss */
  height = 300;

  /** @type {number} The width of the endboss */
  width = 200;

  /** @type {number} The y position of the endboss */
  y = 140;

  /** @type {boolean} Whether the player has triggered first contact */
  hadfirstContact = false;

  /** @type {number} The current energy/health of the endboss (0-100) */
  energy = 100;

  /** @type {boolean} Whether the endboss should be removed from the level */
  markedForDeletion = false;

  /** @type {number} Tracks the current animation cycle index */
  animationIndex = 0;

  /** @type {Audio} Roar sound played when the player gets close */
  soundRoar = new Audio("audio/endboss_roar.mp3");

  /** @type {boolean} Whether the roar sound has already been played */
  roarSoundPlayed = false;

  /** @type {Audio} Footstep sound played while the endboss is walking */
  soundWalk = new Audio("audio/endboss_footsteps.mp3");

  /** @type {boolean} Whether the endboss is currently in attack state */
  isAttacking = false;

  /** @type {Audio} Sound played when the endboss attacks */
  attackSound = new Audio("audio/chicken_boss.mp3");

  /** @type {Audio} Sound played when the endboss is hurt */
  soundHurt = new Audio("audio/endboss_hurt_scream.mp3");

  /** @type {Audio} Sound played when the endboss dies */
  soundDead = new Audio("audio/endboss_dead.mp3");

  /** @type {boolean} Whether the death sound has already been played */
  deadSoundPlayed = false;

  /**
   * @type {{top: number, bottom: number, left: number, right: number}}
   * @description Collision offset to fine-tune the hitbox
   */
  offset = {
    top: 80,
    bottom: 10,
    left: 20,
    right: 20,
  };

  /** @type {string[]} Animation frames for the walking state */
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /** @type {string[]} Animation frames for the alertness state */
  IMAGES_ALERTNESS = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /** @type {string[]} Animation frames for the attack state */
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /** @type {string[]} Animation frames for the hurt state */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /** @type {string[]} Animation frames for the death state */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * @constructor
   * @description Loads all animation images and starts the endboss animation.
   */
  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERTNESS);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2600;
    this.speed = 8;
  }

  // #start-region animation

  /**
   * @description Advances the endboss's main animation/behaviour, hurt and
   * death states by the given elapsed time. Called once per frame from the
   * world's central game loop.
   * @param {number} dt - The elapsed time since the last frame in milliseconds
   */
  update(dt) {
    tickTimer(this.timers, "main", 200, dt, () => {
      this.checkFirstContact();
      if (this.isDead()) return;
      if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else {
        this.walkingAnimation();
      }
      this.animationIndex++;
    });
    tickTimer(this.timers, "hurt", 600, dt, () => {
      if (this.isDead()) return;
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        if (this.soundHurt.paused) {
          this.playSound(this.soundHurt, 0.5);
        }
      }
    });
    tickTimer(this.timers, "dead", 400, dt, () => {
      if (this.isDead()) {
        this.handleDeathSequence();
      }
    });
  }

  /**
   * @description Checks whether first contact conditions are met and
   * triggers the roar sound if the player is close enough.
   */
  checkFirstContact() {
    this.checkEnterCombat();
    this.checkRoarSound();
  }

  /**
   * @description Activates combat mode when the player crosses x position 2000.
   * Makes the endboss health bar visible.
   */
  checkEnterCombat() {
    if (this.world && this.world.character.x > 2000 && !this.hadfirstContact) {
      this.animationIndex = 0;
      this.hadfirstContact = true;
      this.world.endbossBarVisible = true;
    }
  }

  /**
   * @description Plays the roar sound once when the player crosses x position 1650.
   */
  checkRoarSound() {
    if (this.world && this.world.character.x > 1650 && !this.roarSoundPlayed) {
      this.roarSoundPlayed = true;
      this.playSound(this.soundRoar, 0.5);
    }
  }

  /**
   * @description Plays the appropriate walking animation based on contact state
   * and animation index.
   */
  walkingAnimation() {
    if (!this.hadfirstContact) {
      this.playAnimation(this.IMAGES_WALKING);
      return;
    }
    if (this.animationIndex < 10) {
      this.playAlertnessPhase();
    } else {
      this.playWalkingPhase();
    }
  }

  /**
   * @description Plays the alertness animation and stops the walking sound.
   */
  playAlertnessPhase() {
    this.playAnimation(this.IMAGES_ALERTNESS);
    this.soundWalk.pause();
    this.soundWalk.currentTime = 0;
  }

  /**
   * @description Plays the walking animation, moves towards the character
   * and plays the walking sound.
   */
  playWalkingPhase() {
    this.playAnimation(this.IMAGES_WALKING);
    this.moveTowardsCharacter();
    if (this.soundWalk.paused) {
      this.playSound(this.soundWalk, 0.5, false);
    }
  }

  /**
   * @description Moves the endboss towards the player character if it is to the left.
   */
  moveTowardsCharacter() {
    if (this.world && this.world.character) {
      if (this.world.character.x < this.x) {
        this.x -= this.speed;
      }
    }
  }

  /**
   * @description Handles the full death sequence: stops walking sound,
   * plays death sound and animation, then schedules removal.
   */
  handleDeathSequence() {
    this.soundWalk.pause();
    this.soundWalk.currentTime = 0;
    this.playDeadSound();
    this.playAnimation(this.IMAGES_DEAD);
    this.scheduleRemoval();
  }

  /**
   * @description Plays the death sound once.
   */
  playDeadSound() {
    if (this.soundDead.paused && !this.deadSoundPlayed) {
      this.deadSoundPlayed = true;
      this.playSound(this.soundDead, 0.5);
    }
  }

  /**
   * @description Marks the endboss for deletion after 1000ms and stops the death sound.
   */
  scheduleRemoval() {
    if (!this.markedForDeletion) {
      setTimeout(() => {
        this.markedForDeletion = true;
        this.soundDead.pause();
        this.soundDead.currentTime = 0;
      }, 1000);
    }
  }
  
  // #end-region animation

  // #start-region combat

  /**
   * @description Reduces the endboss energy by 20 on hit.
   * Only applies if the endboss is not currently in hurt state.
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
   * @description Triggers the attack state and plays the attack sound.
   * Resets the attack state after 800ms.
   */
  startAttack() {
    this.isAttacking = true;
    this.playSound(this.attackSound, 0.5);
    setTimeout(() => {
      this.isAttacking = false;
    }, 800);
  }

  // #end-region combat

  // #start-region sounds

  /**
   * @description Plays a sound at the given volume, optionally resetting playback.
   * @param {Audio} sound - The audio object to play
   * @param {number} [volume=0.5] - The volume level (0.0 to 1.0)
   * @param {boolean} [resetTime=true] - Whether to reset playback to the beginning
   */
  playSound(sound, volume = 0.5, resetTime = true) {
    sound.volume = volume;
    sound.muted = soundEffectsMuted;
    if (resetTime) sound.currentTime = 0;
    sound.play();
  }

  // #end-region sounds
}
