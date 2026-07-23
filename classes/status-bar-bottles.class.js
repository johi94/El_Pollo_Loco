/**
 * @class StatusBarBottles
 * @extends StatusBarBase
 * @description Displays the player's current bottle count as a status bar image.
 */
class StatusBarBottles extends StatusBarBase {

  /** @type {string[]} Images representing bottle count from 0% to 100% */
  images = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];
  
  /**
 * @constructor
 * @description Loads all bottle images and initializes the bar at zero bottles.
 */
  constructor() {
    super();
    this.width = 250;
    this.height = 60;
    this.loadImages(this.images);
    this.x = 0;
    this.y = 120;
    this.setPercentage(0);
  }
}
