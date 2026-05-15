class Character extends MovableObject {
  y = 80;
  width = 130;
  height = 250;
  speed = 10;
  energy = 100;
  coins = 0;
  bottles = 0;
  hurtDuration = 1;
  wasInAir = false; // after "landing" picture idle
  markedForDeletion = false;
  isInvincible = false;
  lastMovement = new Date().getTime(); // getTime for IDLE
  soundJump = new Audio("audio/jump.mp3");
  soundWalk = new Audio("audio/pepe_walk.mp3");
  soundIdle = new Audio("audio/pepe_idle_humming.mp3");
  soundLongIdle = new Audio("audio/pepe_snoring.mp3");

  offset = {
    top: 120,
    bottom: 5,
    left: 30,
    right: 30,
  };

  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

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

  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

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

  world;

  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONGIDLE);
    this.applyGravity();
    this.animate();
  }

  // #start-region animation
  animate() {
    addInterval(() => {
      this.movementCharacter();
      this.landingCharacter();
      this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    addInterval(() => {
      if (this.isDead()) return;
      this.animationCharacter();
    }, 100);
    this.animateDead();
    this.animateHurt();
    this.animateIdle();
  }

  movementCharacter() {
    if (this.isDead()) return;
    if (this.world.gameWon) return;
    if (this.isMovingRight()) {
      this.moveRight();
    }
    if (this.isMovingLeft()) {
      this.moveLeft();
    }
    if (!this.isMovingRight() && !this.isMovingLeft()) {
      this.soundWalk.pause();
      this.soundWalk.currentTime = 0;
    }
    if (this.isJumping()) {
      this.soundWalk.pause();
      this.soundWalk.currentTime = 0;
      this.jump();
    }
  }

  isMovingRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  moveRight() {
    super.moveRight();
    this.otherDirection = false;
    this.lastMovement = new Date().getTime();
    this.playWalkSound();
  }

  isMovingLeft() {
    return this.world.keyboard.LEFT && this.x > -600;
  }

  moveLeft() {
    super.moveLeft();
    this.otherDirection = true;
    this.lastMovement = new Date().getTime();
    this.playWalkSound();
  }

  isJumping() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }

  jump() {
    super.jump();
    this.lastMovement = new Date().getTime();
    this.soundJump.volume = 0.3;
    this.soundJump.muted = soundEffectsMuted;
    this.soundJump.currentTime = 0;
    this.soundJump.play();
  }

  landingCharacter() {
    if (this.isDead()) return;
    if (this.wasInAir && !this.isAboveGround()) {
      this.img = this.imageCache["img/2_character_pepe/1_idle/idle/I-1.png"];
      this.currentImage = 0;
      this.lastMovement = new Date().getTime();
    }
    this.wasInAir = this.isAboveGround();
  }

  animationCharacter() {
    if (this.world.gameWon) return;
    if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }

  animateDead() {
    let deadFrame = 0;
    let deadInterval = addInterval(() => {
      if (this.isDead()) {
        if (deadFrame < this.IMAGES_DEAD.length) {
          this.img = this.imageCache[this.IMAGES_DEAD[deadFrame]];
          deadFrame++;
        } else {
          this.img =
            this.imageCache[this.IMAGES_DEAD[this.IMAGES_DEAD.length - 1]];
          this.markedForDeletion = true;
          clearInterval(deadInterval);
        }
      }
    }, 300);
  }

  animateHurt() {
    addInterval(() => {
      if (this.isDead()) return;
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      }
    }, 500);
  }

  animateIdle() {
    addInterval(() => {
      if (this.isDead()) return;
      let idleTime = (new Date().getTime() - this.lastMovement) / 1000;
      if (idleTime > 15) {
        this.playLongIdle();
      } else if (idleTime > 1) {
        this.playIdle();
      } else {
        this.stopIdleSounds();
      }
    }, 600);
  }
  // #end-region animation

  //  #start-region soundeffetcs character
  playLongIdle() {
    this.playAnimation(this.IMAGES_LONGIDLE);
    this.soundIdle.pause();
    this.soundIdle.currentTime = 0;
    if (this.soundLongIdle.paused) {
      this.soundLongIdle.volume = 0.3;
      this.soundLongIdle.muted = soundEffectsMuted;
      this.soundLongIdle.play();
    }
  }

  playIdle() {
    this.playAnimation(this.IMAGES_IDLE);
    if (this.soundIdle.paused) {
      this.soundIdle.volume = 0.3;
      this.soundIdle.muted = soundEffectsMuted;
      this.soundIdle.play();
    }
  }

  stopIdleSounds() {
    this.soundIdle.pause();
    this.soundIdle.currentTime = 0;
    this.soundLongIdle.pause();
    this.soundLongIdle.currentTime = 0;
  }

  playWalkSound() {
    if (this.soundWalk.paused && !this.isAboveGround()) {
      this.soundWalk.volume = 0.3;
      this.soundWalk.muted = soundEffectsMuted;
      this.soundWalk.play();
    }
  }
  //  #send-region soundeffetcs character

  setInvincible() {
    this.isInvincible = true;
    setTimeout(() => {
      this.isInvincible = false;
    }, 500);
  }
}
