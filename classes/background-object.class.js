class BackgroundObject extends MovableObject {
   width = 720;
   height = 480;
   
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 480 - this.height;             // from heigth canvas substaction of the height of the image
    }
}


 

