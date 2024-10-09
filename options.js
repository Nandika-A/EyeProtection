const shortcutInput = document.getElementById('shortcut');
const saveButton = document.getElementById('saveShortcut');
const message = document.getElementById('message');

// load saved shortcut from storage
chrome.storage.sync.get(['eyeProtectionShortcut'], function(result) {
    if (result.eyeProtectionShortcut) {
        shortcutInput.value = result.eyeProtectionShortcut;
    }
});

// save shortcut and redirect
saveButton.addEventListener('click', function() {
    const shortcut = shortcutInput.value;
    
    // save the shortcut to chrome storage
    chrome.storage.sync.set({eyeProtectionShortcut: shortcut}, function() {
        // notification
        message.textContent = 'Shortcut saved. Redirecting to Chrome Shortcuts page...';
        message.style.display = 'block';

        // redirection
        chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });

        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    });
});

shortcutInput.addEventListener('keydown', function(e) {
    e.preventDefault();
    const keys = [];
    
    if (e.ctrlKey) keys.push('Ctrl');
    if (e.altKey) keys.push('Alt');
    if (e.shiftKey) keys.push('Shift');
    if (e.metaKey) keys.push('Command');
    
    if (e.key.length === 1) {
        keys.push(e.key.toUpperCase());
    }

    console.log(`Captured keys: ${keys.join('+')}`); 
    shortcutInput.value = keys.join('+'); 
});
