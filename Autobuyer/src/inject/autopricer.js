var isInErrorPage = false;

// If the Neopets page sends an error, reload;
function HandleServerErrors() {
    const bodyText = document.body.innerText;
    var error502 = bodyText.includes("502 Bad Gateway\nopenresty");
    var error504 = bodyText.includes("504 Gateway Time-out\nopenresty");
    var captcha = bodyText.includes("Loading site please wait...");
    var certError = bodyText.includes("NET::ERR_CERT_COMMON_NAME_INVALID")
    
    if (error502 || error504 || captcha || certError) {
        isInErrorPage = true;

        setTimeout(() => {
            location.reload();
        }, 10000); // Reload after 10 seconds
    }

    window.addEventListener('error', function (event) {
        if (event.message && event.message.includes('net::ERR_CERT_COMMON_NAME_INVALID')) {
            window.location.reload();
        }
    });
}

HandleServerErrors();


//######################################################################################################################################


function setSUBMIT_PRICES_PROCESS(value) {
    chrome.storage.local.set({ SUBMIT_PRICES_PROCESS: value }, function () {});
}

function getSUBMIT_PRICES_PROCESS(callback) {
    chrome.storage.local.get(['SUBMIT_PRICES_PROCESS'], function (result) {
        const value = result.SUBMIT_PRICES_PROCESS;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setSHOP_INVENTORY(value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ SHOP_INVENTORY: value }, function () {
            resolve();
        });
    });
}

