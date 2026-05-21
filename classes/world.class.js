/**
 * @class World
 * @description Manages the game world including rendering, collisions,
 * game state and all game objects.
 */
class World {
  /** @type {Character} The player character */
  character = new Character();

  /** @type {Level} The current level */
  level = level1;

  /** @type {HTMLCanvasElement} The game canvas */
  canvas;

  /** @type {CanvasRenderingContext2D} The 2D rendering context */
  ctx;

  /** @type {Keyboard} The keyboard input handler */
  keyboard;

  /** @type {number} Camera offset on the x-axis */
  camera_x = 0;

  /** @type {StatusBar} Health status bar */
  statusBar = new StatusBar();

  /** @type {StatusBarCoins} Coin status bar */
  statusBarCoins = new StatusBarCoins();

  /** @type {StatusBarBottles} Bottle status bar */
  statusBarBottles = new StatusBarBottles();

  /** @type {StatusBarEndboss} Endboss health status bar */
  statusBarEndboss = new StatusBarEndboss();

  /** @type {boolean} Whether the endboss health bar is visible */
  endbossBarVisible = false;

  /** @type {ThrowableObject[]} Array of currently thrown bottles */
  throwableObjects = [];

  /** @type {boolean} Cooldown flag to prevent rapid bottle throwing */
  bottleThrown = false;

  /** @type {boolean} Whether the game over screen has been shown */
  gameOverShown = false;

  /** @type {boolean} Whether the win screen has been shown */
  winShown = false;

  /** @type {boolean} Whether the game has been won */
  gameWon = false;

  /** @type {boolean} Whether the death sound has already been played */
  deadSoundPlayed = false;

  /** @type {number[]} Array of active interval IDs for this world */
  intervals = [];

  /** @type {number} The current animation frame request ID */
  animationFrame;

  /** @type {Audio} Sound played when collecting a bottle */
  soundBottleCollect = new Audio("audio/bottle_pickup.mp3");

  /** @type {Audio} Sound played when collecting a coin */
  soundCoinCollect = new Audio("audio/collect_coin.mp3");

  /** @type {Audio} Sound played when the character is hurt */
  soundHurt = new Audio("audio/pepe_hurt.mp3");

  /** @type {Audio} Sound played when the character dies */
  soundDead = new Audio("audio/pepe_dead.mp3");
  /** @type {Audio} Sound played when throwing a bottle */
  soundBottleThrow = new Audio("audio/throw_bottle.mp3");

