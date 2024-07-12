importScripts("../../js/ExtPay.js");

chrome.runtime.onInstalled.addListener(function(e) {
	"install" == e.reason || e.reason

	if(e.reason == "install") {
		const autoPricerDefaultSettings = {
			// Toolbar;
			UPDATE_STATUS_A: false,
			UPDATE_DATE: "",
			UPDATE_VERSION: "",
			IS_UP_TO_DATE: false,
			LATEST_DOWNLOAD_LINK: "",

			// AutoBuyer;
			RUN_AUTOBUYER_FROM_MS: 1712473200000,
			RUN_AUTOBUYER_TO_MS: 1712559599000,
			IS_DEFAULT_SHOP_TIME: true,
			MIN_FIVE_SECOND_RULE_REFRESH: 5000,
			MAX_FIVE_SECOND_RULE_REFRESH: 10000,
			SHOULD_BYPASS_CONFIRM: false,
			SHOULD_ONLY_REFRESH_ON_CLEAR: false,
			SHOULD_USE_CUSTOM_HAGGLE_MULTIPLIERS: false,
			MIN_HAGGLE_POWER: 0.75,
			MAX_HAGGLE_POWER: 0.85,
			SHOULD_MULTICLICK_CAPTCHA: false,
			SHOULD_CHANGE_DOCUMENT_DATA: false,
			PAUSE_AFTER_BUY_MS: 18000,

			//AutoAttic;
			ATTIC_HAS_REFRESHED: false,
			ATTIC_SHOULD_REFRESH: false,
			RUN_AUTOATTIC_FROM_MS: 1712473200000,
			RUN_AUTOATTIC_TO_MS: 1712559599000,
			IS_DEFAULT_ATTIC_TIME: true,
			ATTIC_RESTOCK_LIST: [],
			ATTIC_NEXT_START_WINDOW: 0,
        	ATTIC_NEXT_END_WINDOW: 0,

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
			SHOULD_CHECK_IF_FROZEN_SHOP: false,
			SHOP_HISTORY: [],
			SHOULD_IMPORT_SALES: false,

			// AutoKQ;
			START_AUTOKQ_PROCESS: false,
			AUTOKQ_STATUS: "Inactive",
			KQ_INVENTORY: [],
			SUBMIT_AUTOKQ_PROCESS: false,
			MAX_INSTA_BUY_PRICE: 0, 
			MAX_SPENDABLE_PRICE: 60000,
    		USE_BLACKLIST_KQ: false,
    		BLACKLIST_KQ: ["Yellow Negg", "Purple Negg", "Green Negg", "Partitioned Negg", "Super Icy Negg"],
			SHOULD_DELETE_SHOP_LAYOUTS: false,

			// [Level, Hit Points, Strength, Defence, Agility, Items, Neopoints];
			KQ_TRACKER: [0, 0, 0, 0, 0, 0, 0],
		
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
			SHOULD_SHARE_SALES_HISTORY: false,
			SHOULD_SHARE_BLACKLISTS: false,
			SHOULD_SHARE_PIN: false,
			SHOULD_SHARE_ATTIC_LAST_REFRESH: false,
			SHOULD_SHARE_HISTORY: false,
			SHOULD_SHARE_AUTOKQ_LOG: false,
			SHOULD_SHARE_NEOBUYER_MAILS: false,

			// NeoBuyer+ Mail;
			EMAIL_LIST: [],
			IS_NEW_MAIL_INBOX: false,
			SKIP_CURRENT_MAIL: false,
			CURRENT_MAIL_INDEX: -1,
			RETRIEVED_NEWEST_EMAIL: false,

			// The Void Within;
			TAB_ID: null,
			OWNED_PETS: [],
			VOLUNTEER_PETS: [],
			VOLUNTEER_TIME: [],
			TVW_STATUS: "Inactive",
			IS_LOADING_PETS: false,
			IS_RUNNING_TVW_PROCESS: false,
			MIN_TVW_VISIT: 120000,
			MAX_TVW_VISIT: 300000,
		};

		chrome.storage.local.set(autoPricerDefaultSettings, function (){});
	}
})

chrome.runtime.onStartup.addListener(() => {
    CheckVersionWhenBackgroundActive();
});

function setVARIABLE(propertyName, value) {
	var storageObject = {};
	storageObject[propertyName] = value;
	chrome.storage.local.set(storageObject, function () {});
}

function getVARIABLE(variable) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([variable], function (result) {
            var value = result[variable];

            resolve(value);
        });
    });
}

