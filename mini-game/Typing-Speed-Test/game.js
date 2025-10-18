const textToType = document.getElementById('text-to-type');
const typingInput = document.getElementById('typing-input');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartBtn = document.getElementById('restart-btn');

const texts = [
    "The quick brown fox jumps over the lazy dog.",
    "Never underestimate the power of a good book.",
    "The journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "In the middle of difficulty lies opportunity."
];

let timer;
let timeLeft = 60;
let gameActive = false;
let text = "";
let startTime;

function getRandomText() {
    return texts[Math.floor(Math.random() * texts.length)];
}

function startGame() {
    gameActive = true;
    timeLeft = 60;
    text = getRandomText();
    textToType.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        textToType.appendChild(span);
    });
    typingInput.value = '';
    typingInput.focus();
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    wpmDisplay.textContent = 'WPM: 0';
    accuracyDisplay.textContent = 'Accuracy: 100%';
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    startTime = new Date().getTime();
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft === 0) {
        endGame();
    }
}

typingInput.addEventListener('input', () => {
    const typedText = typingInput.value;
    const textChars = textToType.querySelectorAll('span');
    let correct = true;
    let correctChars = 0;
    textChars.forEach((charSpan, index) => {
        const char = typedText[index];
        if (char == null) {
            charSpan.classList.remove('correct', 'incorrect');
            correct = false;
        } else if (char === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
            correctChars++;
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
            correct = false;
        }
    });

    const accuracy = Math.round((correctChars / typedText.length) * 100) || 100;
    accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;

    const timeElapsed = (new Date().getTime() - startTime) / 1000 / 60; // in minutes
    const wpm = Math.round((typedText.length / 5) / timeElapsed) || 0;
    wpmDisplay.textContent = `WPM: ${wpm}`;

    if (correct && typedText.length === text.length) {
        endGame();
    }
});

function endGame() {
    gameActive = false;
    clearInterval(timer);
    typingInput.disabled = true;
}

restartBtn.addEventListener('click', () => {
    typingInput.disabled = false;
    startGame();
});

startGame();