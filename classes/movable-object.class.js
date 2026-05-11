class MovableObject extends DrawableObject {
  speed = 0.15; // movement speed of clouds and chickens
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // throwableObjects should always fall
      return true;
    } else {
      return this.y < 180;
    }
  }

  isColliding(movableObject) {
     return (
    this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
    this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
    this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
    this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom
  );
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 2;
  }

  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    let index = this.currentImage % images.length;
    let path = images[index];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  moveRight() {
    this.x += this.speed;
  }

  jump() {
    this.speedY = 30;
  }
}
