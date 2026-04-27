class World {
  character = new Character(); // creates a new JavaScript image object (virtuale, not visible on the page)
  enemies = [new Chicken(), new Chicken(), new Chicken()]; // array with enemies
  clouds = [new Cloud()]; // array for clouds
  backgroundObjects = [
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
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 2160)
  ];

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
  }

  setWorld() {
    this.character.world = this;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // clears canvas at the beginning, before anything is drawn onto it

    this.ctx.translate(this.camera_x, 0);

    this.addObjectsToMap(this.backgroundObjects); // add background to map
    this.addToMap(this.character); // add character to map
    this.addObjectsToMap(this.enemies); // add enemies to map
    this.addObjectsToMap(this.clouds); // add clouds to map
    this.ctx.translate(-this.camera_x, 0);
                                                                  // draw gets called over and over again with this part
    let self = this;                                             // variable to use this. in function
    requestAnimationFrame(function () {                         // function is obligatory to draw character over and over again                                        
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
    if(movableObject.otherDirection) {
      this.ctx.save();
      this.ctx.translate(movableObject.width, 0);
      this.ctx.scale(-1,1);
      movableObject.x = movableObject.x * -1;
    }
    this.ctx.drawImage(
      movableObject.img,
      movableObject.x,
      movableObject.y,
      movableObject.width,
      movableObject.height,
    );
    if(movableObject.otherDirection) {
      movableObject.x = movableObject.x * -1;
      this.ctx.restore();
    }
  }
}
