// mini-game/game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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

// Create falling objects randomly
function createFallingObject() {
    const x = Math.random() * (canvas.width - 10);
    fallingObjects.push({ x: x, y: 0 });
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
        obj.y += 2; // Speed of falling objects

        // Draw object
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
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
            createFallingObject();
        }
    }

    // Draw score
    ctx.font = '16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('Score: ' + score, 10, 20);

    requestAnimationFrame(updateGame);
}

// Move the basket
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && basketX > 0) {
        basketX -= basketSpeed;
    } else if (e.key === 'ArrowRight' && basketX < canvas.width - basketWidth) {
        basketX += basketSpeed;
    }
});

// Start the game
createFallingObject();
updateGame();
