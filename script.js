//Add the global variables here




//Global Variables 
let pattern = [2, 2, 4, 3, 2, 1, 2, 4]
let progress = 0;
let gamePlaying = false;
let tonePlaying = false; // New variable to track tone playing state
let volume = 0.5; // New variable to control volume
let guessCounter = 0;//keep track of the user's progress in the clue sequence

// Constant Variables
const clueHoldTime = 1000;
const cluePauseTime = 333; //how long to puase in between clues
const nextClueWaitTime = 1000; // how long to wait before starting playback of the clue sequence

//store the start and stop buttons
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");





// Add your functions here
function startGame(){
  //function body
  //initialize game variables
  progress = 0;
  gamePlaying = true;
  playClueSequence();

  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");
  
}
function stopGame(){
  //function body
  //initialize game variables
  gamePlaying = false;
  //swap the Start and Stop Buttons
   
  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");
  
}


// Sound Synthesis Functions for Steps 6-8
// You do not need to edit the below code

// Frequencies for each button
const freqMap = {
  1: 261.63, //Frequnecy for button 1
  2: 329.63, //Frequnecy for button 2
  3: 392.00, //Frequnecy for button 3
  4: 523.25 //Frequnecy for button 4
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone(){
  g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
  tonePlaying = false
}

// Functions for lighting and clearing buttons
function lightButton(btn) {
    document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
    document.getElementById("button" + btn).classList.remove("lit");
}

// Function for playing a single clue
function playSingleClue(btn) {
    if (gamePlaying) {
        lightButton(btn);
        playTone(btn, clueHoldTime);
        setTimeout(clearButton, clueHoldTime, btn);
    }
}

function playClueSequence(){
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
}

// Function for losing the game
function loseGame() {
    stopGame();
    alert("Game Over. You lost!");
}

// Function for winning the game
function winGame() {
    stopGame();
    alert("Congratulations! You won!");
}

// Function for handling user guesses
 function guess(btn) {
    console.log("user guessed: " + btn);

    if (!gamePlaying) {
        return;
    }

    // Check if the guessed button matches the current clue in the sequence
    if (btn === pattern[guessCounter]) {
        // Correct guess
        if (guessCounter === progress) {
            // Check if the guess completes the entire pattern
            if (progress === pattern.length - 1) {
                // Player has completed the pattern and won the game
                winGame();
            } else {
                // Player's guess is correct, proceed to the next turn
                progress++;
                guessCounter = 0; // Reset guessCounter for the next turn
                playClueSequence();
            }
        } else {
            // Player's guess is correct so far, check the next button in the sequence
            guessCounter++;
        }
    } else {
        // Incorrect guess, player loses the game
        loseGame();
    }
}




// Page Initialization
// Init Sound Synthesizer
let AudioContext = window.AudioContext || window.webkitAudioContext 
let context = new AudioContext()
let o = context.createOscillator()
let g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)