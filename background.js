var timerInterval;
var startTime;
var elapsedTime = 0;
var isTimerRunning = false;
var firstIntervalDuration = 20 * 1000; // 20 seconds
var secondIntervalDuration = 10 * 1000; // 10 seconds

// Function to start the timer
function startTimer() {
    chrome.storage.local.get(["startTime", "elapsedTime"], function(result) {
        startTime = result.startTime || Date.now() + firstIntervalDuration;
        elapsedTime = result.elapsedTime || 0;
        if (elapsedTime > 0) {
            startTime += elapsedTime;
        }
        timerInterval = setInterval(updateTimer, 1000);
        isTimerRunning = true;
    });
}

// Function to pause the timer
function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
}

// Function to resume the timer
function resumeTimer() {
    startTimer();
}

// Function to reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    chrome.storage.local.set({ startTime: Date.now() + firstIntervalDuration, elapsedTime: 0 }, function() {
        startTimer();
    });
}

// Function to update the timer
function updateTimer() {
    try {
        var currentTime = Date.now();
        elapsedTime = startTime - currentTime;
        if (elapsedTime <= 0) {
            clearInterval(timerInterval);
            // Send message to popup to show alert
            chrome.runtime.sendMessage({ type: "updateTimer", time: "00:00:00" });
            chrome.notifications.create("breakTimeNotification", {
                type: "basic",
                iconUrl: "images/hourglass.png",
                title: "Take a break!",
                message: "It's time to take a break. Look at something 20 feet away for 20 seconds."
            });
            // Start short break timer
            startShortTimer();
        } else {
            // Send message to popup to update timer display
            chrome.runtime.sendMessage({ type: "updateTimer", time: formatTime(elapsedTime) });
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to start the short break timer
function startShortTimer() {
    startTime = Date.now() + secondIntervalDuration;
    timerInterval = setInterval(updateShortTimer, 1000);
}

// Function to update the short break timer
function updateShortTimer() {
    var currentTime = Date.now();
    elapsedTime = startTime - currentTime;
    if (elapsedTime <= 0) {
        clearInterval(timerInterval);
        resetTimer();
    }
}

// Function to format time
function formatTime(time) {
    var seconds = Math.floor((time / 1000) % 60);
    var minutes = Math.floor((time / 1000 / 60) % 60);
    var hours = Math.floor((time / 1000 / 60 / 60) % 24);

    var formattedSeconds = seconds.toString().padStart(2, "0");
    var formattedMinutes = minutes.toString().padStart(2, "0");
    var formattedHours = hours.toString().padStart(2, "0");

    return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
}

// Listen for messages from popup script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log(message);
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
            sendResponse({ isTimerRunning: isTimerRunning, elapsedTime: elapsedTime });
            chrome.runtime.sendMessage({ type: "updateTimer", time: formatTime(elapsedTime) });
            break;
    }
});
