/**
 * @class StatusBarEndboss
 * @extends StatusBarBase
 * @description Displays the endboss's current health as a status bar image.
 * Only visible after the player has made first contact with the endboss.
 */
class StatusBarEndboss extends StatusBarBase {

  /** @type {string[]} Images representing endboss health from 0% to 100% */
  images = [
    "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
  ];

  constructor() {
    super();
    this.loadImages(this.images);
    this.x = 460;
    this.y = 60;
    this.width = 250;
    this.height = 60;
    this.setPercentage(100);
  }
}
