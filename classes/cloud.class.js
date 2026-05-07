class Cloud extends MovableObject {
  y = 25; // position on y-axis start point top left corner
  width = 400; // width of img
  height = 400; // heigth of img

  CLOUD_IMAGES = [
    "img/5_background/layers/4_clouds/1.png",
    "img/5_background/layers/4_clouds/2.png",
  ];

  constructor(x) {
    super().loadImage(this.CLOUD_IMAGES[0]);
    this.x = x;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
      if (this.x < -this.width) {
        this.x = 2600;
      }
    }, 1000 / 60);
  }
}
