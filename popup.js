var timerElement = document.getElementById("timer");
var pauseButton = document.getElementById("pause");
var isTimerPaused = false;
var startButton = document.getElementById("start");
var resumeButton = document.getElementById("resume");
var resetButton = document.getElementById("reset");
var isTimerRunning = false;

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message);
    if (message.type === "updateTimer") {
        // Update timer display
        timerElement.textContent = message.time;
    }
});

function startTimer() {
    if (!isTimerRunning) {
        // Send message to background script to start the timer
        chrome.runtime.sendMessage({ type: "startTimer" });
        isTimerRunning = true;
    }
}

startButton.addEventListener("click", startTimer);

pauseButton.addEventListener("click", pauseTimer);

function pauseTimer() {
    if (isTimerRunning) {
        // Send message to background script to pause the timer
        chrome.runtime.sendMessage({ type: "pauseTimer" });
        isTimerPaused = true;
    }
}

resumeButton.addEventListener("click", resumeTimer);

function resumeTimer() {
    if (isTimerPaused) {
        // Send message to background script to resume the timer
        chrome.runtime.sendMessage({ type: "resumeTimer" });
        isTimerPaused = false;
    }
}

resetButton.addEventListener("click", resetTimer);

function resetTimer() {
    // Send message to background script to reset the timer
    chrome.runtime.sendMessage({ type: "resetTimer" });
    isTimerRunning = false;
}

// Start the timer when the page loads
window.addEventListener("load", function() {
    // Send message to background script to get the current timer state
    chrome.runtime.sendMessage({ type: "getTimerState" });
});
