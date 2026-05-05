class Bottle extends DrawableObject {
  offset = { top: 10, bottom: 10, left: 10, right: 10 };
  BOTTLE_IMAGES = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  constructor(x, y) {
    super();
    this.loadImages(this.BOTTLE_IMAGES);
    this.img = this.imageCache[this.BOTTLE_IMAGES[0]];
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 80;
  }
}