  /**
   * @constructor
   * @param {HTMLCanvasElement} canvas - The game canvas element
   * @param {Keyboard} keyboard - The keyboard input handler
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * @description Assigns the world reference to the character and all enemies,
   * so they can access world properties like keyboard and camera.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  /**
   * @description Starts the main game loop. Checks collisions,
   * throwable objects and game state every 50ms.
   */
  run() {
    this.addInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkGameOver();
      this.checkWin();
    }, 50);
  }

  // #start-region-collisions

  /**
   * @description Runs all collision checks for the current frame.
   */
  checkCollisions() {
    this.checkEnemyCollisions();
    this.cleanUpEnemies();
    this.checkCoinCollisions();
    this.checkBottleCollisions();
    this.checkThrowableCollisions();
  }

  /**
   * @description Checks if the character collides with any enemy
   * and handles the result.
   */
  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !enemy.chickenDead) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  /**
   * @description Handles the outcome of a character-enemy collision.
   * Kills the enemy if jumped on, otherwise damages the character.
   * @param {MovableObject} enemy - The enemy that was collided with
   */
  handleEnemyCollision(enemy) {
    if (this.character.isAboveGround() && this.character.speedY < 0) {
      this.killEnemy(enemy);
    } else if (!this.character.isInvincible) {
      this.damageCharacter();
      if (enemy instanceof Endboss) {
        enemy.startAttack();
      }
    }
  }

  /**
   * @description Checks if the character collides with any coin and collects it.
   */
  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin) && this.character.coins < 100) {
        this.character.coins += 20;
        if (this.character.coins > 100) {
          this.character.coins = 100;
        }
        this.statusBarCoins.setPercentage(this.character.coins);
        this.level.coins.splice(index, 1);
        this.soundCoinCollect.volume = 0.3;
        this.soundCoinCollect.currentTime = 0;
        this.soundCoinCollect.muted = soundEffectsMuted;
        this.soundCoinCollect.play();
      }
    });
  }

  /**
   * @description Checks if the character collides with any bottle and collects it.
   */
  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle) && this.character.bottles < 100) {
        this.character.bottles += 20;
        if (this.character.bottles > 100) {
          this.character.bottles = 100;
        }
        this.statusBarBottles.setPercentage(this.character.bottles);
        this.level.bottles.splice(index, 1);
        this.soundBottleCollect.volume = 0.3;
        this.soundBottleCollect.currentTime = 0;
        this.soundBottleCollect.muted = soundEffectsMuted;
        this.soundBottleCollect.play();
      }
    });
  }

  /**
   * @description Checks if any thrown bottle collides with an enemy.
   * Hits the endboss or kills regular enemies, then triggers bottle splash.
   */
  checkThrowableCollisions() {
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy) => {
        if (
          bottle.isColliding(enemy) &&
          !bottle.splashing &&
          !enemy.chickenDead
        ) {
          if (enemy instanceof Endboss) {
            enemy.hit();
            this.endbossBarVisible = true;
            this.statusBarEndboss.setPercentage(enemy.energy);
          } else {
            enemy.die();
          }
          bottle.splash();
          setTimeout(() => {
            this.throwableObjects.splice(bottleIndex, 1);
          }, 600);
        }
      });
    });
  }
  // #end-region-collisions

  // #start-region combat

  /**
   * @description Kills an enemy and makes the character bounce upward.
   * @param {MovableObject} enemy - The enemy to kill
   */
  killEnemy(enemy) {
    enemy.die();
    this.character.speedY = 15;
    this.character.setInvincible();
  }

  /**
   * @description Reduces character health and plays the appropriate sound.
   */
  damageCharacter() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
    if (this.character.isDead()) {
      this.playDeadSound();
    } else {
      this.playHurtSound();
    }
  }

  /**
   * @description Removes all enemies marked for deletion from the level.
   */
  cleanUpEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (enemy) => !enemy.markedForDeletion,
    );
  }
  // #end-region combat

  // #start-region throwable-object

  /**
   * @description Checks if the player wants to throw a bottle and triggers it.
   */
  checkThrowObjects() {
    if (this.canThrowBottle()) {
      this.throwBottle();
    }
  }

  /**
   * @description Returns whether the player can currently throw a bottle.
   * @returns {boolean} True if D is pressed, bottles are available and cooldown is inactive
   */
  canThrowBottle() {
    return this.keyboard.D && this.character.bottles > 0 && !this.bottleThrown;
  }

  /**
   * @description Creates a new throwable bottle at the character's position
   * and plays the throw sound.
   */
  throwBottle() {
    let bottle = new ThrowableObject(
      this.character.x + 100,
      this.character.y + 11,
    );
    this.throwableObjects.push(bottle);
    this.updateBottleStatus();
    this.setCooldown();
    this.soundBottleThrow.currentTime = 0;
    this.soundBottleThrow.muted = soundEffectsMuted;
    this.soundBottleThrow.play();
  }

  /**
   * @description Reduces the character's bottle count and updates the status bar.
   */
  updateBottleStatus() {
    this.character.bottles -= 20;
    this.statusBarBottles.setPercentage(this.character.bottles);
  }

  /**
   * @description Sets a short cooldown to prevent throwing multiple bottles at once.
   */
  setCooldown() {
    this.bottleThrown = true;
    setTimeout(() => {
      this.bottleThrown = false;
    }, 500);
  }
  // #end-region throwable-object

  // #start-region draw objects on canvas

  /**
   * @description Main render loop. Clears the canvas and redraws all game objects each frame.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    this.drawGameObjects();
    this.drawStatusBars();
    this.animationFrame = requestAnimationFrame(() => this.draw());
  }

  /**
   * @description Draws all background objects with camera offset applied.
   */
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * @description Draws all dynamic game objects (clouds, coins, bottles,
   * character, enemies, throwables) with camera offset applied.
   */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * @description Draws all status bars. The endboss bar is only shown
   * after first contact.
   */
  drawStatusBars() {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
    if (this.endbossBarVisible) {
      this.addToMap(this.statusBarEndboss);
    }
  }
  // #end-region draw objects on canvas

  // #start-region add objects to map

  /**
   * @description Draws an array of objects onto the canvas.
   * @param {DrawableObject[]} objects - The objects to draw
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * @description Draws a single object onto the canvas.
   * Flips the image horizontally if the object is moving in the other direction.
   * @param {MovableObject} movableObject - The object to draw
   */
  addToMap(movableObject) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject);
    }
    movableObject.draw(this.ctx);
    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
    }
  }
  // #end-region add objects to map

  // #start-region rendering

  /**
   * @description Flips the canvas context horizontally to mirror an object's image.
   * @param {MovableObject} movableObject - The object to flip
   */
  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  /**
   * @description Restores the canvas context after flipping an image.
   * @param {MovableObject} movableObject - The object to restore
   */
  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }
  // #end-region rendering

  // #start-region game-state

  /**
   * @description Checks if the character has died and triggers the game over screen.
   */
  checkGameOver() {
    if (this.character.markedForDeletion && !this.gameOverShown) {
      this.gameOverShown = true;
      setTimeout(() => {
        this.stopAllSounds();
        showGameOver();
      }, 1000);
    }
  }

  /**
   * @description Checks if the endboss has been defeated and triggers the win screen.
   */
  checkWin() {
    const endbossDefeated = this.level.enemies.every(
      (enemy) => !(enemy instanceof Endboss) || enemy.markedForDeletion,
    );
    if (endbossDefeated && !this.winShown) {
      this.winShown = true;
      this.gameWon = true;
      setTimeout(() => showWin(), 1000);
    }
  }
  // #end-region game-state

  // #start-region intervals

  /**
   * @description Creates a managed interval that is tracked for later cleanup.
   * @param {Function} fn - The function to execute on each interval
   * @param {number} time - The interval duration in milliseconds
   * @returns {number} The interval ID
   */
  addInterval(fn, time) {
    let id = setInterval(fn, time);
    this.intervals.push(id);
    return id;
  }

  /**
   * @description Stops all world intervals and cancels the animation frame.
   */
  stopGame() {
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];
    cancelAnimationFrame(this.animationFrame);
  }
  // #end-region intervals

  // #start-region sounds

  /**
   * @description Plays the character death sound once.
   */
  playDeadSound() {
    if (!this.deadSoundPlayed) {
      this.deadSoundPlayed = true;
      this.soundDead.muted = soundEffectsMuted;
      this.soundDead.play();
    }
  }

  /**
   * @description Plays the character hurt sound.
   */
  playHurtSound() {
    this.soundHurt.currentTime = 0;
    this.soundHurt.muted = soundEffectsMuted;
    this.soundHurt.play();
  }

  /**
   * @description Pauses a sound and resets its playback position.
   * @param {Audio} sound - The audio object to stop
   */
  stopSound(sound) {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * @description Stops all sounds in the game world.
   */
  stopAllSounds() {
    this.stopEnemySounds();
    this.stopCharacterSounds();
    this.stopWorldSounds();
    this.stopThrowableSounds();
  }

  /**
   * @description Stops all sounds associated with enemies.
   */
  stopEnemySounds() {
    this.level.enemies.forEach((enemy) => {
      this.stopSound(enemy.sound);
      this.stopSound(enemy.soundDead);
      this.stopSound(enemy.soundRoar);
      this.stopSound(enemy.soundAlert);
      this.stopSound(enemy.soundWalk);
      this.stopSound(enemy.attackSound);
      this.stopSound(enemy.soundHurt);
    });
  }

  /**
   * @description Stops all sounds associated with the player character.
   */
  stopCharacterSounds() {
    this.stopSound(this.character.soundJump);
    this.stopSound(this.character.soundWalk);
    this.stopSound(this.character.soundIdle);
    this.stopSound(this.character.soundLongIdle);
  }

  /**
   * @description Stops all sounds owned directly by the world.
   */
  stopWorldSounds() {
    this.stopSound(this.soundHurt);
    this.stopSound(this.soundDead);
    this.stopSound(this.soundBottleThrow);
  }

  /**
   * @description Stops all sounds from currently active throwable objects.
   */
  stopThrowableSounds() {
    this.throwableObjects.forEach((bottle) => {
      this.stopSound(bottle.soundSplash);
    });
  }
  
  // #end-region sounds
}