async function CheckVersionWhenBackgroundActive(){
    chrome.storage.local.set({ "UPDATE_DATE": "" });
	chrome.storage.local.set({ "UPDATE_VERSION": "" });

    // If the version checker has not been run, check the latest version of the extension;
    var currentVersion = chrome.runtime.getManifest().version;
    var apiUrl = "https://api.github.com/repos/Unovamata/AutoBuyerPlus/releases/latest";
    var githubLatestVersion = await FetchLatestGitHubVersion(apiUrl);
    var parsedVersion = githubLatestVersion.replace("v", "");
	setVARIABLE("UPDATE_VERSION", parsedVersion);
    var isLatestVersion = parsedVersion == currentVersion;

    switch(parsedVersion){
        // Github's API can't be reached or user is using a VPN;
        case 'a':
			var fetchedVersion = await FetchLatestGithubTag();

			isLatestVersion = fetchedVersion == currentVersion;

			// The version could not be parsed at all;
			if(fetchedVersion != "a") setVARIABLE("UPDATE_VERSION", fetchedVersion);
			setVARIABLE("UPDATE_STATUS_A", isLatestVersion);    
        break;

        // Unknown error;
        case 'b':
            setVARIABLE("UPDATE_STATUS_A", false);
        break;

        // Normal version checking;
        default:
			setVARIABLE("UPDATE_STATUS_A", isLatestVersion);
        break;
    }

    if(isLatestVersion) ChangeIcon("../../icons/icon128.png");
    else ChangeIcon("../../icons/redicon128.png");

    async function FetchLatestGitHubVersion(apiUrl) {
        try {
            // Checking the Github API for the latest extension version;
            const response = await fetch(apiUrl);

            if (!response.ok) {
                return 'a'; // API can't be reached;
            }

            // Parsing the data and returning it;
            const data = await response.json();

            const githubLatestVersion = data.tag_name,
				  githubLatestFiles = data.assets[0].browser_download_url;

			setVARIABLE("LATEST_DOWNLOAD_LINK", githubLatestFiles);  

            return githubLatestVersion;
        } catch (error) {
			ErrorMessage(error);

            return 'b'; // Error in the execution;
        }
    }

	function ErrorMessage(error){
		var errorMessage = "";

		var propertyNames = Object.getOwnPropertyNames(error);

		propertyNames.forEach(function(property) {
			var descriptor = Object.getOwnPropertyDescriptor(error, property);

			errorMessage += property + ":" + error[property] + ":" + PropsToStr(descriptor);
		});

		setVARIABLE("ERROR_STATUS", errorMessage);  
		setVARIABLE("LATEST_DOWNLOAD_LINK", "");  

		function PropsToStr(obj) {
			var str = '';

			for (prop in obj) {
				str += prop + "=" + obj[prop] + ",";
			}

			return str;
		}
	}

	async function FetchLatestGithubTag() {
		try {
			const response = await fetch('https://github.com/Unovamata/AutoBuyerPlus/tags');
			if (!response.ok) {
				return 'a'; // API can't be reached;
			}
	
			const html = await response.text();
	
			const classString = 'Link--primary Link">',
				startPosition = html.indexOf(classString);
			
			if (startPosition === -1) {
				return 'a'; // API can't be reached;
			}

			var processedVersion = html.substring(startPosition + classString.length);
			processedVersion = processedVersion.split("v")[0];
	
			return processedVersion;
		} catch (error) {
			throw error;
		}
	}

    // Function to change the icon
    function ChangeIcon(iconPath) {
        chrome.action.setIcon({ path: iconPath });
    }
}

CheckVersionWhenBackgroundActive();


var extpay = ExtPay("restock-highligher-autobuyer");

// Crack user;
extpay.startBackground();
	
// Attic Captcha Warning after 3 seconds;
setTimeout(() => {
	chrome.storage.local.get({WARNING_ACK: false, EXT_P_S: true}, data => {
		if(!data.WARNING_ACK && data.EXT_P_S){
			var storageObject = {};
			storageObject["ATTIC_SHOULD_REFRESH"] = false;
			chrome.storage.local.set(storageObject, function () {});

			chrome.tabs.create({ url: "../../src/options/Warning/warning.html" });
		}
	});
}, 1000)

// Open index page when the extension icon is clicked;
chrome.action.onClicked.addListener(() => {
	chrome.tabs.create({ url: "../../src/options/Autobuyer/autobuyer.html" });
});

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "outdatedVersion") {
        // Open a new window when message with action "openWindow" is received
        chrome.tabs.create({ url: "../src/options/Autobuyer/autobuyer.html" });
    }
});

// The Void Within
CheckCurrentVolunteerTime();

// CheckCurrentVolunteerTime(); Checks if the Volunteer Shift windows have passed;
async function CheckCurrentVolunteerTime(){
	var volunteerTime = await getVARIABLE("VOLUNTEER_TIME"),
		currentTime = Date.now(),
		passedWindows = [];

	if(volunteerTime == undefined){
		setVARIABLE("VOLUNTEER_TIME", []),
		volunteerTime = [];	
	} 

	// Checks the volunteer times and adds them for confirmation;
	volunteerTime.forEach(function(window){
		if(currentTime >= window){
			passedWindows.push(window);
		}
	});

	var tabId = await getVARIABLE("TAB_ID"),
		isRunningTVWProcess = await getVARIABLE("IS_RUNNING_TVW_PROCESS"),
		isShiftComplete = isRunningTVWProcess && tabId == null && passedWindows.length > 0 && volunteerTime != [];

	// Creates a tab, saves its data, and removes the old shift data;
	if(isShiftComplete){
		chrome.tabs.create({ url: 'https://www.neopets.com/hospital/volunteer.phtml' }, function(tab) {
			setVARIABLE("TAB_ID", tab.id);
			setVARIABLE("VOLUNTEER_TIME", volunteerTime.filter(time => !passedWindows.includes(time)));
		});
	}
}

// Check the shift times every 10 seconds;
setInterval(CheckCurrentVolunteerTime, 10000);

// Close the tab once the process has finished its duties;
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    if (message.action === 'closeTab') {
        try {
            var tabId = await getVARIABLE("TAB_ID");
            
            chrome.tabs.remove(tabId, function() {
                sendResponse({ result: 'success' });
				setVARIABLE("TAB_ID", null);
            });
        } catch (error) {
            sendResponse({ result: 'error', message: error.message });
        }
    }
});