class Endboss extends MovableObject {
  height = 300;
  width = 200;
  y = 140;
  hadfirstContact = false;
  energy = 100;
  markedForDeletion = false;
  animationIndex = 0;

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
  }

  animate() {
    let i = 0;
    setInterval(() => {
      this.checkFirstContact(i);
      if (this.isDead()) return;
      this.walkingAnimation(i);
      this.animationIndex++;
    }, 200);
    this.animateHurt();
    this.animateDead();
  }

  checkFirstContact(i) {
    if (this.world && this.world.character.x > 2000 && !this.hadfirstContact) {
      this.animationIndex = 0;
      this.hadfirstContact = true;
    }
  }

  walkingAnimation(i) {
    if (this.animationIndex < 10) {
    this.playAnimation(this.IMAGES_WALKING);
  } else {
    this.playAnimation(this.IMAGES_ALERTNESS);
  }
  }

  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  animateHurt() {
    let hurtInterval = setInterval(() => {
      if (this.isDead()) return;
      if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      }
    }, 600);
  }

  animateDead() {
    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
        setTimeout(() => {
          this.markedForDeletion = true;
        }, 1000);
      }
    }, 400);
  }
}
