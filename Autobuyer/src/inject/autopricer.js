async function RunAutoPricer(){
    if(window.location.href.includes("market.phtml?type=sales") 
    || window.location.href.includes("market.phtml?type=till")
    || window.location.href.includes("market.phtml?type=edit")) return;
    
    chrome.storage.local.get({
        // AutoPricer;
        IS_TURBO: false,
        SHOULD_USE_NEON: false,
        PRICING_TYPE: "Percentage",
        SHOULD_USE_RANDOM_PERCENTAGES_FOR_PRICING: false,
        PERCENTAGE_PRICING_ALGORITHM_TYPE: "Zeroes",
        FIXED_PRICING_PERCENTAGE: 15,
        MIN_PRICING_PERCENTAGE: 10,
        MAX_PRICING_PERCENTAGE: 20,
        FIXED_PRICING_ALGORITHM_TYPE: "True Absolute",
        FIXED_PRICING_VALUE: 1000,
        SHOULD_CHECK_IF_FROZEN_SHOP: false,
        MIN_FIXED_PRICING: 200,
        MAX_FIXED_PRICING: 800,
        SHOP_HISTORY: [],
        SHOULD_IMPORT_SALES: false,

        // AutoKQ;
        START_AUTOKQ_PROCESS: false,
        MAX_INSTA_BUY_PRICE: 0,
        MAX_SPENDABLE_PRICE: 60000,

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
        USE_AUTOPRICING_BLACKLIST: false,
        USE_BLACKLIST_SW: false,

        // Shop Stock Page Settings;
        MIN_WAIT_AFTER_PRICING_ITEM: 10000,
        MAX_WAIT_AFTER_PRICING_ITEM: 20000,
        MIN_SHOP_NAVIGATION_COOLDOWN: 20000,
        MAX_SHOP_NAVIGATION_COOLDOWN: 40000,
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
        MIN_PAGE_LOAD_FAILURES: 10000,
        MAX_PAGE_LOAD_FAILURES: 20000,
    }, (async function(autobuyerVariables) {
        
        // Destructing the variables extracted from the extension;
        const {
            // AutoPricer;
            IS_TURBO: isTurbo,
			PRICING_TYPE: pricingType,
			SHOULD_USE_RANDOM_PERCENTAGES_FOR_PRICING: isRandomPercentage,
			PERCENTAGE_PRICING_ALGORITHM_TYPE: percentageAlgorithmType,
			FIXED_PRICING_PERCENTAGE: fixedPercentageDeduction,
			MIN_PRICING_PERCENTAGE: percentageDeductionMin,
			MAX_PRICING_PERCENTAGE: percentageDeductionMax,
			FIXED_PRICING_ALGORITHM_TYPE: fixedAlgorithmType,
			FIXED_PRICING_VALUE: fixedPricingDeduction,
			MIN_FIXED_PRICING: minFixedPricingDeduction,
			MAX_FIXED_PRICING: maxFixedPricingDeduction,
            SHOP_HISTORY: shopHistory,
            SHOULD_IMPORT_SALES: shouldImportSales,

            // AutoKQ;
            START_AUTOKQ_PROCESS: isKQRunning,
            MAX_INSTA_BUY_PRICE: maxInstaBuyPrice,
            MAX_SPENDABLE_PRICE: maxSpendablePrice,

            // Shop Wizard;
            SHOULD_CHECK_IF_FROZEN_SHOP: shouldCheckIfFrozenShop,
            MIN_WAIT_BAN_TIME: sleepIfBannedMin,
            MAX_WAIT_BAN_TIME: sleepIfBannedMax,
            MIN_WAIT_PER_REFRESH: sleepWhileNavigatingToSWMin,
            MAX_WAIT_PER_REFRESH: sleepWhileNavigatingToSWMax,
            MIN_WAIT_PER_ACTION: sleepInSWPageMin,
            MAX_WAIT_PER_ACTION: sleepInSWPageMax,
            RESUBMIT_TYPE: resubmitType,
			MIN_RESUBMITS_PER_ITEM: minResubmitsPerItem,
			MAX_RESUBMITS_PER_ITEM: maxResubmitsPerItem,
            RESUBMITS_PER_ITEM: resubmitPresses,
            MIN_RESUBMIT_WAIT_TIME: sleepThroughSearchesMin,
            MAX_RESUBMIT_WAIT_TIME: sleepThroughSearchesMax,
            MIN_NEW_SEARCH_WAIT_TIME: sleepNewSearchMin,
            MAX_NEW_SEARCH_WAIT_TIME: sleepNewSearchMax,

            // Shop Stock Page Settings;
            MIN_WAIT_AFTER_PRICING_ITEM: sleepAfterPricingMin,
            MAX_WAIT_AFTER_PRICING_ITEM: sleepAfterPricingMax,
            MIN_SHOP_NAVIGATION_COOLDOWN: sleepBeforeNavigatingToNextPageMin,
            MAX_SHOP_NAVIGATION_COOLDOWN: sleepBeforeNavigatingToNextPageMax,
            MIN_SHOP_SEARCH_FOR_INPUT_BOX: sleepSearchPriceInputBoxMin,
            MAX_SHOP_SEARCH_FOR_INPUT_BOX: sleepSearchPriceInputBoxMax,
            MIN_SHOP_CLICK_UPDATE: sleepWaitForUpdateMin,
            MAX_SHOP_CLICK_UPDATE: sleepWaitForUpdateMax,

            //Security;
            MIN_TYPING_SPEED: typingSleepMin,
            MAX_TYPING_SPEED: typingSleepMax,
            SHOULD_ENTER_PIN: isEnteringPINAutomatically,
            NEOPETS_SECURITY_PIN: playerPIN,
            MIN_WAIT_BEFORE_UPDATE: sleepAfterPinMin,
            MAX_WAIT_BEFORE_UPDATE: sleepAfterPinMax,
        } = autobuyerVariables;

        //######################################################################################################################################


        ///////# Loading the Shop Stock in the Extension;

        const hrefLinks = [];

        // Calling all the shop pages for processing;
        async function ProcessAllPages() {
            // If there are no other pages, then this is the only page the shop has;
            if(hrefLinks.length == 0){
                hrefLinks.push(window.location.href);
            }

            // Checking all links;
            for (let pageIndex = 0; pageIndex < hrefLinks.length; pageIndex++) {
                await ProcessPageData(pageIndex);

                // If it's the last page, let the user know the process is complete;
                if(pageIndex == hrefLinks.length - 1){
                    setVARIABLE("SHOP_INVENTORY", rowsItems);
                    setVARIABLE("AUTOPRICER_STATUS", "Inactive");
                    UpdateBannerAndDocument("The shop inventory has been successfully saved! Return to NeoBuyer+ and close this window.");
                    setVARIABLE("INVENTORY_UPDATED", true);
                }
            }
        }

        var rowsItems = [];
        var currentIndex = 0;
        const vetoWords = ['Enter your PIN:', 'Remove All', 'Name'];

        // Process the contents inside the page;
        async function ProcessPageData(pageIndex) {
            // Fetching the page and getting its contents;
            const response = await fetch(hrefLinks[pageIndex]);
            const pageContent = await response.text();

            // Parsing the page's contents;
            const parser = new DOMParser();
            const pageDocument = parser.parseFromString(pageContent, 'text/html');
            const form = pageDocument.querySelector('form[action="process_market.phtml"][method="post"]');
            const table = form.querySelector('table[cellspacing="0"][cellpadding="3"][border="0"]');
            const rows = table.querySelectorAll('tr');

            // Processing all the rows of the stocked table;
            rows.forEach((row, rowIndex) => {
                // Extracting the item row and name;
                const nameRow = row.querySelector('td:first-child');
                const itemName = nameRow.textContent.trim();

                // Extracting the input box;
                const inputElements = row.querySelectorAll('td input[name^="cost_"]');
                var priceContent = 0;
                try { priceContent = inputElements[0].value; } catch {}

                // Checking if it's a veto word;
                const isVetoWord = vetoWords.includes(itemName);

                //If it's not a veto word, store the data in the shop list;
                if (!isVetoWord) {
                    const stockCell = row.querySelector('td:nth-child(3)').querySelector("b");
                    const inStock = parseInt(stockCell.textContent); // Stores the amount of 'X' item in stock;

                    // Saving in the shop list;
                    const item = new Item(itemName, priceContent, true, rowIndex, currentIndex, inStock);
                    currentIndex++;
                    rowsItems.push(item);
                }
            });

            if(!shouldImportSales) return;

            // Fetching history data;
            const salesResponse = await fetch("https://www.neopets.com/market.phtml?type=sales");
            const salesContent = await salesResponse.text();

            // Parsing the history's contents;
            const historyParser = new DOMParser();
            const historyDocument = historyParser.parseFromString(salesContent, 'text/html');
            const tableElement = historyDocument.querySelector('form[action="market.phtml"]')?.parentElement.parentElement.parentElement;
            if (!tableElement) {
                return;
            }
            const trElements = tableElement.querySelectorAll("tr");

            var historyItems = [];

            var now = new Date(),
            todayDate = now.getDate(),
            todayMonth = now.getMonth() + 1,
            todayYear = now.getFullYear();

            // Processing all the history data into an array;
            trElements.forEach(function(tr){
                const tdElements = tr.querySelectorAll("td");
                
                // Parsing the data;
                try{
                    var dateParts = tdElements[0].textContent.split("/");

                    var entry = {
                        "Date & Time": dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2],
                        Item: tdElements[1].textContent,
                        Buyer: tdElements[2].textContent,
                        Price: ParseNPNumber(tdElements[3].textContent),
                        Entries: 1,
                        Profit: 0,
                    }
                    
                    var isASaleFromToday = todayYear == Number(dateParts[2]) && todayMonth == Number(dateParts[1]) && Number(todayDate == dateParts[0]);

                    // Do not include today's sales;
                    if(!isASaleFromToday){
                        // Find the entry to edit its data later;
                        var foundEntry = historyItems.find(item =>
                            item["Date & Time"] === entry["Date & Time"] &&
                            item.Item === entry.Item &&
                            item.Buyer === entry.Buyer &&
                            item.Price === entry.Price
                        );

                        if(foundEntry == undefined){
                            historyItems.push(entry);
                        } 
                        // Increase the number of times this item has appeared in the shop sales history and increment the profit;
                        else { 
                            foundEntry.Entries += 1;
                            foundEntry.Profit = foundEntry.Price * foundEntry.Entries;
                        }
                    }
                } catch {}
            });

            // Filter objects out of the historyItems that are in the extension's local shopHistory;
            var filteredHistoryItems = historyItems.filter(shopItem => {
                // If the information matches, then the item is already listed, returning true;
                var matchingObject = shopHistory.find(historyItem =>
                    historyItem["Date & Time"] === shopItem["Date & Time"] &&
                    historyItem.Item === shopItem.Item &&
                    historyItem.Buyer === shopItem.Buyer &&
                    historyItem.Price === shopItem.Price
                );
                
                return !matchingObject;
            // Filtering invalid items;
            }).filter(item => item["Date & Time"] != "undefined/Date/undefined");

            setVARIABLE("SHOP_HISTORY", [...shopHistory, ...filteredHistoryItems]);
        }

        LoadPageLinks();

        // Parsing the shop pages links to access them later;
        function LoadPageLinks(){
            document.querySelectorAll('p[align="center"] a').forEach(link => {
                const href = link.getAttribute('href');
                hrefLinks.push(href);
            });
            
            hrefLinks.shift();
        }


        //######################################################################################################################################


        // A list separated from the shop list so the system knows what to price;
        var autoPricingList = [];   

        var isActive = await getVARIABLE("START_AUTOPRICING_PROCESS");

        if(isActive || isKQRunning){
            var status = await getVARIABLE("UPDATE_STATUS_A");

            if(!status){
                UpdateBannerAndDocument(updateAlert, updateBanner);
                chrome.runtime.sendMessage({ action: "outdatedVersion" });
                return;
            } 
        }

        var usernameElement, username;

        function LoadUsernameData(){
            try {
                usernameElement = document.querySelector('a.text-muted');
                username = usernameElement.textContent;
            } catch {}
        }

        if(isActive){
            /* If the user is inside the SW and the AutoPricing process is active, the extension will begin
            * pricing the "AutoPricerInventory" list, saving its values and updating them with the lowest
            * prices available;
            */
            StartSWPricing();
        } else {
            /* A user can be inside the SW while also AutoPricing, this circumvents that issue;
            * This function either loads or submits prices depending on the current state of the AutoPricer;
            */

            if(isKQRunning){
                await KQSearch();
            } else {
                StartInventoryScrapingOrSubmitting();
            }
        }

        // Selects lowest prices to price the currently stocked items in the shop;
        async function StartSWPricing(){
            // Detect page errors;
            if(isInErrorPage) return;

            var wizardURL = "https://www.neopets.com/shops/wizard.phtml";

            //If the user is in the Shop Wizard page;
            if(!window.location.href.includes(wizardURL)){
                /* A user can be inside the SW while also AutoPricing, this circumvents that issue;
                * This function either loads or submits prices depending on the current state of the AutoPricer;
                */
                UpdateBannerAndDocument("The AutoPricer is running, the Neobuyer's+ shop inventory will not be updated. Cancel the process if necessary...");

                return;
            }

            setVARIABLE("AUTOPRICER_STATUS", "Navigating to SW...");

            var list = await getVARIABLE("AUTOPRICER_INVENTORY");
            var currentPricingIndex = await getVARIABLE("CURRENT_PRICING_INDEX");

            // Check the currently priced item;
            autoPricingList = list;

            //If the pricing list has been completed, end the AutoPricing process;
            AutoSubmitPrices(autoPricingList.length, currentPricingIndex);

            var itemToSearch = autoPricingList[currentPricingIndex];
            var nameToSearch = itemToSearch.Name;

            if(!isTurbo) await Sleep(sleepWhileNavigatingToSWMin, sleepWhileNavigatingToSWMax);
            
            if(DetectFaerieQuest(isInErrorPage)) return;

            // If the box exists, then introduce the name on it;
            setVARIABLE("AUTOPRICER_STATUS", `Searching ${nameToSearch}...`);

            const searchBox = document.getElementById("shopwizard");

            if(!isTurbo){
                await SimulateKeyEvents(searchBox, nameToSearch);
                await Sleep(sleepInSWPageMin, sleepInSWPageMax);
            }

            await CheckForBan();

            // Click the button for the search;
            await PressSearch();
            
            // Checking if the search was made correctly;
            WaitForElement(".wizard-results-text", 0).then((resultsTextDiv) => {
                var h3Element = resultsTextDiv.querySelector('h3');

                // If the name introduced was not valid, then refresh;
                if(h3Element.textContent === '...'){
                    window.location.reload();
                }
            });

            if(!isTurbo) await Sleep(sleepInSWPageMin, sleepInSWPageMax);

            // The amount of times the extension should search for lower prices;
            await PressResubmit();

            // Getting the lowest price;
            await WaitForElement(".wizard-results-grid-header", 0).then(async (searchResults) => {
                var ownerElements = searchResults.parentNode.querySelectorAll("li");
                
                var ownerName = '', bestPrice = 0;

                LoadUsernameData();

                //Don't change the price if it's already the cheapest item in the list;
                function CheckIfUserIsLowestPrice(){
                    if(username == ownerName){
                        setVARIABLE("AUTOPRICER_STATUS", `${username} Already has the Lowest Price Available! Skipping...`);
                        UpdateShopInventoryWithValue(itemToSearch, itemToSearch.Price);
                        return true;
                    }
                }

                // Checking if an owner is frozen;
                for(var i = 1; i < ownerElements.length; i++){
                    // Extracting all the table data;
                    var entry = ownerElements[i];
                    var ownerElement = entry.querySelector("a");
                    var ownerLink = ownerElement.getAttribute("href");
                    var currentOwnerPrice = ParseNPNumber(entry.querySelector("div").textContent);
                    var percentageDifference = 0;

                    /* Measuring the price difference to see if the user has an abnormally low 
                        * price, maybe meaning it was frozen. This saves in requests and processing 
                        * time for AutoPricing */
                    try {
                        var nextOwnerPrice = ParseNPNumber(ownerElements[i + 1].querySelector("div").textContent);

                        percentageDifference = CalculatePercentageDifference(currentOwnerPrice, nextOwnerPrice);
                    } catch { }

                    ownerName = ownerElement.textContent;
                    bestPrice = currentOwnerPrice;

                    CheckIfUserIsLowestPrice();

                    // Sending and reading a request to know if the shop user is frozen;
                    if(shouldCheckIfFrozenShop && percentageDifference > 50){
                        var isFrozen = await CheckShopFrozenStatus(ownerLink);

                        if(!isFrozen){
                            UpdateBannerAndDocument(`Abnormally low priced ${nameToSearch} detected. NeoBuyer+ will not price this item.`, 
                                                    "Abnormally priced item");
    
                            UpdateShopInventoryWithValue(itemToSearch, 0);

                            return;
                        }
                    // If the user decided to not check if the user's shop is frozen, then return the first value;
                    } else {
                        if(percentageDifference > 50){
                            UpdateBannerAndDocument(`Abnormally low priced ${nameToSearch} detected. NeoBuyer+ will not price this item.`, 
                                                    "Abnormally priced item");

                            UpdateShopInventoryWithValue(itemToSearch, 0);

                            return;
                        }

                        break;
                    }
                }

                // Calculates the percentage difference between 2 numbers to know if a user has been frozen or not;
                function CalculatePercentageDifference(oldValue, newValue) {
                    return Math.abs((newValue - oldValue) / oldValue) * 100;
                }

                async function CheckShopFrozenStatus(ownerLink, maxRetries = 3, retryDelay = 2000) {
                    let retries = 0;
                
                    while (retries < maxRetries) {
                        try {
                            const shopResponse = await fetch(ownerLink);
                            
                            if (shopResponse.ok) {
                                const shopContent = await shopResponse.text();
                                const shopDocument = new DOMParser().parseFromString(shopContent, 'text/html');
                                const isOwnerFrozen = shopDocument.body.textContent.includes("Sorry - The owner of this shop has been frozen!");
                                return isOwnerFrozen;
                            }
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                
                        // If the request fails, wait for a while before retrying
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        retries++;
                    }
                
                    throw new Error(`Failed to fetch data from ${ownerLink} after ${maxRetries} retries.`);
                }

                var deductedPrice = 0;

                switch(pricingType){
                    case "Percentage":
                        PercentagePricingCalculation();
                    break;

                    case "Absolute":
                        AbsolutePricingCalculation();
                    break;

                    case "Random":
                        var pricingAlgorithmOptions = ["Percentage", "Absolute"];
                        var randomIndex = GetRandomInt(0, pricingAlgorithmOptions.length);

                        switch(pricingAlgorithmOptions[randomIndex]){
                            case "Percentage":
                                PercentagePricingCalculation();
                            break;

                            case "Absolute":
                                AbsolutePricingCalculation();
                            break;
                        }
                    break;
                }
                
                function PercentagePricingCalculation(){
                    var percentageBestPrice = Math.floor(CalculatePercentagePrices(bestPrice, true));

                    switch(percentageAlgorithmType){
                        case "Zeroes":
                            deductedPrice = RoundToNearestUnit(percentageBestPrice);
                        break;

                        case "Nines":
                            deductedPrice = RoundToNearestUnit(percentageBestPrice, true);
                        break;

                        case "Random":
                            const percentagePricingOptions = ["Zeroes", "Nines", "Unchanged"];
                            var randomIndex = GetRandomIntExclusive(0, percentagePricingOptions.length);

                            switch(percentagePricingOptions[randomIndex]){
                                case "Zeroes": deductedPrice = RoundToNearestUnit(percentageBestPrice); break;
                                case "Nines": deductedPrice = RoundToNearestUnit(percentageBestPrice, true); break;
                                case "Unchanged": deductedPrice = percentageBestPrice; break;
                            }
                        break;

                        case "Unchanged":
                            deductedPrice = percentageBestPrice;
                        break;
                    }
                }

                function AbsolutePricingCalculation(){
                    switch(fixedAlgorithmType){
                        case "True Absolute":
                            deductedPrice = Clamp(bestPrice - fixedPricingDeduction, 0, 999999);
                        break;

                        case "Random Absolute":
                            deductedPrice = Clamp(bestPrice - GetRandomInt(minFixedPricingDeduction, maxFixedPricingDeduction), 0, 999999);
                        break;

                        case "Both":
                            var absolutePricingOptions = ["True Absolute", "Random Absolute"];
                            var randomIndex = GetRandomInt(0, absolutePricingOptions.length);

                            switch(absolutePricingOptions[randomIndex]){
                                case "True Absolute":
                                    deductedPrice = Clamp(bestPrice - fixedPricingDeduction, 0, 999999);
                                break;

                                case "Random Absolute":
                                    deductedPrice = Clamp(bestPrice - GetRandomInt(minFixedPricingDeduction, maxFixedPricingDeduction), 0, 999999);
                                break;
                            }
                        break;
                    }
                }

                function RoundToNearestUnit(number, hasNines = false){
                    var zeroesToAdd = number.toString().length - 2;
                    var unitString = "1" + "0".repeat(zeroesToAdd);
                    var unit = Number(unitString);

                    if(hasNines) return CalculateThousand(number, unit, 1);
                    return CalculateThousand(number, unit);
                }

                function CalculateThousand(number, unit, subtraction = 0){
                    return Math.round(number / unit) * unit - subtraction;
                }

                function CalculatePercentagePrices(number, isSubtractingPercentage = false){
                    if(isRandomPercentage || isSubtractingPercentage) {
                        return number * (1 - parseFloat((GetRandomFloat(percentageDeductionMin, percentageDeductionMax) * 0.01).toFixed(3)));
                    } else { // If the subtracted percentage is fixed;
                        return number * (1 - (fixedPercentageDeduction * 0.01));
                    }
                }

                deductedPrice = Math.floor(deductedPrice);
                autoPricingList[currentPricingIndex].Price = deductedPrice;

                setVARIABLE("AUTOPRICER_INVENTORY", autoPricingList);

                UpdateShopInventoryWithValue(itemToSearch, deductedPrice);

                setVARIABLE("AUTOPRICER_STATUS", `${nameToSearch} Best Price Found! Priced at ${bestPrice}...`);
            });

            ContinueAutoPricing(currentPricingIndex);
        }

        async function ContinueAutoPricing(currentPricingIndex){
            // Increment currentIndex
            setVARIABLE("CURRENT_PRICING_INDEX", ++currentPricingIndex);
            await Sleep(sleepNewSearchMin, sleepNewSearchMax);

            //Starting a new search;
            if(!isTurbo){
                WaitForElement(".button-default__2020.button-blue__2020.wizard-button__2020[type='submit'][value='New Search']", 0).then((newSearchButton) => {
                    newSearchButton.click();
                })
            } else {
                try{
                    window.location.href = `https://www.neopets.com/shops/wizard.phtml?string=${encodeURIComponent(autoPricingList[currentPricingIndex].Name)}`;
                } catch {
                    window.location.reload();
                }
            }
        }

        async function AutoSubmitPrices(listLength, currentPricingIndex){
            if(listLength - 1 < currentPricingIndex){
                setVARIABLE("CURRENT_PRICING_INDEX", 0);
                setVARIABLE("START_AUTOPRICING_PROCESS", false);
                setVARIABLE("AUTOPRICER_STATUS", "AutoPricing Complete!");

                // Submitting the prices automatically;
                var isSubmittingAutomatically = await getVARIABLE("SHOULD_SUBMIT_AUTOMATICALLY");

                if(isSubmittingAutomatically){
                    if(!isTurbo) await Sleep(sleepBeforeNavigatingToNextPageMin, sleepBeforeNavigatingToNextPageMax);
                    setVARIABLE("NEXT_PAGE_INDEX", 1);
                    setVARIABLE("SUBMIT_PRICES_PROCESS", true);
                    setVARIABLE("START_INVENTORY_PROCESS", false);

                    var entireShopStock = await getVARIABLE("SHOP_INVENTORY");

                    for(var i = 0; i < entireShopStock.length; i++){
                        entireShopStock[i].IsPricing = true;
                    }

                    setVARIABLE("INVENTORY_UPDATED", true);
                    setVARIABLE("SHOP_INVENTORY", entireShopStock);
                    window.open('https://www.neopets.com/market.phtml?type=your', '_blank');
                } else {
                    UpdateBannerAndDocument("AutoPricing done! Return to NeoBuyer+ and press the 'Submit Prices' button.", "Process Complete!");
                }
            }
        }

        // DetectFaerieQuest(); If the item search box is missing in thew Shop Missing, the user is in a quest;
        function DetectFaerieQuest(isInErrorPage){
            var wizardURL = "https://www.neopets.com/shops/wizard.phtml";

            if(window.location.href.includes(wizardURL) && PageIncludes("Ancient laws of magic and all that") && !isInErrorPage){
                UpdateBannerAndDocument("You are currently in a Faerie Quest.");
                setVARIABLE("AUTOPRICER_STATUS", "Faerie Quest Detected, Process Stopped.");
                CancelAutoPricer();
                return true;
            }
        }

        // PressSearch(); Press the search button in the SW page;
        async function PressSearch(){
            // Click the button for the search;
            WaitForElement(".button-search-white", 0).then((searchButton) => {
                searchButton.click();
            });

            if(!isTurbo) await Sleep(sleepInSWPageMin, sleepInSWPageMax);
        }

        // PressResubmit(); Press the "Resubmit" button in the SW page;
        async function PressResubmit(){
            var resubmits = 0;

            if(resubmitType == "Absolute"){
                resubmits = resubmitPresses
            } else {
                resubmits = GetRandomInt(minResubmitsPerItem, maxResubmitsPerItem);
            }

            // The amount of times the extension should search for lower prices;
            for(var i = 1; i <= resubmits; i++){
                await CheckForBan();
                
                FindLowestPricedShop(false, false);

                await Sleep(sleepThroughSearchesMin, sleepThroughSearchesMax);

                await WaitForElement("#resubmitWizard", 0).then((resubmitButton) => {
                    resubmitButton.click();
                });
            }
        }

        async function CheckForBan(){
            // Find all paragraphs;
            const paragraphs = document.querySelectorAll('p');
            
            return new Promise(async (resolve) => {
                for (const paragraph of paragraphs) {
                    const contents = paragraph.textContent;
            
                    if (contents.includes('I am too busy right now, please come back in about ')) {
                        var bannedMinutes = contents.replace("I am too busy right now, please come back in about ", "");
                        bannedMinutes = Number(bannedMinutes.replace(" minutes and I can help you out.", ""));
                        setVARIABLE("AUTOPRICER_STATUS", `Shop Wizard Ban Detected! Sleeping for ${bannedMinutes} Minutes or so...`);
                        setVARIABLE("AUTOKQ_STATUS", `Shop Wizard Ban Detected! Sleeping for ${bannedMinutes} Minutes or so...`);

                        UpdateBannerAndDocument("You are currently Shop Wizard Banned.");

                        bannedMinutes *= 60000;

                        // Sleep for the SW banned minutes and refresh the window;
                        await Sleep(bannedMinutes + Number(sleepIfBannedMin), bannedMinutes + Number(sleepIfBannedMax))
                        resolve();
                        setVARIABLE("AUTOPRICER_STATUS", `Shop Wizard is Usable Again!`);
                        setVARIABLE("AUTOKQ_STATUS", "Shop Wizard is Usable Again!");
                        window.location.reload();
                    }
                }

                resolve();
            });
        }

        // Loads and edits the stored shop inventory and sets a price to items;
        async function UpdateShopInventoryWithValue(itemToSearch, price){
            var shopList = await getVARIABLE("SHOP_INVENTORY");

            shopList[itemToSearch.Index - 1].Price = price;
            shopList[itemToSearch.Index - 1].IsPricing = false;
            setVARIABLE("SHOP_INVENTORY", shopList);
            setVARIABLE("INVENTORY_UPDATED", true);
        }

        // Loading or submitting of prices;
        async function StartInventoryScrapingOrSubmitting(){
            var marketURL = "https://www.neopets.com/market.phtml?";

            //If the player is in the market;
            if(window.location.href.includes(marketURL)){
                // Check if the system can submit prices;
                var canSubmit = await getVARIABLE("SUBMIT_PRICES_PROCESS");

                if(!canSubmit){
                    var canScrapeInventory = await getVARIABLE("START_INVENTORY_PROCESS");

                    //If it can't, then it will be loading the stock into the extension;
                    if(canScrapeInventory){
                        ProcessAllPages();
                        setVARIABLE("START_INVENTORY_PROCESS", false);
                    }
                    
                    return;
                } else {
                    StartPriceSubmitting();
                }
            }
        }

        // Resets the AutoPricer to its initial state;
        function CancelAutoPricer(){
            setVARIABLE("START_AUTOPRICING_PROCESS", false);
            setVARIABLE("AUTOPRICER_INVENTORY", []);
            setVARIABLE("INVENTORY_UPDATED", true);
            setVARIABLE("CURRENT_PRICING_INDEX", 0);
            setVARIABLE("SUBMIT_PRICES_PROCESS", false);
        }

        async function StartPriceSubmitting(){
            await PriceItemsInPage();
            await NavigateToNextPage();
        }

        // Loads elements from the shop page to inject the calculated prices;
        async function PriceItemsInPage() {
            return new Promise(async (resolve) => {
                setVARIABLE("AUTOPRICER_STATUS", "Navigating to Shop's Stock...");

                var form = null;
                form = await WaitForElement('form[action="process_market.phtml"][method="post"]', 0);

                // Extract all the table from the form;
                const table = form.querySelector('table[cellspacing="0"][cellpadding="3"][border="0"]');

                // Extracting all the input and read parameters of the table;
                const rows = table.querySelectorAll('tr');
                const pinInput = document.querySelector('input[type="password"][name="pin"]');
                const updateButton = document.querySelector('input[type="submit"][value="Update"]');

                // Saving all the data in its respective array;
                await InputDataInShop(rows);
                await PressUpdateButton(pinInput, updateButton);

                resolve(); // Resolve the PriceItemsInPage promise after all operations are done
            });
        }

        var updatedPrices = false;

        // Saving the data in the shop input values;
        async function InputDataInShop(rows){
            for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
                // Getting the row data in the table;
                const row = rows[rowIndex];
                const nameRow = row.querySelector('td:first-child');
                const inputElements = row.querySelector('td input[name^="cost_"]');

                // Checking if the name is not a veto word;
                const itemName = nameRow.textContent.trim();
                const isVetoWord = vetoWords.includes(itemName);

                if(!isVetoWord){
                    await new Promise(async (resolve) => {
                        var list = await getVARIABLE("SHOP_INVENTORY");

                        // Extracting the items from the list;
                        const item = list.find(item => item.Name === itemName); // Finding the Item object based on its name in the table;

                        var itemPrice;

                        try {
                            itemPrice = parseInt(item.Price);
                        } catch {
                            resolve();
                            return;
                        }
                        
                        // If the price is NOT worth changing;
                        if (itemPrice == parseInt(inputElements.value) || !item.IsPricing) {
                            resolve(); // Skip the current item and move to the next
                            return;
                        }

                        setVARIABLE("AUTOPRICER_STATUS", `Pricing ${itemName} at ${itemPrice} NPs...`);

                        // Get a reference to the input element
                        const inputElement = document.querySelector(`input[name="cost_${rowIndex}"]`);
                        if(!isTurbo) await Sleep(sleepSearchPriceInputBoxMin, sleepSearchPriceInputBoxMax);

                        // Clear the current value in the input field
                        inputElement.value = "";

                        // The value you want to input
                        const desiredValue = itemPrice.toString();
                        await SimulateKeyEvents(inputElement, desiredValue);

                        updatedPrices = true;
                        resolve(); // Continue to the next item
                    });
                }
            }
        }

        // Go to the next page in the page for pricing;
        async function GetNextPage(){
            var index = await getVARIABLE("NEXT_PAGE_INDEX");

            if(index < hrefLinks.length){
                setVARIABLE("NAVIGATE_TO_NEXT_PAGE", true);
            } else {
                var canSubmit = await getVARIABLE("SUBMIT_PRICES_PROCESS");
                
                if(canSubmit){
                    setVARIABLE("SUBMIT_PRICES_PROCESS", false);
                    setVARIABLE("AUTOPRICER_STATUS", `The AutoPricing Process has Completed Successfully!`);
                    UpdateBannerAndDocument("The AutoPricing process has completed successfully!");
                }
            }
        }

        // Press the 'Update' button in the shop to update its prices;
        async function PressUpdateButton(pinInput, updateButton){
            if(!isEnteringPINAutomatically){
                UpdateBannerAndDocument("Please Enter your PIN manually. The AutoPricing process has priced page, to continue fill the PIN input box.");
                
                async function WaitForPIN(pinInput){
                    return new Promise(async (resolve) => {
                        var intervalID = setInterval(() => {
                            var isValidPIN = pinInput.value.length === 4;

                            if (isValidPIN) {
                                clearInterval(intervalID);
                                resolve();
                            }
                        }, 100);
                    });
                }

                await WaitForPIN(pinInput);
            }

            if(updatedPrices){
                await Sleep(sleepAfterPricingMin, sleepAfterPricingMax);

                if(pinInput && isEnteringPINAutomatically){
                    await SimulateKeyEvents(pinInput, playerPIN);
                    await Sleep(sleepAfterPinMin, sleepAfterPinMax);
                }
            }

            if(pinInput.value != "") updateButton.click();
            GetNextPage();
            setVARIABLE("AUTOPRICER_STATUS", `Prices Updated!`);
        }

        var currentPageLink = null;

        async function NavigateToNextPage(){
            return new Promise(async (resolve) => {
                await Sleep(sleepWaitForUpdateMin, sleepWaitForUpdateMax);
                var canNavigate = await getVARIABLE("NAVIGATE_TO_NEXT_PAGE");
                var index = await getVARIABLE("NEXT_PAGE_INDEX");

                currentPageLink = hrefLinks[index];
                if(currentPageLink === undefined || currentPageLink === null) return;
                window.location.href = currentPageLink;
                setVARIABLE("NAVIGATE_TO_NEXT_PAGE", false);
                setVARIABLE("NEXT_PAGE_INDEX", ++index);
                if(canNavigate) setVARIABLE("AUTOPRICER_STATUS", `Navigating to the Shop's Next Page...`);

                resolve();
            });
        }

        // Setting KQ Searches for AutoBuying;
        async function KQSearch(){
            if(DetectFaerieQuest(isInErrorPage)) return;

            await CheckForBan();
            
            await PressSearch();

            await Sleep(sleepInSWPageMin, sleepInSWPageMax);

            // The amount of times the extension should search for lower prices;
            await PressResubmit();

            FindLowestPricedShop(true, true);
        }

        async function FindLowestPricedShop(mustTriggerNavigation = false, isLastSearch = false){

            // Automatically buys an item if its below a certain price threshold;
            if(isKQRunning){
                await WaitForElement('.wizard-results-grid li', 3).then(async (searchResults) => {
                    // Removing the table head;
                    searchResults = Array.from(searchResults);
                    searchResults.shift();
                    LoadUsernameData();

                    RecursivelyProcessSearchResults(0);
                    
                    function RecursivelyProcessSearchResults(index) {
                        // Exit the recursion in case no price is good;
                        if (index >= searchResults.length) {
                            if(isLastSearch) window.location.reload();
                            return;
                        }
                    
                        const result = searchResults[index];
                        const ownerElement = result.querySelector("a");
                        const priceElement = result.querySelector("div");
                    
                        const lowestPrice = ParseNPNumber(priceElement.textContent);
                        const ownerName = ownerElement.textContent;
                    
                        // If the lowest price is greater than the price the user is willing to pay, search again;
                        if (lowestPrice >= maxSpendablePrice && isLastSearch) {
                            window.location.reload();
                            setVARIABLE("AUTOKQ_STATUS", `Retrying Search as the Price ${lowestPrice} Goes Above the NP Limit...`);
                            return;
                        }
                    
                        // Buy an item if it's not from the user and is within the payable price;
                        if ((lowestPrice <= maxInstaBuyPrice || mustTriggerNavigation) && (username != ownerName)) {
                            ownerElement.click();
                            setVARIABLE("AUTOKQ_STATUS", `Navigating to a Shop Owned by ${ownerName}...`);
                            return;
                        }
                    
                        // Check for the next item if necessary;
                        RecursivelyProcessSearchResults(index + 1);
                    }
                });
            }
        }


        //######################################################################################################################################

        // Limits a value to its minimum or maximum depending on its ceiling or floor;
        function Clamp(value, min, max){ return Math.min(Math.max(value, min), max); }

        // Simulates real key presses character-by-character;
        async function SimulateKeyEvents(inputElement, desiredValue){
            // Extracting characters;
            for (const char of desiredValue.toString()) {
                // Sending the Keyboard Key Down event;
                const keyEventDown = new KeyboardEvent("keydown", {
                    key: char,
                    bubbles: true,
                    cancelable: true,
                });

                // Dispatch keydown event
                inputElement.value += char;

                // Sending the Keyboard Key Up event;
                const keyEventUp = new KeyboardEvent("keyup", {
                    key: char,
                    bubbles: true,
                    cancelable: true,
                });

                // Dispatch keyup event
                inputElement.dispatchEvent(keyEventUp);
                await Sleep(typingSleepMin, typingSleepMax); // Adjust the min and max sleep times as needed
            }

            // Trigger an input event to simulate user input
            const inputEvent = new Event("input", {
                bubbles: true,
                cancelable: true,
            });

            inputElement.dispatchEvent(inputEvent);
        }
    }));
}

// Exectute AutoPricer;
RunAutoPricer();