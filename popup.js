var timerElement = document.getElementById("timer");
var pauseButton = document.getElementById("pause");
var isTimerPaused = false;

pauseButton.addEventListener("click", pauseTimer);

function pauseTimer() {
    if (isTimerRunning) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        isTimerPaused = true;
    }
}

var startButton = document.getElementById("start");
var resumeButton = document.getElementById("resume");
var resetButton = document.getElementById("reset");
var timerInterval;
var startTime;
var elapsedTime = 0;
var isTimerRunning = false;

function startTimer() {
    if (!isTimerRunning) {
        startTime = Date.now() + 20 * 60 * 1000;
        timerInterval = setInterval(updateTimer, 1000);
        isTimerRunning = true;
        timerElement.textContent = formatTime(startTime - Date.now());
    }
}

function updateTimer() {
var currentTime = Date.now();
elapsedTime = startTime - currentTime;
if (elapsedTime <= 0) {
    clearInterval(timerInterval);
    timerElement.innerHTML = "00:00:00";
    isTimerRunning = false;
    // Show popup
    alert("Take a 20-second break!");
    // Start 20-second timer
    startShortTimer();
} else {
    var formattedTime = formatTime(elapsedTime);
    timerElement.innerHTML = formattedTime;
}
}

function startShortTimer() {
startTime = Date.now() + 20 * 1000;
timerInterval = setInterval(updateShortTimer, 1000);
isTimerRunning = true;
}

function updateShortTimer() {
var currentTime = Date.now();
elapsedTime = startTime - currentTime;
if (elapsedTime <= 0) {
    clearInterval(timerInterval);
    timerElement.textContent = "00:00:00";
    isTimerRunning = false;
} else {
    var formattedTime = formatTime(elapsedTime);
    timerElement.textContent = formattedTime;
}
}

function formatTime(time) {
var seconds = Math.floor((time / 1000) % 60);
var minutes = Math.floor((time / 1000 / 60) % 60);
var hours = Math.floor((time / 1000 / 60 / 60) % 24);

var formattedSeconds = seconds.toString().padStart(2, "0");
var formattedMinutes = minutes.toString().padStart(2, "0");
var formattedHours = hours.toString().padStart(2, "0");

return formattedHours + ":" + formattedMinutes + ":" + formattedSeconds;
}

function resumeTimer() {
    if (!isTimerRunning && isTimerPaused) {
        startTime = Date.now() + elapsedTime;
        timerInterval = setInterval(updateTimer, 1000);
        isTimerRunning = true;
        isTimerPaused = false;
    }
}

function resetTimer() {
clearInterval(timerInterval);
elapsedTime = 0;
timerElement.textContent = "00:00:00";
isTimerRunning = false;
startTimer();
}

startButton.onclick = startTimer();
resumeButton.addEventListener("click", resumeTimer);
resetButton.addEventListener("click", resetTimer);

// Start the timer when the page loads
window.addEventListener("load", startTimer);