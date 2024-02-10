HandleServerErrors();

DisplayAutoBuyerBanner();

InjectAutoHaggler();

function InjectAutoHaggler() {

    var startGlobalTime = performance.now();
    
    chrome.storage.local.get({
        PAUSE_AFTER_BUY_MS: 0,
        ENABLED: !0,
        SHOULD_CLICK_NEOPET: !0,
        SHOULD_ANNOTATE_IMAGE: !0,
        SHOULD_ENTER_OFFER: !0,
        MIN_FIVE_SECOND_RULE_REFRESH: 5000,
        MAX_FIVE_SECOND_RULE_REFRESH: 10000,
        MIN_OCR_PAGE: 750,
        MAX_OCR_PAGE: 1100,
    }, (async function(autobuyerVariables) {
        
        // Destructing the variables extracted from the extension;
        const {
            PAUSE_AFTER_BUY_MS: pauseAfterBuy,
            ENABLED: isAutoBuyerEnabled,
            SHOULD_CLICK_NEOPET: isClickingCaptcha,
            SHOULD_ANNOTATE_IMAGE: isAnnotatingImage,
            SHOULD_ENTER_OFFER: isEnteringOffer,
            MIN_FIVE_SECOND_RULE_REFRESH: minFiveSecondRuleRefresh,
            MAX_FIVE_SECOND_RULE_REFRESH: maxFiveSecondRuleRefresh,
            MIN_OCR_PAGE: minOCRDetectionInterval,
            MAX_OCR_PAGE: maxOCRDetectionInterval,
        } = autobuyerVariables;
        
        var minSoldOutRefresh = 50,
            maxSoldOutRefresh = 100,
            minInventoryRefreshInterval = 5000, // 5 seconds
            maxInventoryRefreshInterval = 5100, // 5.1 seconds
            minHagglingTimeout = minOCRDetectionInterval,
            maxHagglingTimeout = maxOCRDetectionInterval;

        if(!isAutoBuyerEnabled) return;

        if (IsSoldOut()) {
            ProcessSoldOutItem();
        } else if (IsItemAddedToInventory()) {
            ProcessPurchase();
        } else {
            const itemName = document.querySelector("h2").innerText.replace("Haggle for ", "");
            const seller = document.querySelector("h1").textContent;

            // No NPs at hand;
            if (PageIncludes("You don't have that kind of money")) {
                UpdateBannerAndDocument("Not enough NPs", "Not enough NPs to purchase " + itemName + " from " + seller + ". Pausing.");
                SaveToPurchaseHistory(itemName, seller, "-", "Not enough neopoints");
                return;
            }
            
            // Inventory full;
            else if (PageIncludes("Sorry, you can only carry a maximum of")) {
                UpdateBannerAndDocument("Inventory full", "Inventory was full. Pausing.");
                return;
            }

            // Five second rule;
            else if (PageIncludes("every five seconds")) {
                SaveToPurchaseHistory(itemName, seller, "-", "Five second rule");
                UpdateBannerAndDocument("Five second rule", "Attempted to purchase an item within 5 seconds of a different purchase");

                // Wait time for five second rules as they are desynced;
                await Sleep(minFiveSecondRuleRefresh, maxFiveSecondRuleRefresh);

                window.history.back();
            }
            
            
            
            // Haggling;
            else {
                UpdateBannerStatus("Entering offer...");

                var haggleInput = document.querySelector(".haggleForm input[type=text]");

                // Perform haggling choosing between haggling algorithms;
                if(isEnteringOffer){
                    // Haggling action;
                    var hagglingTimeout = GetRandomFloatExclusive(minHagglingTimeout, maxHagglingTimeout) / 3;
                    
                    setTimeout(PerformHaggling, hagglingTimeout);

                    // Main haggling fuction to call the data from the GUI to the bot;
                    function PerformHaggling() {
                        // Matching the shopkeeper's deal, adding a random price percentage to the price for haggling;
                        var shopkeeperDeal = document.getElementById("shopkeeper_makes_deal").textContent,
                            match = shopkeeperDeal.match("[0-9|,]+ Neopoints"),
                            askingPrice = parseInt(match[0].replace(" Neopoints", "").replace(/,/g, ""));
                            thresholdToAdd =  Math.pow(Number(askingPrice), GetRandomFloatExclusive(0.75, 0.85));
                            thresholdPrice = "" + Math.round(Number(askingPrice) + thresholdToAdd);
                            
                            
                            // Creating the haggle;
                            haggleInput.value = "0" + GenerateHagglePrice(thresholdPrice);
                    }
                    
                    // Generates the haggle amount based on a numpad position heat-map;
                    function GenerateHagglePrice(askedPrice) {
                        let haggledPrice = "";
                        let heatMap, closestNumber;
                    
                        // Checking all the digits in the possible haggle offer;
                        for (let i = 0; i < askedPrice.length; i++) {
                            const selectedNumber = parseInt(askedPrice[i]);
                    
                            /* In this part of the process, we preset the first 2 numbers in the haggle value
                                * As these 2 numbers are the most important for the haggle to go through.
                                * After that, based on the numbers pre-generated, we generate a random number
                                * for the rest of the haggle offer based on the heat-maps and their numpad position
                                * to create a more cohesive and natural haggle amount. */
                            if (i <= 1) {
                                heatMap = GenerateHeatMap(selectedNumber.toString());
                                closestNumber = GetClosestNumber(heatMap, selectedNumber.toString(), i, askedPrice);
                            } else {
                                heatMap = GenerateHeatMap(haggledPrice[i - 1].toString());
                                closestNumber = GetClosestNumber(heatMap, haggledPrice[i - 1], i, askedPrice);
                            }

                            haggledPrice += closestNumber;
                        }
                    
                        return haggledPrice;
                    }
                    
                    const baseNumpadLayout = [
                        ['0'],
                        ['1', '2', '3'],
                        ['4', '5', '6'],
                        ['7', '8', '9']
                    ];
                    
                    const zeroNumpadLayout = [
                        ['0', '1'],
                        ['2', '3'],
                        ['4', '5', '6'],
                        ['7', '8', '9']
                    ];

                    // Generates a heat-map based on the position of the numpad numbers;
                    function GenerateHeatMap(selectedNumber, weight = false) {
                        const heatMap = {};
                        var numpadLayout;
                    
                        // Use a different heat-map for the number 0;
                        if (selectedNumber == '0') {
                            numpadLayout = zeroNumpadLayout;
                        } else {
                            numpadLayout = baseNumpadLayout;
                        }
                    
                        // Navigate through the numpad array to find the selected number;
                        let selectedRow, selectedColumn;
                        for (let row = 0; row < numpadLayout.length; row++) {
                            for (let col = 0; col < numpadLayout[row].length; col++) {

                                // Saving the row and column of the selected number for later processing;
                                if (numpadLayout[row][col] === selectedNumber) {
                                    selectedRow = row;
                                    selectedColumn = col;
                                    break;
                                }
                            }
                        }
                    
                        // Using the Manhattan Distance formula to create a heat-map for natural-looking haggles;
                        for (let row = 0; row < numpadLayout.length; row++) {
                            for (let col = 0; col < numpadLayout[row].length; col++) {
                                const number = numpadLayout[row][col];

                                // Numbers from a different row but the same column take more 'effort' to get to;
                                var weight = 0;
                    
                                if (row != selectedRow && col == selectedColumn) weight = 0.5;
                    
                                // Calculate the Manhattan Distance and store the value in the array for later use;
                                const distance = Math.abs(row - selectedRow) + Math.abs(col - selectedColumn) + weight;
                                heatMap[number] = distance;
                            }
                        }
                    
                        return heatMap;
                    }

                    // Get the closest number to input based on the heat-maps created above;
                    function GetClosestNumber(heatMap, selectedNumber, index, askingPrice) {
                        // Return the first 2 numbers of the haggle; for the haggle to go through;
                        if (index <= 1) {
                            return selectedNumber.toString();
                        }
                    
                        // Map the numbers with an importance value for them to jump to another row if necessary;
                        let closestNumbers = [];
                        let importanceThreshold = Math.ceil(askingPrice.length / 2.5) - 1;
                    
                        // Check the heat-map and push closer numbers to an array;
                        for (const number in heatMap) {
                            const distance = heatMap[number];
                            let minDist = 1; // For contiguous numbers;
                    
                            if (index <= importanceThreshold) {
                                minDist = 1.5; // For numbers outside the current row;
                            }
                            
                            if (distance <= minDist && distance >= 0) {
                                closestNumbers.push(number);
                            }
                        }
                    
                        // Remove unnecessary options to create the haggle;
                        if(closestNumbers.length > 1 && index < importanceThreshold){
                            closestNumbers = closestNumbers.filter(number => parseInt(number) > parseInt(selectedNumber));
                        }
                    
                        // Select one of the numbers for the haggle value;
                        const randomIndex = Math.floor(Math.random() * closestNumbers.length);
                        return closestNumbers[randomIndex];
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
                        var maxDarkness = 0; // Track the maximum darkness found
                        var maxAdjustmentDistance = 17; // Adjust this value as needed

                        for (var i = 0; i < imageData.data.length; i += 4) {
                            // Calculate luminance based on RGB values.
                            var luminance = (Math.max(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]) +
                                            Math.min(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2])) / 510;

                            // Check if the current pixel is darker than the darkest found so far.
                            if (luminance < minLuminance) {
                                minLuminance = luminance;
                                darkestPixelIndex = i / 4; // Dividing by 4 because we're iterating over RGBA values.
                            }

                            // Calculate the x and y coordinates of the current pixel
                            var xCurrent = i / 4 % canvas.width;
                            var yCurrent = Math.floor(i / 4 / canvas.width);

                            // Calculate the distance between the current pixel and the darkest pixel
                            var distance = Math.sqrt(Math.pow(xCurrent - x, 2) + Math.pow(yCurrent - y, 2));

                            // Check if the pixel is within the maximum adjustment distance
                            if (distance <= maxAdjustmentDistance) {
                                // Update maxDarkness
                                if (luminance < maxDarkness) {
                                    maxDarkness = luminance;
                                }
                            }
                        }

                        // Define weights for moving coordinates based on darkness
                        var weightMedium = 3.37; // Medium adjustment for medium darkness
                        var weightDark = 0.65; // Heavily adjust for darkest pixels

                        // Calculate the x and y coordinates based on the darkest pixel
                        var x = darkestPixelIndex % canvas.width;
                        var y = Math.floor(darkestPixelIndex / canvas.width);

                        // Calculate the adjustment factor based on darkness
                        var adjustmentFactor = (luminance - maxDarkness) < 0.51 ? weightMedium : weightDark;

                        // Adjust x and y coordinates
                        x += adjustmentFactor;
                        y += adjustmentFactor;

                        // Ensure x and y are within bounds
                        x = Math.max(0, Math.min(x, canvas.width - 1));
                        y = Math.max(0, Math.min(y, canvas.height - 1));

                        // X & Y coordinates to trigger the click event;
                        TriggerClickEventCaptcha(x, y);
                    };
                }

                // Sending events to the captcha image; IIFE function <-- + ^
                (captchaElement.src, (function(x, y) {

                    var imageLoadStartTime = performance.now(),
                    adjustedDelay = Math.max(Math.round(Math.random() * (maxHagglingTimeout - minHagglingTimeout) + minHagglingTimeout - Math.max(imageLoadStartTime - startGlobalTime, imageLoadStartTime - imageLoadingTime)), 0);

                    // Clicking the captcha pet;
                    setTimeout((function() {
                        var captchaOffset = CalculateCaptchaOffset(captchaElement);
                        
                        // Calculating the relative position of the catpcha element;
                        var clickX = captchaOffset.x + x;
                        var clickY = captchaOffset.y + y;

                        if (isClickingCaptcha) {
                            // Create a click event
                            var clickEvent = new MouseEvent("click", {
                                view: window,
                                bubbles: true,
                                cancelable: true,
                                clientX: clickX,
                                clientY: clickY,
                            });
                        
                            // Dispatch the click event
                            captchaElement.dispatchEvent(clickEvent);
                        }

                        if (isAnnotatingImage) {
                            // Create the highlighter element
                            const highlighter = document.createElement("div");
                            highlighter.style.width = "4px";
                            highlighter.style.height = "4px";
                            highlighter.style.background = "red";
                            highlighter.style.color = "red";
                            highlighter.style.borderRadius = "50%";
                            highlighter.style.position = "absolute";
                            highlighter.style.top = clickY + "px";
                            highlighter.style.left = clickX + "px";
                            highlighter.style.zIndex = "9999"; // Ensure it's above other elements
                            highlighter.style.pointerEvents = "none"; // Allow click events to pass through
                            
                            document.body.appendChild(highlighter);

                            const styles = `
                                input[type='image'] {
                                filter: contrast(3) grayscale(1);
                                }`;
                            
                            AddCSSStyle(styles);
                        }

                        function CalculateCaptchaOffset(element) {
                            let x = 0, y = 0;

                            while (element) {
                                x += element.offsetLeft - element.scrollLeft;
                                y += element.offsetTop - element.scrollTop;
                                element = element.offsetParent;
                            }

                            return { x, y };
                        }
                    }), adjustedDelay)
                }));
            }
        }

        function ProcessPurchase() {
            var itemName = document.querySelector("h2").innerText.replaceAll("Haggle for ", "");

            // Extract shop name
            var shopName = document.getElementsByTagName("h1")[0].textContent;
            var purchaseDetails = document.querySelector("p > b").textContent;
            var purchaseAmount = purchaseDetails.split("your offer of ")[1].split(" Neopoints!'")[0];
            
            UpdateBannerAndDocument(itemName + " bought", itemName + " bought from " + shopName + " for " + purchaseAmount + " NPs");
            
            SaveToPurchaseHistory(itemName, shopName, purchaseAmount, "Bought");

            ReloadPageBasedOnConditions();
        }

        function IsItemAddedToInventory() {
            return PageIncludes("has been added to your inventory");
        }

        function IsSoldOut() {
            return PageIncludes(" is SOLD OUT!");
        }

        async function ReloadPageBasedOnConditions() {
            if (IsSoldOut()) {
                var cooldown = GetRandomFloatExclusive(minSoldOutRefresh, maxSoldOutRefresh);
                UpdateBannerStatus("Waiting " + FormatMillisecondsToSeconds(cooldown) + " to reload page...");
                
                await Sleep(cooldown);

                ClickToRefreshShop();
            } else if (IsItemAddedToInventory()) {
                var cooldown = GetRandomFloatExclusive(minInventoryRefreshInterval, maxInventoryRefreshInterval) + pauseAfterBuy;
                UpdateBannerStatus("Waiting " + FormatMillisecondsToSeconds(cooldown) + " to reload page...");
                
                //Wait 5 seconds after purchase;
                await Sleep(cooldown);

                ClickToRefreshShop();
            }
        }

        function ProcessSoldOutItem() {
            var e = document.querySelector("h2")
                .innerText.replaceAll("Haggle for ", "");
            
            UpdateBannerAndDocument("Sold out", "Sold out of " + e);
            
            SaveToPurchaseHistory(e, document.getElementsByTagName("h1")[0].textContent, "-", "Sold out");
            
            ReloadPageBasedOnConditions()
        }
    }));
}