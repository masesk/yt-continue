
const getToggle = (callback) => { // expects function(value){...}
    chrome.storage.local.get('yt-continue-toggle',  (data) => {
        if (data["yt-continue-toggle"] === undefined) {
            callback(true); // default value
        } else {
            callback(data["yt-continue-toggle"]);
        }
    });
}

const setToggle = (value, callback) => { // expects function(){...}
    chrome.storage.local.set({ "yt-continue-toggle": value }, function () {
        if (chrome.runtime.lastError) {
            throw Error(chrome.runtime.lastError);
        } else {
            callback();
        }
    });
}
document.addEventListener('DOMContentLoaded',  () => {
    const link = document.getElementById('myyt-continue-toggle');
    var enabled;
    getToggle(function (toggle) {
        enabled = toggle
        link.checked = toggle
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { enabled: enabled }, function (response) {
            });
        });
    });
    link.addEventListener('change',  () => {
        if (link.checked) {
            enabled = true;
        }
        else {
            enabled = false;
        }
        setToggle(enabled, () => {
        })
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { enabled: enabled }, function (response) {

            });
        });
    });

});