

var observer;
var enabled = true;



chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.enabled) {
        enabled = true;
        startObserving();
    }
    else {
        enabled = false;
        if(observer !== undefined){
            observer.disconnect();
        }
        
    }

});
const startObserving = () => {
    const popupContainer = document.getElementsByTagName('ytd-popup-container')[0];
    observer = new MutationObserver(function (mutations) {
        const continueButton = popupContainer.getElementsByClassName("yt-button-renderer")[0];
        continueButton.click();
        const d = new Date();
        console.log("YT Continue pressed 'Yes' on your behalf on " + d.toLocaleString())
    });
    const config = { attributes: true, childList: true, characterData: true };
    observer.observe(popupContainer, config);
}
