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

	if(e.reason == "install") {
		const autoPricerDefaultSettings = {
			// AutoBuyer;
			MIN_FIVE_SECOND_RULE_REFRESH: 5000,
			MAX_FIVE_SECOND_RULE_REFRESH: 10000,
			SHOULD_BYPASS_CONFIRM: false,
			SHOULD_ONLY_REFRESH_ON_CLEAR: false,
			SHOULD_CHANGE_DOCUMENT_DATA: false,

			// AutoPricer;
			IS_TURBO: false,
			SHOULD_USE_NEON: false,
			PRICING_TYPE: "Percentage",
			SHOULD_USE_RANDOM_PERCENTAGES_FOR_PRICING: false,
			PERCENTAGE_PRICING_ALGORITHM_TYPE: "Zeroes",
			FIXED_PRICING_PERCENTAGE: 15,
			MIN_PRICING_PERCENTAGE: 10,
			MAX_PRICING_PERCENTAGE: 20,
			FIXED_PRICING_ALGORITHM_TYPE: "Fixed",
			FIXED_PRICING_VALUE: 1000,
			MIN_FIXED_PRICING: 200,
			MAX_FIXED_PRICING: 800,

			// AutoKQ;
			START_AUTOKQ_PROCESS: false,
			AUTOKQ_STATUS: "Inactive",
			KQ_INVENTORY: [],
			SUBMIT_AUTOKQ_PROCESS: false,
			MAX_INSTA_BUY_PRICE: 0, 
			MAX_SPENDABLE_PRICE: 60000,
    		USE_BLACKLIST_KQ: false,
    		BLACKLIST_KQ: ["Yellow Negg", "Purple Negg", "Green Negg", "Partitioned Negg", "Super Icy Negg"],

			// [Level, Hit Points, Strength, Defence, Agility, Items, Neopoints];
			KQ_TRACKER: [],
		
			// Shop Wizard;
			MIN_WAIT_BAN_TIME: 300000,
			MAX_WAIT_BAN_TIME: 900000,
			MIN_WAIT_PER_REFRESH: 10000,
			MAX_WAIT_PER_REFRESH: 20000,
			RESUBMIT_TYPE: "Absolute",
			MIN_RESUBMITS_PER_ITEM: 2,
			MAX_RESUBMITS_PER_ITEM: 5,
			RESUBMITS_PER_ITEM: 5,
			MIN_WAIT_PER_ACTION: 10000,
			MAX_WAIT_PER_ACTION: 20000,
			MIN_RESUBMIT_WAIT_TIME: 10000,
			MAX_RESUBMIT_WAIT_TIME: 40000,
			MIN_NEW_SEARCH_WAIT_TIME: 10000,
			MAX_NEW_SEARCH_WAIT_TIME: 30000,
			USE_BLACKLIST_SW: false,
			BLACKLIST_SW: ['Forgotten Shore Map Piece', 'Petpet Laboratory Map', 'Piece of a treasure map', 'Piece of a treasure map', 'Secret Laboratory Map', 'Space Map', 'Spooky Treasure Map', 'Underwater Map Piece'],
			
			// Shop Stock Page Settings;
			SHOULD_SUBMIT_AUTOMATICALLY: false,
			MIN_SHOP_NAVIGATION_COOLDOWN: 20000,
			MAX_SHOP_NAVIGATION_COOLDOWN: 40000,
			MIN_WAIT_AFTER_PRICING_ITEM: 10000,
			MAX_WAIT_AFTER_PRICING_ITEM: 20000,
			MIN_SHOP_SEARCH_FOR_INPUT_BOX: 5000,
			MAX_SHOP_SEARCH_FOR_INPUT_BOX: 10000,
			MIN_SHOP_CLICK_UPDATE: 10000,
			MAX_SHOP_CLICK_UPDATE: 20000,
			MIN_TYPING_SPEED: 200,
			MAX_TYPING_SPEED: 500,
			SHOULD_ENTER_PIN: true,
			NEOPETS_SECURITY_PIN: "0000",
			MIN_WAIT_BEFORE_UPDATE: 10000,
			MAX_WAIT_BEFORE_UPDATE: 20000,

			//Miscellaneous;
			AUTOPRICER_STATUS: "Inactive",
			SHOP_INVENTORY: [],
			MIN_PAGE_LOAD_FAILURES: 10000,
			MAX_PAGE_LOAD_FAILURES: 20000,

			// Save and load;
			SHOULD_SHARE_STORES_TO_VISIT: false,
			SHOULD_SHARE_RESTOCK_LIST: false,
			SHOULD_SHARE_SHOP_STOCK: false,
			SHOULD_SHARE_BLACKLISTS: false,
			SHOULD_SHARE_PIN: false,
			SHOULD_SHARE_ATTIC_LAST_REFRESH: false,
			SHOULD_SHARE_HISTORY: false,
			SHOULD_SHARE_NEOBUYER_MAILS: false,

			// NeoBuyer+ Mail;
			EMAIL_LIST: [],
			IS_NEW_MAIL_INBOX: false,
			SKIP_CURRENT_MAIL: false,
			CURRENT_MAIL_INDEX: -1,
			RETRIEVED_NEWEST_EMAIL: false,
		};

		chrome.storage.local.set(autoPricerDefaultSettings, function (){});
	}
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