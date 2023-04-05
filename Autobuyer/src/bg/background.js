importScripts("../../js/ExtPay.js");

var extpay = ExtPay("restock-highligher-autobuyer");

function setATTIC_SHOULD_REFRESH(e) {
    chrome.storage.local.set({
        ATTIC_SHOULD_REFRESH: e
    }, function() {})
}
function getRandomToken() {
    var e = new Uint8Array(32);
    crypto.getRandomValues(e);
    for (var t = "", o = 0; o < e.length; ++o) t += e[o].toString(16);
    return t
}

// Crack user;
extpay.startBackground();
extpay.getUser()
	.then(user => {
		chrome.storage.local.set({ EXT_P_S: true});
	}).catch(error => {
		console.error(error);
	})
	
// Attic Captcha Warning after 3 seconds;
setTimeout(() => {
	chrome.storage.local.get({WARNING_ACK: false, EXT_P_S: false}, data => {
		if(!data.WARNING_ACK && data.EXT_P_S){
			setATTIC_SHOULD_REFRESH(false);
			chrome.tabs.create({ url: "../../src/notes/warning.html" });
		}
	});
}, 3000)

// Open index page when the extension icon is clicked;
chrome.action.onClicked.addListener(() => {
	chrome.tabs.create({ url: "../../src/options/index.html" });
});

chrome.runtime.onInstalled.addListener(function(e) {
	"install" == e.reason || e.reason
});