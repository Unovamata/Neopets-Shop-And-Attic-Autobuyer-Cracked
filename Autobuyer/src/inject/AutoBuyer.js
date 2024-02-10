HandleServerErrors();

DisplayAutoBuyerBanner();

InjectAutoPricer();

function InjectAutoPricer() {
    chrome.storage.local.get({
        SEND_TO_SDB_AFTER_PURCHASE: !1,
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
        SHOULD_BYPASS_CONFIRM: false,
        SHOULD_GO_FOR_SECOND_MOST_VALUABLE: !1,
        MIN_REFRESH: 3500,
        MAX_REFRESH: 5e3,
        MIN_REFRESH_STOCKED: 37500,
        MAX_REFRESH_STOCKED: 45e3,
        SHOULD_ONLY_REFRESH_ON_CLEAR: false,
        ITEMS_TO_CONSIDER_STOCKED: 1,
        MIN_CLICK_ITEM_IMAGE: 500,
        MAX_CLICK_ITEM_IMAGE: 1e3,
        MIN_CLICK_CONFIRM: 100,
        MAX_CLICK_CONFIRM: 200,
        STORES_TO_CYCLE_THROUGH_WHEN_STOCKED: [2, 58],
        RUN_BETWEEN_HOURS: [0, 23],
        RESTOCK_LIST: defaultDesiredItems,
    }, (function(autobuyerVariables) {
        
        // Destructing the variables extracted from the extension;
        const {
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
            SHOULD_BYPASS_CONFIRM: isBypassingConfirm,
            SHOULD_GO_FOR_SECOND_MOST_VALUABLE: isBuyingSecondMostProfitable,
            STORES_TO_CYCLE_THROUGH_WHEN_STOCKED: storesToCycle,
            RUN_BETWEEN_HOURS: runBetweenHours,
            MIN_REFRESH: minRefreshIntervalUnstocked,
            MAX_REFRESH: maxRefreshIntervalUnstocked,
            ITEMS_TO_CONSIDER_STOCKED: minItemsToConsiderStocked,
            MIN_REFRESH_STOCKED: minRefreshIntervalStocked,
            MAX_REFRESH_STOCKED: maxRefreshIntervalStocked,
            SHOULD_ONLY_REFRESH_ON_CLEAR: shouldOnlyRefreshOnClear,
            MIN_CLICK_ITEM_IMAGE: minClickImageInterval,
            MAX_CLICK_ITEM_IMAGE: maxClickImageInterval,
            MIN_CLICK_CONFIRM: minClickConfirmInterval,
            MAX_CLICK_CONFIRM: maxClickConfirmInterval,
            RESTOCK_LIST: restockList,
        } = autobuyerVariables;
        
        var shopIntervals, 
            isRunningOnScheduledTime = false,
            confirmWindowInteral = 50;
        
        // Check if the user is in a main shop;
        if(!isAutoBuyerEnabled) return;

        // Setting the bypass for shop items;
        if(isBypassingConfirm){
            // Loading the shop's stock;
            let shopStockArr = [...document.getElementsByClassName('shop-item')];

            // Define the confirmPurchase function in the webpage's global context
            window.confirmPurchase = function(item) {
                if (item.className == 'shop-item') {
                    window.location.href = item.firstElementChild.dataset.link; // Redirect to the link specified in the dataset
                }
            };

            // Attach event listeners to each 'shop-item' element
            shopStockArr.forEach(
                shopItem => shopItem.addEventListener('click', () => confirmPurchase(shopItem))
            );
        }

        var itemElements = Array.from(document.querySelectorAll(".item-img"));

        var items = itemElements.map(element => {
            var itemName = element.getAttribute("data-name");
            var itemPrice = parseInt(element.getAttribute("data-price").replaceAll(",", ""));
            return {
                name: itemName,
                price: itemPrice,
            };
        });

        var itemProfits = CalculateItemProfits(items.map((item) => item.name), items.map((item) => item.price), buyUnknownItemsIfProfitMargin, minDBRarityToBuy, isBlacklistActive, blacklistToNeverBuy);

        if (isHighlightingItemsInShops) {
            if (buyWithItemDB) {
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
                var selectedName = restockList.find((itemName) => itemNames.has(itemName) && !IsItemInBlacklist(itemName, isBlacklistActive, blacklistToNeverBuy));
                var filteredNames = restockList.filter((itemName) => itemNames.has(itemName) && !IsItemInBlacklist(itemName, isBlacklistActive, blacklistToNeverBuy));
        
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

            if (buyWithItemDB) {
                var bestItemIndices = [];
                var maxProfit = -Infinity;

                for (var index = 0; index < items.length; index++) {
                    var profit = itemProfits[index];
                    var price = items[index].price;

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
                    selectedName = items[bestItemIndices[0]].name;
                } else if (isBuyingSecondMostProfitable) {
                    selectedName = items[bestItemIndices[1]].name;
                    //console.warn("Skipping the first most valuable item: " + items[bestItemIndices[0]].name);
                } else {
                    selectedName = items[bestItemIndices[0]].name;
                }
            } 
            
            //If the user is not using the 
            else {
                var itemElements = Array.from(document.querySelectorAll(".item-img")).map((element) => element.getAttribute("data-name"));

                // Assuming restockList is an array with the desired order
                filteredNames = restockList.filter((itemName) => itemElements.includes(itemName) && !IsItemInBlacklist(itemName, isBlacklistActive, blacklistToNeverBuy));

                // If there are items to buy, pick the first one
                selectedName = PickSecondBestItem(filteredNames, isBuyingSecondMostProfitable);
            }

            selectedName ? (isClickingItems ? UpdateBannerAndDocument(`Buying ${selectedName}`, `Buying ${selectedName} from the main shop`) : UpdateBannerAndDocument(`${selectedName} is in stock`, `${selectedName} is in stock in the main shop`)) : null;
            
            return selectedName
        }();


        
        // This code is better to not touch it as it breaks with any change made to it;
        itemToBuyExtracted ? async function(e) {
            //Clicking the selected item;
            if (isClickingItems) {
                var itemToBuyElement = document.querySelector(`.item-img[data-name="${e}"]`);

                await Sleep(minClickImageInterval, maxClickImageInterval);

                itemToBuyElement.click();
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
                
                var isClicked = !1;

                clearInterval(shopIntervals), shopIntervals = setInterval((function() {
                    var t, n = document.getElementById("confirm-link");
                    ((t = n)
                        .offsetWidth || t.offsetHeight || t.getClientRects()
                        .length) && setTimeout((function() {
                        isClicked || (n.click(), isClicked = !0)
                    }), GetRandomFloat(minClickConfirmInterval, maxClickConfirmInterval));
                }), confirmWindowInteral)
            }
        }()

        async function ReloadPageBasedOnConditions() {
            // Calculate the number of stocked items
            var currentStockedItems = Array.from(document.querySelectorAll(".item-img")).length;
            UpdateDocument(currentStockedItems + " stocked items", "", false);

            // If the bot should only refresh if the shop is cleared and the shop is not cleared, then stop refreshing;
            if(shouldOnlyRefreshOnClear){
                if(currentStockedItems > 0){
                    UpdateBannerStatus("Shop Stocked, Stopping. Refreshing Only on Clears.");
                    return;
                }
            }

            if (currentStockedItems < minItemsToConsiderStocked) {
                var cooldown = GetRandomFloat(minRefreshIntervalUnstocked, maxRefreshIntervalUnstocked);

                // Handle case when not enough items are stocked
                UpdateBannerStatus("Waiting " + FormatMillisecondsToSeconds(cooldown) + " to reload page...");

                await Sleep(cooldown);

                location.reload();
            } else {
                var cooldown = GetRandomFloat(minRefreshIntervalStocked, maxRefreshIntervalStocked);
                
                // Handle case when enough items are stocked
                UpdateBannerStatus("Waiting " + FormatMillisecondsToSeconds(cooldown) + " to reload page...");
                
                await Sleep(cooldown);

                // Handle cycling through shops
                if (storesToCycle.length === 0) {
                    location.reload();
                } else if (storesToCycle.length === 1) {
                    window.location.href = "http://www.neopets.com/objects.phtml?type=shop&obj_type=" + storesToCycle[0];
                } else {
                    const currentShopId = window.location.toString().match(/obj_type=(\d+)/)[1];
                    const currentIndex = storesToCycle.findIndex(shopId => shopId == currentShopId);

                    if (currentIndex === -1) {
                        window.location.href = `http://www.neopets.com/objects.phtml?type=shop&obj_type=${storesToCycle[0]}`;
                    } else {
                        const nextIndex = currentIndex === storesToCycle.length - 1 ? 0 : currentIndex + 1;
                        const nextShopId = storesToCycle[nextIndex];
                        window.location.href = `http://www.neopets.com/objects.phtml?type=shop&obj_type=${nextShopId}`;
                    }
                }
            }
        }
    }));
}