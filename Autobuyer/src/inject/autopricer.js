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

function setSUBMIT_PRICES_PROCESS(value) {
    chrome.storage.local.set({ SUBMIT_PRICES_PROCESS: value }, function () {});
}

function getSUBMIT_PRICES_PROCESS(callback) {
    chrome.storage.local.get(['SUBMIT_PRICES_PROCESS'], function (result) {
        const value = result.SUBMIT_PRICES_PROCESS;

        // Check if value is undefined or null, and set it to false
        if (value === undefined || value === null) {
            setSUBMIT_PRICES_PROCESS(false);
        }

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}


//######################################################################################################################################


function Item(Name, Price, IsPricing, Index, ListIndex, Stock){
    this.Name = Name;
    this.Price = Price;
    this.IsPricing = IsPricing;
    this.Index = Index;
    this.ListIndex = ListIndex;
    this.Stock = Stock
}


//######################################################################################################################################


const hrefLinks = [];

function LoadPageLinks(){
    document.querySelectorAll('p[align="center"] a').forEach(link => {
        const href = link.getAttribute('href');
        hrefLinks.push(href);
    });
    
    hrefLinks.shift();
}

var currentPage = 1;
var currentIndex = 0;
var rowsItems = [];
var playerPIN = 0000;
  
/*async function ProcessAllPages(isInputtingPrices = false) {
    for (let pageIndex = 0; pageIndex < hrefLinks.length; pageIndex++) {
        if(isInputtingPrices){
            currentIndex = 0;
            await ProcessPageData(pageIndex, isInputtingPrices);
        } else {
            await ProcessPageData(pageIndex);
            console.log(`Processed page ${pageIndex + 1}`);

            if(pageIndex == hrefLinks.length - 1){
                setSHOP_INVENTORY(rowsItems);
                window.alert("The shop inventory has been successfully saved!\nYou can close this window now.\n\nPlease return to NeoBuyer's AutoPricer page to continue.");
                setINVENTORY_UPDATED(true);
                //Sleep(sleepInShopMin, sleepInShopMin);
            }
        }
    }
}*/

async function ProcessAllPages() {
    for (let pageIndex = 0; pageIndex < hrefLinks.length; pageIndex++) {
        await ProcessPageData(pageIndex);
        console.log(`Processed page ${pageIndex + 1}`);
        if(pageIndex == hrefLinks.length - 1){
            setSHOP_INVENTORY(rowsItemNames);
            window.alert("The shop inventory has been successfully saved!\nYou can close this window now.\n\nPlease return to NeoBuyer's AutoPricer page to continue.");
            setINVENTORY_UPDATED(true);
        }
    }
}

async function ProcessPageData(pageIndex) {
    //Loading the page and getting its contents;
    const response = await fetch(hrefLinks[pageIndex]);
    const pageContent = await response.text();

    // Parsing the content;
    const parser = new DOMParser();
    const pageDocument = parser.parseFromString(pageContent, 'text/html');
    const form = pageDocument.querySelector('form[action="process_market.phtml"][method="post"]');
    const table = form.querySelector('table[cellspacing="0"][cellpadding="3"][border="0"]');
    const rows = table.querySelectorAll('tr');

    //Saving all the data in its respective array;
    rows.forEach((row, rowIndex) => {
        const nameRow = row.querySelector('td:first-child');
        const textContent = nameRow.textContent.trim();

        //const priceRow = row.querySelector('td:nth-child(5)');
        const inputElements = row.querySelectorAll('td input[name^="cost_"]');
        var priceContent = 0;
        try { 
            priceContent = inputElements[0].value;
        } catch {}

        const vetoWords = ['Enter your PIN:', 'Remove All', 'Name'];
        const isVetoWord = vetoWords.includes(textContent);

        if (!isVetoWord) {
            const stockCell = row.querySelector('td:nth-child(3)').querySelector("b");
            const inStock = parseInt(stockCell.textContent);

            const item = new Item(textContent, priceContent, true, rowIndex, currentIndex, inStock);
            currentIndex++;
            rowsItemNames.push(item);
        }
    });
}

/*async function ProcessPageData(pageIndex, isInputtingPrices = false) {
    //Loading the page and getting its contents;
    const response = await fetch(hrefLinks[pageIndex]);
    const pageContent = await response.text();

    // Parsing the content;
    const parser = new DOMParser();
    const pageDocument = parser.parseFromString(pageContent, 'text/html');
    const form = pageDocument.querySelector('form[action="process_market.phtml"][method="post"]');

    // If the page cannot be reached, try again;
    try{
        table = form.querySelector('table[cellspacing="0"][cellpadding="3"][border="0"]');
    } catch {
        ProcessPageData(pageIndex, isInputtingPrices);
        return;
    }
    
    const rows = table.querySelectorAll('tr');
    const pinInput = document.querySelector('input[type="password"][name="pin"]');
    const updateButton = document.querySelector('input[type="submit"][value="Update"]');
    var updatedPrices = false;

    //Saving all the data in its respective array;
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        const nameRow = row.querySelector('td:first-child');
        const textContent = nameRow.textContent.trim();

        const inputElements = row.querySelector('td input[name^="cost_"]');

        var priceContent = 0;
        try { 
            priceContent = inputElements.value;
        } catch {}

        const vetoWords = ['Enter your PIN:', 'Remove All', 'Name'];
        const isVetoWord = vetoWords.includes(textContent);

        if (!isVetoWord) {
            if(isInputtingPrices){
                await new Promise(async (resolve) => {
                    getSHOP_INVENTORY(async function (list){
                        const item = list.find(item => item.Name === textContent);
                        const itemPrice = parseInt(item.Price);
                        
                        if (itemPrice == parseInt(inputElements.value) || !item.IsPricing) {
                            resolve(); // Skip the current item and move to the next
                            return;
                        }

                        await Sleep(0.5, 2);
                        // Get a reference to the input element
                        const inputElement = document.querySelector(`input[name="cost_${rowIndex}"]`);

                        // Clear the current value in the input field
                        inputElement.value = "";

                        // The value you want to input
                        const desiredValue = itemPrice.toString();

                        SimulateKeyEvents(inputElement, desiredValue);

                        updatedPrices = true;
                        resolve(); // Continue to the next item
                    });
                });
            } else {
                const stockCell = row.querySelector('td:nth-child(3)').querySelector("b");
                const inStock = parseInt(stockCell.textContent);

                const item = new Item(textContent, priceContent, true, rowIndex, currentIndex, inStock);
                
                rowsItems.push(item);
            }

            currentIndex++;
        }
    }
    
    if(isInputtingPrices){
        console.log(`Pricing done for page ${pageIndex + 1}!`);
        await Sleep(2, 4);

        if(updatedPrices){
            SimulateKeyEvents(pinInput, playerPIN);
            await Sleep(1, 2);

            // Get a reference to the update button element
            //const updateButton = pageDocument.querySelector('input[type="submit"][value="Update"]');

            updateButton.click();

            console.log(`Prices Updated for page ${pageIndex + 1}!`);
        }
    }
}*/

async function SimulateKeyEvents(inputElement, desiredValue){
    // Simulate typing the value character by character
    for (const char of desiredValue.toString()) {
        const keyEventDown = new KeyboardEvent("keydown", {
            key: char,
            bubbles: true,
            cancelable: true,
        });

        const keyEventUp = new KeyboardEvent("keyup", {
            key: char,
            bubbles: true,
            cancelable: true,
        });

        // Dispatch keydown event
        inputElement.value += char;
        await Sleep(typingSleepMin, typingSleepMax); // Adjust the min and max sleep times as needed

        // Dispatch keyup event
        inputElement.dispatchEvent(keyEventUp);
    }

    // Trigger an input event to simulate user input
    const inputEvent = new Event("input", {
        bubbles: true,
        cancelable: true,
    });

    inputElement.dispatchEvent(inputEvent);
}

// Simulates the time a real player browses through its entire shop;
var sleepInShopMin = 10, sleepInShopMin = 60;


var sleepMin = 3;
var sleepMax = 8;

var typingSleepMin = 0.01;
var typingSleepMax = 0.1;

var sleepWhileNavigatingToSWMin = 2;
var sleepWhileNavigatingToSWMax = 5;

var sleepInSWPageMin = 2;
var sleepInSWPageMax = 5;

var sleepThroughSearchesMin = 2;
var sleepThroughSearchesMax = 4;

var sleepNewSearchMin = 1;
var sleepNewSearchMax = 3;


function Sleep(min, max, showConsoleMessage = false) {
    const milliseconds = GetRandomFloat(min, max) * 1000;
    if(showConsoleMessage) console.log(`Sleeping for ${milliseconds / 1000} seconds...`);
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function GetRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function GetRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function Clamp(value, min, max){
    return Math.min(Math.max(value, min), max);
}


//######################################################################################################################################


var autoPricingList = [];
var resubmitPresses = 3;
var isRandomPercentage = true;
var percentageDeduction = 5;
var percentageDeductionMin = 3;
var percentageDeductionMax = 8;
var fixedDeduction = 1000;
var priceDeductionMin = 100;
var priceDeductionMax = 1000;

function setCURRENT_PRICING_INDEX(value) {
    chrome.storage.local.set({ CURRENT_PRICING_INDEX: value }, function () {});
}

function getCURRENT_PRICING_INDEX(callback) {
    chrome.storage.local.get(['CURRENT_PRICING_INDEX'], function (result) {
        const value = result.CURRENT_PRICING_INDEX;

        if (typeof callback === 'function') {
            callback(typeof value === 'undefined' ? 0 : value);
        }
    });
}

getSTART_AUTOPRICING_PROCESS(
    function() {
        if(window.location.href.includes("https://www.neopets.com/shops/wizard.phtml")){
            // Define a callback function to handle the retrieved value
            function handleAUTOPRICER_INVENTORY(list) {
                getCURRENT_PRICING_INDEX(async function (currentPricingIndex) {
                    console.log(currentPricingIndex);
                    autoPricingList = list;

                    if(autoPricingList.length < currentPricingIndex){
                        setSTART_AUTOPRICING_PROCESS(false);
                        console.log("stop");
                        return;
                    } 

                    console.log(`Navigating to SW, searching for: ${autoPricingList[currentPricingIndex].Name}`);
                    await Sleep(sleepWhileNavigatingToSWMin, sleepWhileNavigatingToSWMax);

                    var searchBox = document.getElementById("shopwizard");
                    var isInQuest = TypeLetterByLetter(searchBox, autoPricingList[currentPricingIndex].Name);

                    if(isInQuest){
                        window.alert("You are currently in a faerie quest.\nEither complete it or cancel it to use the AutoPricer.\n\nThe AutoPricer process will now stop...");
                        CancelAutoPricer();
                        return;
                    } 

                    await Sleep(sleepInSWPageMin, sleepInSWPageMax);

                    // Usage example:
                    WaitForElement(".button-search-white", 0).then((searchButton) => {
                        searchButton.click();
                    });

                    await Sleep(sleepInSWPageMin, sleepInSWPageMax);
                    console.log("Search button clicked!");

                    for(var i = 0; i < resubmitPresses; i++){
                        await Sleep(sleepThroughSearchesMin, sleepThroughSearchesMax);
                        console.log("Resubmitted " + i + " Times");

                        WaitForElement("#resubmitWizard", 0).then((resubmitButton) => {
                            resubmitButton.click();
                        });
                    }

                    WaitForElement(".wizard-results-price", 0).then(async (searchResults) => {
                        var bestPrice = Number.parseInt(searchResults.textContent.replace(' NP', '').replace(',', ''));
                        var deductedPrice = 0;

                        if(isRandomPercentage) {
                            console.log(bestPrice);
                            deductedPrice = bestPrice * (1 - parseFloat((GetRandomFloat(percentageDeductionMin, percentageDeductionMax) * 0.01).toFixed(3)));
                        } else {
                            deductedPrice = bestPrice * (1 - (percentageDeduction * 0.01));
                        }

                        autoPricingList[currentPricingIndex - 1].Price = Math.floor(deductedPrice);
                        await setAUTOPRICER_INVENTORY(autoPricingList);
                        await setSHOP_INVENTORY(autoPricingList);
                        setINVENTORY_UPDATED(true);
                    });

                    // Increment currentIndex
                    setCURRENT_PRICING_INDEX(++currentPricingIndex);
                    await Sleep(sleepNewSearchMin, sleepNewSearchMax);

                    WaitForElement(".button-default__2020.button-blue__2020.wizard-button__2020[type='submit'][value='New Search']", 0).then((newSearchButton) => {
                        newSearchButton.click();
                    })
                });
            }

            getAUTOPRICER_INVENTORY(handleAUTOPRICER_INVENTORY);
        } else {
            window.alert("The AutoPricer is running, the Neobuyer's+ shop inventory will not be updated.\n\nWait for the AutoPricer to finish or cancel the process.");
        }
    },
    function() {
        console.log('START_AUTOPRICING_PROCESS is false ');

        // A user can be inside the SW while also AutoPricing, this circumvents that issue;
        if(window.location.href.includes("https://www.neopets.com/market.phtml?")){
            getSUBMIT_PRICES_PROCESS(function (canSubmit){
                if(!canSubmit){
                    getSTART_INVENTORY_PROCESS(function (canScrapeInventory) {
                        StartInventoryScraping();
                    });
                    return;
                }

                StartPriceSubmitting();
            });
            
        }
    }
);

function CancelAutoPricer(){
    setSTART_AUTOPRICING_PROCESS(false);
    setAUTOPRICER_INVENTORY([]);
    setINVENTORY_UPDATED(true);
    setCURRENT_PRICING_INDEX(0);
}

function StartInventoryScraping(){
    if(value){
        LoadPageLinks();
        ProcessAllPages();
        setSTART_INVENTORY_PROCESS(false);
    }
}

function StartPriceSubmitting(){

}

async function TypeLetterByLetter(inputElement, text){
    var textResult = "";

    for (var i = 0; i < text.length; i++) {
        if(inputElement == null) return true;
        
        // Simulate typing a letter
        textResult += text[i];
        inputElement.value = textResult;
        
        // Trigger an input event to simulate user input
        var inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });

        inputElement.dispatchEvent(inputEvent);

        // Wait for a random delay before typing the next letter
        await Sleep(typingSleepMin, typingSleepMax); // Adjust the min and max sleep times as needed
    }
}

function WaitForElement(selector, index = 0) {
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            let element;

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


function StartPriceSaving(){
    LoadPageLinks();
}
