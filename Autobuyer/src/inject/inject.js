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
    
    var e = performance.now();

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
            "502 Bad Gateway\nopenresty",
            "504 Gateway Time-out\nopenresty",
            "Loading site please wait...",
            "NET::ERR_CERT_COMMON_NAME_INVALID"
            ];
        
            const pageText = document.body.innerText;
        
            // Reload the page after 10 seconds if an error is detected;
            if (errorMessages.some(message => pageText.includes(message))) {
                const indexOfMessage = errorMessages.findIndex(message => pageText.includes(message));

                if (indexOfMessage === 2) {
                    UpdateDocument("Captcha page detected", "Captcha page detected. Pausing.");
                }
            } 
            
            // If there's a browser related error;
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
    
    function l() {
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
                MIN_PAGE_LOAD_FAILURES: minPageReloadTime,
                MAX_PAGE_LOAD_FAILURES: maxPageReloadTime
            } = autobuyerVariables;
            
            var re, atticString = "Attic",
                bannerElementID = "qpkzsoynerzxsqw",
                ce = [0, 60],
                minSoldOutRefresh = 50,
                maxSoldOutRefresh = 100,
                minAddedToInventoryRefresh = 5e3,
                maxAddedToInventoryRefresh = 5100,
                de = minOCRDetectionInterval / 2,
                fe = maxOCRDetectionInterval / 2,
                _e = !1,
                isBannerDisplaying = !1,
                Ee = 50;

            // Run the AutoBuyer
            RunAutoBuyer();

            function RunAutoBuyer() {
                if (IsHaggling()) DisplayAutoBuyerBanner(), IsSoldOut() ? ProcessSoldOutItem() : IsItemAddedToInventory() ? ProcessPurchase() : (document.documentElement.textContent || document.documentElement.innerText)
                    .includes("You don't have that kind of money") ? (o = document.querySelector("h2")
                        .innerText.replaceAll("Haggle for ", ""), c = {
                            status: "missed",
                            item: o,
                            notes: "You do not have enough neopoints to purchase " + o + ". Program will pause now."
                        }, u = document.getElementsByTagName("h1")[0].textContent, SendEmail(c), UpdateBannerAndDocument("Not enough NPs", "Not enough NPs to purchase " + o + " from " + u + ". Pausing."), SaveToPurchaseHistory(o, u, "-", "Not enough neopoints")) : document.body.innerText.indexOf("every five seconds") > -1 ? (SaveToPurchaseHistory(document.getElementsByTagName("h2")[0].innerText.split("Haggle for ")[1], document.getElementsByTagName("h1")[0].textContent, "-", "Five second rule"), UpdateBannerAndDocument("Five second rule", "Attempted to purchase item within 5 seconds of a different purchase"), window.history.back()) : document.body.innerText.indexOf("Sorry, you can only carry a maximum of") > -1 ? UpdateBannerAndDocument("Inventory full", "Inventory was full. Pausing.") : (UpdateBannerStatus("Entering offer..."), function() {
                        (document.documentElement.textContent || document.documentElement.innerText)
                        .indexOf("You must select the correct pet in order to continue") > -1 && console.error("Incorrect click on pet!");
                        isEnteringOffer && setTimeout((function() {
                            var e, t = new RegExp("[0-9|,]+ Neopoints")
                                .exec(document.getElementById("shopkeeper_makes_deal")
                                    .innerText)[0].replace(" Neopoints", "")
                                .replaceAll(",", ""),
                                n = Number(t),
                                o = (e = n, Math.random() > .33 ? function(e) {
                                    for (var t = 1 - (.015 * Math.random() + .015), n = Math.round(t * e), o = Math.round(e * (1 + .005 * Math.random())), r = n, i = n, a = Oe(n); r <= o;) {
                                        var c = Oe(r);
                                        (c > a || c == a && Math.random() < .33) && (a = c, i = r), r += 1
                                    }
                                    return i
                                }(e) : function(e) {
                                    var t = 100 * (Math.round(4 * Math.random()) + 1),
                                        n = Math.round(e / t) * t;
                                    return e <= 500 && (n = 10 * Math.round(e / 10)), n
                                }(e));
                            document.querySelector(".haggleForm input[type=text]")
                                .value = o
                        }), Math.random() * (fe - de) + de);

                        t = document.querySelector("input[type='image']"), n = performance.now(),
                            function(e, t, n, o) {
                                var r = new Image;
                                r.src = e;
                                var i = performance.now();
                                r.onload = function() {
                                    var e = performance.now();
                                    console.log("Image load took " + Math.round(e - i) + " milliseconds.");
                                    var a = document.createElement("canvas");
                                    a.width = n, a.height = o;
                                    var c = a.getContext("2d");
                                    c.drawImage(r, 0, 0), document.body.append(a);
                                    for (var u = c.getImageData(0, 0, n, o), l = 0, m = 100, s = 0, d = 1, f = 0; f < u.data.length; f += 4 * d) {
                                        if (red = u.data[f + 0], green = u.data[f + 1], blue = u.data[f + 2], alpha = u.data[f + 3], 0 != red || 0 != green || 0 != blue) {
                                            var _ = We(red, green, blue)
                                                .l;
                                            _ < m && (m = _, s = l)
                                        }
                                        l += d
                                    }
                                    var T = Math.floor(s / n);
                                    t(s - T * n, T)
                                }
                            }(t.src, (function(o, r) {
                                var i = performance.now(),
                                    a = Math.max(i - e, i - n),
                                    c = Math.random() * (maxOCRDetectionInterval - minOCRDetectionInterval) + minOCRDetectionInterval,
                                    u = Math.max(Math.round(c - a), 0);
                                setTimeout((function() {
                                    var a = performance.now();
                                    ! function(e, t, n) {
                                        var o = function(e) {
                                                for (var t = 0, n = 0; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop);) t += e.offsetLeft - e.scrollLeft, n += e.offsetTop - e.scrollTop, e = e.offsetParent;
                                                return {
                                                    top: n,
                                                    left: t
                                                }
                                            }(e),
                                            r = Math.round(t + o.left),
                                            i = Math.round(n + o.top),
                                            a = new MouseEvent("click", {
                                                view: window,
                                                bubbles: !0,
                                                cancelable: !0,
                                                clientX: r,
                                                clientY: i
                                            });
                                        isClickingCaptcha && (e.dispatchEvent(a), SendBeepMessage()),
                                            function(e, t) {
                                                if (isAnnotatingImage) {
                                                    var n = document.createElement("img");
                                                    n.src = "https://upload.wikimedia.org/wikipedia/commons/3/31/Circle_Burgundy_Solid.svg", n.style.height = "14px", n.style.width = "14px", n.style.position = "absolute", n.style.top = t - 7 + "px", n.style.left = e - 7 + "px", n.style.zIndex = "9999999999", n.style.pointerEvents = "none", document.body.appendChild(n), AddCSSStyle("\n                          input[type='image'] {\n                            filter: contrast(2) grayscale(1);\n                          }\n                        ")
                                                }
                                            }(r, i)
                                    }(t, o, r);
                                    var c = performance.now();
                                    console.log("Load script to click image took " + Math.round(performance.now() - e) + "ms [X: " + o + ", Y: " + r + "]. Image solve took " + Math.round(i - n) + "ms. Added " + u + "ms to meet minimum. Click then took " + Math.round(c - a) + "ms.")
                                }), u)
                            }), t.width, t.height);
                        var t, n
                    }());
                
                else if (IsInShop())
                    if (DisplayAutoBuyerBanner(), IsSoldOut()) ProcessSoldOutItem();
                    else if (IsItemAddedToInventory()) ProcessPurchase();
                    
                else {
                    ! function() {
                        if (isHighlightingItemsInShops)
                            if (buyWithItemDB) ! function() {
                                var e = Array.from(document.querySelectorAll(".item-img"))
                                    .map((e => e.getAttribute("data-name"))),
                                    t = Array.from(document.querySelectorAll(".item-img"))
                                    .map((e => parseInt(e.getAttribute("data-price")
                                        .replaceAll(",", "")))),
                                    n = CalculateItemProfits(e, t),
                                    o = Be(e, t, n, minDBProfitToBuy, minDBProfitPercentToBuy),
                                    r = Pe(e, t, n, minDBProfitToBuy, minDBProfitPercentToBuy);
                                if (null != o) {
                                    for (var i of r) document.querySelector(`.item-img[data-name="${i}"]`)
                                        .parentElement.style.backgroundColor = "lightgreen";
                                    document.querySelector(`.item-img[data-name="${o}"]`)
                                        .parentElement.style.backgroundColor = "orangered"
                                }
                            }();
                            else {
                                var e = new Set(Array.from(document.querySelectorAll(".item-img"))
                                        .map((e => e.getAttribute("data-name")))),
                                    t = restockList.find((t => e.has(t) && !IsItemInBlacklist(t))),
                                    n = restockList.filter((t => e.has(t) && !IsItemInBlacklist(t)));
                                if (null != t) {
                                    for (var o of n) document.querySelector(`.item-img[data-name="${o}"]`)
                                        .parentElement.style.backgroundColor = "lightgreen";
                                    document.querySelector(`.item-img[data-name="${t}"]`)
                                        .parentElement.style.backgroundColor = "orangered"
                                }
                            }
                    }();
                    var t = function() {
                        var e;
                        if (buyWithItemDB) {
                            var t = function() {
                                for (var e = Array.from(document.querySelectorAll(".item-img"))
                                        .map((e => e.getAttribute("data-name"))), t = Array.from(document.querySelectorAll(".item-img"))
                                        .map((e => parseInt(e.getAttribute("data-price")
                                            .replaceAll(",", "")))), n = CalculateItemProfits(e, t), o = null, r = null, i = -1, a = 0; a < n.length; a++) {
                                    var c = n[a] > minDBProfitToBuy,
                                        u = n[a] / t[a] > minDBProfitPercentToBuy;
                                    c && u && n[a] > i && (i = n[a], null != r && (o = r), r = e[a])
                                }
                                return null == r ? [] : null == o ? [r] : [r, o]
                            }();
                            if (0 == t.length) return;
                            1 == t.length ? e = t[0] : isBuyingSecondMostProfitable ? (e = t[1], console.warn("Skipping first most valuable item: " + t[0])) : e = t[0]
                        } else {
                            var n = new Set(Array.from(document.querySelectorAll(".item-img"))
                                    .map((e => e.getAttribute("data-name")))),
                                o = restockList.find((e => n.has(e) && !IsItemInBlacklist(e)));
                            if (e = o, isBuyingSecondMostProfitable) {
                                var r = restockList.find((e => n.has(e) && e !== o && !IsItemInBlacklist(e)));
                                r && (console.warn("Skipping first most valuable item: " + e), e = r)
                            }
                        }
                        e && isClickingItems ? UpdateBannerAndDocument("Buying " + e, "Buying " + e + " from main shop") : e && UpdateBannerAndDocument(e + " is in stock", e + " is in stock in main shop");
                        return e
                    }();
                    t ? function(e) {
                            if (isClickingItems) {
                                var t = document.querySelector(`.item-img[data-name="${e}"]`);
                                setTimeout((function() {
                                    t.click(), SendBeepMessage()
                                }), Math.random() * (maxClickImageInterval - minClickImageInterval) + minClickImageInterval)
                            }
                        }(t) : ! function() {
                            var e = new Date,
                                t = e.getHours(),
                                n = e.getMinutes();
                            e.getDay();
                            return t >= runBetweenHours[0] && t <= runBetweenHours[1] && n >= ce[0] && n <= ce[1]
                        }() ? (_e || (UpdateBannerAndDocument("Waiting", "Waiting for scheduled time in main shop"), _e = !0), setTimeout((function() {
                            RunAutoBuyer()
                        }), 3e4)) : ReloadPageBasedOnConditions(),
                        function() {
                            if (isClickingConfirm) {
                                var e = !1;
                                clearInterval(re), re = setInterval((function() {
                                    var t, n = document.getElementById("confirm-link");
                                    ((t = n)
                                        .offsetWidth || t.offsetHeight || t.getClientRects()
                                        .length) && setTimeout((function() {
                                        e || (n.click(), SendBeepMessage(), e = !0)
                                    }), Math.random() * (maxClickConfirmInterval - minClickConfirmInterval) + minClickConfirmInterval)
                                }), Ee)
                            }
                        }()
                // This may break in the future #TAG; The original line was CheckNeopetsGarage() > -1, meaning the item was found, returning true using includes;
                } else if(IsInAlmostAbandonedAttic()){
                    function handleAlmostAbandonedAttic() {
                        DisplayAutoBuyerBanner();

                        function IsItemInInventory() {
                            const message = "I have placed it in your inventory";
                            return document.body.innerText.indexOf(message) > -1;
                        }

                        if (IsItemInInventory()) {
                            var e = document.getElementsByTagName("strong")[0].innerText,
                                t = {
                                    status: "bought",
                                    item: e,
                                    notes: ""
                                };
                            SendEmail(t);
                            UpdateBannerAndDocument(e + " bought", e + " bought from Attic");
                            SaveToPurchaseHistory(e, atticString, "-", "Bought");

                            setTimeout(function() {
                                AutoRefreshAttic();
                            }, 120000);
                            HighlightItemsInAttic();
                        } 
                        
                        else if (document.body.innerText.includes("Didn't you just buy something?")) {
                            UpdateBannerAndDocument("Need to wait 20 minutes in Attic", "Pausing NeoBuyer in Attic for 20 minutes");
                            
                            setTimeout(function() {
                                window.location.href = "https://www.neopets.com/halloween/garage.phtml";
                            }, 120000);
                        }


                        else if (document.body.innerText.includes("Sorry, please try again later.")){
                            UpdateBannerAndDocument("Attic is refresh banned", "Pausing NeoBuyer in Attic");
                        } 
                        

                        else if (document.body.innerText.includes("cannot buy any more items from this shop today")) {
                            UpdateBannerAndDocument("Five item limit reached in Attic", "Pausing NeoBuyer in Attic");
                        }
                        
                        else {
                            AtticRestockUpdateChecker();

                            function AtticRestockUpdateChecker(){
                                if (atticPreviousNumberOfItems < 0) return;
                                if (atticLastRefresh < 0) return;
                                var e = GetStockedItemNumber();
                                var t = Date.now();
                            
                                if (e > atticPreviousNumberOfItems) {
                                    chrome.storage.local.set({
                                        ATTIC_PREV_NUM_ITEMS: e,
                                        ATTIC_LAST_REFRESH_MS: t
                                    }, function() {
                                        UpdateBannerAndDocument("Attic restocked", "Restock detected in Attic, updating last restock estimate.");
                                    });
                                }
                            }
                            
                            if (document.body.innerText.includes("Sorry, we just sold out of that.")) {
                                UpdateBannerAndDocument("Sold out", "Item was sold out at the Attic");
                            }
                            
                            HighlightItemsInAttic();
                            
                            var e = (o = Array.from(document.querySelectorAll("#items li")).map((e => e.getAttribute("oname"))), 
                            r = Array.from(document.querySelectorAll("#items li")).map((e => e.getAttribute("oprice").replaceAll(",", ""))),
                            i = CalculateItemProfits(o, r), Be(o, r, i, minDBProfitToBuyInAttic, minDBProfitPercentToBuyInAttic));
                            e ? function(e) {
                                if (isClickingItemsInAttic) {
                                    var t = Math.random() * (maxAtticBuyTime - minAtticBuyTime) + minAtticBuyTime;
                                    UpdateBannerAndDocument("Attempting " + e + " in Attic", "Attempting to buy " + e + " in Attic in " + FormatMillisecondsToSeconds(t));
                                    var n = document.querySelector(`#items li[oname="${e}"]`),
                                        o = n.getAttribute("oii"),
                                        r = n.getAttribute("oprice");
                                    SaveToPurchaseHistory(e, atticString, r, "Attempted"), setTimeout((function() {
                                        document.getElementById("oii")
                                            .value = o, document.getElementById("frm-abandoned-attic")
                                            .submit()
                                    }), t)
                                }
                            }(e) : !isAtticAutoRefreshing || function() {
                                var e = new Date,
                                    t = e.getHours();
                                e.getMinutes(), e.getDay();
                                return t >= atticRunBetweenHours[0] && t <= atticRunBetweenHours[1]
                            }() ? AutoRefreshAttic() : (_e || (UpdateBannerAndDocument("Waiting", "Waiting for scheduled time in Attic"), _e = !0), setTimeout((function() {
                                RunAutoBuyer()
                            }), 3e4)), t = GetStockedItemNumber(), chrome.storage.local.set({
                                ATTIC_PREV_NUM_ITEMS: t
                            }, (function() {}))
                        }
                        
                        var t;
                        var o, r, i
                    }
                    
                    handleAlmostAbandonedAttic();
                }

                var o, c, u
            }

            function UpdateBannerAndDocument(e, n) {
                UpdateBannerStatus(n), UpdateDocument(e, n)
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
                    var e = Array.from(document.querySelectorAll("#items li"))
                        .map((e => e.getAttribute("oname"))),
                        t = Array.from(document.querySelectorAll("#items li"))
                        .map((e => e.getAttribute("oprice")
                            .replaceAll(",", ""))),
                        n = CalculateItemProfits(e, t),
                        o = Be(e, t, n, minDBProfitToBuyInAttic, minDBProfitPercentToBuyInAttic),
                        r = Pe(e, t, n, minDBProfitToBuyInAttic, minDBProfitPercentToBuyInAttic);
                    if (null != o) {
                        for (var i of r) HighlightItemWithColor(i, "lightgreen");
                        HighlightItemWithColor(o, "orangered")
                    }
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
                    item: e,
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
                    window.emailjs.send(emailServiceID, emailTemplate, emailData, emailUserID)
                        .then(
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
                    UpdateBannerStatus("Waiting " + FormatMillisecondsToSeconds(t = Math.random() * (maxAddedToInventoryRefresh - minAddedToInventoryRefresh) + minAddedToInventoryRefresh + pauseAfterBuy) + " to reload page...");
                    
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

            function Oe(e) {
                return 20 - function(e) {
                    let t = 0,
                        n = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    for (; e > 0;) {
                        n[e % 10]++, e = Math.floor(e / 10)
                    }
                    for (let e = 0; e < 10; e++) n[e] >= 1 && t++;
                    return t
                }(e)
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
                    const itemData = item_db[itemID];
            
                    if (!IsItemInRarityThresholdToBuy(itemID) || hasUserExcludedItem(itemID)) {
                        itemProfits.push(-99999999);
                    } else if (itemData === null) {
                        console.warn("Item not found in the database.");
                        itemProfits.push(buyUnknownItemsIfProfitMargin);
                    } else if (itemData.Price === null || itemData.Price === 0) {
                        console.warn("Item price not available in the database.");
                        itemProfits.push(buyUnknownItemsIfProfitMargin);
                    } else {
                        const itemPrice = parseInt(itemData.Price.toString().replace(",", ""));
                        const userPrice = parseInt(itemPrices[itemIDs.indexOf(itemID)]);
                        const profit = itemPrice - userPrice;
                        itemProfits.push(profit);
                    }
                }
            
                return itemProfits;
            }

            function Be(e, t, n, o, r) {
                for (var i = null, a = -1, c = 0; c < n.length; c++) {
                    var u = n[c] >= o,
                        l = n[c] / t[c] >= r;
                    u && l && n[c] > a && (a = n[c], i = e[c])
                }
                return i
            }
            function Pe(e, t, n, o, r) {
                for (var i = [], a = 0; a < n.length; a++) {
                    var c = n[a] > o,
                        u = n[a] / t[a] > r;
                    c && u && i.push(e[a])
                }
                return i
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
                if (isShowingBanner && !bannerDisplayed) {
                    bannerDisplayed = true;

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
            l();
            clearInterval(IntervalID); // Stop the interval when triggered
        }
    }

    (function () {
        // Your code here, such as SetAutoBuyer and the interval
        IntervalID = setInterval(SetAutoBuyer, 20);
    })();
}

topLevelTurbo();