class Endboss extends MovableObject {
  height = 300;
  width = 200;
  y = 140;
  hadfirstContact = false;
  energy = 100;
  markedForDeletion = false;
  animationIndex = 0;
  soundRoar = new Audio("audio/endboss_roar.mp3");
  roarSoundPlayed = false;
  soundWalk = new Audio("audio/endboss_footsteps.mp3");
  isAttacking = false;
  attackSound = new Audio("audio/chicken_boss.mp3");
  soundHurt = new Audio("audio/endboss_hurt_scream.mp3");
  soundDead = new Audio("audio/endboss_dead.mp3");
  deadSoundPlayed = false;

  offset = {
    top: 80,
    bottom: 10,
    left: 20,
    right: 20,
  };

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

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

  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super().loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERTNESS);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2600;
    this.animate();
    this.speed = 8;
  }

  // #start-region animation
  animate() {
    addInterval(() => {
      this.checkFirstContact();
      if (this.isDead()) return;
      if (this.isAttacking) {
        this.playAnimation(this.IMAGES_ATTACK);
      } else {
        this.walkingAnimation();
      }
      this.animationIndex++;
    }, 200);
    this.animateHurt();
    this.animateDead();
  }

  checkFirstContact() {
  this.checkEnterCombat();
  this.checkRoarSound();
}

checkEnterCombat() {
  if (this.world && this.world.character.x > 2000 && !this.hadfirstContact) {
    this.animationIndex = 0;
    this.hadfirstContact = true;
    this.world.endbossBarVisible = true;
  }
}

checkRoarSound() {
  if (this.world && this.world.character.x > 1650 && !this.roarSoundPlayed) {
    this.roarSoundPlayed = true;
    this.playSound(this.soundRoar, 0.5);
  }
}

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

playAlertnessPhase() {
  this.playAnimation(this.IMAGES_ALERTNESS);
  this.soundWalk.pause();
  this.soundWalk.currentTime = 0;
}

playWalkingPhase() {
  this.playAnimation(this.IMAGES_WALKING);
  this.moveTowardsCharacter();
  if (this.soundWalk.paused) {
    this.playSound(this.soundWalk, 0.5, false);
  }
}

  moveTowardsCharacter() {
    if (this.world && this.world.character) {
      if (this.world.character.x < this.x) {
        this.x -= this.speed;
      }
    }
  }

  animateHurt() {
    addInterval(() => {
      if (this.isDead()) return;
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
        if (this.soundHurt.paused) {
          this.playSound(this.soundHurt, 0.5);
        }
      }
    }, 600);
  }

  animateDead() {
  addInterval(() => {
    if (this.isDead()) {
      this.handleDeathSequence();
    }
  }, 400);
}

handleDeathSequence() {
  this.soundWalk.pause();
  this.soundWalk.currentTime = 0;
  this.playDeadSound();
  this.playAnimation(this.IMAGES_DEAD);
  this.scheduleRemoval();
}

playDeadSound() {
  if (this.soundDead.paused && !this.deadSoundPlayed) {
    this.deadSoundPlayed = true;
    this.playSound(this.soundDead, 0.5);
  }
}

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

  hit() {
    if (this.isHurt()) return;
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  startAttack() {
    this.isAttacking = true;
    this.playSound(this.attackSound, 0.5);
    setTimeout(() => {
      this.isAttacking = false;
    }, 800);
  }

  // #end-region combat

  // #start-region sounds

  playSound(sound, volume = 0.5, resetTime = true) {
  sound.volume = volume;
  sound.muted = soundEffectsMuted;
  if (resetTime) sound.currentTime = 0;
  sound.play();
}

  // #end-region sounds
}
