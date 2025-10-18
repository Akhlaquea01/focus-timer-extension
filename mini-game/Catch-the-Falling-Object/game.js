const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverText = document.getElementById('gameOver');
const catchPopup = document.getElementById('catchPopup');
const catchSound = document.getElementById('catchSound');
const timerDisplay = document.getElementById('timerDisplay');

let basketX = canvas.width / 2 - 25;
const basketWidth = 50;
const basketHeight = 10;
const basketSpeed = 15;
let fallingObjects = [];
let score = 0;
let fallingSpeed = 2;
let gameInterval;
let isGameOver = false;
let timeLeft = 30;
let timer;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createFallingObject() {
    const x = Math.random() * (canvas.width - 20) + 10;
    fallingObjects.push({ x: x, y: 0 });
}

function updateGame() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#333';
    ctx.fillRect(basketX, canvas.height - 30, basketWidth, basketHeight);

    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        const obj = fallingObjects[i];
        obj.y += fallingSpeed;

        const grad = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, 10);
        grad.addColorStop(0, 'red');
        grad.addColorStop(1, 'yellow');
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.closePath();

        if (obj.y > canvas.height - 40 && obj.y < canvas.height - 20 && obj.x > basketX && obj.x < basketX + basketWidth) {
            fallingObjects.splice(i, 1);
            score++;
            playCatchEffect(obj.x);
            createFallingObject();
        } else if (obj.y > canvas.height) {
            endGame();
        }
    }

    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Score: ' + score, 10, 20);

    requestAnimationFrame(updateGame);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && basketX > 0) {
        basketX -= basketSpeed;
    } else if (e.key === 'ArrowRight' && basketX < canvas.width - basketWidth) {
        basketX += basketSpeed;
    }
    if (e.key === ' ' && isGameOver) {
        restartGame();
    }
});

function startGame() {
    score = 0;
    fallingObjects = [];
    fallingSpeed = 2;
    isGameOver = false;
    timeLeft = 30;
    gameOverText.style.display = 'none';
    catchPopup.style.display = 'none';
    updateTimerDisplay();
    createFallingObject();
    gameInterval = requestAnimationFrame(updateGame);
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function playCatchEffect(x) {
    catchSound.play();
    catchPopup.style.left = x + 'px';
    catchPopup.style.top = (canvas.height - 50) + 'px';
    catchPopup.style.display = 'block';
    setTimeout(() => {
        catchPopup.style.display = 'none';
    }, 300);
    increaseSpeed();
}

function endGame() {
    isGameOver = true;
    gameOverText.innerHTML = `Game Over! Your score: ${score}<br>Press Space to Restart`;
    gameOverText.style.display = 'block';
    cancelAnimationFrame(gameInterval);
    clearInterval(timer);
}

function restartGame() {
    isGameOver = false;
    startGame();
}

function increaseSpeed() {
    if (score % 5 === 0 && score > 0) {
        fallingSpeed += 0.5;
    }
}

function updateTimerDisplay() {
    timerDisplay.textContent = 'Time: ' + timeLeft + 's';
}

startGame();