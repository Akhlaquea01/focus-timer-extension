const gameBoard = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const flipsDisplay = document.getElementById('flips');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

const symbols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
let cards = [...symbols, ...symbols];
let flippedCards = [];
let matchedPairs = 0;
let flips = 0;
let timeLeft = 60;
let timer;
let gameActive = true;

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

function createBoard() {
    shuffle(cards);
    gameBoard.innerHTML = '';
    cards.forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"></div>
                <div class="card-back">${symbol}</div>
            </div>
        `;
        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });
}

function flipCard(card) {
    if (!gameActive || card.classList.contains('flipped') || flippedCards.length === 2) {
        return;
    }
    card.classList.add('flipped');
    flippedCards.push(card);
    flips++;
    flipsDisplay.textContent = `Flips: ${flips}`;
    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.symbol === card2.dataset.symbol) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === symbols.length) {
            endGame(true);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function startGame() {
    gameActive = true;
    matchedPairs = 0;
    flips = 0;
    timeLeft = 60;
    flippedCards = [];
    flipsDisplay.textContent = 'Flips: 0';
    timerDisplay.textContent = 'Time: 60s';
    gameOverScreen.style.display = 'none';
    createBoard();
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function endGame(won) {
    gameActive = false;
    clearInterval(timer);
    gameOverScreen.style.display = 'block';
    if (won) {
        finalScoreDisplay.textContent = `You won with ${flips} flips!`;
    } else {
        finalScoreDisplay.textContent = `Time's up! You found ${matchedPairs} pairs.`;
    }
}

restartBtn.addEventListener('click', startGame);

startGame();