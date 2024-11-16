// background.js

let timerInterval = null;
let remainingTime = 0; // Time in seconds
let isTimerRunning = false;
let focusMinutes = 25; // Default focus time

// Fetch stored focus time from local storage or set default
chrome.storage.local.get('focusMinutes', (data) => {
    if (data.focusMinutes) {
        focusMinutes = data.focusMinutes;
    }
});

// Start the timer
function startTimer(timeInMinutes) {
    remainingTime = timeInMinutes * 60; // Convert minutes to seconds
    isTimerRunning = true;
    updateTimerInStorage();

    // Update the timer every second
    if (timerInterval === null) {
        timerInterval = setInterval(() => {
            if (remainingTime > 0) {
                remainingTime--;
                updateTimerInStorage();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                isTimerRunning = false;
                updateTimerInStorage();
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
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
    updateTimerInStorage();
}

// Update the timer state in Chrome's local storage
function updateTimerInStorage() {
    chrome.storage.local.set({
        remainingTime: remainingTime,
        isTimerRunning: isTimerRunning,
        focusMinutes: focusMinutes
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'start':
            startTimer(request.time);
            sendResponse({ status: 'started' });
            break;
        case 'stop':
            stopTimer();
            sendResponse({ status: 'stopped' });
            break;
        case 'get-status':
            sendResponse({
                remainingTime: remainingTime,
                isTimerRunning: isTimerRunning,
                focusMinutes: focusMinutes
            });
            break;
        case 'set-focus-time':
            focusMinutes = request.time;
            updateTimerInStorage();
            sendResponse({ status: 'focus time updated' });
            break;
        default:
            sendResponse({ status: 'unknown action' });
            break;
    }
});


// // Restore the timer state from storage when the background script starts
// chrome.runtime.onStartup.addListener(() => {
//     chrome.storage.local.get(['remainingTime', 'isTimerRunning'], (data) => {
//         if (data.isTimerRunning) {
//             remainingTime = data.remainingTime;
//             startTimer(Math.floor(remainingTime / 60));
//         }
//     });
// });

// // Ensure the background script runs when the extension is installed/updated
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.storage.local.get(['remainingTime', 'isTimerRunning'], (data) => {
//         if (data.isTimerRunning) {
//             remainingTime = data.remainingTime;
//             startTimer(Math.floor(remainingTime / 60));
//         }
//     });
// });