function getSHOP_INVENTORY(callback) {
    chrome.storage.local.get(['SHOP_INVENTORY'], function (result) {
        const value = result.SHOP_INVENTORY;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setINVENTORY_UPDATED(value) {
    chrome.storage.local.set({ INVENTORY_UPDATED: value }, function () {});
}

function getINVENTORY_UPDATED(callback) {
    chrome.storage.local.get(['INVENTORY_UPDATED'], function (result) {
        const value = result.INVENTORY_UPDATED;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setSTART_INVENTORY_PROCESS(value) {
    chrome.storage.local.set({ START_INVENTORY_PROCESS: value }, function () {});
}

function getSTART_INVENTORY_PROCESS(callback) {
    chrome.storage.local.get(['START_INVENTORY_PROCESS'], function (result) {
        const value = result.START_INVENTORY_PROCESS;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setSTART_AUTOPRICING_PROCESS(value) {
    chrome.storage.local.set({ START_AUTOPRICING_PROCESS: value }, function () {});
}

function getSTART_AUTOPRICING_PROCESS(trueCallback, falseCallback) {
    chrome.storage.local.get(['START_AUTOPRICING_PROCESS'], function (result) {
        const value = result.START_AUTOPRICING_PROCESS;

        if (value === true && typeof trueCallback === 'function') {
            trueCallback();
        } else if (value === false && typeof falseCallback === 'function') {
            falseCallback();
        }
    });
}

function setAUTOPRICER_INVENTORY(value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ AUTOPRICER_INVENTORY: value }, function () {
            resolve();
        });
    });
}

function getAUTOPRICER_INVENTORY(callback) {
    chrome.storage.local.get(['AUTOPRICER_INVENTORY'], function (result) {
        const value = result.AUTOPRICER_INVENTORY;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function getSUBMIT_PRICES_PROCESS(callback) {
    chrome.storage.local.get(['SUBMIT_PRICES_PROCESS'], function (result) {
        const value = result.SUBMIT_PRICES_PROCESS;

        if (value === undefined || value === null) {
            setSUBMIT_PRICES_PROCESS(false);
        }

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setNAVIGATE_TO_NEXT_PAGE(value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ NAVIGATE_TO_NEXT_PAGE: value }, function () {
            resolve();
        });
    });
    
}

function getNAVIGATE_TO_NEXT_PAGE(callback) {
    chrome.storage.local.get(['NAVIGATE_TO_NEXT_PAGE'], function (result) {
        const value = result.NAVIGATE_TO_NEXT_PAGE;

        if (value === undefined || value === null) {
            setNAVIGATE_TO_NEXT_PAGE(true);
        }

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setNEXT_PAGE_INDEX(value) {
    chrome.storage.local.set({ NEXT_PAGE_INDEX: value }, function () {});
}

function getNEXT_PAGE_INDEX(callback) {
    chrome.storage.local.get(['NEXT_PAGE_INDEX'], function (result) {
        const value = result.NEXT_PAGE_INDEX;

        if (value === undefined || value === null) {
            setNEXT_PAGE_INDEX(1);
        }

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setCURRENT_PRICING_INDEX(value) {
    chrome.storage.local.set({ CURRENT_PRICING_INDEX: value }, function () {});
}

function getCURRENT_PRICING_INDEX(callback) {
    chrome.storage.local.get(['CURRENT_PRICING_INDEX'], function (result) {
        const value = result.CURRENT_PRICING_INDEX;

        if(value === undefined || value === null) value = 0;

        if (typeof callback === 'function') {
            callback(typeof value === 'undefined' ? 0 : value);
        }
    });
}

function setAUTOPRICER_STATUS(value) {
    chrome.storage.local.set({ AUTOPRICER_STATUS: value }, function () {});
}


//######################################################################################################################################


RunAutoPricer();

async function RunAutoPricer(){
    if(window.location.href.includes("market.phtml?type=sales") 
    || window.location.href.includes("market.phtml?type=till")
    || window.location.href.includes("market.phtml?type=edit")) return;
    
    chrome.storage.local.get({
        // AutoPricer;
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
    }, (async function(autobuyerVariables) {
        
        // Destructing the variables extracted from the extension;
        const {
            // AutoPricer;
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

            // Shop Wizard;
            MIN_WAIT_BAN_TIME: sleepIfBannedMin,
            MAX_WAIT_BAN_TIME: sleepIfBannedMax,
            MIN_WAIT_PER_REFRESH: sleepWhileNavigatingToSWMin,
            MAX_WAIT_PER_REFRESH: sleepWhileNavigatingToSWMax,
            MIN_WAIT_PER_ACTION: sleepInSWPageMin,
            MAX_WAIT_PER_ACTION: sleepInSWPageMax,
            RESUBMITS_PER_ITEM: resubmitPresses,
            MIN_RESUBMIT_WAIT_TIME: sleepThroughSearchesMin,
            MAX_RESUBMIT_WAIT_TIME: sleepThroughSearchesMax,
            MIN_NEW_SEARCH_WAIT_TIME: sleepNewSearchMin,
            MAX_NEW_SEARCH_WAIT_TIME: sleepNewSearchMax,
            MIN_BLACKLIST_ITEM_WAIT: sleepBlacklistMin,
            MAX_BLACKLIST_ITEM_WAIT: sleepBlacklistMax,
            BLACKLIST_SW: blacklist,

            // Shop Stock Page Settings;
            MIN_WAIT_AFTER_PRICING_ITEM: sleepAfterPricingMin,
            MAX_WAIT_AFTER_PRICING_ITEM: sleepAfterPricingMax,
            MIN_SHOP_NAVIGATION_COOLDOWN: sleepAfterNavigatingToNextPageMin,
            MAX_SHOP_NAVIGATION_COOLDOWN: sleepAfterNavigatingToNextPageMax,
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
                    setSHOP_INVENTORY(rowsItems);
                    setAUTOPRICER_STATUS("Inactive");
                    window.alert("The shop inventory has been successfully saved!\nYou can close this window now.\n\nPlease return to NeoBuyer's AutoPricer page to continue.");
                    setINVENTORY_UPDATED(true);
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

        getSTART_AUTOPRICING_PROCESS(
            function() {
                /* If the user is inside the SW and the AutoPricing process is active, the extension will begin
                * pricing the "AutoPricerInventory" list, saving its values and updating them with the lowest
                * prices available;
                */
                StartSWPricing();
            }, function() {
                /* A user can be inside the SW while also AutoPricing, this circumvents that issue;
                * This function either loads or submits prices depending on the current state of the AutoPricer;
                */
                StartInventoryScrapingOrSubmitting();
            }
        );

        var wizardURL = "https://www.neopets.com/shops/wizard.phtml";

        // Selects lowest prices to price the currently stocked items in the shop;
        function StartSWPricing(){
            // Detect page errors;
            if(isInErrorPage) return;

            //If the user is in the Shop Wizard page;
            if(window.location.href != wizardURL){
                /* A user can be inside the SW while also AutoPricing, this circumvents that issue;
                * This function either loads or submits prices depending on the current state of the AutoPricer;
                */
                window.alert("The AutoPricer is running, the Neobuyer's+ shop inventory will not be updated.\n\nWait for the AutoPricer to finish or cancel the process.");

                return;
            }

            setAUTOPRICER_STATUS("Navigating to SW...");

            getAUTOPRICER_INVENTORY(function (list) {
                // Check the currently priced item;
                getCURRENT_PRICING_INDEX(async function (currentPricingIndex) {
                    autoPricingList = list;

                    //If the pricing list has been completed, end the AutoPricing process;
                    if(autoPricingList.length - 1 < currentPricingIndex){
                        setCURRENT_PRICING_INDEX(0);
                        setSTART_AUTOPRICING_PROCESS(false);
                        window.alert("AutoPricing done!\n\nReturn to NeoBuyer+ and press the 'Submit Prices' to save the new stock prices.");
                        setAUTOPRICER_STATUS("AutoPricing Complete!");
                        return;
                    }

                    var itemToSearch = autoPricingList[currentPricingIndex];
                    var nameToSearch = itemToSearch.Name;

                    // Checking if an item is inside a blacklist;
                    if(blacklist.includes(nameToSearch)){
                        setCURRENT_PRICING_INDEX(++currentPricingIndex);

                        UpdateShopInventoryWithValue(itemToSearch, 0);
                        setAUTOPRICER_STATUS(`${nameToSearch} is Blacklisted, Skipping...`);

                        // Reloading the page so the script can continue;
                        await Sleep(sleepBlacklistMin, sleepBlacklistMax);
                        window.location.reload();
                        return;
                    }
                    

                    await Sleep(sleepWhileNavigatingToSWMin, sleepWhileNavigatingToSWMax);

                    // Searching the searchbox, if the box doesn't exists, the user is in a Faerie quest;
                    var searchBox = document.getElementById("shopwizard");

                    if(searchBox === null || searchBox === undefined && !isInErrorPage){
                        window.alert(
                            "You are currently in a Faerie Quest.\n" +
                            "Please complete or cancel the quest to use NeoBuyer's+ AutoPricer.\n\n" +
                            "To continue, click 'Start AutoPricing' on the AutoPricer page.\n" +
                            "The AutoPricer will resume from the last priced item.\n" +
                            "Please avoid modifying your Shop Inventory List in the meantime.\n\n" +
                            "AutoPricer has been stopped.\n"
                        );
                        setAUTOPRICER_STATUS("Faerie Quest Detected, Process Stopped.");
                        CancelAutoPricer();
                        return;
                    }

                    // If the box exists, then introduce the name on it;
                    setAUTOPRICER_STATUS(`Searching ${nameToSearch}...`);
                    await SimulateKeyEvents(searchBox, nameToSearch);
                    await Sleep(sleepInSWPageMin, sleepInSWPageMax);

                    // Click the button for the search;
                    WaitForElement(".button-search-white", 0).then((searchButton) => {
                        searchButton.click();
                    });

                    await Sleep(sleepInSWPageMin, sleepInSWPageMax);
                    
                    // Checking if the search was made correctly;
                    WaitForElement(".wizard-results-text", 0).then((resultsTextDiv) => {
                        var h3Element = resultsTextDiv.querySelector('h3');

                        // If the name introduced was not valid, then refresh;
                        if(h3Element.textContent === '...'){
                            window.location.reload();
                        }
                    });

                    await Sleep(sleepInSWPageMin, sleepInSWPageMax);

                    // The amount of times the extension should search for lower prices;
                    for(var i = 1; i <= resubmitPresses; i++){
                        await CheckForBan();

                        await Sleep(sleepThroughSearchesMin, sleepThroughSearchesMax);

                        WaitForElement("#resubmitWizard", 0).then((resubmitButton) => {
                            resubmitButton.click();
                        });
                    }

                    // Getting the lowest price;
                    WaitForElement(".wizard-results-price", 0).then(async (searchResults) => {
                        // Parsing the string to a number;
                        var bestPrice = Number.parseInt(searchResults.textContent.replace(' NP', '').replace(',', ''));
                        var deductedPrice = 0;

                        // Subtracting a percentage of the price, so it's competitive with other results;
                        if(isRandomPercentage) {
                            deductedPrice = bestPrice * (1 - parseFloat((GetRandomFloat(percentageDeductionMin, percentageDeductionMax) * 0.01).toFixed(3)));
                        } else { // If the subtracted percentage is fixed;
                            deductedPrice = bestPrice * (1 - (fixedPercentageDeduction * 0.01));
                        }

                        deductedPrice = Math.floor(deductedPrice);

                        // Updating the price list;
                        autoPricingList[currentPricingIndex - 1].Price = deductedPrice;
                        await setAUTOPRICER_INVENTORY(autoPricingList);

                        UpdateShopInventoryWithValue(itemToSearch, deductedPrice);

                        setAUTOPRICER_STATUS(`${nameToSearch} Best Price Found! Priced at ${bestPrice}...`);
                    });

                    // Increment currentIndex
                    setCURRENT_PRICING_INDEX(++currentPricingIndex);
                    await Sleep(sleepNewSearchMin, sleepNewSearchMax);

                    //Starting a new search;
                    WaitForElement(".button-default__2020.button-blue__2020.wizard-button__2020[type='submit'][value='New Search']", 0).then((newSearchButton) => {
                        newSearchButton.click();
                    })
                });
            });
        }

        async function CheckForBan(){
            // Find all paragraphs;
            const paragraphs = document.querySelectorAll('p');
            
            return new Promise(async (resolve) => {
                for (const paragraph of paragraphs) {
                    const contents = paragraph.textContent;
            
                    if (contents.includes('I am too busy right now, please come back in about ')) {
                        var bannedMinutes = contents.replace("I am too busy right now, please come back in about ", "");
                        bannedMinutes = Number(bannedMinutes.replace(" minutes and I can help you out.", "")) * 6000;
                        setAUTOPRICER_STATUS(`Shop Wizard Ban Detected! Sleeping for ${bannedMinutes} Minutes or so...`);

                        window.alert(
                            "You are currently Shop Wizard Banned.\n\n" +
                            "You will need to wait a certain period of time before the autopricer can continue.\n" +
                            "The AutoPricer will resume from the last priced item automatically.\n" +
                            "You can either close this tab or leave it open after confirming this alert, it is up to you.\n\n" +
                            "The AutoPricer has paused.\n"
                        );

                        // Sleep for the SW banned minutes and refresh the window;
                        await Sleep(bannedMinutes + Number(sleepIfBannedMin), bannedMinutes + Number(sleepIfBannedMax))
                        resolve();
                        setAUTOPRICER_STATUS(`Shop Wizard is Usable Again! Refreshing...`);
                        window.location.reload();
                    }
                }

                resolve();
            });
        }

        // Loads and edits the stored shop inventory and sets a price to items;
        function UpdateShopInventoryWithValue(itemToSearch, price){
            getSHOP_INVENTORY(function(shopList){
                var updatedShopList = shopList;

                updatedShopList[itemToSearch.Index - 1].Price = price;
                updatedShopList[itemToSearch.Index - 1].IsPricing = false;
                setSHOP_INVENTORY(updatedShopList);
                setINVENTORY_UPDATED(true);
            });
        }

        var marketURL = "https://www.neopets.com/market.phtml?";

        // Loading or submitting of prices;
        function StartInventoryScrapingOrSubmitting(){
            //If the player is in the market;
            if(window.location.href.includes(marketURL)){
                // Check if the system can submit prices;
                getSUBMIT_PRICES_PROCESS(function (canSubmit){
                    if(!canSubmit){
                        //If it can't, then it will be loading the stock into the extension;
                        getSTART_INVENTORY_PROCESS(function (canScrapeInventory) {
                            if(canScrapeInventory){
                                ProcessAllPages();
                                setSTART_INVENTORY_PROCESS(false);
                            } 
                        });
                        return;
                    } else {
                        StartPriceSubmitting();
                    }
                });
            }
        }

        // Resets the AutoPricer to its initial state;
        function CancelAutoPricer(){
            getSTART_INVENTORY_PROCESS(false);
            setSTART_AUTOPRICING_PROCESS(false);
            setAUTOPRICER_INVENTORY([]);
            setINVENTORY_UPDATED(true);
            setCURRENT_PRICING_INDEX(0);
            setSUBMIT_PRICES_PROCESS(false);
        }

        async function StartPriceSubmitting(){
            await PriceItemsInPage();
            await NavigateToNextPage();
        }

        // Loads elements from the shop page to inject the calculated prices;
        async function PriceItemsInPage() {
            return new Promise(async (resolve) => {
                setAUTOPRICER_STATUS("Navigating to Shop's Stock...");

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
                        getSHOP_INVENTORY(async function (list){
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

                            setAUTOPRICER_STATUS(`Pricing ${itemName} at ${itemPrice} NPs...`);

                            // Get a reference to the input element
                            const inputElement = document.querySelector(`input[name="cost_${rowIndex}"]`);
                            await Sleep(sleepSearchPriceInputBoxMin, sleepSearchPriceInputBoxMax);

                            // Clear the current value in the input field
                            inputElement.value = "";

                            // The value you want to input
                            const desiredValue = itemPrice.toString();
                            await SimulateKeyEvents(inputElement, desiredValue);

                            updatedPrices = true;
                            resolve(); // Continue to the next item
                        });
                    });
                }
            }
        }

        // Go to the next page in the page for pricing;
        function GetNextPage(){
            getNEXT_PAGE_INDEX(function (index){
                if(index < hrefLinks.length){
                    setNAVIGATE_TO_NEXT_PAGE(true);
                } else {
                    getSUBMIT_PRICES_PROCESS(function (isActive){
                        if(isActive){
                            setSUBMIT_PRICES_PROCESS(false);
                            setAUTOPRICER_STATUS("AutoPricing Complete!");
                            window.alert("The AutoPricing process has completed successfully!");
                        }
                    });
                }
            });
        }

        // Press the 'Update' button in the shop to update its prices;
        async function PressUpdateButton(pinInput, updateButton){
            if(!isEnteringPINAutomatically){
                window.alert("Since you deactivated the Auto-Enter PIN option, please Enter your PIN manually.\n\nThe AutoPricing process has finished for this page, fill the PIN input box with your PIN and the system will continue to the next page automatically.");
                
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
            setAUTOPRICER_STATUS(`Prices Updated!`);
        }

        var currentPageLink = null;

        async function NavigateToNextPage(){
            return new Promise(async (resolve) => {
                await Sleep(sleepWaitForUpdateMin, sleepWaitForUpdateMax);

                getNAVIGATE_TO_NEXT_PAGE(function (canNavigate){
                    getNEXT_PAGE_INDEX(function (index){
                        currentPageLink = hrefLinks[index];
                        if(currentPageLink === undefined || currentPageLink === null) return;
                        window.location.href = currentPageLink;
                        setNAVIGATE_TO_NEXT_PAGE(false);
                        setNEXT_PAGE_INDEX(++index);
                        if(canNavigate) setAUTOPRICER_STATUS(`Navigating to the Shop's Next Page...`);
                    });
                });

                resolve();
            });
        }


        //######################################################################################################################################


        // Waits for an element to appear on the page. Can search JQuery and IDs;
        function WaitForElement(selector, index = 0) {
            return new Promise((resolve) => {
                const intervalId = setInterval(() => {
                    let element;

                    // Choosing between JQuery or ID selection;
                    switch (index) {
                        default:
                            element = document.querySelector(selector);
                            break;

                        case 1:
                            element = document.getElementById(selector);
                            break;

                        case 2:
                            // This case returns a NodeList, not a single element
                            const elements = document.querySelectorAll(selector);
                            if (elements.length > 0) {
                                element = elements[0];
                            }
                            break;
                    }

                    if (element) {
                        clearInterval(intervalId);
                        resolve(element); // Resolve with the found element
                    }
                }, 1000);
            });
        }


        // Waits 'X' amount of milliseconds. 'await Sleep(min, max)';
        function Sleep(min, max, showConsoleMessage = true) {
            const milliseconds = GetRandomFloat(min, max);
            //if(showConsoleMessage) console.log(`Sleeping for ${milliseconds / 1000} seconds...`, min, max);
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        }

        function GetRandomFloat(min, max) { return Math.random() * (max - min) + min; }

        function GetRandomInt(min, max) { return Math.floor(Math.random() * (max - min) + min); }

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