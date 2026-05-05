class Coin extends DrawableObject {
  offset = { top: 10, bottom: 10, left: 10, right: 10 };
  
  COIN_IMAGES = ["img/8_coin/coin_1.png", "img/8_coin/coin_2.png"];

  constructor(x, y) {
    super();
    this.loadImages(this.COIN_IMAGES);
    this.img = this.imageCache[this.COIN_IMAGES[0]];
    this.x = x;
    this.y = y;
    this.width = 180;
    this.height = 180;
  }
}
