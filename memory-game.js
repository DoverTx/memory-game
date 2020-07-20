const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

const CARDCOVERED = 'covered';
const CARDFLIPPED = 'flipped';
const CARDMATCHED = "matched";
const CARDSTATE   = "data-card";
const CARDID      = "data-id";
const DATACOLOR   = "data-color";
const STARTTIME   = 60;

let cardCnt = 0;
let matchCnt = 0;
let cardFlips = 0;
let totalFlips = 0;
let flippedElement;
let timeRemaining = STARTTIME;
let countDownId;
let shuffledColors = [];


document.getElementById('time-remaining').innerText = timeRemaining;

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

//let
 shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  cardCnt = 0;
  totalFlips = 0;
 
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.setAttribute("data-color",color); 
    newDiv.classList.add('card');

    newDiv.setAttribute(CARDSTATE, CARDCOVERED);  // initial state of card
    newDiv.setAttribute(CARDID, cardCnt.toString());

    gameContainer.append(newDiv);
    cardCnt++;
  }
 setStartButton()
  
}

let startButton;
function setStartButton() {
startButton = document.getElementsByClassName('start visible');
startButton[0].addEventListener("click", startGame);

}

let acard;
function startGame() {
  
  cardFlips = 0;
  totalFlips = 0;
  matchCnt = 0;
  
  timeRemaining = STARTTIME;
  document.getElementById('time-remaining').innerText = timeRemaining;
  document.getElementById('flips').innerText = totalFlips;
  
  startButton = document.getElementsByClassName('start visible');
  startButton[0].classList.remove('visible');
 
  acard = document.getElementsByClassName('card');
  for (let i=0;i < acard.length; i++){
    acard[i].addEventListener("click", handleCardClick);
  }
  startCountDown();
}


let e;
// TODO: Implement this function!
function handleCardClick(event) {
  e = event;
  // you can use event.target to see which element was clicked
  // console.log("you just clicked", event.target.className);
  // console.log("you just clicked", event.target.getAttribute(DATACOLOR));

  // can only check covered cards & no sneaking in extra cards...
  if (event.target.getAttribute(CARDSTATE) === CARDCOVERED && cardFlips < 2){
    cardFlips++;
    totalFlips++;
     // display flips
     document.getElementById('flips').innerText = totalFlips;

    event.target.setAttribute(CARDSTATE, CARDFLIPPED);
 
    event.target.style.backgroundColor = event.target.getAttribute(DATACOLOR);
    //  save the 1st flip
    if (cardFlips == 1){
        flippedElement = event.target;

      // 2nd flip, check for a match
    } else if (flippedElement.getAttribute(DATACOLOR) === event.target.getAttribute(DATACOLOR)) {
        event.target.setAttribute(CARDSTATE, CARDMATCHED);
        flippedElement.setAttribute(CARDSTATE, CARDMATCHED);
        cardFlips = 0;
        matchCnt += 2;
        console.log("matchCnt=",matchCnt," cardCnt=",cardCnt);
        if (matchCnt === cardCnt){
          gameWinner();
        }
        // alert("a match!!!!")

      // if not a match reset everything flip cards back over  
    } else {  
        setTimeout(function(){
          event.target.style.backgroundColor = "";
          flippedElement.style.backgroundColor = "";
          cardFlips = 0;
          event.target.setAttribute(CARDSTATE, CARDCOVERED);
          flippedElement.setAttribute(CARDSTATE, CARDCOVERED);
        },1000);
    }
  }
}

function startCountDown() { 
  // console.log("startCountDown");
  countDownId = setInterval(function() {
    timeRemaining--;
    document.getElementById('time-remaining').innerText = timeRemaining;
    // console.log("timeRemaining ID",countDownId);
    if (timeRemaining === 0) gameOver();
  }, 1000);
}

function gameOver() {
  // alert("game over "+ countDownId);
  clearInterval(countDownId);
  document.getElementById('game-over-text').classList.add('visible');
 resetGame();
}

function gameWinner() {
  clearInterval(countDownId);
  // alert("winner! \nNumber of Flips: "+totalFlips+"\nTime remaining: "+ timeRemaining+" seconds.")
  let winnerEle = document.getElementById('winner-text')
  winnerEle.classList.add('visible');
 // winnerEle.addEventListener("click", startGame); 
  resetGame();
}

// let cards;
function resetGame() {
  let cards = document.querySelectorAll('.card');
  for (let card of cards) {
    card.remove();
  }
  // resuffle cards
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
}

// when the DOM loads
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDivsForColors(shuffledColors));
  } else {
    createDivsForColors(shuffledColors);
  }

