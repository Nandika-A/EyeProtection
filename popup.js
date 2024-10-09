var timerElement = document.getElementById("timer");
var pauseButton = document.getElementById("pause");
var isTimerPaused = false;
var startButton = document.getElementById("start");
var resumeButton = document.getElementById("resume");
var resetButton = document.getElementById("reset");
var isTimerRunning = false;
var themeToggle = document.getElementById("theme-toggle");

// Detect system theme
function detectSystemTheme() {
  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  if (localStorage.getItem("darkTheme") === null) {
    // Apply system theme by default
    if (prefersDarkScheme) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("darkTheme", "enabled");
      themeToggle.checked = true;
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("darkTheme", "disabled");
    }
  } else if (localStorage.getItem("darkTheme") === "enabled") {
    document.body.classList.add("dark-theme");
    themeToggle.checked = true;
  } else {
    document.body.classList.remove("dark-theme");
  }
}

// Theme toggle
themeToggle.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark-theme");
    localStorage.setItem("darkTheme", "enabled");
  } else {
    document.body.classList.remove("dark-theme");
    localStorage.setItem("darkTheme", "disabled");
  }
});
window.addEventListener("load", function () {
  detectSystemTheme();

  // Send message to background script to get the current timer state
  chrome.runtime.sendMessage({ type: "getTimerState" });
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "updateTimer") {
    // Update timer display
    timerElement.textContent = message.time;
  }
});

function startTimer() {
  if (!isTimerRunning) {
    chrome.runtime.sendMessage({ type: "startTimer" });
    isTimerRunning = true;
  }
}

startButton.addEventListener("click", startTimer);

pauseButton.addEventListener("click", function () {
  if (isTimerRunning) {
    chrome.runtime.sendMessage({ type: "pauseTimer" });
    isTimerPaused = true;
  }
});

resumeButton.addEventListener("click", function () {
  if (isTimerPaused) {
    chrome.runtime.sendMessage({ type: "resumeTimer" });
    isTimerPaused = false;
  }
});

resetButton.addEventListener("click", function () {
  chrome.runtime.sendMessage({ type: "resetTimer" });
  isTimerRunning = false;
});
