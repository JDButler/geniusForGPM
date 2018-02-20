// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

base_url = 'http://api.genius.com';
TOKEN = 'ynNur_kehS736JRQKOuR-39e6Cz-PCDMN5bBDbl8lV-JGY7sBOVZa_JR1vObatLO';
KEY = 'WC4gW1Waqf4s81EuYE76TSpCsMXbhe0TspQScXgL99Oho8VL8GsW8IbLoMKSvg3DvE1qoGoGU0dA7d-Gj-N3Ng';

// Update the declarative rules on install or upgrade.
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        // When a page contains a <video> tag...
        new chrome.declarativeContent.PageStateMatcher({
			pageUrl: { 
				hostEquals: 'play.google.com',
				pathContains: '/music/listen',
				schemes: ['https'] 
		   },
        })
      ],
      // ... show the page action.
      actions: [new chrome.declarativeContent.ShowPageAction() ]
    }]);
  });
});

// A function to use as callback
function extractSongInfo(messageResponse) {
	
	// remove feature tags from title
	if (messageResponse.songName.indexOf('(feat') > -1) {
		messageResponse.songName = messageResponse.songName.split('(feat')[0];
	}
	geniusAPIRequest(messageResponse.songName, messageResponse.artistName);
}

chrome.pageAction.onClicked.addListener(function (tab) {
	console.log('pageAction click listener works!');
    // ...if it matches, send a message specifying a callback too
		chrome.tabs.sendMessage(tab.id, {text: 'getSongInfo'}, extractSongInfo);
    }
);

function geniusAPIRequest(songName, artistName) {
	search_url = base_url + '/search' + '?access_token=' + TOKEN + '&q=' + songName + ' ' + artistName;
	var httpRequest = new XMLHttpRequest();
	
	// Processes the server response
	httpRequest.onreadystatechange = function() {
		if (httpRequest.readyState == XMLHttpRequest.DONE) {
			// Response was received
			if (httpRequest.status === 200) {
				response = JSON.parse(httpRequest.responseText);
				let hits = response.response.hits;
				if (hits.length > 0) {
					// check for artist match
					if (hits[0].result.primary_artist.name == artistName) {
						window.open(hits[0].result.url, '_blank');
					}
				}
			} else {
				alert('There was a problem with the request.');
			}
		}
	}
	
	// Makes the HTTP request
	httpRequest.open('GET', search_url, true);
	httpRequest.send();
}

