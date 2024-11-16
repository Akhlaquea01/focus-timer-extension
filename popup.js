// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const timeDisplay = document.getElementById('time-display');
    const startTimerBtn = document.getElementById('start-timer-btn');
    const changeTimeBtn = document.getElementById('change-time-btn');
    const focusTimeInput = document.getElementById('focus-time');
    const timeInputSection = document.getElementById('time-input-section');
    const setTimeBtn = document.getElementById('set-time-btn');

    let focusMinutes = 25; // Default focus time
    let timerUpdateInterval = null; // Interval to update the timer display

    // Fetch and set the focus time from storage when popup loads
    chrome.storage.local.get('focusMinutes', (data) => {
        if (data.focusMinutes) {
            focusMinutes = data.focusMinutes;
            displayTime(focusMinutes * 60);
        } else {
            displayTime(focusMinutes * 60);
        }
    });

    // Display remaining time
    function displayTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timeDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Fetch timer status from background script
    function fetchTimerStatus() {
        chrome.runtime.sendMessage({ action: 'get-status' }, (response) => {
            if (response) {
                displayTime(response.remainingTime);
                if (response.isTimerRunning) {
                    // Start updating the timer display dynamically
                    if (!timerUpdateInterval) {
                        startTimerDisplayUpdate();
                    }
                }
            } else {
                console.error('Failed to get timer status from background script.');
            }
        });
    }

    // Update the timer display every second
    function startTimerDisplayUpdate() {
        timerUpdateInterval = setInterval(() => {
            chrome.runtime.sendMessage({ action: 'get-status' }, (response) => {
                if (response && response.isTimerRunning) {
                    displayTime(response.remainingTime);
                } else {
                    clearInterval(timerUpdateInterval); // Stop updating when the timer stops
                    timerUpdateInterval = null;
                }
            });
        }, 1000);
    }

    // Clear any ongoing interval
    function clearExistingInterval() {
        if (timerUpdateInterval) {
            clearInterval(timerUpdateInterval);
            timerUpdateInterval = null;
        }
    }

    // Event listener to show/hide input
    changeTimeBtn.addEventListener('click', () => {
        timeInputSection.style.display = 'block';
    });

    // Set custom time
    setTimeBtn.addEventListener('click', () => {
        focusMinutes = parseInt(focusTimeInput.value) || 25; // Get focus time from input
        timeInputSection.style.display = 'none'; // Hide input field
        displayTime(focusMinutes * 60); // Update the display with the custom time

        // Save the custom time in Chrome storage for future sessions
        chrome.storage.local.set({ focusMinutes: focusMinutes });

        // Clear any ongoing interval when setting new time
        clearExistingInterval();
    });

    // Start timer with custom time
    startTimerBtn.addEventListener('click', () => {
        console.log('Starting timer with minutes:', focusMinutes);

        // Clear any ongoing interval before starting a new timer
        clearExistingInterval();

        // Send start message to background script
        chrome.runtime.sendMessage({ action: 'start', time: focusMinutes }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Error sending start message:', chrome.runtime.lastError.message);
            } else {
                console.log('Start message sent successfully.');
                // Start updating the timer display dynamically after the timer starts
                if (!timerUpdateInterval) {
                    startTimerDisplayUpdate();
                }
            }
        });
    });

    // Fetch the current timer status on popup load
    fetchTimerStatus();
});
