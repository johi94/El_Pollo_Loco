class MovableObject {
  x = 80;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0;
  speed = 0.15; // movement speed of clouds and chickens

  otherDirection = false;

  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementByID('image') <img id="image">
    this.img.src = path;
  }

  loadImages(array) {
    array.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  moveRight() {
    console.log("Moving right");
  }

  playAnimation(images) {
    let index = this.currentImage % this.IMAGES_WALKING.length;
    let path = images[index];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveLeft() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);
  }
}
