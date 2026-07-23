/**
 * @description Mixin that adds all combat and game state related methods to the World class.
 */
Object.assign(World.prototype, {

  /**
   * @description Advances the whole world by one frame: updates the character,
   * clouds, enemies and throwable objects, then runs collision/state checks
   * on their original ~50ms cadence. Called once per frame from the central
   * requestAnimationFrame loop in draw() instead of many independent setIntervals.
   * @param {number} dt - The elapsed time since the last frame in milliseconds
   */
  update(dt) {
    this.character.update(dt);
    this.level.clouds.forEach((cloud) => cloud.update(dt));
    this.level.enemies.forEach((enemy) => enemy.update(dt));
    this.throwableObjects.forEach((bottle) => bottle.update(dt));
    tickTimer(this.timers, "collisions", 50, dt, () => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkGameOver();
      this.checkWin();
    });
  },

  /**
   * @description Kills an enemy and makes the character bounce upward.
   * @param {MovableObject} enemy - The enemy to kill
   */
  killEnemy(enemy) {
    enemy.die();
    this.character.speedY = 15;
    this.character.setInvincible();
  },

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
  },

  /**
   * @description Removes all enemies marked for deletion from the level.
   */
  cleanUpEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (enemy) => !enemy.markedForDeletion,
    );
  },

  /**
   * @description Checks if the player wants to throw a bottle and triggers it.
   */
  checkThrowObjects() {
    if (this.canThrowBottle()) {
      this.throwBottle();
    }
  },

  /**
   * @description Returns whether the player can currently throw a bottle.
   * @returns {boolean} True if D is pressed, bottles are available and cooldown is inactive
   */
  canThrowBottle() {
    return this.keyboard.D && this.character.bottles > 0 && !this.bottleThrown;
  },

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
  },

  /**
   * @description Reduces the character's bottle count and updates the status bar.
   */
  updateBottleStatus() {
    this.character.bottles -= 20;
    this.statusBarBottles.setPercentage(this.character.bottles);
  },

  /**
   * @description Sets a short cooldown to prevent throwing multiple bottles at once.
   */
  setCooldown() {
    this.bottleThrown = true;
    setTimeout(() => {
      this.bottleThrown = false;
    }, 500);
  },

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
  },

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
  },
});