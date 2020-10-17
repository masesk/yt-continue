chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.id) {
        chrome.tabs.reload(sender.tab.id);
    }
});