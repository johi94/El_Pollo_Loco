class World {
  character = new Character(); // creates a new JavaScript image object (virtuale, not visible on the page)
  level = level1;

  canvas;
  ctx; // ctx = context, variable for context / used to render shapes and images
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d"); // asks canvas for its 2D rendering context / with this it's possible to draw on the screen
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach( (enemy) => {
       if (this.character.isColliding(enemy) ) {
        this.character.hit();
        console.log('Collision with Character, energy', this.character.energy);
       }
      });
    }, 200);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clears canvas at the beginning, before anything is drawn onto it
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects); // add background to map
    this.addToMap(this.character); // add character to map
    this.addObjectsToMap(this.level.enemies); // add enemies to map
    this.addObjectsToMap(this.level.clouds); // add clouds to map
    this.ctx.translate(-this.camera_x, 0);
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
