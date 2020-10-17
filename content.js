

var observer;
var enabled = true;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var recognition = new SpeechRecognition();;
var reconitionEnabled = false;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.hasOwnProperty('enabled')) {
        if (message.enabled) {
            enabled = true;
            startObserving();
        }
        else {
            enabled = false;
            if (observer !== undefined) {
                console.log("[YT Continue] Stopped");
                observer.disconnect();
                observer = undefined
            }

        }
    }
    else if (message.hasOwnProperty('speechRec')) {
        if (message.speechRec) {
            startRecognition()
        }
        else {
            stopRecognition()
        }
    }
    else if (message.hasOwnProperty('isRecEnabled')) {
        sendResponse({ recEnabled: reconitionEnabled })
    }


});
const startObserving = () => {
    const popupContainer = document.getElementsByTagName('ytd-popup-container')[0];
    observer = new MutationObserver(function (mutations) {
        console.log("[YT Continue] Popup detected!")
        chrome.runtime.sendMessage({ id: true }, tabId => { });

    });
    const config = { attributes: true, childList: true, characterData: true };
    observer.observe(popupContainer, config);
    console.log("[YT Continue] Started");
}

const getToggle = (callback) => {
    chrome.storage.local.get('yt-continue-toggle', (data) => {
        if (data["yt-continue-toggle"] === undefined) {
            callback(true);
        } else {
            callback(data["yt-continue-toggle"]);
        }
    });
}

const startRecognition = () => {
    reconitionEnabled = true
    const phrase = "youtube"
    var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase + ';';
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    const vidPlayer = document.getElementsByClassName("video-stream html5-main-video")[0]
    if (vidPlayer !== undefined) {
        recognition.start();
    }


    recognition.onresult = function (event) {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The first [0] returns the SpeechRecognitionResult at position 0.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The second [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object 
        const speechResultList = (event.results[0][0].transcript.toLowerCase()).split(" ");
        if (speechResultList.length != 2) {
            return
        }
        else if (speechResultList[0] !== "youtube") {
            return
        }
        if (vidPlayer !== undefined) {
            switch (speechResultList[1]) {
                case "play":
                    vidPlayer.play()
                    break

                case "pause":
                    vidPlayer.pause()
                    break
                case "skip":
                    vidPlayer.currentTime = vidPlayer.duration
                    break
            }
        }

    }

    recognition.onspeechend = function () {
        recognition.stop();
    }

    recognition.onerror = function (event) {
        console.log(event.error)
    }

    recognition.onaudiostart = function (event) {
        //Fired when the user agent has started to capture audio.
        //console.log('SpeechRecognition.onaudiostart');
    }

    recognition.onaudioend = function (event) {
        //Fired when the user agent has finished capturing audio.
        //console.log('SpeechRecognition.onaudioend');
    }

    recognition.onend = function (event) {
        //Fired when the speech recognition service has disconnected.
        if (reconitionEnabled) {
            recognition.start();
        }
        //console.log('SpeechRecognition.onend');
    }

    recognition.onnomatch = function (event) {
        //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
        //console.log('SpeechRecognition.onnomatch');
    }

    recognition.onsoundstart = function (event) {
        //Fired when any sound — recognisable speech or not — has been detected.
        //console.log('SpeechRecognition.onsoundstart');
    }

    recognition.onsoundend = function (event) {
        //Fired when any sound — recognisable speech or not — has stopped being detected.
        //console.log('SpeechRecognition.onsoundend');
    }

    recognition.onspeechstart = function (event) {
        //Fired when sound that is recognised by the speech recognition service as speech has been detected.
        //console.log('SpeechRecognition.onspeechstart');
    }
    recognition.onstart = function (event) {
        //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
        //console.log('SpeechRecognition.onstart');
    }
}

const stopRecognition = () => {
    reconitionEnabled = false;
    if (recognition !== undefined) {
        recognition.stop()
        recognition = null
    }
}


getToggle(function (toggle) {
    if (toggle) {
        startObserving();
    }
});




