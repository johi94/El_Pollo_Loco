
  /**
 * @class StatusBar
 * @extends StatusBarBase
 * @description Displays the player character's current health as a status bar image.
 */
class StatusBar extends StatusBarBase {

  /** @type {string[]} Images representing health from 0% to 100% */
  images = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];
  
  /**
 * @constructor
 * @description Loads all health images and initializes the bar at full health.
 */
  constructor() {
    super();
    this.width = 250;
    this.height = 60;
    this.loadImages(this.images);
    this.x = 0;
    this.y = 0;
    this.setPercentage(100);
  }
}