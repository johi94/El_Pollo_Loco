/**
 * @class Level
 * @description Represents a game level and holds all its objects
 * including enemies, clouds, background, coins and bottles.
 */
class Level {

    /** @type {MovableObject[]} All enemy objects in the level */
    enemies;

    /** @type {Cloud[]} All cloud objects in the level */
    clouds;

    /** @type {BackgroundObject[]} All background objects in the level */
    backgroundObjects;

    /** @type {Coin[]} All coin objects in the level */
    coins;

    /** @type {Bottle[]} All bottle objects in the level */
    bottles;

    /** @type {number} The x position where the level ends */
    level_end_x = 2260;

    /**
   * @constructor
   * @param {MovableObject[]} enemies - The enemy objects in the level
   * @param {Cloud[]} clouds - The cloud objects in the level
   * @param {BackgroundObject[]} backgroundObjects - The background objects in the level
   * @param {Coin[]} coins - The coin objects in the level
   * @param {Bottle[]} bottles - The bottle objects in the level
   */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}