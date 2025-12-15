//Variables related to spellcasting
let points = [];
let lines = [];
let maxPoints = 8;
let spells = [];
let currentSpellAngles = [];
let castedSpellName = "";
let spellDisplayTime = 0;

//Variables for the index of the screen showed (pages)
let page = 0; 
let tutorialIndex = 0;

//Track point clicks for the spell point sounds
let pointClickCount = 0;

//Wizard animation state Variables
let wizardState = "idle";
let wizardAttackStartTime = 0;
let attackGIFDuration = 1300; // 

//Main battle game mode variables
let monsters = [];
let lastMonsterSpawnTime = 0;
let monsterSpawnInterval = 5000; 
let monsterSpeed = 1.0; 
let wizardPosition = { x: 450, y: 1350 }; 
let wizardHitRadius = 550; //Wizard hitbox
let monsterSize = 600; 
//Battle timer for the battle game mode
let battleStartTime = 0;
let battleDuration = 90; 
let battleTimerActive = false;

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------

function preload() {
  //Preload the necessary elements for my game - load time 30seconds or more (all assets are made by me - drawn / music)
  //Main Menu Screen
  mainMenuGIF = loadImage('assets/SCREENS/menuScreen.gif');
  mainMenuMusic = loadSound('assets/SONGS/mainMenuSong.wav');

  //Tutorial Screen
  fireTutorialPNG = loadImage('assets/SCREENS/fireTutorial.png');
  iceTutorialPNG = loadImage('assets/SCREENS/iceTutorial.png');
  synapseTutorialPNG = loadImage('assets/SCREENS/synapseTutorial.png');
  stoneTutorialPNG = loadImage('assets/SCREENS/stoneTutorial.png');
  holyTutorialPNG = loadImage('assets/SCREENS/holyTutorial.png');
  tutorialMusic = loadSound('assets/SONGS/spellBookSong.wav');

  //SFX
  pointPNG = loadImage('assets/point.png'); 
  buttonPressSound = loadSound('assets/SFX/buttonPressSFX.wav')
  earthenBlowSound = loadSound('assets/SFX/earthenBlowSFX.wav')
  earthenMonsterSound = loadSound('assets/SFX/earthenMonsterSFX.wav')
  failedSpellSound = loadSound('assets/SFX/failedSpellSFX.wav')
  fireBallSound = loadSound('assets/SFX/fireBallSFX.wav')
  fireMonsterSound = loadSound('assets/SFX/fireMonsterSFX.wav')
  holyLanceSound = loadSound('assets/SFX/holyLanceSFX.wav')
  holyMonsterSound = loadSound('assets/SFX/holyMonsterSFX.wav')
  iceMonsterSound = loadSound('assets/SFX/iceMonsterSFX.wav')
  iceStrikeSound = loadSound('assets/SFX/iceStrikeSFX.wav')
  spellPoint1Sound = loadSound('assets/SFX/spellpoint1SFX.wav')
  spellPoint2Sound = loadSound('assets/SFX/spellPoint2SFX.wav')
  spellPoint3Sound = loadSound('assets/SFX/spellPoint3SFX.wav')
  startingAudioSound = loadSound('assets/SFX/startingAudio.wav')
  synapseMonsterSound = loadSound('assets/SFX/synapseMonsterSFX.wav')
  synapticStrikeSound = loadSound('assets/SFX/synapticStrikeSFX.wav')

  //Wizard main character
  wizardIdleGIF = loadImage('assets/CHARACTERS/wizardIdle.gif');
  wizardAttackGIF = loadImage('assets/CHARACTERS/wizardAttack.gif');

  //Battle Menu
  battleScreenGIF = loadImage('assets/SCREENS/battleScreen.gif');
  fireMonsterPNG = loadImage('assets/CHARACTERS/fireMonster.png');
  iceMonsterPNG = loadImage('assets/CHARACTERS/iceMonster.png');
  synapseMonsterPNG = loadImage('assets/CHARACTERS/synapseMonster.png');
  stoneMonsterPNG = loadImage('assets/CHARACTERS/earthMonster.png');
  holyMonsterPNG = loadImage('assets/CHARACTERS/holyMonster.png');
  fightMusic = loadSound('assets/SONGS/FightSongFinal.wav');

  //Ending Menus
  loseMusic = loadSound('assets/SONGS/loseSong.wav');
  winMusic = loadSound('assets/SONGS/winSong.wav');
  winScreenGIF = loadImage('assets/SCREENS/winScreen.gif');
  loseScreenGIF = loadImage('assets/SCREENS/loseScreen.gif');
}

