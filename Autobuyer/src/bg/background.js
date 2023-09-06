importScripts("../../js/ExtPay.js");

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

var extpay = ExtPay("restock-highligher-autobuyer");

// Crack user;
extpay.startBackground();
extpay.getUser().then(user => {
	chrome.storage.local.set({ EXT_P_S: true});
}).catch(error => {
	console.error(error);
})
	
// Attic Captcha Warning after 3 seconds;
setTimeout(() => {
	chrome.storage.local.get({WARNING_ACK: false, EXT_P_S: true}, data => {
		if(!data.WARNING_ACK && data.EXT_P_S){
			setATTIC_SHOULD_REFRESH(false);
			chrome.tabs.create({ url: "../../src/notes/warning.html" });
		}
	});
}, 3000)

// Open index page when the extension icon is clicked;
chrome.action.onClicked.addListener(() => {
	chrome.tabs.create({ url: "../../src/options/Autobuyer/autobuyer.html" });
});

chrome.runtime.onInstalled.addListener(function(e) {
	"install" == e.reason || e.reason
})

chrome.runtime.onMessage.addListener((function(e, t, o) {
	t.url.indexOf("neopets.com") < 0 || "NeoBuyer" === e.neobuyer && ("Notification" != e.type ? "OpenQuickstockPage" != e.type ? "Beep" != e.type ? console.error("Received message with unknown purpose:", JSON.stringify(e)) : chrome.storage.local.get({
		SHOULD_SOUND_ALERTS: !0
	}, (function(e) {
		e.SHOULD_SOUND_ALERTS
	})) : chrome.tabs.create({
		url: "https://www.neopets.com/quickstock.phtml?itemToQuickstock=" + e.itemName
	}, (e => setTimeout((function() {
		chrome.tabs.remove(e.id)
	}), 8e3))) : chrome.storage.local.get({
		SHOULD_SHOW_CHROME_NOTIFICATIONS: !0,
		SHOULD_SOUND_ALERTS: !0
	}, (function(t) {
		t.SHOULD_SHOW_CHROME_NOTIFICATIONS && chrome.notifications.create(e.notificationObject), t.SHOULD_SOUND_ALERTS && chrome.tts.speak(e.notificationObject.title, {
			rate: 1.15
		})
	})))
}))

chrome.webNavigation.onErrorOccurred.addListener((function(e) {
	chrome.storage.local.get({
		SHOULD_REFRESH_THROUGH_PAGE_LOAD_FAILURES: !0
	}, (function(t) {
		t.SHOULD_REFRESH_THROUGH_PAGE_LOAD_FAILURES && ("outermost_frame" !== e.frameType || "net::ERR_HTTP_RESPONSE_CODE_FAILURE" !== e.error || setTimeout((function() {
			chrome.tabs.reload(e.tabId, (function() {}))
		}), 1e4))
	}))
}), {
	url: [{
		urlMatches: "(.*neopets.com/halloween/garage.phtml)|(.*neopets.com/objects.phtml?(.)*type=shop(.)*)|(.*neopets.com/objects.phtml?(.)*obj_type=([0-9]+)(.)*)"
	}]
});


