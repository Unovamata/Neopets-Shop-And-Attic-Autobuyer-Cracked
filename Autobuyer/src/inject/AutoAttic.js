HandleServerErrors();

function topLevelTurbo() {
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
            MIN_FIVE_SECOND_RULE_REFRESH: 5000,
            MAX_FIVE_SECOND_RULE_REFRESH: 10000,
            SHOULD_ONLY_REFRESH_ON_CLEAR: false,
            ITEMS_TO_CONSIDER_STOCKED: 1,
            MIN_CLICK_ITEM_IMAGE: 500,
            MAX_CLICK_ITEM_IMAGE: 1e3,
            MIN_CLICK_CONFIRM: 100,
            MAX_CLICK_CONFIRM: 200,
            MIN_OCR_PAGE: 750,
            MAX_OCR_PAGE: 1100,
            SHOULD_CLICK_NEOPET: !0,
            SHOULD_ANNOTATE_IMAGE: !0,
            SHOULD_ENTER_OFFER: !0,
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
                SHOULD_GO_FOR_SECOND_MOST_VALUABLE: isBuyingSecondMostProfitable,
                STORES_TO_CYCLE_THROUGH_WHEN_STOCKED: storesToCycle,
                RUN_BETWEEN_HOURS: runBetweenHours,
                MIN_REFRESH: minRefreshIntervalUnstocked,
                MAX_REFRESH: maxRefreshIntervalUnstocked,
                ITEMS_TO_CONSIDER_STOCKED: minItemsToConsiderStocked,
                MIN_REFRESH_STOCKED: minRefreshIntervalStocked,
                MAX_REFRESH_STOCKED: maxRefreshIntervalStocked,
                MIN_FIVE_SECOND_RULE_REFRESH: minFiveSecondRuleRefresh,
                MAX_FIVE_SECOND_RULE_REFRESH: maxFiveSecondRuleRefresh,
                SHOULD_ONLY_REFRESH_ON_CLEAR: shouldOnlyRefreshOnClear,
                MIN_CLICK_ITEM_IMAGE: minClickImageInterval,
                MAX_CLICK_ITEM_IMAGE: maxClickImageInterval,
                MIN_CLICK_CONFIRM: minClickConfirmInterval,
                MAX_CLICK_CONFIRM: maxClickConfirmInterval,
                MIN_OCR_PAGE: minOCRDetectionInterval,
                MAX_OCR_PAGE: maxOCRDetectionInterval,
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
            
            var atticString = "Attic",
                isRunningOnScheduledTime = false;

            // Run the AutoBuyer
            if(!isAtticEnabled) RunAutoAttic();

            function RunAutoAttic() {
                DisplayAutoBuyerBanner();

                function UpdateBannerAndDocument(title, message) {
                    UpdateBannerStatus(title), UpdateDocument(title, message, true);
                }

                // Recently bought item;
                if (PageIncludes("I have placed it in your inventory")) {
                    var boughtItemElement = document.getElementsByTagName("strong")[0].innerText;
                    
                    UpdateBannerAndDocument(boughtItemElement + " bought", boughtItemElement + " bought from Attic");
                    SaveToPurchaseHistory(boughtItemElement, atticString, "-", "Bought");

                    setTimeout(function() {
                        AutoRefreshAttic();
                    }, 120000);

                    HighlightItemsInAttic();
                } 
                
                // Purchase cooldown;
                else if (PageIncludes("Didn't you just buy something?")) {
                    UpdateBannerAndDocument("Need to wait 20 minutes in Attic", "Pausing NeoBuyer in Attic for 20 minutes");
                    
                    setTimeout(function() {
                        window.location.href = "https://www.neopets.com/halloween/garage.phtml";
                    }, 120000);
                }

                // Pausing if the user is AAA banned;
                else if (PageIncludes("Sorry, please try again later.")){
                    UpdateBannerAndDocument("Attic is refresh banned", "Pausing NeoBuyer+ in Attic");
                } 
                
                // 5 item limit per day;
                else if (PageIncludes("cannot buy any more items from this shop today")) {
                    UpdateBannerAndDocument("Five item limit reached in Attic", "Pausing NeoBuyer+ in Attic");
                }
                
                // Buying items from the attick;
                else {
                    if (atticPreviousNumberOfItems < 0) return;
                    if (atticLastRefresh < 0) return;
                    var ItemsStocked = GetAtticStockedItemNumber();
                    var lastRestock = Date.now();

                    if (ItemsStocked > atticPreviousNumberOfItems) {
                        chrome.storage.local.set({
                            ATTIC_PREV_NUM_ITEMS: ItemsStocked,
                            ATTIC_LAST_REFRESH_MS: lastRestock
                        }, function() {
                            UpdateBannerAndDocument("Attic restocked", "Restock detected in Attic, updating last restock estimate.");
                        });
                    }
                    
                    // Sold out;
                    if (PageIncludes("Sorry, we just sold out of that.")) {
                        UpdateBannerAndDocument("Sold out", "Item was sold out at the Attic");
                    }
                    
                    // Selecting the best item to buy;
                    var bestItemName = HighlightItemsInAttic();

                    if (bestItemName) {
                        if (isClickingItemsInAttic) {
                            var randomBuyTime = GetRandomFloat(minAtticBuyTime, maxAtticBuyTime);

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
                    if(isAtticAutoRefreshing){
                        if(IsTimeToAutoRefreshAttic() && isRunningOnScheduledTime){
                            UpdateBannerAndDocument("Waiting", "Waiting for scheduled time in Attic");
                            isRunningOnScheduledTime = true;

                            RunAutoAttic();
                        } else {
                            AutoRefreshAttic();
                        }
                    }

                    // Additional function to check if it's time to auto-refresh the Attic
                    function IsTimeToAutoRefreshAttic() {
                        var now = new Date();
                        var currentHour = now.getHours();
                        return currentHour >= atticRunBetweenHours[0] && currentHour <= atticRunBetweenHours[1];
                    }

                    // Update the stored number of items
                    var numItems = GetAtticStockedItemNumber();
                    chrome.storage.local.set({ ATTIC_PREV_NUM_ITEMS: numItems }, function() {});
                }
            }

            function AutoRefreshAttic() {
                if(!isAtticAutoRefreshing){
                    UpdateBannerStatus("Attic auto refresh is disabled. Waiting for manual refresh.");
                    return;
                }

                // Calculate the time to wait before the next refresh
                const waitTime = CreateWaitTime();

                function CreateWaitTime() {
                    if (atticLastRefresh < 0) {
                        return GetRandomFloat(minRefreshIntervalAttic, maxRefreshIntervalAttic);
                    }
                
                    const now = Date.now();
                    const baseInterval = 7 * 60 * 1000; // 7 minutes in ms;
                    const minTimeFrame = 10 * 1000; // 10 seconds in ms;
                    const maxTimeFrame = 30 * 1000; // 30 seconds in ms;
                
                    // Calculate the start of the current 7-minute interval;
                    const intervalStart = Math.floor((now - atticLastRefresh) / baseInterval) * baseInterval + atticLastRefresh;
                
                    // Calculate the expected refresh time within the time frame
                    const expectedRefreshTime = intervalStart + baseInterval + minTimeFrame + Math.random() * (maxTimeFrame - minTimeFrame);
                
                    if (now <= expectedRefreshTime) {
                        return expectedRefreshTime - now;
                    } else {
                        // The current interval has passed; schedule the next one
                        return baseInterval - (now - intervalStart) + expectedRefreshTime - now;
                    }
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

            function GetAtticStockedItemNumber() {
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
                            filteredItems.forEach((item) => HighlightAtticItemWithColor(item, "lightgreen"));
                            HighlightAtticItemWithColor(selectedName, "orangered");
                        }
                    } else {
                        // Filtering the items based on the restocking list;
                        filteredItems = restockList.filter((itemName) => {
                            return itemData.some((item) => item.name === itemName && !IsItemInBlacklist(itemName));
                        });

                        selectedName = PickSecondBestItem(filteredItems);

                        if(selectedName){
                            filteredItems.forEach((item) => HighlightAtticItemWithColor(item, "lightgreen"));
                            HighlightAtticItemWithColor(selectedName, "orangered");
                        }
                    }

                    return selectedName;
                }
            }

            function HighlightAtticItemWithColor(itemName, color) {
                const itemElement = document.querySelector(`#items li[oname="${itemName}"]`);
                itemElement.style.backgroundColor = color;
            }

            function CalculateItemProfits(itemIDs, itemPrices) {
                const itemProfits = [];
            
                for (const itemID of itemIDs) {
                    if (!IsItemInRarityThresholdToBuy(itemID) || IsItemInBlacklist(itemID)) {
                        itemProfits.push(-99999999);
                    } else {
                        const itemData = item_db[itemID];
                        
                        try{
                            if (itemData["Rarity"] == undefined || itemData["Price"] == undefined) {
                                //console.warn("Item not found in the database or price not available.");
                                itemProfits.push(buyUnknownItemsIfProfitMargin);
                            } else {
                                const itemPrice = itemData.Price;
                                const userPrice = parseInt(itemPrices[itemIDs.indexOf(itemID)]);
                                const profit = itemPrice - userPrice;
                                itemProfits.push(profit);
                            }
                        } catch {
                            itemProfits.push(buyUnknownItemsIfProfitMargin);
                        }  
                    }
                }
            
                return itemProfits;
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
        }));
    }

    var IntervalID = null;

    function SetAutoBuyer() {
        InjectAutoPricer();
        clearInterval(IntervalID); // Stop the interval when triggered
    }

    (function () {
        // Your code here, such as SetAutoBuyer and the interval
        IntervalID = setInterval(SetAutoBuyer, 20);
    })();
}

topLevelTurbo();