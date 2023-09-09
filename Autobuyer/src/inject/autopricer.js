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
    chrome.storage.local.set({ START_AUTOPRICING_PROCESS: value }, function () {});
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


//######################################################################################################################################


function Item(Name, Price, IsPricing, Index){
    this.Name = Name;
    this.Price = Price;
    this.IsPricing = IsPricing;
    this.Index = Index;
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
var rowsItemNames = [];

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
    rows.forEach((row) => {
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
            const item = new Item(textContent, priceContent, true);
            rowsItemNames.push(item);
        }
    });
}
  
async function ProcessAllPages() {
    for (let pageIndex = 0; pageIndex < hrefLinks.length; pageIndex++) {
        await ProcessPageData(pageIndex);
        console.log(`Processed page ${pageIndex + 1}`);
        if(pageIndex == 3){
            setSHOP_INVENTORY(rowsItemNames);
            window.alert("The shop inventory has been successfully saved!\nYou can close this window now.\n\nPlease return to NeoBuyer's AutoPricer page to continue.");
            setINVENTORY_UPDATED(true);
            //Sleep(sleepInShopMin, sleepInShopMin);
        }
    }
}

// Simulates the time a real player browses through its entire shop;
var sleepInShopMin = 10, sleepInShopMin = 60;


var sleepMin = 3;
var sleepMax = 8;

var typingSleepMin = 0.03;
var typingSleepMax = 0.15;

var sleepWhileNavigatingToSWMin = 2;
var sleepWhileNavigatingToSWMax = 5;

var sleepInSWPageMin = 2;
var sleepInSWPageMax = 5;

var sleepThroughSearchesMin = 1;
var sleepThroughSearchesMax = 3;

var sleepNewSearchMin = 1;
var sleepNewSearchMax = 3;


function Sleep(min, max) {
    const milliseconds = GetRandomFloat(min, max) * 1000;
    //console.log(`Sleeping for ${milliseconds / 1000} seconds...`);
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


function StartInventoryScraping(value){
    if(value){
        LoadPageLinks();
        ProcessAllPages();
        setSTART_INVENTORY_PROCESS(false);
    }
}

var autoPricingList = [];
var currentResubmitPresses = 1, resubmitPresses = 1;
var isDeductionFixed = false, isUsingPercentages = false, isRandomPercentage = true;
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

function checkForErrorsAndRefresh() {
    if (console && console.error) {
        const origError = console.error; // Store the original console.error function

        console.error = function () {
            origError.apply(console, arguments); // Call the original console.error
            location.reload(); // Refresh the page when an error is detected
        };
    }
}

// Call the error checking function at regular intervals
setInterval(checkForErrorsAndRefresh, 100); // Adjust the interval as needed

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
                    TypeLetterByLetter(searchBox, autoPricingList[currentPricingIndex].Name);

                    await Sleep(sleepInSWPageMin, sleepInSWPageMax);

                    // Usage example:
                    WaitForElement(".button-search-white", 0).then((searchButton) => {
                        searchButton.click();
                    });

                    await Sleep(sleepInSWPageMin, sleepInSWPageMax);
                    console.log("Search button clicked!");

                    while(currentResubmitPresses <= resubmitPresses){
                        await Sleep(sleepThroughSearchesMin, sleepThroughSearchesMax);
                        console.log("Pressed " + currentResubmitPresses + " Times");

                        WaitForElement("resubmitWizard", true).then((resubmitButton) => {
                            resubmitButton.click();
                        });

                        currentResubmitPresses++;
                    }

                    WaitForElement(".wizard-results-price", 0).then(async (searchResults) => {
                        var bestPrice = Number.parseInt(searchResults.textContent.replace(' NP', '').replace(',', ''));
                        var deductedPrice = 0;

                        if(isUsingPercentages){
                            if(isRandomPercentage) {
                                deductedPrice = bestPrice * (1 - parseFloat((GetRandomFloat(percentageDeductionMin, percentageDeductionMax) * 0.01).toFixed(3)));
                            } else {
                                deductedPrice = bestPrice * (1 - (percentageDeduction * 0.01));
                            }
                        } else {
                            if(isDeductionFixed){
                                deductedPrice = bestPrice - fixedDeduction;
                            } else {
                                deductedPrice = bestPrice - GetRandomInt(priceDeductionMin, priceDeductionMax);
                            }
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
        console.log('START_AUTOPRICING_PROCESS is false');

        // A user can be inside the SW while also AutoPricing, this circumvents that issue;
        if(window.location.href.includes("https://www.neopets.com/market.phtml?")){
            getSTART_INVENTORY_PROCESS(StartInventoryScraping);
        }
    }
);

async function TypeLetterByLetter(inputElement, text){
    for (var i = 0; i < text.length; i++) {
        // Simulate typing a letter
        inputElement.value += text[i];
        
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