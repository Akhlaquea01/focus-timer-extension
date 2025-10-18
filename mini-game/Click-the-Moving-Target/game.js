const canvas = document.getElementById('targetCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const gameOverText = document.getElementById('gameOver');
const timerDisplay = document.getElementById('timerDisplay');

let target = { x: 100, y: 100, radius: 30 };
let score = 0;
let gameActive = false;
let timer;
let moveInterval;
let timeLeft = 30;
let moveSpeed = 1200; // ms, initial speed
let speedIncreaseTimer;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawStartScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Click to Start', canvas.width / 2, canvas.height / 2);
}

function drawTarget() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function moveTarget() {
    target.x = Math.random() * (canvas.width - 2 * target.radius) + target.radius;
    target.y = Math.random() * (canvas.height - 2 * target.radius) + target.radius;
    drawTarget();
}

function startMoveInterval() {
    if (moveInterval) clearInterval(moveInterval);
    moveInterval = setInterval(moveTarget, moveSpeed);
}

canvas.addEventListener('click', (e) => {
    if (!gameActive) {
        if (gameOverText.style.display === 'block') {
            restartGame();
        } else {
            startGame();
        }
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const dist = Math.sqrt((mouseX - target.x) ** 2 + (mouseY - target.y) ** 2);
    if (dist < target.radius) {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        moveTarget();
    }
});

function updateTimerDisplay() {
    timerDisplay.textContent = 'Time: ' + timeLeft + 's';
}

function startGame() {
    score = 0;
    gameActive = true;
    scoreDisplay.textContent = 'Score: 0';
    gameOverText.style.display = 'none';
    timeLeft = 30;
    moveSpeed = 1200;
    updateTimerDisplay();
    moveTarget();
    startMoveInterval();
    if (speedIncreaseTimer) clearInterval(speedIncreaseTimer);
    speedIncreaseTimer = setInterval(() => {
        if (moveSpeed > 400) {
            moveSpeed -= 120; // increase speed every 5 seconds
            startMoveInterval();
        }
    }, 5000);
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    gameOverText.innerHTML = `Game Over! Your score: ${score}<br>Click to Restart`;
    gameOverText.style.display = 'block';
    clearInterval(moveInterval);
    clearInterval(timer);
    clearInterval(speedIncreaseTimer);
}

function restartGame() {
    clearInterval(moveInterval);
    clearInterval(timer);
    clearInterval(speedIncreaseTimer);
    startGame();
}

window.addEventListener('DOMContentLoaded', () => {
    drawStartScreen();
});