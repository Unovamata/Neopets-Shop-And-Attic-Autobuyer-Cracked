var errorRefreshed = false;

function topLevelTurbo() {
    // Updates the page's title;
    function UpdateDocument(title, message) {
        // Update the document title to uppercase
        document.title = title.toUpperCase();

        message = `${message} - ${new Date().toLocaleString()}`;
        
        // Send a message to the Chrome runtime
        chrome.runtime.sendMessage({
            neobuyer: "NeoBuyer",
            type: "Notification",
            notificationObject: {
            type: "basic",
            title: title,
            message: message,
            iconUrl: "../../icons/icon48.png",
            },
        });
    }
    
    var currentGlobalTime = performance.now();

    // Handle page errors by refreshing;
    function HandleServerErrors() {
        chrome.storage.local.get({
            MIN_PAGE_LOAD_FAILURES: 10000,
            MAX_PAGE_LOAD_FAILURES: 20000
        }, (function(autobuyerVariables) {
            // Destructing the variables extracted from the extension;
            const {
                MIN_PAGE_LOAD_FAILURES: minPageReloadTime,
                MAX_PAGE_LOAD_FAILURES: maxPageReloadTime
            } = autobuyerVariables;

            const errorMessages = [
            "502 Bad Gateway",
            "504 Gateway Time-out",
            "Loading site please wait...",
            ];
        
            const pageText = document.body.innerText;
            
            // Page errors and captchas;
            if (errorMessages.some(message => pageText.includes(message))) {
                const indexOfMessage = errorMessages.findIndex(message => pageText.includes(message));

                // Captcha;
                if (indexOfMessage === 2) {
                    UpdateDocument("Captcha page detected", "Captcha page detected. Pausing.");
                    return;
                } else { // Refresh on page errors;
                    function executeOnceAndPreventReexecution() {
                        if (!errorRefreshed) {
                            errorRefreshed = true;
                            
                            location.reload();
                        }
                    }

                    setTimeout(executeOnceAndPreventReexecution, Math.random() * (maxPageReloadTime - minPageReloadTime) + minPageReloadTime);
                }
            }
            
            // Browser errors;
            else if(window.location.title == "www.neopets.com"){
                setTimeout(() => { location.reload(); }, Math.random() * (maxPageReloadTime - minPageReloadTime) + minPageReloadTime);
            }
        }));
    }
    
    // Check the Almost Abandoned Attic;
    function IsInAlmostAbandonedAttic() {
        // Check if the user is in the garage;
        if (!window.location.href.includes("neopets.com/halloween/garage")) return false;
        
        const hasAlmostAbandonedAttic = document.body.innerText.includes("Almost Abandoned Attic");
        const hasVisitorMessage = document.body.innerText.includes("I am very happy to have a visitor");
        const hasShopLimitMessage = document.body.innerText.includes("Sorry, but you cannot buy any more items from this shop today! Please come back again tomorrow so that others may have a fair chance.");
        const hasTryAgainLaterMessage = document.body.innerText.includes("Sorry, please try again later.");
        
        if (hasAlmostAbandonedAttic && hasVisitorMessage || hasShopLimitMessage || hasTryAgainLaterMessage) return true;
        else {
            HandleServerErrors();
            return false;
        }
    }
    
    function IsHaggling() {
        const isHagglePage = window.location.href.includes("neopets.com/haggle.phtml");
        const isHaggleForItem = document.body.innerText.includes("Haggle for");

        if (isHagglePage) {
            if (isHaggleForItem) return true;
            else {
            HandleServerErrors();
            return false;
            }
        }

        return false;
    }

    function IsInShop() {
        const isObjectsPage = window.location.href.includes("neopets.com/objects.phtml");
        const hasInflationText = document.body.innerText.includes("Neopian Inflation");

        if (isObjectsPage) {
            if (hasInflationText) {
            return true;
            } else {
            HandleServerErrors();
            return false;
            }
        }

        return false;
    }

    function IsInNeopianShop() {
        return IsHaggling() || IsInShop()
    }
    
    function IsInAtticOrShop() {
        return IsInAlmostAbandonedAttic() || IsInNeopianShop()
    }
    
    function InjectAutoPricer() {
        chrome.storage.local.get({
            BUY_UNKNOWN_ITEMS_PROFIT: 1e5,
            ITEM_DB_MIN_RARITY: 1,
            USE_BLACKLIST: !1,
            BLACKLIST: [],
            ENABLED: !0,
            USE_ITEM_DB: !0,
            ITEM_DB_MIN_PROFIT_NPS: 1e4,
            ITEM_DB_MIN_PROFIT_PERCENT: .5,
            HIGHLIGHT: !0,
            CLICK_ITEM: !0,
            CLICK_CONFIRM: !0,
            SHOULD_SHOW_BANNER: !0,
            MIN_REFRESH: 3500,
            MAX_REFRESH: 5e3,
            MIN_REFRESH_STOCKED: 37500,
            MAX_REFRESH_STOCKED: 45e3,
            ITEMS_TO_CONSIDER_STOCKED: 1,
            MIN_CLICK_ITEM_IMAGE: 500,
            MAX_CLICK_ITEM_IMAGE: 1e3,
            MIN_CLICK_CONFIRM: 100,
            MAX_CLICK_CONFIRM: 200,
            MIN_OCR_PAGE: 750,
            MAX_OCR_PAGE: 1100,
            EMAIL_TEMPLATE: "",
            EMAIL_USER_ID: "",
            EMAIL_SERVICE_ID: "",
            SHOULD_CLICK_NEOPET: !0,
            SHOULD_ANNOTATE_IMAGE: !0,
            SHOULD_ENTER_OFFER: !0,
            SHOULD_SEND_EMAIL: !1,
            SHOULD_GO_FOR_SECOND_MOST_VALUABLE: !1,
            STORES_TO_CYCLE_THROUGH_WHEN_STOCKED: [2, 58],
            RUN_BETWEEN_HOURS: [0, 23],
            RESTOCK_LIST: defaultDesiredItems,
            ATTIC_ENABLED: !0,
            ATTIC_HIGHLIGHT: !0,
            ATTIC_CLICK_ITEM: !0,
            ATTIC_ITEM_DB_MIN_PROFIT_NPS: 1e4,
            ATTIC_ITEM_DB_MIN_PROFIT_PERCENT: .5,
            ATTIC_MIN_BUY_TIME: 500,
            ATTIC_MAX_BUY_TIME: 750,
            ATTIC_RUN_BETWEEN_HOURS: [0, 23],
            ATTIC_MIN_REFRESH: 2500,
            ATTIC_MAX_REFRESH: 3500,
            ATTIC_SHOULD_REFRESH: !1,
            ATTIC_LAST_REFRESH_MS: -1,
            ATTIC_PREV_NUM_ITEMS: -1,
            SEND_TO_SDB_AFTER_PURCHASE: !1,
            PAUSE_AFTER_BUY_MS: 0,
            MIN_PAGE_LOAD_FAILURES: 10000,
            MAX_PAGE_LOAD_FAILURES: 20000
        }, (function(autobuyerVariables) {
            
            // Destructing the variables extracted from the extension;
            const {
                PAUSE_AFTER_BUY_MS: pauseAfterBuy,
                SEND_TO_SDB_AFTER_PURCHASE: isSendingToSBD,
                BUY_UNKNOWN_ITEMS_PROFIT: buyUnknownItemsIfProfitMargin,
                ITEM_DB_MIN_RARITY: minDBRarityToBuy,
                USE_BLACKLIST: isBlacklistActive,
                BLACKLIST: blacklistToNeverBuy,
                ENABLED: isAutoBuyerEnabled,
                USE_ITEM_DB: buyWithItemDB,
                ITEM_DB_MIN_PROFIT_NPS: minDBProfitToBuy,
                ITEM_DB_MIN_PROFIT_PERCENT: minDBProfitPercentToBuy,
                HIGHLIGHT: isHighlightingItemsInShops,
                CLICK_ITEM: isClickingItems,
                CLICK_CONFIRM: isClickingConfirm,
                SHOULD_SHOW_BANNER: isShowingBanner,
                SHOULD_CLICK_NEOPET: isClickingCaptcha,
                SHOULD_ANNOTATE_IMAGE: isAnnotatingImage,
                SHOULD_ENTER_OFFER: isEnteringOffer,
                SHOULD_SEND_EMAIL: isSendingEmail,
                SHOULD_GO_FOR_SECOND_MOST_VALUABLE: isBuyingSecondMostProfitable,
                STORES_TO_CYCLE_THROUGH_WHEN_STOCKED: storesToCycle,
                RUN_BETWEEN_HOURS: runBetweenHours,
                MIN_REFRESH: minRefreshIntervalUnstocked,
                MAX_REFRESH: maxRefreshIntervalUnstocked,
                ITEMS_TO_CONSIDER_STOCKED: minItemsToConsiderStocked,
                MIN_REFRESH_STOCKED: minRefreshIntervalStocked,
                MAX_REFRESH_STOCKED: maxRefreshIntervalStocked,
                MIN_CLICK_ITEM_IMAGE: minClickImageInterval,
                MAX_CLICK_ITEM_IMAGE: maxClickImageInterval,
                MIN_CLICK_CONFIRM: minClickConfirmInterval,
                MAX_CLICK_CONFIRM: maxClickConfirmInterval,
                MIN_OCR_PAGE: minOCRDetectionInterval,
                MAX_OCR_PAGE: maxOCRDetectionInterval,
                EMAIL_TEMPLATE: emailTemplate,
                EMAIL_USER_ID: emailUserID,
                EMAIL_SERVICE_ID: emailServiceID,
                RESTOCK_LIST: restockList,
                ATTIC_ENABLED: isAtticEnabled,
                ATTIC_HIGHLIGHT: isHighlightingItemsInAttic,
                ATTIC_CLICK_ITEM: isClickingItemsInAttic,
                ATTIC_ITEM_DB_MIN_PROFIT_NPS: minDBProfitToBuyInAttic,
                ATTIC_ITEM_DB_MIN_PROFIT_PERCENT: minDBProfitPercentToBuyInAttic,
                ATTIC_MIN_BUY_TIME: minAtticBuyTime,
                ATTIC_MAX_BUY_TIME: maxAtticBuyTime,
                ATTIC_RUN_BETWEEN_HOURS: atticRunBetweenHours,
                ATTIC_MIN_REFRESH: minRefreshIntervalAttic,
                ATTIC_MAX_REFRESH: maxRefreshIntervalAttic,
                ATTIC_SHOULD_REFRESH: isAtticAutoRefreshing,
                ATTIC_LAST_REFRESH_MS: atticLastRefresh,
                ATTIC_PREV_NUM_ITEMS: atticPreviousNumberOfItems,
            } = autobuyerVariables;
            
            var shopIntervals, 
                atticString = "Attic",
                bannerElementID = "qpkzsoynerzxsqw",
                minSoldOutRefresh = 50,
                maxSoldOutRefresh = 100,
                minInventoryRefreshInterval = 5000, // 5 seconds
                maxInventoryRefreshInterval = 5100, // 5.1 seconds
                minHagglingTimeout = minOCRDetectionInterval / 2,
                maxHagglingTimeout = maxOCRDetectionInterval / 2,
                isRunningOnScheduledTime = false,
                isBannerDisplaying = !1,
                confirmWindowInteral = 50;

            // Run the AutoBuyer
            RunAutoBuyer();
            
            function RunAutoBuyer() {
                if (IsHaggling()) {
                    if(!isAutoBuyerEnabled) return;
                    
                    DisplayAutoBuyerBanner();

                    if (IsSoldOut()) {
                        ProcessSoldOutItem();
                    } else if (IsItemAddedToInventory()) {
                        ProcessPurchase();
                    } else {
                        const pageText = document.documentElement.textContent ?? document.documentElement.innerText;

                        const itemName = document.querySelector("h2").innerText.replace("Haggle for ", "");
                        const seller = document.querySelector("h1").textContent;

                        // No NPs at hand;
                        if (pageText.includes("You don't have that kind of money")) {
                            // Updating data;
                            const message = "You do not have enough neopoints to purchase " + itemName + ". Program will pause now.";

                            UpdateBannerAndDocument("Not enough NPs", "Not enough NPs to purchase " + itemName + " from " + seller + ". Pausing.");
                            SaveToPurchaseHistory(itemName, seller, "-", "Not enough neopoints");

                            SendEmail({ status: "missed", item: itemName, notes: message });
                        } 
                        
                        // Five second rule;
                        else if (document.body.innerText.includes("every five seconds")) {
                            SaveToPurchaseHistory(itemName, seller, "-", "Five second rule");
                            UpdateBannerAndDocument("Five second rule", "Attempted to purchase an item within 5 seconds of a different purchase");

                            window.history.back();
                        } 
                        
                        // Inventory full;
                        else if (document.body.innerText.includes("Sorry, you can only carry a maximum of")) {
                            UpdateBannerAndDocument("Inventory full", "Inventory was full. Pausing.");
                        } 
                        
                        // Haggling;
                        else {
                            UpdateBannerStatus("Entering offer...");
                            
                            // Incorrect pet clicked;
                            if (pageText.includes("You must select the correct pet in order to continue")) {
                                console.error("Incorrect click on pet!");
                            }

                            // Perform haggling choosing between haggling algorithms;
                            if(isEnteringOffer){
                                // Haggling action;
                                var hagglingTimeout = Math.random() * (maxHagglingTimeout - minHagglingTimeout) + minHagglingTimeout;

                                setTimeout(PerformHaggling(), hagglingTimeout);

                                function PerformHaggling(){
                                    // The asked price message can change, that's why the complexity of this operation;
                                    var askedPrice = Number(new RegExp("[0-9|,]+ Neopoints").exec(document.getElementById("shopkeeper_makes_deal").innerText)[0].replace(" Neopoints", "").replaceAll(",", ""));

                                    // Choose between 2 haggling algorithms;
                                    function calculateRandomHagglingValue(baseValue) {
                                        return Math.random() > 0.33 ? calculateDynamicHagglingValue(baseValue) : calculateRoundedHagglingValue(baseValue);
                                    }
                                    
                                    // Rounds offers with a lowest value;
                                    function calculateDynamicHagglingValue(baseValue) {
                                        const lowerBound = 1 - (0.015 * Math.random() + 0.015);
                                        const upperBound = Math.round(lowerBound * baseValue);
                                        const maxUpperBound = Math.round(baseValue * (1 + 0.005 * Math.random()));
                                        let bestValue = upperBound;
                                    
                                        for (let current = upperBound; current <= maxUpperBound; current++) {
                                            if (Math.random() > Math.random() || (Math.random() === Math.random() && Math.random() < 0.33)) {
                                                bestValue = current;
                                            }
                                        }
                                    
                                        return bestValue;
                                    }
                                    
                                    // Rounds offers with zeroes;
                                    function calculateRoundedHagglingValue(baseValue) {
                                        const randomFactor = 100 * (Math.round(4 * Math.random()) + 1);
                                        let roundedValue = Math.round(baseValue / randomFactor) * randomFactor;
                                    
                                        if (baseValue <= 500) {
                                            roundedValue = 10 * Math.round(baseValue / 10);
                                        }
                                    
                                        return roundedValue;
                                    }

                                    // Inputting the haggle offer;
                                    document.querySelector(".haggleForm input[type=text]").value = calculateRandomHagglingValue(askedPrice);
                                }
                            }

                            var captchaElement, imageLoadingTime;

                            // Finding the darkest pixel in the captcha image
                            captchaElement = document.querySelector('input[type="image"]'), imageLoadingTime = performance.now(),

                            function(captchaElement, TriggerClickEventCaptcha) {
                                var captchaImage = new Image();
                                captchaImage.src = captchaElement;
                            
                                captchaImage.onload = function() {
                                    var canvas = document.createElement("canvas");
                                    canvas.width = captchaImage.width;
                                    canvas.height = captchaImage.height;
                                    var context = canvas.getContext("2d");
                                    context.drawImage(captchaImage, 0, 0);
                            
                                    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                                    var minLuminance = 100; // Minimum luminance threshold
                                    var darkestPixelIndex = 0;
                            
                                    for (var i = 0; i < imageData.data.length; i += 4) {
                                        /* First, we're taking the RBG values of the image and then converting them to HSV values,
                                         * The sum of these values represents darkest and brightest colors,
                                         * After that, we normalize the sum by dividing it to 510, making the values range from 0 to 1,
                                         * Lastly, we take the number closest to 0, where 1 is the brightest color and 0 the darkest 
                                         * colors respectively.
                                         */
                                        var luminance = (Math.max(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]) +
                                            Math.min(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2])) / 510;
                                        
                                        // Getting the darkest pixel;
                                        if (luminance < minLuminance) {
                                            minLuminance = luminance;
                                            darkestPixelIndex = i / 4; // Dividing by 4 because we're doing + 4 increments;
                                        }
                                    }
                                    
                                    // X & Y coordinates to trigger the click event;
                                    TriggerClickEventCaptcha(darkestPixelIndex % canvas.width, Math.floor(darkestPixelIndex / canvas.width));
                                };
                            }

                            // Sending events to the captcha image; IIFE function <-- + ^
                            (captchaElement.src, (function(o, r) {
                                var imageLoadStartTime = performance.now(),
                                adjustedDelay = Math.max(Math.round(Math.random() * (maxOCRDetectionInterval - minOCRDetectionInterval) + minOCRDetectionInterval - Math.max(imageLoadStartTime - currentGlobalTime, imageLoadStartTime - imageLoadingTime)), 0);

                                setTimeout((function() {
                                    var startCaptchaTime = performance.now();
                                    //var currentTime = performance.now();
                                    
                                    ManageCaptcha(o, r);

                                    function ManageCaptcha(left, highlighter) {
                                         // Cache the frequently used elements
                                        const element = captchaElement;
                                        const offset = CalculateCaptchaOffset(element);
                                        const highlightLeft = Math.round(left + offset.left);
                                        const highlightTop = Math.round(highlighter + offset.top);

                                        // Checking the offset of the captcha image;
                                        function CalculateCaptchaOffset(element) {
                                            let left = 0, top = 0;

                                            while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
                                            left += element.offsetLeft - element.scrollLeft;
                                            top += element.offsetTop - element.scrollTop;
                                            element = element.offsetParent;
                                            }

                                            return {
                                            top: top,
                                            left: left
                                            };
                                        }

                                        // Setting the click event for the captcha;
                                        const mouseClickEvent = new MouseEvent("click", {
                                            view: window,
                                            bubbles: true,
                                            cancelable: true,
                                            clientX: Math.round(highlightLeft),
                                            clientY: Math.round(highlightTop)
                                        });

                                        // If it's autoclicking the captcha, send the event and beep message
                                        if (isClickingCaptcha) {
                                            element.dispatchEvent(mouseClickEvent);
                                            SendBeepMessage();
                                        }

                                        // And add a small highlighter to the image to analyze;
                                        if (isAnnotatingImage) {
                                            // Create the highlighter element
                                            const highlighter = document.createElement("img");
                                            highlighter.src = chrome.runtime.getURL("icons/circle.svg");
                                            highlighter.style.height = "14px";
                                            highlighter.style.width = "14px";
                                            highlighter.style.position = "absolute";
                                            highlighter.style.top = Math.round(highlightTop - 7) + "px";
                                            highlighter.style.left = Math.round(highlightLeft - 7) + "px";
                                            highlighter.style.zIndex = "9999999999";
                                            highlighter.style.pointerEvents = "none";
                                            
                                            document.body.appendChild(highlighter);
                                        
                                            const styles = `
                                                input[type='image'] {
                                                filter: contrast(2) grayscale(1);
                                                }`;
                                            
                                            AddCSSStyle(styles);
                                        }
                                    }

                                    var endCaptchaTime = performance.now();
                                    console.log("Image load took " + Math.round(endCaptchaTime - startCaptchaTime) + " milliseconds.");
                                    //console.log("Load script to click image took " + Math.round(performance.now() - currentGlobalTime) + "ms [X: " + o + ", Y: " + r + "]. Image solve took " + Math.round(currentTime - imageLoadingTime) + "ms. Added " + adjustedDelay + "ms to meet minimum. Click then took " + Math.round(performance.now() - currentTime) + "ms.")
                                }), adjustedDelay)
                            }));
                        }
                    }
                } 
                
                // Check if the user is in a main shop;
                else if (IsInShop()) {
                    if(!isAutoBuyerEnabled) return;

                    DisplayAutoBuyerBanner()
                    
                    if (IsSoldOut()) ProcessSoldOutItem();

                    // Bought item;
                    else if (IsItemAddedToInventory()) ProcessPurchase();

                    // Auto Buying;
                    else {
                        var itemProfits = CalculateItemProfits(items.map((item) => item.name), items.map((item) => item.price));

                        if (isHighlightingItemsInShops) {
                            if (buyWithItemDB) {
                                var items = Array.from(document.querySelectorAll(".item-img")).map((item) => {
                                    var itemName = item.getAttribute("data-name");
                                    var itemPrice = parseInt(item.getAttribute("data-price").replaceAll(",", ""));
                                    return {
                                        name: itemName,
                                        price: itemPrice,
                                    };
                                });
                                
                                var bestItemName = BestItemName(items.map((item) => item.name), items.map((item) => item.price), itemProfits, minDBProfitToBuy, minDBProfitPercentToBuy);
                                var filteredItems = FilterItemsByProfitCriteria(items.map((item) => item.name), items.map((item) => item.price), itemProfits, minDBProfitToBuy, minDBProfitPercentToBuy);
                        
                                if (bestItemName) {
                                    for (var itemName of filteredItems) {
                                        document.querySelector(`.item-img[data-name="${itemName}"]`).parentElement.style.backgroundColor = "lightgreen";
                                    }
                                    document.querySelector(`.item-img[data-name="${bestItemName}"]`).parentElement.style.backgroundColor = "orangered";
                                }
                            } else {
                                var itemNames = new Set(Array.from(document.querySelectorAll(".item-img")).map((item) => item.getAttribute("data-name")));
                                var selectedName = restockList.find((itemName) => itemNames.has(itemName) && !IsItemInBlacklist(itemName));
                                var filteredNames = restockList.filter((itemName) => itemNames.has(itemName) && !IsItemInBlacklist(itemName));
                        
                                if (selectedName) {
                                    for (var itemName of filteredNames) {
                                        document.querySelector(`.item-img[data-name="${itemName}"]`).parentElement.style.backgroundColor = "lightgreen";
                                    }
                                    document.querySelector(`.item-img[data-name="${selectedName}"]`).parentElement.style.backgroundColor = "orangered";
                                }
                            }
                        }
                        
                        var itemToBuyExtracted = function() {
                            var selectedName;
                            var itemElements = Array.from(document.querySelectorAll(".item-img"));

                            if (buyWithItemDB) {
                                // From item images, get the name, and price of said items;
                                var itemData = itemElements.map(element => {
                                    return { name: element.getAttribute("data-name"), price: parseInt(element.getAttribute("data-price").replaceAll(",", "")) };
                                });

                                var bestItemIndices = [];
                                var maxProfit = -Infinity;

                                itemProfits = CalculateItemProfits(itemData.map(item => item.name), itemData.map(item => item.price));

                                for (var index = 0; index < itemData.length; index++) {
                                    var profit = itemProfits[index];
                                    var price = itemData[index].price;

                                    var isProfitable = profit > minDBProfitToBuy;
                                    var isProfitablePercent = profit / price > minDBProfitPercentToBuy;

                                    if (isProfitable && isProfitablePercent) {
                                        if (profit > maxProfit) {
                                            maxProfit = profit;
                                            bestItemIndices = [index];
                                        } else if (profit === maxProfit) {
                                            bestItemIndices.push(index);
                                        }
                                    }
                                }                            

                                // No best item to buy
                                if (bestItemIndices.length === 0) return;

                                if (bestItemIndices.length === 1) {
                                    selectedName = itemData[bestItemIndices[0]].name;
                                } else if (isBuyingSecondMostProfitable) {
                                    selectedName = itemData[bestItemIndices[1]].name;
                                    console.warn("Skipping the first most valuable item: " + itemData[bestItemIndices[0]].name);
                                } else {
                                    selectedName = itemData[bestItemIndices[0]].name;
                                }
                            } 
                            
                            //If the user is not using the 
                            else {
                                var itemElements = Array.from(document.querySelectorAll(".item-img")).map((element) => element.getAttribute("data-name"));

                                // Assuming restockList is an array with the desired order
                                filteredNames = restockList.filter((itemName) => itemElements.includes(itemName) && !IsItemInBlacklist(itemName));

                                // If there are items to buy, pick the first one
                                selectedName = filteredNames.length > 0 ? filteredNames[0] : null;

                                // If there's an item to buy and isBuyingSecondMostProfitable is true, check for the second best option
                                if (selectedName && isBuyingSecondMostProfitable && filteredItems.length > 1) {
                                    console.log("Going for the second best item");
                                    selectedName = filteredItems[1];
                                }
                            }
                            
                            selectedName ? (isClickingItems ? UpdateBannerAndDocument(`Buying ${selectedName}`, `Buying ${selectedName} from the main shop`) : UpdateBannerAndDocument(`${selectedName} is in stock`, `${selectedName} is in stock in the main shop`)) : null;
                            
                            return selectedName
                        }();
                        
                        itemToBuyExtracted ? function(e) {
                            if (isClickingItems) {
                                var t = document.querySelector(`.item-img[data-name="${e}"]`);
                                //console.log(t);
                                setTimeout((function() {
                                    t.click(), SendBeepMessage()
                                }), Math.random() * (maxClickImageInterval - minClickImageInterval) + minClickImageInterval)
                            }
                        }(itemToBuyExtracted) : ! function() {
                            var e = new Date,
                                t = e.getHours(),
                                n = e.getMinutes();
                            e.getDay();
                            return t >= runBetweenHours[0] && t <= runBetweenHours[1] && n >= 0 && n <= 60
                        }() ? (isRunningOnScheduledTime || (UpdateBannerAndDocument("Waiting", "Waiting for scheduled time in main shop"), isRunningOnScheduledTime = !0), setTimeout((function() {
                            RunAutoBuyer()
                        }), 3e4)) : ReloadPageBasedOnConditions(),
                        function() {
                            if (isClickingConfirm) {
                                var e = !1;
                                clearInterval(shopIntervals), shopIntervals = setInterval((function() {
                                    var t, n = document.getElementById("confirm-link");
                                    ((t = n)
                                        .offsetWidth || t.offsetHeight || t.getClientRects()
                                        .length) && setTimeout((function() {
                                        e || (n.click(), SendBeepMessage(), e = !0)
                                    }), Math.random() * (maxClickConfirmInterval - minClickConfirmInterval) + minClickConfirmInterval)
                                }), confirmWindowInteral)
                            }
                        }()
                    }

                
                //######################################################################################################################################


                // Almost Abandoned Attic;
                } else if(IsInAlmostAbandonedAttic()){
                    if(!isAtticEnabled) return;

                    DisplayAutoBuyerBanner();

                    function IsItemInInventory() {
                        const message = "I have placed it in your inventory";
                        return document.body.innerText.includes(message);
                    }

                    // Recently bought item;
                    if (IsItemInInventory()) {
                        var boughtItemElement = document.getElementsByTagName("strong")[0].innerText;

                        var email = {
                            status: "bought",
                            item: boughtItemElement,
                            notes: ""
                        };
                        
                        UpdateBannerAndDocument(boughtItemElement + " bought", boughtItemElement + " bought from Attic");
                        SaveToPurchaseHistory(boughtItemElement, atticString, "-", "Bought");

                        setTimeout(function() {
                            AutoRefreshAttic();
                        }, 120000);

                        HighlightItemsInAttic();

                        SendEmail(email);
                    } 
                    
                    // Purchase cooldown;
                    else if (document.body.innerText.includes("Didn't you just buy something?")) {
                        UpdateBannerAndDocument("Need to wait 20 minutes in Attic", "Pausing NeoBuyer in Attic for 20 minutes");
                        
                        setTimeout(function() {
                            window.location.href = "https://www.neopets.com/halloween/garage.phtml";
                        }, 120000);
                    }

                    // Pausing if the user is AAA banned;
                    else if (document.body.innerText.includes("Sorry, please try again later.")){
                        UpdateBannerAndDocument("Attic is refresh banned", "Pausing NeoBuyer in Attic");
                    } 
                    
                    // 5 item limit per day;
                    else if (document.body.innerText.includes("cannot buy any more items from this shop today")) {
                        UpdateBannerAndDocument("Five item limit reached in Attic", "Pausing NeoBuyer in Attic");
                    }
                    
                    // Buying items from the attick;
                    else {
                        AtticRestockUpdateChecker();

                        function AtticRestockUpdateChecker(){
                            if (atticPreviousNumberOfItems < 0) return;
                            if (atticLastRefresh < 0) return;
                            var ItemsStocked = GetStockedItemNumber();
                            var lastRestock = Date.now();
                        
                            if (ItemsStocked > atticPreviousNumberOfItems) {
                                chrome.storage.local.set({
                                    ATTIC_PREV_NUM_ITEMS: ItemsStocked,
                                    ATTIC_LAST_REFRESH_MS: lastRestock
                                }, function() {
                                    UpdateBannerAndDocument("Attic restocked", "Restock detected in Attic, updating last restock estimate.");
                                });
                            }
                        }
                        
                        // Sold out;
                        if (document.body.innerText.includes("Sorry, we just sold out of that.")) {
                            UpdateBannerAndDocument("Sold out", "Item was sold out at the Attic");
                        }
                        
                        // Selecting the best item to buy;
                        var bestItemName = HighlightItemsInAttic();

                        if (bestItemName) {
                            if (isClickingItemsInAttic) {
                                var randomBuyTime = Math.random() * (maxAtticBuyTime - minAtticBuyTime) + minAtticBuyTime;

                                UpdateBannerAndDocument(
                                    "Attempting " + bestItemName + " in Attic",
                                    "Attempting to buy " + bestItemName + " in Attic in " + FormatMillisecondsToSeconds(randomBuyTime)
                                );
                                
                                // Getting item data for submission;
                                var selectedLi = document.querySelector(`#items li[oname="${bestItemName}"]`);
                                var itemID = selectedLi.getAttribute("oii");
                                var itemPrice = selectedLi.getAttribute("oprice").replaceAll(",","");

                                SaveToPurchaseHistory(bestItemName, atticString, itemPrice, "Attempted");

                                setTimeout(function() {
                                    document.getElementById("oii").value = itemID;
                                    document.getElementById("frm-abandoned-attic").submit();
                                }, randomBuyTime);
                            }
                        } 
                        
                        // Wait for the scheduled time or run the AutoBuyer
                        else if (!isAtticAutoRefreshing || !IsTimeToAutoRefreshAttic()) {
                            if (!isRunningOnScheduledTime) {
                                UpdateBannerAndDocument("Waiting", "Waiting for scheduled time in Attic");
                                isRunningOnScheduledTime = true;
                            }

                            setTimeout(function() {
                                RunAutoBuyer();
                            }, 30000);
                        }

                        // Additional function to check if it's time to auto-refresh the Attic
                        function IsTimeToAutoRefreshAttic() {
                            var now = new Date();
                            var currentHour = now.getHours();
                            return currentHour >= atticRunBetweenHours[0] && currentHour <= atticRunBetweenHours[1];
                        }

                        // Update the stored number of items
                        var numItems = GetStockedItemNumber();
                        chrome.storage.local.set({ ATTIC_PREV_NUM_ITEMS: numItems }, function() {});
                    }
                }
            }

            function UpdateBannerAndDocument(e, n) {
                UpdateBannerStatus(e), UpdateDocument(e, n)
            }

            function AutoRefreshAttic() {
                if(!isAtticAutoRefreshing){
                    UpdateBannerStatus("Attic auto refresh is disabled. Waiting for manual refresh.");
                    return;
                }

                // Calculate the time to wait before the next refresh
                const waitTime = CreateWaitTime();
                
                function CreateWaitTime(){
                    if (atticLastRefresh < 0) {
                        return Math.random() * (maxRefreshIntervalAttic - minRefreshIntervalAttic) + minRefreshIntervalAttic;
                    }
                    
                    const now = Date.now();
                    const baseInterval = 420000; // 7 minutes
                    const shortInterval = 1000;
                    const longInterval = 8000;
                    let startShort = atticLastRefresh;
                    let startLong = atticLastRefresh;
        
                    for (; startShort < now && startLong < now;) {
                        startShort += baseInterval + shortInterval;
                        startLong += baseInterval + longInterval;
                    }
        
                    if (now <= startLong && now >= startShort) {
                        return Math.random() * (maxRefreshIntervalAttic - minRefreshIntervalAttic) + minRefreshIntervalAttic;
                    }
        
                    return startShort - now;
                }
        
                // Create a message with the wait time and last restock time
                let message = "Waiting " + FormatMillisecondsToSeconds(waitTime) + " to reload...";
        
                if (atticLastRefresh > 0) {
                    message += " Last restock: " + moment(atticLastRefresh)
                        .tz("America/Los_Angeles")
                        .format("h:mm:ss A") + " NST...";
                }
        
                // Update the banner status and initiate the page reload after the wait time
                UpdateBannerStatus(message);

                setTimeout(() => {
                    window.location.href = "https://www.neopets.com/halloween/garage.phtml";
                }, waitTime);
            }

            function SendBeepMessage() {
                chrome.runtime.sendMessage({
                    neobuyer: "NeoBuyer",
                    type: "Beep"
                })
            }

            function GetStockedItemNumber() {
                return Array.from(document.querySelectorAll("#items li"))
                    .map((e => e.getAttribute("oname")))
                    .length
            }

            function HighlightItemsInAttic() {
                if (isHighlightingItemsInAttic) {
                    var items = Array.from(document.querySelectorAll("#items li"));
                    var itemData = items.map((item) => {
                        var itemName = item.getAttribute("oname");
                        var itemPrice = item.getAttribute("oprice").replaceAll(",", "");
                        return {
                            name: itemName,
                            price: itemPrice,
                        };
                    });

                    var filteredItems = null, selectedName = null;

                    if (buyWithItemDB) {
                        var itemProfits = CalculateItemProfits(itemData.map(item => item.name), itemData.map(item => item.price));
                        selectedName = BestItemName(itemData.map(item => item.name), itemData.map(item => item.price), itemProfits, minDBProfitToBuyInAttic, minDBProfitPercentToBuyInAttic);
                        filteredItems = FilterItemsByProfitCriteria(itemData.map(item => item.name), itemData.map(item => item.price), itemProfits, minDBProfitToBuyInAttic, minDBProfitPercentToBuyInAttic);

                        if (selectedName) {
                            filteredItems.forEach((item) => HighlightItemWithColor(item, "lightgreen"));
                            HighlightItemWithColor(selectedName, "orangered");
                        }
                    } else {
                        // Filtering the items based on the restocking list;
                        filteredItems = restockList.filter((itemName) => {
                            return itemData.some((item) => item.name === itemName && !IsItemInBlacklist(itemName));
                        });

                        // If there are items to buy, pick the first one
                        selectedName = filteredItems.length > 0 ? filteredItems[0] : null;

                        // If there's an item to buy and isBuyingSecondMostProfitable is true, check for the second best option
                        if (selectedName && isBuyingSecondMostProfitable && filteredItems.length > 1) {
                            console.log("Going for the second best item");
                            selectedName = filteredItems[1];
                        }

                        if(selectedName){
                            filteredItems.forEach((item) => HighlightItemWithColor(item, "lightgreen"));
                            HighlightItemWithColor(selectedName, "orangered");
                        }
                    }

                    return selectedName;
                }
            }

            function HighlightItemWithColor(itemName, color) {
                const itemElement = document.querySelector(`#items li[oname="${itemName}"]`);
                itemElement.style.backgroundColor = color;
            }

            function ProcessPurchase() {
                var itemName = document.querySelector("h2").innerText.replaceAll("Haggle for ", "");
            
                SendEmail({
                    status: "bought",
                    item: itemName,
                    notes: ""
                });

                // Extract shop name
                var shopName = document.getElementsByTagName("h1")[0].textContent;
                var purchaseDetails = document.querySelector("p > b").textContent;
                var purchaseAmount = purchaseDetails.split("your offer of ")[1].split(" Neopoints!'")[0];
                
                UpdateBannerAndDocument(itemName + " bought", itemName + " bought from " + shopName + " for " + purchaseAmount + " NPs");
                
                SaveToPurchaseHistory(itemName, shopName, purchaseAmount, "Bought");

                ReloadPageBasedOnConditions();
            }

            function SendEmail(emailData) {
                if (isSendingEmail) {
                    window.emailjs.send(emailServiceID, emailTemplate, emailData, emailUserID).then(
                        function (response) {
                            console.log("Email sent!", response.status, response.text);
                        },
                        function (error) {
                            console.error("Failed to send email...", error);
                        }
                    );
                }
            }
            
            function FormatMillisecondsToSeconds(milliseconds) {
                return (milliseconds / 1e3).toFixed(2) + " secs"
            }

            function ReloadPageBasedOnConditions() {
                var currentStockedItems;

                if (IsSoldOut()) {
                    UpdateBannerStatus("Waiting " + FormatMillisecondsToSeconds(t = Math.random() * (maxSoldOutRefresh - minSoldOutRefresh) + minSoldOutRefresh) + " to reload page...");
                    
                    setTimeout(() => {
                        ClickToRefreshShop();
                    }, t);
                } else if (IsItemAddedToInventory()) {
                    UpdateBannerStatus("Waiting " + FormatMillisecondsToSeconds(t = Math.random() * (maxInventoryRefreshInterval - minInventoryRefreshInterval) + minInventoryRefreshInterval + pauseAfterBuy) + " to reload page...");
                    
                    setTimeout(() => {
                        ClickToRefreshShop();
                    }, t);

                } else {
                    // Calculate the number of stocked items
                    currentStockedItems = Array.from(document.querySelectorAll(".item-img")).length;
                    document.title = currentStockedItems + " stocked items";

                    if (currentStockedItems < minItemsToConsiderStocked) {
                        // Handle case when not enough items are stocked
                        UpdateBannerStatus("Waiting " + FormatMillisecondsToSeconds(t = Math.random() * (maxRefreshIntervalUnstocked - minRefreshIntervalUnstocked) + minRefreshIntervalUnstocked) + " to reload page...");
                        
                        setTimeout(() => {
                            location.reload();
                        }, t);
                    } else {
                        // Handle case when enough items are stocked
                        UpdateBannerStatus("Waiting " + FormatMillisecondsToSeconds(t = Math.random() * (maxRefreshIntervalStocked - minRefreshIntervalStocked) + minRefreshIntervalStocked) + " to reload page...");
                       
                        setTimeout(() => {
                            // Handle cycling through shops
                            if (storesToCycle.length === 0) {
                                location.reload();
                            } else if (storesToCycle.length === 1) {
                                window.location.href = "http://www.neopets.com/objects.phtml?type=shop&obj_type=" + storesToCycle[0];
                            } else {
                                var e = false;
                                storesToCycle.forEach((t, n) => {
                                    if (window.location.toString().match(/obj_type=(\d+)/)[1] == t) {
                                        var o = n === storesToCycle.length - 1 ? storesToCycle[0] : storesToCycle[n + 1];
                                        e = true;
                                        window.location.href = "http://www.neopets.com/objects.phtml?type=shop&obj_type=" + o;
                                    }
                                });
                                if (!e) {
                                    window.location.href = "http://www.neopets.com/objects.phtml?type=shop&obj_type=" + storesToCycle[0];
                                }
                            }
                        }, t);
                    }
                }
            }

            function SaveToPurchaseHistory(itemName, shopName, price, status) {
                chrome.storage.local.get({ ITEM_HISTORY: [] }, function (result) {
                    var itemHistory = result.ITEM_HISTORY;
                    
                    // Determine the current user's account
                    var accountName = "";

                    if(shopName === atticString){
                        accountName = document.querySelector(".user a:nth-of-type(1)").innerText
                    } else {
                        accountName = document.getElementsByClassName("nav-profile-dropdown-text")[0].innerText.split("Welcome, ")[1];
                    }
            
                    var newItem = {
                        "Item Name": itemName,
                        "Shop Name": shopName,
                        "Price": price,
                        "Status": status,
                        "Date & Time": new Date().toLocaleString(),
                        "Account": accountName
                    };
                    
                    //Saving the new history;
                    itemHistory.push(newItem);

                    chrome.storage.local.set({ ITEM_HISTORY: itemHistory }, function () {});
                });
            }

            function IsItemAddedToInventory() {
                return (document.documentElement.textContent || document.documentElement.innerText).includes("has been added to your inventory");
            }

            function ProcessSoldOutItem() {
                var e = document.querySelector("h2")
                    .innerText.replaceAll("Haggle for ", "");
                
                UpdateBannerAndDocument("Sold out", "Sold out of " + e);
                
                SaveToPurchaseHistory(e, document.getElementsByTagName("h1")[0].textContent, "-", "Sold out");
                
                ReloadPageBasedOnConditions()
            }

            function ClickToRefreshShop() {
                document.querySelector("div.shop-bg").click()
            }

            function IsSoldOut() {
                return (document.documentElement.textContent || document.documentElement.innerText).includes(" is SOLD OUT!");
            }

            function CalculateItemProfits(itemIDs, itemPrices) {
                const itemProfits = [];
            
                for (const itemID of itemIDs) {
                    if (!IsItemInRarityThresholdToBuy(itemID) || IsItemInBlacklist(itemID)) {
                        itemProfits.push(-99999999);
                    } else {
                        const itemData = item_db[itemID];
                        console.log(itemData["Price"]);

                        if (itemData["Rarity"] == undefined || itemData["Price"] == undefined) {
                            console.warn("Item not found in the database or price not available.");
                            itemProfits.push(buyUnknownItemsIfProfitMargin);
                        } else {
                            const itemPrice = itemData.Price;
                            const userPrice = parseInt(itemPrices[itemIDs.indexOf(itemID)]);
                            const profit = itemPrice - userPrice;
                            itemProfits.push(profit);
                        }
                    }
                }
            
                return itemProfits;
            }

            function BestItemName(itemNames, itemPrices, itemProfits, minDBProfitToBuy, minDBProfitPercent) {
                var bestItemName = null;
                var maxProfit = -1;
                var length = itemProfits.length;

                for (var i = 0; i < length; i++) {
                    var profit = itemProfits[i];

                    var meetsProfitCriteria = profit >= minDBProfitToBuy;
                    var meetsPercentCriteria = (profit / itemPrices[i]) >= minDBProfitPercent;
            
                    if (meetsProfitCriteria && meetsPercentCriteria && profit > maxProfit) {
                        maxProfit = profit;
                        bestItemName = itemNames[i];
                    }
                }
            
                return bestItemName;
            }
            
            function FilterItemsByProfitCriteria(itemNames, itemPrices, itemProfits, minDBProfit, minDBProfitPercent) {
                var filteredItems = [];
                
                for (var i = 0; i < itemProfits.length; i++) {
                    var meetsProfitCriteria = itemProfits[i] > minDBProfit;
                    var meetsPercentCriteria = (itemProfits[i] / itemPrices[i]) > minDBProfitPercent;

                    if (meetsProfitCriteria && meetsPercentCriteria) {
                        filteredItems.push(itemNames[i]);
                    }
                }

                return filteredItems;
            }

            function IsItemInBlacklist(itemName) {
                return isBlacklistActive && blacklistToNeverBuy.includes(itemName);
            }

            function IsItemInRarityThresholdToBuy(e) {
                const item = item_db[e];

                if (!item) {
                    return true;
                }
                
                const itemRarity = parseInt(item.Rarity);
                return !itemRarity || itemRarity >= minDBRarityToBuy;
            }

            function UpdateElementStyle() {
                const isAlmostAbandonedAttic = IsInAlmostAbandonedAttic();
                const topPosition = isAlmostAbandonedAttic ? "0" : "68px";
                
                const style = `
                    color: white;
                    width: 100%;
                    position: fixed;
                    height: 35px;
                    top: ${topPosition};
                    left: 0;
                    z-index: 11;
                    pointer-events: none;
                    text-align: center;
                    line-height: 35px;
                    font-size: 15px;
                    font-family: Verdana, Arial, Helvetica, sans-serif;
                    background-color: rgba(0, 0, 0, .8);
                    font-weight: bold;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                `;

                AddCSSStyle("#" + bannerElementID + " {" + style + "}");
            }

            function DisplayAutoBuyerBanner() {
                if (isShowingBanner && !isBannerDisplaying) {
                    isBannerDisplaying = true;

                    // Creating the banner element;
                    const bannerElement = document.createElement("div");
                    bannerElement.innerText = "Autobuyer Running";
                    bannerElement.id = bannerElementID;

                    document.body.appendChild(bannerElement);
                    UpdateElementStyle();
                }
            }

            function UpdateBannerStatus(runningStatus) {
                if (isBannerDisplaying) {
                    const bannerElement = document.getElementById(bannerElementID);
                    
                    if (bannerElement) {
                        // Update the banner text with the running status
                        bannerElement.innerText = "Autobuyer Running: " + runningStatus;
                    }
                }
            }

            function AddCSSStyle(e) {
                const t = document.createElement("style");
                t.textContent = e, document.head.append(t)
            }

            function We(e, t, n) {
                e /= 255, t /= 255, n /= 255;
                var o, r, i = Math.max(e, t, n),
                    a = Math.min(e, t, n),
                    c = (i + a) / 2;
                if (i == a) o = r = 0;
                else {
                    var u = i - a;
                    switch (r = c > .5 ? u / (2 - i - a) : u / (i + a), i) {
                        case e:
                            o = (t - n) / u + (t < n ? 6 : 0);
                            break;
                        case t:
                            o = (n - e) / u + 2;
                            break;
                        case n:
                            o = (e - t) / u + 4
                    }
                    o /= 6
                }
                return {
                    h: o,
                    s: r,
                    l: c
                }
            }
        }));
    }

    var IntervalID = null;

    function SetAutoBuyer() {
        if (IsInAtticOrShop()) {
            InjectAutoPricer();
            clearInterval(IntervalID); // Stop the interval when triggered
        }
    }

    (function () {
        // Your code here, such as SetAutoBuyer and the interval
        IntervalID = setInterval(SetAutoBuyer, 20);
    })();
}

topLevelTurbo();