// background.js

let timerInterval = null;
let remainingTime = 25 * 60; // Default focus time in seconds (25 minutes)
let isTimerRunning = false;

// Store timer data in chrome storage
function updateStorage() {
    chrome.storage.local.set({
        remainingTime: remainingTime,
        isTimerRunning: isTimerRunning,
    });
}

// Start the timer
function startTimer(minutes) {
    if (isTimerRunning) return;
    
    remainingTime = minutes * 60; // Set the custom time
    isTimerRunning = true;
    updateStorage();

    timerInterval = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
        } else {
            clearInterval(timerInterval);
            isTimerRunning = false;
            updateStorage();

            // Open the mini-game in a new tab when the timer is finished
            // chrome.tabs.create({ url: 'mini-game/game-list.html' });

            // Open the mini-game popup when the timer is finished
            chrome.windows.create({
                url: 'mini-game/game-list.html',
                type: 'popup',
                width: 600, // Set the width of the popup
                height: 600, // Set the height of the popup
            });
        }
    }, 1000);
}

// Stop the timer
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        updateStorage();
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'start') {
        startTimer(message.time);
        sendResponse({ status: 'timer started' }); // Send response back to the popup
    } else if (message.action === 'get-status') {
        sendResponse({ remainingTime, isTimerRunning });
    } else {
        sendResponse({ error: 'unknown action' });
    }
});
