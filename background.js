// Service Worker for Google Chrome Extension
// Handles when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Handles when message is received
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received:', message);
    sendResponse("Message received");
});
