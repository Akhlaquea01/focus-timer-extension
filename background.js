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
            updateStorage(); // Keep storage updated for popup retrieval
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

// Listen for messages from popup or other components
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

// Restore the timer state from storage when the background script starts
chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(['remainingTime', 'isTimerRunning'], (data) => {
        if (data.isTimerRunning) {
            remainingTime = data.remainingTime;
            startTimer(Math.floor(remainingTime / 60));
        }
    });
});

// Ensure the background script runs when the extension is installed/updated
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['remainingTime', 'isTimerRunning'], (data) => {
        if (data.isTimerRunning) {
            remainingTime = data.remainingTime;
            startTimer(Math.floor(remainingTime / 60));
        }
    });
});
