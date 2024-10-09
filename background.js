// background.js

// Timer variables
let timerInterval;
let startTime;
let elapsedTime = 0;
let isTimerRunning = false;
const firstIntervalDuration = 20 * 60 * 1000; // 20 minutes in milliseconds
const secondIntervalDuration = 20 * 1000; // 20 seconds for break

// Start timer
function startTimer() {
    chrome.storage.local.get(["startTime", "elapsedTime"], function (result) {
        startTime = result.startTime || Date.now();
        elapsedTime = result.elapsedTime || 0;
        if (elapsedTime > 0) {
            startTime = Date.now() - elapsedTime; // Adjust start time by elapsed time
        }
        timerInterval = setInterval(updateTimer, 1000);
        isTimerRunning = true;
        chrome.storage.local.set({ isTimerRunning: true });
    });
}

// Pause timer
function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    chrome.storage.local.set({ isTimerRunning: false, elapsedTime: elapsedTime });
}

// Resume timer
function resumeTimer() {
    if (!isTimerRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateTimer, 1000);
        isTimerRunning = true;
        chrome.storage.local.set({ isTimerRunning: true });
    }
}

// Reset timer
function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    isTimerRunning = false;
    chrome.storage.local.set({ startTime: null, elapsedTime: 0, isTimerRunning: false });
    chrome.runtime.sendMessage({ type: "updateTimer", time: formatTime(firstIntervalDuration) });
}

// Update timer
function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    const remainingTime = firstIntervalDuration - elapsedTime;

    if (remainingTime <= 0) {
        clearInterval(timerInterval);
        chrome.runtime.sendMessage({ type: "updateTimer", time: "00:00" });
        notifyBreakTime();
        startShortTimer();
    } else {
        chrome.runtime.sendMessage({ type: "updateTimer", time: formatTime(remainingTime) });
    }
}

// Format time function
function formatTime(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// Function to notify break time
function notifyBreakTime() {
    chrome.notifications.create("breakTimeNotification", {
        type: "basic",
        iconUrl: "images/hourglass.png",
        title: "Take a break!",
        message: "It's time to take a break. Look at something 20 feet away for 20 seconds."
    });
}

// Function to start short break timer
function startShortTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedBreakTime = Date.now() - startTime;
        const remainingBreakTime = secondIntervalDuration - elapsedBreakTime;

        if (remainingBreakTime <= 0) {
            clearInterval(timerInterval);
            chrome.runtime.sendMessage({ type: "updateTimer", time: formatTime(firstIntervalDuration) });
            notifyBreakEnd();
        } else {
            chrome.runtime.sendMessage({ type: "updateTimer", time: formatTime(remainingBreakTime) });
        }
    }, 1000);
}

// Function to notify break end
function notifyBreakEnd() {
    chrome.notifications.create("breakEndNotification", {
        type: "basic",
        iconUrl: "images/hourglass.png",
        title: "Break time over",
        message: "Time to get back to work! The 20-20-20 timer will restart."
    });
    startTimer();
}

// Listen for messages from popup script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case "startTimer":
            startTimer();
            break;
        case "pauseTimer":
            pauseTimer();
            break;
        case "resumeTimer":
            resumeTimer();
            break;
        case "resetTimer":
            resetTimer();
            break;
        case "getTimerState":
            chrome.storage.local.get(["isTimerRunning", "elapsedTime"], function (result) {
                sendResponse({
                    isTimerRunning: result.isTimerRunning || false,
                    elapsedTime: result.elapsedTime || 0
                });
            });
            return true; // asynchronous response
    }
});

// Initialization
chrome.runtime.onInstalled.addListener(() => {
    resetTimer();
});

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
    if (command === "activate_extension") {
        console.log("Extension Activated"); // Log for debugging
        chrome.action.openPopup(); // Open the extension popup
    }
});
