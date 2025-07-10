const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const moleCountDisplay = document.getElementById("moleCount");
const startButton = document.getElementById("startButton");

let score = 0;
let moleCount = 0;
let gameRunning = false;
let lastHole = null;

const GAME_DURATION = 15000; // 15 seconds
const MIN_PEEP_TIME = 1000; // slower now
const MAX_PEEP_TIME = 1800;

const hitSound = new Audio(
  "https://freesound.org/data/previews/66/66717_931655-lq.mp3"
); // simple pop sound

function getRandomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getRandomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return getRandomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function flash(element) {
  element.classList.add("flash");
  setTimeout(() => element.classList.remove("flash"), 150);
}

function showMole() {
  if (!gameRunning) return;

  const time = getRandomTime(MIN_PEEP_TIME, MAX_PEEP_TIME);
  const hole = getRandomHole(holes);

  hole.classList.add("up");
  moleCount++;
  moleCountDisplay.textContent = moleCount;
  flash(moleCountDisplay);

  setTimeout(() => {
    hole.classList.remove("up");
    if (gameRunning) {
      showMole();
    }
  }, time);
}

function startGame() {
  score = 0;
  moleCount = 0;
  gameRunning = true;

  scoreDisplay.textContent = score;
  moleCountDisplay.textContent = moleCount;
  startButton.disabled = true;

  showMole();

  setTimeout(() => {
    gameRunning = false;
    startButton.disabled = false;
    alert(`Game over! Your score is ${score}`);
  }, GAME_DURATION);
}

function whackMole(hole) {
  if (!gameRunning) return;
  if (hole.classList.contains("up")) {
    hole.classList.remove("up");
    score++;
    scoreDisplay.textContent = score;
    flash(scoreDisplay);
    hitSound.currentTime = 0;
    hitSound.play();
  }
}

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  const key = e.key;
  if (key >= "1" && key <= "9") {
    const index = Number(key) - 1;
    const hole = holes[index];
    if (hole) {
      whackMole(hole);
    }
  }
});

startButton.addEventListener("click", startGame);
