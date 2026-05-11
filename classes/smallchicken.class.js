class Smallchicken extends MovableObject {
  y = 360;
  width = 60;
  height = 60;
  chickenDead = false;
  markedForDeletion = false;

  offset = {
    top: 5,
    bottom: 5,
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
    this.animate();
  }

  die() {
  this.chickenDead = true;
  this.loadImage(this.IMAGE_DEAD);
  this.speed = 0;
  setTimeout(() => {
    this.markedForDeletion = true;
  }, 500);
}

animate() {
  setInterval(() => {
    if (!this.chickenDead) {
      this.moveLeft();
    }
  }, 1000 / 60);
  setInterval(() => {
    if (!this.chickenDead) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }, 200);
}

}