function setup() {
  createCanvas(3840, 2160); // I had set all my drawings as this size. It makes it not very flexible in this option because I am unable to resive based on window size but i found it very difficult to implemnt this
  mainMenuMusic.setVolume(0.4);
  tutorialMusic.setVolume(0.4);
  loseMusic.setVolume(0.3);
  spellPoint1Sound.setVolume(4);
  spellPoint2Sound.setVolume(4);
  spellPoint3Sound.setVolume(4);

  
  //Pausing wizard gif so it plays at start
  if (wizardAttackGIF) {
    wizardAttackGIF.pause();
  }
  
  //The 5 main spells in my game. Storing their name, how to cast, corresponding monster, and sounds
  spells.push({
    name: "Fireball",
    angles: [-60, 60, 180],
    sound: fireBallSound,
    monsterType: "fire",
    monsterSound: fireMonsterSound
  });
  
  spells.push({
    name: "Ice Strike",
    angles: [-90, 25, 160],
    sound: iceStrikeSound,
    monsterType: "ice",
    monsterSound: iceMonsterSound
  });
  
  spells.push({
    name: "Synaptic Charge",
    angles: [35, 140, -140, -40, 90],
    sound: synapticStrikeSound,
    monsterType: "synapse",
    monsterSound: synapseMonsterSound
  });
  
  spells.push({
    name: "Earthen Blow",
    angles: [-90, 0, 90, 180],
    sound: earthenBlowSound,
    monsterType: "stone",
    monsterSound: earthenMonsterSound
  });
  
  spells.push({
    name: "Holy Lance",
    angles: [-45, 45, 180, -45, 90],
    sound: holyLanceSound,
    monsterType: "holy",
    monsterSound: holyMonsterSound
  });
}

function mainMenu() {
  background(0);
  image(mainMenuGIF, 0, 0);
  
  //stop music and play in loop
  tutorialMusic.stop();
  winMusic.stop();
  loseMusic.stop();
  if (!mainMenuMusic.isPlaying()) {
    mainMenuMusic.loop();
  }
  
  //clear monsters when leaving battle
  monsters = [];
}

function tutorialMenu() {
  background(0);
  
  //Draw current tutorial page
  if (tutorialIndex == 0) {
    image(fireTutorialPNG, 600, 0);
  } else if (tutorialIndex == 1) {
    image(iceTutorialPNG, 600, 0);
  } else if (tutorialIndex == 2) {
    image(synapseTutorialPNG, 600, 0);
  } else if (tutorialIndex == 3) {
    image(stoneTutorialPNG, 600, 0);
  } else if (tutorialIndex == 4) {
    image(holyTutorialPNG, 600, 0);
  }
  
  mainMenuMusic.stop();
  if (!tutorialMusic.isPlaying()) {
    tutorialMusic.loop();
  }

  //Calls spellcasting 
  drawSpellcasting();
  drawWizard();
}

function battleMenu() {
  background(0);
  image(battleScreenGIF, 0, 0);
  
  //Start battle timer, initialisation for my variables for my battle game mode
  if (!battleTimerActive) {
    battleStartTime = millis();
    battleTimerActive = true;
    lastMonsterSpawnTime = millis();
    monsters = []; //clear
    monsterSpawnInterval = 5000; 
    monsterSpeed = 1.0; 
  }
  
  //Music 
  mainMenuMusic.stop();
  if (!fightMusic.isPlaying()) {
    fightMusic.loop();
    startingAudioSound.setVolume(3);
    startingAudioSound.play();
  }
  
  //Update my monster fight system
  updateMonsters();
  
  //Timer bar
  drawBattleTimer();
  
  drawSpellcasting();
  drawWizard();
  drawMonsters();
  
  //Check if time is up
  checkBattleTimer();
  
  //Check if wizard was killed
  checkWizardDeath();
}

