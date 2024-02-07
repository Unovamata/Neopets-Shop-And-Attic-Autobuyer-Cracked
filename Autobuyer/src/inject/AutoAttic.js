HandleServerErrors();

InjectAutoAttic();

DisplayAutoBuyerBanner();

//######################################################################################################################################


function InjectAutoAttic() {
    chrome.storage.local.get({
        BUY_UNKNOWN_ITEMS_PROFIT: 1e5,
        ITEM_DB_MIN_RARITY: 1,
        USE_BLACKLIST: !1,
        BLACKLIST: [],
        ENABLED: !0,
        USE_ITEM_DB: !0,
        RESTOCK_LIST: defaultDesiredItems,
        SHOULD_GO_FOR_SECOND_MOST_VALUABLE: !1,
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
    }, (function(autobuyerVariables) {
        
        // Destructing the variables extracted from the extension;
        const {
            BUY_UNKNOWN_ITEMS_PROFIT: buyUnknownItemsIfProfitMargin,
            ITEM_DB_MIN_RARITY: minDBRarityToBuy,
            USE_BLACKLIST: isBlacklistActive,
            BLACKLIST: blacklistToNeverBuy,
            USE_ITEM_DB: buyWithItemDB,
            RESTOCK_LIST: restockList,
            SHOULD_GO_FOR_SECOND_MOST_VALUABLE: isBuyingSecondMostProfitable,
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
        
        var isRunningOnScheduledTime = false;

        // Run the AutoBuyer
        if(!isAtticEnabled) return;

        // Recently bought item;
        if (PageIncludes("I have placed it in your inventory")) {
            var boughtItemElement = document.getElementsByTagName("strong")[0].innerText;
            
            UpdateBannerAndDocument(boughtItemElement + " bought", boughtItemElement + " bought from Attic");
            SaveToPurchaseHistory(boughtItemElement, "Attic", "-", "Bought");

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

                    SaveToPurchaseHistory(bestItemName, "Attic", itemPrice, "Attempted");

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
                    var itemProfits = CalculateItemProfits(itemData.map(item => item.name), itemData.map(item => item.price), buyUnknownItemsIfProfitMargin, minDBRarityToBuy, isBlacklistActive, blacklistToNeverBuy);
                    selectedName = BestItemName(itemData.map(item => item.name), itemData.map(item => item.price), itemProfits, minDBProfitToBuyInAttic, minDBProfitPercentToBuyInAttic);
                    filteredItems = FilterItemsByProfitCriteria(itemData.map(item => item.name), itemData.map(item => item.price), itemProfits, minDBProfitToBuyInAttic, minDBProfitPercentToBuyInAttic);

                    if (selectedName) {
                        filteredItems.forEach((item) => HighlightAtticItemWithColor(item, "lightgreen"));
                        HighlightAtticItemWithColor(selectedName, "orangered");
                    }
                } else {
                    // Filtering the items based on the restocking list;
                    filteredItems = restockList.filter((itemName) => {
                        return itemData.some((item) => item.name === itemName && !IsItemInBlacklist(itemName, isBlacklistActive, blacklistToNeverBuy));
                    });

                    selectedName = PickSecondBestItem(filteredItems, isBuyingSecondMostProfitable);

                    if(selectedName){
                        filteredItems.forEach((item) => HighlightAtticItemWithColor(item, "lightgreen"));
                        HighlightAtticItemWithColor(selectedName, "orangered");
                    }
                }

                return selectedName;
            }
        }
    }));
}


//######################################################################################################################################


function GetAtticStockedItemNumber() {
    return Array.from(document.querySelectorAll("#items li"))
        .map((e => e.getAttribute("oname")))
        .length
}


function HighlightAtticItemWithColor(itemName, color) {
    const itemElement = document.querySelector(`#items li[oname="${itemName}"]`);
    itemElement.style.backgroundColor = color;
}

//######################################################################################################################################