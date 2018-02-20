debugger;

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'getSongInfo') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        var songName = document.querySelector("div#currently-playing-title");
		var artistName = document.querySelector("div#player-artist");
		if (songName) {
			sendResponse({songName: songName.innerText, artistName: artistName.innerText});
		}
    }
});