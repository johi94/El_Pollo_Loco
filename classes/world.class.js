class World {
  character = new Character(); // creates a new JavaScript image object (virtuale, not visible on the page)
  level = level1;
  canvas;
  ctx; // ctx = context, variable for context / used to render shapes and images
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  statusBarCoins = new StatusBarCoins();
  statusBarBottles = new StatusBarBottles();
  statusBarEndboss = new StatusBarEndboss();
  endbossBarVisible = false;
  throwableObjects = [];
  bottleThrown = false;
  gameOverShown = false;
  winShown = false;
  gameWon = false;
  deadSoundPlayed = false;
  intervals = [];
  animationFrame;
  soundBottleCollect = new Audio("audio/bottle_pickup.mp3");
  soundCoinCollect = new Audio("audio/collect_coin.mp3");
  soundHurt = new Audio("audio/pepe_hurt.mp3");
  soundDead = new Audio("audio/pepe_dead.mp3");
  soundBottleThrow = new Audio("audio/throw_bottle.mp3");

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d"); // asks canvas for its 2D rendering context / with this it's possible to draw on the screen
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
    });
  }

  run() {
    this.addInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
      this.checkGameOver();
      this.checkWin();
    }, 50);
  }

  // #start-region-collisions
  checkCollisions() {
    this.checkEnemyCollisions();
    this.cleanUpEnemies();
    this.checkCoinCollisions();
    this.checkBottleCollisions();
    this.checkThrowableCollisions();
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy) && !enemy.chickenDead) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

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
  killEnemy(enemy) {
    enemy.die();
    this.character.speedY = 15;
    this.character.setInvincible();
  }

  damageCharacter() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
    if (this.character.isDead()) {
      this.playDeadSound();
    } else {
      this.playHurtSound();
    }
  }

  cleanUpEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (enemy) => !enemy.markedForDeletion,
    );
  }
  // #end-region combat

  // #start-region throwable-object
  checkThrowObjects() {
    if (this.canThrowBottle()) {
      this.throwBottle();
    }
  }

  canThrowBottle() {
    return this.keyboard.D && this.character.bottles > 0 && !this.bottleThrown;
  }

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

  updateBottleStatus() {
    this.character.bottles -= 20;
    this.statusBarBottles.setPercentage(this.character.bottles);
  }

  setCooldown() {
    this.bottleThrown = true;
    setTimeout(() => {
      this.bottleThrown = false;
    }, 500);
  }
  // #end-region throwable-object

  // #start-region draw objects on canvas
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    this.drawGameObjects();
    this.drawStatusBars();
    this.animationFrame = requestAnimationFrame(() => this.draw());
  }

  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

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
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

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
  flipImage(movableObject) {
    this.ctx.save();
    this.ctx.translate(movableObject.width, 0);
    this.ctx.scale(-1, 1);
    movableObject.x = movableObject.x * -1;
  }

  flipImageBack(movableObject) {
    movableObject.x = movableObject.x * -1;
    this.ctx.restore();
  }
  // #start-region rendering

  // #start-region game-state
  checkGameOver() {
    if (this.character.markedForDeletion && !this.gameOverShown) {
      this.gameOverShown = true;
      setTimeout(() => {
        this.stopAllSounds();
        showGameOver();
      }, 1000);
    }
  }

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
  addInterval(fn, time) {
    let id = setInterval(fn, time);
    this.intervals.push(id);
    return id;
  }

  stopGame() {
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];
    cancelAnimationFrame(this.animationFrame);
  }
  // #end-region intervals

  // #start-region sounds
  playDeadSound() {
    if (!this.deadSoundPlayed) {
      this.deadSoundPlayed = true;
      this.soundDead.muted = soundEffectsMuted;
      this.soundDead.play();
    }
  }

  playHurtSound() {
    this.soundHurt.currentTime = 0;
    this.soundHurt.muted = soundEffectsMuted;
    this.soundHurt.play();
  }

  stopSound(sound) {
  if (sound) {
    sound.pause();
    sound.currentTime = 0;
  }
}

  stopAllSounds() {
  this.stopEnemySounds();
  this.stopCharacterSounds();
  this.stopWorldSounds();
  this.stopThrowableSounds();
}

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

stopCharacterSounds() {
  this.stopSound(this.character.soundJump);
  this.stopSound(this.character.soundWalk);
  this.stopSound(this.character.soundIdle);
  this.stopSound(this.character.soundLongIdle);
}

stopWorldSounds() {
  this.stopSound(this.soundHurt);
  this.stopSound(this.soundDead);
  this.stopSound(this.soundBottleThrow);
}

stopThrowableSounds() {
  this.throwableObjects.forEach((bottle) => {
    this.stopSound(bottle.soundSplash);
  });
}
  // #end-region sounds
}
