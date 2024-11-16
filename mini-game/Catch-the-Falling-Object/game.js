const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverText = document.getElementById('gameOver');
const catchPopup = document.getElementById('catchPopup');
const catchSound = document.getElementById('catchSound');  // Reference to catch sound

// Set the canvas size to fit the window dynamically
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Set the initial size

// Game variables
let basketX = canvas.width / 2 - 20;
const basketWidth = 50;
const basketHeight = 10;
const basketSpeed = 10;
let fallingObjects = [];
let score = 0;
let fallingSpeed = 2; // Speed of falling objects
let gameInterval;
let isGameOver = false;

// Create falling objects randomly
function createFallingObject() {
    const x = Math.random() * (canvas.width - 10);
    fallingObjects.push({ x: x, y: 0, caught: false });
}

// Update game state
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw basket
    ctx.fillStyle = '#333';
    ctx.fillRect(basketX, canvas.height - 30, basketWidth, basketHeight);

    // Move and draw falling objects
    for (let i = 0; i < fallingObjects.length; i++) {
        const obj = fallingObjects[i];
        obj.y += fallingSpeed; // Speed of falling objects

        // Draw object with a gradient
        const grad = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, 10);
        grad.addColorStop(0, 'red');
        grad.addColorStop(1, 'yellow');
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.closePath();

        // Check if caught
        if (
            obj.y > canvas.height - 30 &&
            obj.x > basketX &&
            obj.x < basketX + basketWidth
        ) {
            fallingObjects.splice(i, 1);
            score++;
            playCatchEffect(); // Play sound and show popup
            createFallingObject();
        }

        // If object goes off-screen without being caught, game over
        if (obj.y > canvas.height) {
            endGame();
        }
    }

    // Draw score
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Score: ' + score, 10, 20);

    requestAnimationFrame(updateGame);
}

// Basket movement
document.addEventListener('keydown', (e) => {
    if (isGameOver && e.key !== ' ') return; // Do not allow movement if the game is over

    if (e.key === 'ArrowLeft' && basketX > 0) {
        basketX -= basketSpeed;
    } else if (e.key === 'ArrowRight' && basketX < canvas.width - basketWidth) {
        basketX += basketSpeed;
    }
    if (e.key === ' ') { // Restart the game when pressing Space
        if (isGameOver) {
            restartGame();
        }
    }
});

// Start the game
function startGame() {
    score = 0;
    fallingObjects = [];
    fallingSpeed = 2;
    isGameOver = false;
    gameOverText.style.display = 'none'; // Hide the game over text
    catchPopup.style.display = 'none';  // Hide catch popup
    createFallingObject();
    gameInterval = requestAnimationFrame(updateGame);
}

// Play catch effect (sound and popup)
function playCatchEffect() {
    catchSound.play();  // Play catch sound
    increaseSpeed();
}

// End the game if the object misses the basket
function endGame() {
    isGameOver = true;
    fallingSpeed = 2;
    gameOverText.style.display = 'block'; // Show "Game Over" text
    cancelAnimationFrame(gameInterval); // Stop game loop
}

// Restart the game
function restartGame() {
    isGameOver = false;
    startGame();
}

// Increase speed gradually
function increaseSpeed() {
    if (score % 5 === 0 && score > 0) { // Increase speed every 5 score points
        fallingSpeed += 0.5;
    }
}

startGame(); // Start the game
