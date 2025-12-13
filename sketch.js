let page = 0;
musicFlag = false;


function preload(){
  // Main Menu
  mainMenuGIF = loadImage('assets/SCREENS/menuScreen.gif');
  mainMenuMusic = loadSound('assets/SONGS/mainMenuSong.wav');

  fireTutorialPNG = loadImage('assets/SCREENS/fireTutorial.png');
  tutorialMusic = loadSound('assets/SONGS/spellBookSong.wav');

}


function setup() {

mainMenuMusic.setVolume(0.4);
tutorialMusic.setVolume(0.4);
  
  }
  


function mainMenu(){
  createCanvas(3840, 2160);
  background(0);
  image(mainMenuGIF, 0, 0);
  rect(250,1425,1000,260);
  rect(250,925,1500,260);

  tutorialMusic.stop()
  if(mainMenuMusic.isPlaying() == false){
    mainMenuMusic.loop() 
  }
   

    

}




function tutorialMenu(){
  createCanvas(3840, 2160);
  background(0);
  image(fireTutorialPNG, 600, 0);
  rect(670,60,400,160);

  mainMenuMusic.stop()
  if(tutorialMusic.isPlaying() == false){
    tutorialMusic.loop() 
  }
}




function draw() {
  if(page==0){
    mainMenu();
  }else if(page == 2){
    tutorialMenu()
    setup()

  }
}

function mousePressed(){
 if(page==0){
  if( mouseX>=250 && mouseX<=1250 && mouseY>=1425 && mouseY<=1685 ){
    page=2;
  }

 }else if(page==2){
  if( mouseX>=670 && mouseX<=1070 && mouseY>=60 && mouseY<=220 ){
    page=0;
  }
 } 
}

