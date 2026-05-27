/**
 * @description Mixin that adds all collision-related methods to the World class.
 */
Object.assign(World.prototype, {

  /**
   * @description Runs all collision checks for the current frame.
   */
  checkCollisions() {
    this.checkEnemyCollisions();
    this.cleanUpEnemies();
    this.checkCoinCollisions();
    this.checkBottleCollisions();
    this.checkThrowableCollisions();
  },

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
  },

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
  },

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
  },

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
  },

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
  },
});