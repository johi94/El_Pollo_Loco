/**
 * @class StatusBarBase
 * @extends DrawableObject
 * @description Base class for all status bars. Provides shared logic
 * for resolving and updating the displayed image based on a percentage value.
 */
class StatusBarBase extends DrawableObject {

  /** @type {number} The current percentage value (0-100) */
  percentage = 0;

  /**
   * @description Updates the displayed image based on the given percentage.
   * @param {string[]} images - The image array to resolve from
   * @param {number} percentage - The new percentage value (0-100)
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * @description Resolves the correct image index based on the current percentage.
   * @returns {number} Index between 0 and 5
   */
  resolveImageIndex() {
    if (this.percentage == 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }
}