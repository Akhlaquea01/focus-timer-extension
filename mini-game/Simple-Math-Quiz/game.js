const questionEl = document.getElementById('question');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('scoreDisplay');
const gameOverText = document.getElementById('gameOver');
const timerDisplay = document.getElementById('timerDisplay');

let score = 0;
let questionCount = 0;
let wrongAnswers = 0;
let currentAnswer = 0;
let gameActive = true;
let timeLeft = 15;
let timerInterval;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    questionCount++;
    if (questionCount > 10) {
        endGame();
        return;
    }
    const ops = ['+', '-', '×'];
    const op = ops[randomInt(0, 2)];
    let a = randomInt(1, 20);
    let b = randomInt(1, 20);
    if (op === '-') {
        if (b > a) [a, b] = [b, a];
        currentAnswer = a - b;
    } else if (op === '+') {
        currentAnswer = a + b;
    } else {
        a = randomInt(1, 10);
        b = randomInt(1, 10);
        currentAnswer = a * b;
    }
    questionEl.textContent = `Question ${questionCount}/10: What is ${a} ${op} ${b}?`;
    answerInput.value = '';
    answerInput.focus();
    startTimer();
}

function submitAnswer() {
    if (!gameActive) return;
    clearInterval(timerInterval);
    const userAnswer = Number(answerInput.value);
    if (userAnswer === currentAnswer) {
        score++;
        feedback.textContent = 'Correct!';
        scoreDisplay.textContent = 'Score: ' + score;
    } else {
        wrongAnswers++;
        feedback.textContent = `Wrong! The answer was ${currentAnswer}.`;
    }
    setTimeout(() => {
        feedback.textContent = '';
        generateQuestion();
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = 'Time: ' + timeLeft + 's';
}

function startTimer() {
    timeLeft = 15;
    updateTimerDisplay();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    wrongAnswers++;
    feedback.textContent = `Time's up! The answer was ${currentAnswer}.`;
    setTimeout(() => {
        feedback.textContent = '';
        generateQuestion();
    }, 1000);
}

function endGame() {
    gameActive = false;
    gameOverText.innerHTML = `Quiz Over!<br>You scored ${score} out of 10 with ${wrongAnswers} wrong answers.<br>Click to Restart`;
    gameOverText.style.display = 'block';
    questionEl.style.display = 'none';
    answerInput.style.display = 'none';
    submitBtn.style.display = 'none';
    feedback.textContent = '';
    clearInterval(timerInterval);
}

function restartGame() {
    score = 0;
    questionCount = 0;
    wrongAnswers = 0;
    gameActive = true;
    scoreDisplay.textContent = 'Score: 0';
    gameOverText.style.display = 'none';
    questionEl.style.display = 'block';
    answerInput.style.display = 'block';
    submitBtn.style.display = 'block';
    feedback.textContent = '';
    generateQuestion();
    clearInterval(timerInterval);
}

submitBtn.addEventListener('click', submitAnswer);
answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitAnswer();
});
gameOverText.addEventListener('click', restartGame);

restartGame();