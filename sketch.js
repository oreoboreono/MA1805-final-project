function preload(){
  mainMenuGIF = loadGif('assets/screens/menuScreen');
}


function setup() {
  createCanvas(3840, 2160);
  mainMenuGIF.play();
}





function draw() {
  background(0);
  image(mainMenuGIF, 0, 0);
}
