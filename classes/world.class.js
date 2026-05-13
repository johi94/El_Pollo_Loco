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
  throwableObjects = [];
  bottleThrown = false;
  gameOverShown = false;
  winShown = false;
  intervals = [];
  animationFrame;

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
        if (this.character.isAboveGround() && this.character.speedY < 0) {
          enemy.die();
          this.character.speedY = 15;
        } else {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
  }

  cleanUpEnemies() {
    this.level.enemies = this.level.enemies.filter(
      (enemy) => !enemy.markedForDeletion,
    );
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
      }
    });
  }

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

  checkThrowableCollisions() {
    this.throwableObjects.forEach((bottle, bottleIndex) => {
      this.level.enemies.forEach((enemy) => {
        if (bottle.isColliding(enemy) && enemy instanceof Endboss) {
          enemy.hit();
          this.throwableObjects.splice(bottleIndex, 1);
        }
      });
    });
  }

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
  }

  // function to add Objects to Map
  // forEach works like the for-loop / used to itterate through the arrays / Like that every array gets drawImage
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  // function to add movable objects to canvas / with img, x- and y-coordinate, width and heigth
  addToMap(movableObject) {
    if (movableObject.otherDirection) {
      this.flipImage(movableObject);
    }
    movableObject.draw(this.ctx);
    movableObject.drawFrame(this.ctx);
    if (movableObject.otherDirection) {
      this.flipImageBack(movableObject);
    }
  }

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

  checkGameOver() {
    if (this.character.isDead() && !this.gameOverShown) {
      this.gameOverShown = true;
      setTimeout(() => {
        showGameOver();
      }, 1000);
    }
  }

  checkWin() {
    const endbossDefeated = this.level.enemies.every(
      (enemy) => !(enemy instanceof Endboss) || enemy.isDead(),
    );
    if (endbossDefeated && !this.winShown) {
      this.winShown = true;
      setTimeout(() => showWin(), 1000);
    }
  }

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
}