function winMenu() {
  background(0);
  image(winScreenGIF, 0, 0,3840, 2160);
  fightMusic.stop();
  if (!winMusic.isPlaying()) {
    winMusic.loop(); 
  }
  
  //Clear
  monsters = [];
}

function loseMenu() {

  //Music
  background(0);
  image(loseScreenGIF, 0, 0,3840, 2160);
  fightMusic.stop();
  if (!loseMusic.isPlaying()) {
    loseMusic.loop(); 
  }
  
  monsters = [];
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//Monster fight sytem
//---------------------------------------------------------------------------------------------------------------------------------------------------------

function updateMonsters() {
  currentTime = millis();
  elapsedTime = (currentTime - battleStartTime) / 1000; // Time in seconds
  timeLeft = battleDuration - elapsedTime;
  
  //Ramping difficulty for my game. I wanted my game to start off easy then go extremely hard. Monster speed and spawn interval increase as time goes on.
  //This will make it more fun for the user and give them a challenge
  if (timeLeft > 60) {
    monsterSpawnInterval = 5000; 
    monsterSpeed = 0.7; 
  } 
  else if (timeLeft > 40) {
    monsterSpawnInterval = 3500; 
    monsterSpeed = 1.0; 
  }
  else if (timeLeft > 20) {
    monsterSpawnInterval = 3000; 
    monsterSpeed = 2; 
  }
  else {
    monsterSpawnInterval = 2500; 
    monsterSpeed = 2.5; 
  }
  
  //Spawning the new monsters
  if (currentTime - lastMonsterSpawnTime > monsterSpawnInterval) {
    spawnMonster();
    lastMonsterSpawnTime = currentTime;
  }
  
  //Update existing monsters
  for (i = monsters.length - 1; i >= 0; i--) {
    monster = monsters[i];
    
    //Move monster toward wizard using math. Check relative position of monster against wizard
     dx = wizardPosition.x - monster.x;
     dy = wizardPosition.y - monster.y;
     distance = sqrt(dx * dx + dy * dy);
    
    //Direction of monster and their movement
    if (distance > 0) {
      monster.x += (dx / distance) * monsterSpeed;
      monster.y += (dy / distance) * monsterSpeed;
    }
    
    //Remove monster if correct spellcast
    if (monster.dead) {
      monsters.splice(i, 1);
    }
  }
}

function spawnMonster() {
  //Randomized monster spawn
  monsterTypes = ["fire", "ice", "synapse", "stone", "holy"];
  type = random(monsterTypes);
  
  //Choose random starting position ( on right side of screen)
  startX = random(2500, 3500);
  startY = random(300, 1800);
  
  
  //Set corresponding monster images
  switch(type) {
    case "fire": monsterImage = fireMonsterPNG; break;
    case "ice": monsterImage = iceMonsterPNG; break;
    case "synapse": monsterImage = synapseMonsterPNG; break;
    case "stone": monsterImage = stoneMonsterPNG; break;
    case "holy": monsterImage = holyMonsterPNG; break;
    default: monsterImage = fireMonsterPNG;
  }
  
  //Create monster
  monsters.push({
    x: startX,
    y: startY,
    type: type,
    image: monsterImage,
    dead: false,
    size: monsterSize 
  });
  
  //Play monster spawn sound
  playMonsterSound(type);
}

function playMonsterSound(type) {
  //Set monster sounds
  switch(type) {
    case "fire": sound = fireMonsterSound; break;
    case "ice": sound = iceMonsterSound; break;
    case "synapse": sound = synapseMonsterSound; break;
    case "stone": sound = earthenMonsterSound; break;
    case "holy": sound = holyMonsterSound; break;
    default: sound = null;
  }
  
  if (sound) {
    sound.play();
  }
}

//Make the monsters
function drawMonsters() {
  for (monster of monsters) {
    if (!monster.dead) {
      //Set size
      image(monster.image, monster.x - monster.size/2, monster.y - monster.size/2, monster.size, monster.size);
    }
  }
}

function killMonster(spellType) {
  killedAny = false;
  
  //Find and kill the closest monster of matching type
  closestMonster = null;
 closestDistance = Infinity; //Variables to calculate the distance
  
 //Finding distance
  for (monster of monsters) {
    if (!monster.dead && monster.type === spellType) {
      dx = monster.x - wizardPosition.x;
      dy = monster.y - wizardPosition.y;
      distance = sqrt(dx * dx + dy * dy); //Direction of mosnter and their movement from before
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestMonster = monster;
      }
    }
  }
  
  //Kill the closest matching monster
  if (closestMonster) {
    closestMonster.dead = true;
    killedAny = true;
    playMonsterSound(spellType);
  }
  
  return killedAny;
}

