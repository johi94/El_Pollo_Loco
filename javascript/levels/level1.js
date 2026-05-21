/** @type {Level} The current level instance */
let level1;

/**
 * Initializes level 1 by creating all game objects and passing them to the Level constructor.
 */
function initLevel() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgroundObjects(),
    createCoins(),
    createBottles(),
  );
}

/**
 * Creates and returns all enemy objects for level 1.
 * Includes normal chickens, small chickens and the endboss.
 * @returns {MovableObject[]} Array of enemy objects
 */
function createEnemies() {
  return [
    new Chicken(),
    new Chicken(),
    new Chicken(),
    new Smallchicken(),
    new Smallchicken(),
    new Smallchicken(),
    new Chicken(1200 + Math.random() * 400),
    new Chicken(1200 + Math.random() * 400),
    new Chicken(1200 + Math.random() * 400),
    new Smallchicken(1600 + Math.random() * 400),
    new Smallchicken(1600 + Math.random() * 400),
    new Smallchicken(1600 + Math.random() * 400),
    new Endboss(),
  ];
}

/**
 * Creates and returns all cloud objects for level 1.
 * @returns {Cloud[]} Array of cloud objects
 */
function createClouds() {
  return [
    new Cloud(250, 0),
    new Cloud(650, 1),
    new Cloud(1050, 0),
    new Cloud(1450, 1),
    new Cloud(1850, 0),
    new Cloud(2250, 0),
    new Cloud(2650, 0),
  ];
}

/**
 * Creates and returns all background objects for level 1.
 * Each segment consists of four layers: air, third, second and first layer.
 * @returns {BackgroundObject[]} Array of background objects
 */
function createBackgroundObjects() {
  return [
    new BackgroundObject("img/5_background/layers/air.png", -720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),
    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/air.png", 720),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),
    new BackgroundObject("img/5_background/layers/air.png", 1440),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 1440),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 1440),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 1440),
    new BackgroundObject("img/5_background/layers/air.png", 2160),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 2160),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 2160),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 2160),
  ];
}

/**
 * Creates and returns all coin objects for level 1.
 * @returns {Coin[]} Array of coin objects
 */
function createCoins() {
  return [
    new Coin(400, 300),
    new Coin(500, 200),
    new Coin(550, 200),
    new Coin(650, 300),
    new Coin(1000, 100),
  ];
}

/**
 * Creates and returns all bottle objects for level 1.
 * Bottles are distributed across the level with alternating image variants.
 * @returns {Bottle[]} Array of bottle objects
 */
function createBottles() {
  return [
    new Bottle(-500, 350, 1),
    new Bottle(-400, 350, 0),
    new Bottle(-300, 350, 1),
    new Bottle(-200, 350, 0),
    new Bottle(-100, 350, 1),
    new Bottle(300, 350, 0),
    new Bottle(750, 350, 1),
    new Bottle(800, 350, 0),
    new Bottle(900, 350, 1),
    new Bottle(1100, 350, 0),
    new Bottle(1200, 350, 1),
    new Bottle(1400, 350, 0),
    new Bottle(1500, 350, 1),
    new Bottle(1600, 350, 0),
    new Bottle(1700, 350, 1),
    new Bottle(1800, 350, 0),
    new Bottle(1900, 350, 1),
    new Bottle(2000, 350, 0),
    new Bottle(2100, 350, 1),
  ];
}
