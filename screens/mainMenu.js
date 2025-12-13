class MainMenu {
  constructor(switcher) {   // switcher is a callback to change screen
    this.switcher = switcher;
  }

  setup() {
    createCanvas(400, 400);
  }

  draw() {
    background(40, 40, 60);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text('MAIN MENU', width/2, height/2 - 40);

    textSize(18);
    text('Press ENTER to play', width/2, height/2 + 20);
  }

  keyPressed() {
    if (keyCode === ENTER) {
      this.switcher('game');   // tell sketch.js to jump to gamePlay
    }
  }
}