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
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy, index) => {
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
    this.level.enemies = this.level.enemies.filter(
      (enemy) => !enemy.markedForDeletion,
    );
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.character.coins += 20;
        this.statusBarCoins.setPercentage(this.character.coins);
        this.level.coins.splice(index, 1);
      }
    });
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.character.bottles += 20;
        this.statusBarBottles.setPercentage(this.character.bottles);
        this.level.bottles.splice(index, 1);
      }
    });
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 11,
      );
      this.throwableObjects.push(bottle);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clears canvas at the beginning, before anything is drawn onto it
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects); // add background to map
    this.ctx.translate(-this.camera_x, 0);
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.clouds); // add clouds to map
    this.addToMap(this.character); // add character to map
    this.addObjectsToMap(this.level.enemies); // add enemies to map
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.coins); // add coins to map
    this.ctx.translate(-this.camera_x, 0);
    // SPACE FOR FIXED OBJECTS / STATUS BARS
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottles);
    // draw gets called over and over again with this part
    let self = this; // variable to use this. in function
    requestAnimationFrame(function () {
      // function is obligatory to draw character over and over again
      self.draw();
    });
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
}
