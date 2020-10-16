
const getToggle = (callback) => {
    chrome.storage.local.get('yt-continue-toggle', (data) => {
        if (data["yt-continue-toggle"] === undefined) {
            callback(true);
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
document.addEventListener('DOMContentLoaded', () => {

    const yttoggle = document.getElementById('myyt-continue-toggle');
    const rec = document.getElementById('speech-rece-toggle');
    var enabled;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {isRecEnabled: true}, function (response) {
            rec.checked = response.recEnabled
        });
    });
    getToggle(function (toggle) {
        enabled = toggle
        yttoggle.checked = toggle
    });
    yttoggle.addEventListener('change', () => {
        if (yttoggle.checked) {
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
    rec.addEventListener('change', () => {
        if (rec.checked) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { speechRec: true }, function (response) {

                });
            });
        }
        else {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { speechRec: false }, function (response) {

                });
            });
        }
    });


});