function checkWizardDeath() {
  for ( monster of monsters) {
    if (!monster.dead) {
       dx = monster.x - wizardPosition.x;
       dy = monster.y - wizardPosition.y;
       distance = sqrt(dx * dx + dy * dy);
        //If monster reaches wizard, player loses
      if (distance < wizardHitRadius) {
        page = 4; 
        battleTimerActive = false;
        return;
      }
    }
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//Battle timer
//---------------------------------------------------------------------------------------------------------------------------------------------------------

function drawBattleTimer() {
  elapsedSeconds = (millis() - battleStartTime) / 1000;
  timeLeft = max(0, battleDuration - elapsedSeconds);
  
  //Draw timer bar background
  fill(50, 50, 50, 200);
  noStroke();
  rect(50, 50, 500, 50, 10);
  
  //Calculate bar width based on time left
  barWidth = map(timeLeft, 0, battleDuration, 0, 500);

  fill(0, 255, 0);
  rect(50, 50, barWidth, 50, 10);
  stroke(0,255,0);
  strokeWeight(3);
  noFill();
  rect(50, 50, 500, 50, 10);
  
}

function checkBattleTimer() {
  elapsedSeconds = (millis() - battleStartTime) / 1000;
  
  if (elapsedSeconds >= battleDuration) {
    
    page = 3; 
    battleTimerActive = false; 
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//Wizard 
//---------------------------------------------------------------------------------------------------------------------------------------------------------

function drawWizard() {
  //Only draw wizard in tutorial or battle modes
  if (page != 1 && page != 2) return;
  updateWizardState();
  
  // Draw wizard GIF based on current state
  if (wizardState == "idle") {
    image(wizardIdleGIF, -300, 600, 1500, 1500);
  } else if (wizardState == "attack") {
    image(wizardAttackGIF,  -300, 600, 1500, 1500);
  }
}

function updateWizardState() {
  // Check if attack animation should return to idle.


  if (wizardState == "attack") {
    let attackElapsed = millis() - wizardAttackStartTime;
    
    //if attack GIF has played for its duration should return to idle
    if (attackElapsed >= attackGIFDuration) {
      wizardState = "idle";
     
      if (wizardAttackGIF) {
        wizardAttackGIF.pause();
      }
    }
  }
}

function triggerWizardAttack() {
  // Switch wizard to attack state and record start time
  wizardState = "attack";
  wizardAttackStartTime = millis();
  
  // Restart attack GIF from beginning.  I had an issue with this because i found it never actually perfectly played the gif back in the start.
  if (wizardAttackGIF) {
    wizardAttackGIF.play();
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//Spell casting
//---------------------------------------------------------------------------------------------------------------------------------------------------------

function drawSpellcasting() {
  //Lines of the current spell 
  for (let line of lines) {
    drawLine(line.start, line.end);
  }
  
  //Point image is used 
  for (let point of points) {
    image(pointPNG, point.x - 100, point.y - 100, 200, 200); 
  }
  
  //at least one point, show a preview of where the next point star will go
  if (points.length > 0 && points.length < maxPoints) {
    drawPreviewLine(); //function for preview line
  }
}

function drawPreviewLine() {
  // Get the last placed point
  let lastPoint = points[points.length - 1];
  
  //Line
  stroke(50, 255, 50, 200); 
  strokeWeight(32); 
  line(lastPoint.x, lastPoint.y, mouseX, mouseY);
  
  //Preview point
  image(pointPNG, mouseX - 100, mouseY - 100, 200, 200); 
  
  //Pulsing effect
  //millis gives current time in milliseconds, sin creates wave pattern
  let pulseSize = sin(millis() * 0.003) * 100 + 200; // Pulsing around base size
  let pulseAlpha = 200 + sin(millis() * 0.008) * 55; 
  
  tint(255, 255, 255, pulseAlpha);
  image(pointPNG, mouseX - pulseSize/2, mouseY - pulseSize/2, pulseSize, pulseSize);
  noTint();
  
  //Outer glow ring
  noFill();
  stroke(100, 255, 100, 100);
  strokeWeight(10);
  let ringSize = sin(millis() * 0.002) * 150 + 200 + 100; 
  ellipse(mouseX, mouseY, ringSize, ringSize);
}

function handleSpellcastingMouse() {
  //disable spellcasting main menu
  if (page == 0) return;
  
  //in tutorial and battle mode activate spellcasting
  if (page == 2) {
    //Check if click was on back button
    if (mouseX >= 670 && mouseX <= 1070 && mouseY >= 60 && mouseY <= 220) {
      return; // invisible button using distance based on mouse pressed - dont do spellcasting
    }
    //Check if click was on previous button
    if (mouseX >= 1130 && mouseX <= 1370 && mouseY >= 760 && mouseY <= 890) {
      return; 
    }
    //Check if click was on next button
    if (mouseX >= 2570 && mouseX <= 2810 && mouseY >= 760 && mouseY <= 890) {
      return; 
    }
  }
  
  if (mouseButton === LEFT) {
    //New point
    if (points.length < maxPoints) {
      if (points.length === 0) {
        //First point placed
        points.push({x: mouseX, y: mouseY});
      } else {
        //Get recent point
        lastPoint = points[points.length - 1];
        
        //Add new point
        points.push({x: mouseX, y: mouseY});
        
        //Line from the last point to this new point
        lines.push({
          start: lastPoint,
          end: {x: mouseX, y: mouseY}
        });
        
        //Calculate angle of this new line
        let angle = calculateAngle(lastPoint, {x: mouseX, y: mouseY});
        currentSpellAngles.push(angle);
      }
      
      //Point sound when placing point
      playPointSound();
      
          
    }
  } else if (mouseButton === RIGHT) {
    clearDrawing();
  }
}

function playPointSound() {
  //Sound played in sequence when placing point
  if (pointClickCount == 0) {
    spellPoint1Sound.play();
  } else if (pointClickCount == 1) {
    spellPoint2Sound.play();
  } else if (pointClickCount == 2) {
    spellPoint3Sound.play();
  }
  
  //counter for next point
  pointClickCount = (pointClickCount + 1) % 3;
}

function calculateAngle(startPoint, endPoint) {
  //Find how far moved horizontally and vertically
  let dx = endPoint.x - startPoint.x;
  let dy = endPoint.y - startPoint.y;
  
  //Convert to angle in degrees  where (0 = right, 90 = down, -90 = up)
  let angle = atan2(dy, dx) * (180 / PI);
  return angle;
}

//Lines have spell glow to make them more visible for the user
function drawLine(start, end) {
  //line
  stroke(50, 255, 50);
  strokeWeight(32); 
  line(start.x, start.y, end.x, end.y);
  
  //glow line
  stroke(100, 255, 100, 150);
  strokeWeight(48); 
  line(start.x, start.y, end.x, end.y);
  
  //outer glow line
  stroke(150, 255, 150, 80);
  strokeWeight(80);
  line(start.x, start.y, end.x, end.y);
}

function identifySpell() {
  //no line makes no spell
  if (currentSpellAngles.length === 0) return;
  
  //Check each spell in spell list
  for (let spell of spells) {
    //Only check spells that need the same number of lines
    if (spell.angles.length === currentSpellAngles.length) {
      let match = true;
      
      //Compare each angle in the pattern
      for (let i = 0; i < spell.angles.length; i++) {
        let drawnAngle = currentSpellAngles[i];
        let spellAngle = spell.angles[i];
        
        //Check if angles are similar and within 30 degrees - This is compensation to make the spellcasting more fluid and easier to place for the user
        let difference = abs(spellAngle - drawnAngle);
        if (difference > 30 && abs(difference - 360) > 30) {
          match = false;
          break;
        }
      }
      //All angles matched find spell - kill monster, play sound and trigger wizard gif
      if (match) {
        castedSpellName = spell.name;
        spellDisplayTime = millis();
        if (spell.sound) {
          spell.sound.play();
        }
        triggerWizardAttack();
        killedMonster = killMonster(spell.monsterType);
        clearDrawing();
        return;
      }
    }
  }
  
  //If no spell matched]
  spellDisplayTime = millis();
  //Play failed spell sound
  if (failedSpellSound) {
    failedSpellSound.play();
  }
  clearDrawing();
}

function clearDrawing() {
  //reset
  points = [];
  lines = [];
  currentSpellAngles = [];
  
  pointClickCount = 0;
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------
//Determine showed screen
function draw() {
  if (page == 0) {
    mainMenu();
  } else if (page == 1) {
    battleMenu();
  } else if (page == 2) {
    tutorialMenu();
  } else if (page == 3) {
    winMenu();
  } else if (page == 4) {
    loseMenu();
  } 
}

function mousePressed() {
  //Main menu navigation
  if (page == 0) {
    //Determine distance from mouse click applying principle from my earlier project
    if (mouseX >= 250 && mouseX <= 1250 && mouseY >= 1425 && mouseY <= 1685) {
      page = 2;
      playButtonSound();
    }
    if (mouseX >= 250 && mouseX <= 1750 && mouseY >= 925 && mouseY <= 1185) {
      page = 1;
      battleStartTime = millis(); //Reset timer
      battleTimerActive = true;
      monsters = []; //Clear monsters
      playButtonSound();
    }
  } 
  //Tutorial menu navigation
  else if (page == 2) {
    let buttonClicked = false;
    
    //Back button
    if (mouseX >= 670 && mouseX <= 1070 && mouseY >= 60 && mouseY <= 220) {
      page = 0;
      buttonClicked = true;
      playButtonSound();
    }
    //Previous tutorial button
    if (mouseX >= 1130 && mouseX <= 1370 && mouseY >= 760 && mouseY <= 890) {
      if (tutorialIndex != 0) {
        tutorialIndex -= 1;
        buttonClicked = true;
        playButtonSound();
      }
    }
    // Next tutorial button
    if (mouseX >= 2570 && mouseX <= 2810 && mouseY >= 760 && mouseY <= 890) {
      if (tutorialIndex != 4) {
        tutorialIndex += 1;
        buttonClicked = true;
        playButtonSound();
      }
    }
    
    //Spellcasting if no button clicked only
    if (!buttonClicked) {
      handleSpellcastingMouse();
    }
  } else if (page == 3) {
    if (mouseX >= 2600 && mouseX <= 3400 && mouseY >= 1080 && mouseY <= 1280) {
      playButtonSound();
      page = 0;
    }
  } else if (page == 4) {
    if (mouseX >= 1510 && mouseX <= 2310 && mouseY >= 1540 && mouseY <= 1770) {
      playButtonSound();
      page = 0;
    }
  //Battle menu spellcasting
  } else if (page == 1) {
    handleSpellcastingMouse();
  }
}

function playButtonSound() {
  //Play button press sound
  if (buttonPressSound) {
    buttonPressSound.play();
  }
}

function keyPressed() {
  //Only allow casting in tutorial or battle modes
  if ((page == 1 || page == 2) && keyCode === ENTER) {
    identifySpell();
  }
}