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


//######################################################################################################################################


class Item {
    constructor(Name, Price, IsPricing, Index, ListIndex, Stock) {
        this.Name = Name;
        this.Price = Price;
        this.IsPricing = IsPricing;
        this.Index = Index;
        this.ListIndex = ListIndex;
        this.Stock = Stock;
    }
}


//######################################################################################################################################


///////# Loading the Shop Stock in the Extension;

// Calling all the shop pages for processing;
async function ProcessAllPages() {
    // Checking all links;
    for (let pageIndex = 0; pageIndex < hrefLinks.length; pageIndex++) {
        await ProcessPageData(pageIndex);

        // If it's the last page, let the user know the process is complete;
        if(pageIndex == hrefLinks.length - 1){
            setSHOP_INVENTORY(rowsItems);
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

const hrefLinks = [];

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

var resubmitPresses = 3;

// Percentage subtraction control;
var isRandomPercentage = true;
var fixedPercentageDeduction = 5;
var percentageDeductionMin = 3;
var percentageDeductionMax = 8;

// Items to skip with the AutoPricer;
var blacklist = ['Forgotten Shore Map Piece', 'Petpet Laboratory Map', 'Piece of a treasure map', 'Piece of a treasure map', 'Secret Laboratory Map', 'Space Map', 'Spooky Treasure Map', 'Underwater Map Piece'];


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
    //If the user is in the Shop Wizard page;
    if(window.location.href === wizardURL){
        getAUTOPRICER_INVENTORY(function (list) {
            // Check the currently priced item;
            getCURRENT_PRICING_INDEX(async function (currentPricingIndex) {
                autoPricingList = list;

                //If the pricing list has been completed, end the AutoPricing process;
                if(autoPricingList.length - 1 < currentPricingIndex){
                    setCURRENT_PRICING_INDEX(0);
                    setSTART_AUTOPRICING_PROCESS(false);
                    window.alert("AutoPricing done!\n\nReturn to NeoBuyer+ and press the 'Submit Prices' to save the new stock prices.");
                    return;
                }

                var itemToSearch = autoPricingList[currentPricingIndex];
                var nameToSearch = itemToSearch.Name;

                // Checking if an item is inside a blacklist;
                if(blacklist.includes(nameToSearch)){
                    setCURRENT_PRICING_INDEX(++currentPricingIndex);

                    UpdateShopInventoryWithValue(itemToSearch, 0);

                    // Reloading the page so the script can continue;
                    await Sleep(sleepBlacklistMin, sleepBlacklistMax);
                    window.location.reload();
                    return;
                }

                await Sleep(sleepWhileNavigatingToSWMin, sleepWhileNavigatingToSWMax);

                // Searching the searchbox, if the box doesn't exists, the user is in a Faerie quest;
                var searchBox = document.getElementById("shopwizard");

                if(searchBox === null || searchBox === undefined){
                    window.alert(
                        "You are currently in a Faerie Quest.\n" +
                        "Please complete or cancel the quest to use NeoBuyer's+ AutoPricer.\n\n" +
                        "To continue, click 'Start AutoPricing' on the AutoPricer page.\n" +
                        "The AutoPricer will resume from the last priced item.\n" +
                        "Please avoid modifying your Shop Inventory List in the meantime.\n\n" +
                        "AutoPricer has been stopped.\n"
                    );
                    CancelAutoPricer();
                    return;
                }

                // If the box exists, then introduce the name on it;
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
    } else {
        /* A user can be inside the SW while also AutoPricing, this circumvents that issue;
         * This function either loads or submits prices depending on the current state of the AutoPricer;
         */
        window.alert("The AutoPricer is running, the Neobuyer's+ shop inventory will not be updated.\n\nWait for the AutoPricer to finish or cancel the process.");
    }
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

var currentPageLink = null;

async function NavigateToNextPage(){
    await Sleep(sleepWaitForUpdateMin, sleepWaitForUpdateMax);
    return new Promise((resolve) => {
        getNAVIGATE_TO_NEXT_PAGE(function (canNavigate){
            getNEXT_PAGE_INDEX(function (index){
                currentPageLink = hrefLinks[index];
                if(currentPageLink === undefined || currentPageLink === null) return;
                window.location.href = currentPageLink;
                setNAVIGATE_TO_NEXT_PAGE(false);
                setNEXT_PAGE_INDEX(++index);
            });
        });

        resolve();
    });
}


var playerPIN = "0000";

// Loads elements from the shop page to inject the calculated prices;
async function PriceItemsInPage(){
    return new Promise(async (resolve) => {
        var form = null;

        // The shop table is inside a form, we are calling and waiting for it;
        WaitForElement('form[action="process_market.phtml"][method="post"]', 0).then((extractedForm) => {
            form = extractedForm;
        });

        // Extract all the table from the form;
        const table = form.querySelector('table[cellspacing="0"][cellpadding="3"][border="0"]');

        // Extracting all the input and read parameters of the table;
        const rows = table.querySelectorAll('tr');
        const pinInput = document.querySelector('input[type="password"][name="pin"]');
        const updateButton = document.querySelector('input[type="submit"][value="Update"]');

        //Checking if the prices were updated to press the 'Update' button;
        var updatedPrices = false;

        //Saving all the data in its respective array;
        await InputDataInShop(rows);

        GetNextPage();

        PressUpdateButton(pinInput, updateButton);

        resolve();
    });
}

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
                    const itemPrice = parseInt(item.Price);
                    
                    // If the price is NOT worth changing;
                    if (itemPrice == parseInt(inputElements.value) || !item.IsPricing) {
                        resolve(); // Skip the current item and move to the next
                        return;
                    }

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

function GetNextPage(){
    getNEXT_PAGE_INDEX(function (index){
        if(index < hrefLinks.length){
            setNAVIGATE_TO_NEXT_PAGE(true);
        } else {
            getSUBMIT_PRICES_PROCESS(function (isActive){
                if(isActive){
                    setSUBMIT_PRICES_PROCESS(false);
                    window.alert("The AutoPricing process has completed successfully!");
                }
            });
        }
    });
}

async function PressUpdateButton(pinInput, updateButton){
    if(updatedPrices){
        await Sleep(sleepAfterPricingMin, sleepAfterPricingMax);

        if(pinInput){
            await SimulateKeyEvents(pinInput, playerPIN);
            await Sleep(sleepAfterPinMin, sleepAfterPinMax);
        }

        updateButton.click();
    }
}

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


//######################################################################################################################################


// Typing letter-by-letter speed;
var typingSleepMin = 0.03;
var typingSleepMax = 0.15;

// Wait time when the user goes to the SW to AutoPrice after every refresh;
var sleepWhileNavigatingToSWMin = 3;
var sleepWhileNavigatingToSWMax = 7;

// Wait time after every action;
var sleepInSWPageMin = 2;
var sleepInSWPageMax = 5;

// Wait time between searches;
var sleepThroughSearchesMin = 2;
var sleepThroughSearchesMax = 4;

// Wait time if the extension has to wait because of a blacklisted item;
var sleepBlacklistMin = 6;
var sleepBlacklistMax = 12;

// Wait time between new searches;
var sleepNewSearchMin = 1;
var sleepNewSearchMax = 3;

// Wait time between each price input in the player's shop;
var sleepSearchPriceInputBoxMin = 1;
var sleepSearchPriceInputBoxMax = 3;

// Wait time after pricing an item;
var sleepAfterPricingMin = 2;
var sleepAfterPricingMax = 4;

// Wait time after inputting the pin value;
var sleepAfterPinMin = 1;
var sleepAfterPinMax = 2;

// Wait time after navigating to the next page in the shop's stock;
var sleepAfterNavigatingToNextPageMin = 2;
var sleepAfterNavigatingToNextPageMax = 6;

// Wait time after pressing the update button to refresh;
var sleepWaitForUpdateMin = 4;
var sleepWaitForUpdateMax = 6;


// Waits 'X' amount of milliseconds. 'await Sleep(min, max)';
function Sleep(min, max, showConsoleMessage = true) {
    const milliseconds = GetRandomFloat(min, max) * 1000;
    if(showConsoleMessage) console.log(`Sleeping for ${milliseconds / 1000} seconds...`);
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


//######################################################################################################################################


// If the Neopets page sends an error, reload;
function handleServerErrors() {
    const bodyText = document.body.innerText;
    var error502 = bodyText.includes("502 Bad Gateway\nopenresty");
    var error504 = bodyText.includes("504 Gateway Time-out\nopenresty");
    var captcha = bodyText.includes("Loading site please wait...");
    var certError = bodyText.includes("NET::ERR_CERT_COMMON_NAME_INVALID")
    
    if (error502 || error504 || captcha || certError) {
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

handleServerErrors();