function setSHOP_INVENTORY(value) {
    chrome.storage.local.set({ SHOP_INVENTORY: value }, function () {});
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

/*function setSTART_AUTOPRICING_PROCESS(value) {
    chrome.storage.local.set({ START_AUTOPRICING_PROCESS: value }, function () {});
}

function getSTART_AUTOPRICING_PROCESS(callback) {
    chrome.storage.local.get(['START_AUTOPRICING_PROCESS'], function (result) {
        const value = result.START_AUTOPRICING_PROCESS;

        if (typeof callback === 'function') {
        callback(value);
        }
    });
}*/

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

//######################################################################################################################################


function Item(Name, Price, IsPricing){
    this.Name = Name;
    this.Price = Price;
    this.IsPricing = IsPricing;
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

function Sleep(min, max) {
    const milliseconds = GetRandomFloat(min, max) * 1000;
    console.log(`Sleeping for ${milliseconds / 1000}...`);
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function GetRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}


//######################################################################################################################################

function StartAutoPricing(value){
    if(value){
        LoadPageLinks();
        ProcessAllPages();
        setSTART_INVENTORY_PROCESS(false);
    }
}


// Start processing data
getSTART_INVENTORY_PROCESS(StartAutoPricing);