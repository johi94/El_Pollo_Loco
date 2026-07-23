/**
 * @class StatusBarCoins
 * @extends StatusBarBase
 * @description Displays the player's current coin count as a status bar image.
 */
class StatusBarCoins extends StatusBarBase {

  /** @type {string[]} Images representing coin count from 0% to 100% */
  images = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];
  
  /**
 * @constructor
 * @description Loads all coin images and initializes the bar at zero coins.
 */
  constructor() {
    super();
    this.width = 250;
    this.height = 60;
    this.loadImages(this.images);
    this.x = 0;
    this.y = 60;
    this.setPercentage(0);
  }
}
