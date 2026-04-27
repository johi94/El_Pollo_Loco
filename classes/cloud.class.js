class Cloud extends MovableObject {
    y = 25;                                                   // position on y-axis start point top left corner
    width = 400;                                             // width of img
    height = 400;                                           // heigth of img
    
 constructor(){
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = 0 + Math.random() * 500;                               // start position   
        this.animate();
    } 
    
 animate() {
    this.moveLeft();
 }



}

