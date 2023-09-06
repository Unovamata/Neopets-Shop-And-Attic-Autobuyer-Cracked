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

const item = {
    Name: '',
    Price: 0,
    IsPricing: false
};



const hrefLinks = [];

document.querySelectorAll('p[align="center"] a').forEach(link => {
  const href = link.getAttribute('href');
  hrefLinks.push(href);
});

hrefLinks.shift();

var currentPage = 1;
var rowsItemNames = [];

async function processPageData(pageIndex) {
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
        const nameCell = row.querySelector('td:first-child');
        const priceCell = row.querySelector('td:first-child');
        const textContent = nameCell.textContent.trim();

        const vetoWords = ['Enter your PIN:', 'Remove All', 'Name'];
        const isVetoWord = vetoWords.includes(textContent);

        if (!isVetoWord) {
            rowsItemNames.push(textContent);
        }
    });
}
  
async function processAllPages() {
    for (let pageIndex = 0; pageIndex < hrefLinks.length; pageIndex++) {
        await processPageData(pageIndex);
        console.log(`Processed page ${pageIndex + 1}`);
        if(pageIndex == 3){
            setSHOP_INVENTORY(rowsItemNames);

            // Declare a variable to hold the retrieved SHOP_INVENTORY value
            let mySHOP_INVENTORY;

            // Use the getSHOP_INVENTORY function to retrieve and assign the value
            getSHOP_INVENTORY(function (value) {
            mySHOP_INVENTORY = value;

            console.log(mySHOP_INVENTORY);
            });
        }
    }
}
  
// Start processing data
processAllPages();

var sleepMin = 3;
var sleepMax = 8;

function Sleep() {
    const milliseconds = GetRandomFloat(sleepMin, sleepMax) * 1000;
    console.log(`Sleeping for ${milliseconds / 1000}...`);
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function GetRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}