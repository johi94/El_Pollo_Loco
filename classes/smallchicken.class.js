class Smallchicken extends MovableObject {
  y = 360;
  width = 60;
  height = 60;
  chickenDead = false;
  markedForDeletion = false;
  sound = new Audio("audio/small_chicken.mp3");
  soundDead = new Audio('audio/small_chicken_dead.mp3');

  offset = {
    top: 0,
    bottom: 0,
    left: 5,
    right: 5,
  };

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGE_DEAD = "img/3_enemies_chicken/chicken_small/2_dead/dead.png";

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 1000 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;
    this.sound.loop = true;
    this.sound.volume = 0.2;
    this.sound.muted = soundEffectsMuted;
    this.animate();
  }

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

  animate() {
    addInterval(() => {
      if (!this.chickenDead) {
        this.moveLeft();
      }
      this.updateSound();
    }, 1000 / 60);
    addInterval(() => {
      if (!this.chickenDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }

  updateSound() {
  if (this.isVisible() && !this.chickenDead) {
    if (this.sound.paused) {
      this.sound.play();
    }
  } else {
    this.sound.pause();
  }
}

isVisible() {
  if (!world) return false;
  const cameraX = -world.camera_x; 
  return this.x > cameraX - 100 && this.x < cameraX + 820; 
}
}
