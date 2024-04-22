// Item class for item configuration and parsing;
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

function getVARIABLE(variable) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([variable], function (result) {
            var value = result[variable];

            resolve(value);
        });
    });
}

function setVARIABLE(propertyName, value) {
    const storageObject = {};
    storageObject[propertyName] = value;
    chrome.storage.local.set(storageObject, function () {});
}


//######################################################################################################################################
//// AutoBuyers' Common Functions;

function CalculateItemProfits(itemIDs, itemPrices, buyUnknownItemsIfProfitMargin,  minDBRarityToBuy, isBlacklistActive, blacklistToNeverBuy) {
    const itemProfits = [];

    for (const itemID of itemIDs) {
        if (!IsItemInRarityThresholdToBuy(itemID) || IsItemInBlacklist(itemID, isBlacklistActive, blacklistToNeverBuy)) {
            itemProfits.push(-99999999);
        } else {
            const itemData = item_db[itemID];
            
            try{
                if (itemData["Rarity"] == undefined || itemData["Price"] == undefined) {
                    //console.warn("Item not found in the database or price not available.");
                    itemProfits.push(buyUnknownItemsIfProfitMargin);
                } else {
                    const itemPrice = itemData.Price;
                    const userPrice = parseInt(itemPrices[itemIDs.indexOf(itemID)]);
                    const profit = itemPrice - userPrice;
                    itemProfits.push(profit);
                }
            } catch {
                itemProfits.push(buyUnknownItemsIfProfitMargin);
            }  
        }
    }

    function IsItemInRarityThresholdToBuy(itemDB) {
        const item = item_db[itemDB];

        if (!item) {
            return true;
        }
        
        const itemRarity = parseInt(item.Rarity);
        return !itemRarity || itemRarity >= minDBRarityToBuy;
    }

    return itemProfits;
}

function IsItemInBlacklist(itemName, isBlacklistActive, blacklistToNeverBuy) {
    return isBlacklistActive && blacklistToNeverBuy.includes(itemName);
}

function BestItemName(itemNames, itemPrices, itemProfits, minDBProfitToBuy, minDBProfitPercent) {
    var bestItemName = null;
    var maxProfit = -1;
    var length = itemProfits.length;

    for (var i = 0; i < length; i++) {
        var profit = itemProfits[i];

        var meetsProfitCriteria = profit >= minDBProfitToBuy;
        var meetsPercentCriteria = (profit / itemPrices[i]) >= minDBProfitPercent;

        if (meetsProfitCriteria && meetsPercentCriteria && profit > maxProfit) {
            maxProfit = profit;
            bestItemName = itemNames[i];
        }
    }

    return bestItemName;
}


function FilterItemsByProfitCriteria(itemNames, itemPrices, itemProfits, minDBProfit, minDBProfitPercent) {
    var filteredItems = [];
    
    for (var i = 0; i < itemProfits.length; i++) {
        var meetsProfitCriteria = itemProfits[i] > minDBProfit;
        var meetsPercentCriteria = (itemProfits[i] / itemPrices[i]) > minDBProfitPercent;

        if (meetsProfitCriteria && meetsPercentCriteria) {
            filteredItems.push(itemNames[i]);
        }
    }

    return filteredItems;
}


function PickSecondBestItem(filteredItems, isBuyingSecondMostProfitable){
    var selectedName = filteredItems.length > 0 ? filteredItems[0] : null;

    // If there's an item to buy and isBuyingSecondMostProfitable is true, check for the second best option
    if(selectedName && isBuyingSecondMostProfitable){
        if(filteredItems.length > 1){
            selectedName = filteredItems[1];
            //console.log("Going for the second best item");
        } else if (filteredItems.length == 1){
            selectedName = filteredItems[0];
        }
    }

    return selectedName;
}

function CreateWaitTime(inputDate, atticLastRefresh) {
    const now = inputDate;
    const lastRestockTime = new Date(atticLastRefresh);
    lastRestockTime.setFullYear(now.getFullYear());
    lastRestockTime.setMonth(now.getMonth());
    lastRestockTime.setDate(now.getDate());
    
    const timeDifference = Math.abs(now.getTime() - lastRestockTime.getTime());
  
    var extraMinutes = 0, extraSeconds = 0, minutesInterval, extraWindow = 0;
    const fourteenMinutes = 14 * 60 * 1000;
  
    if(timeDifference < fourteenMinutes){
        minutesInterval = 14;
        extraMinutes = 0;
        extraSeconds = 0;
        extraWindow = 1;
    } else {
        minutesInterval = 7;
        extraMinutes = 7;
        extraSeconds = 6;
        extraWindow = -1;
    }
  
    var windowsPassed = Math.floor(timeDifference / (minutesInterval * 60 * 1000)) + extraWindow;
    
    const windowStartTime = new Date(lastRestockTime);
    const windowEndTime = new Date(lastRestockTime);
  
    const secondsToAdd = minutesInterval === 14 ? 10 : 4;
    const lastRestockMinute = lastRestockTime.getMinutes();

    windowStartTime.setMinutes(lastRestockMinute + minutesInterval * windowsPassed + extraMinutes);
    windowStartTime.setSeconds(lastRestockTime.getSeconds() + (1 * windowsPassed) - 0.5);
  
    windowEndTime.setMinutes(lastRestockMinute + minutesInterval * windowsPassed + extraMinutes);
    windowEndTime.setSeconds(lastRestockTime.getSeconds() + secondsToAdd * (windowsPassed + 1) + extraSeconds);

    // Check if the current time is after the end of the current window
    if(now.getTime() >= windowEndTime.getTime()){
        // Move to the next window
        windowsPassed++;
        windowStartTime.setMinutes(lastRestockMinute + minutesInterval * windowsPassed + extraMinutes);
        windowStartTime.setSeconds(lastRestockTime.getSeconds() + (1 * windowsPassed) - 0.5);
        
        windowEndTime.setMinutes(lastRestockMinute + minutesInterval * windowsPassed + extraMinutes);
        windowEndTime.setSeconds(lastRestockTime.getSeconds() + secondsToAdd * (windowsPassed + 1) + extraSeconds);
    }

    return [windowStartTime, windowEndTime];
}


function TimezoneDate(time){
    return new Date(moment(time).tz("America/Los_Angeles").format("YYYY-MM-DD HH:mm:ss"));
}

function ParseStringTime(time){
    const startHours = String(time.getHours()).padStart(2, '0');
    const startMinutes = String(time.getMinutes()).padStart(2, '0');
    const startSeconds = String(time.getSeconds()).padStart(2, '0');
  
    return [startHours, startMinutes, startSeconds];
  }

function CalculateNextWindowReach(timeA, timeB){
    const timeAMilliseconds = (timeA.getHours() * 3600 + timeA.getMinutes() * 60 + timeA.getSeconds()) * 1000;
    const timeBMilliseconds = (timeB.getHours() * 3600 + timeB.getMinutes() * 60 + timeB.getSeconds()) * 1000;
    
    return timeAMilliseconds - timeBMilliseconds;
}

function CalculateMillisecondDifference(timeA, timeB) {
    // Calculate time differences in seconds
    const timeDifferenceInSeconds = (timeA.getHours() * 3600 + timeA.getMinutes() * 60 + timeA.getSeconds()) -
                                    (timeB.getHours() * 3600 + timeB.getMinutes() * 60 + timeB.getSeconds());

    // Find the shorter time
    const shorterTime = (timeDifferenceInSeconds > 0) ? timeB : timeA;

    // Convert times to seconds
    const date = TimezoneDate(new Date());
    const currentTimeInSeconds = (date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds());

    // Calculate time difference in seconds between current time and the shorter time
    let timeDifferenceToShorterTime = shorterTime.getHours() * 3600 + shorterTime.getMinutes() * 60 + shorterTime.getSeconds() - currentTimeInSeconds;

    // If the difference is negative, the shorter time has already passed today
    if (timeDifferenceToShorterTime < 0) {
        // Calculate time left until the shorter time of the next day
        timeDifferenceToShorterTime = 24 * 3600 - Math.abs(timeDifferenceToShorterTime);
    }

    // Convert time difference to milliseconds
    const timeToNextOccurrence = timeDifferenceToShorterTime * 1000;

    return timeToNextOccurrence;
}


//// AutoBuyers' Visual Functions;


var bannerElementID = "qpkzsoynerzxsqw";

function DisplayAutoBuyerBanner(isAlmostAbandonedAttic = false) {
    chrome.storage.local.get({ SHOULD_SHOW_BANNER: false }, function (result) {
        var isBannerVisible = result.SHOULD_SHOW_BANNER;
        
        if(!isBannerVisible) return;

        // Creating the banner element;
        const bannerElement = document.createElement("div");
        bannerElement.innerText = "Autobuyer Running";
        bannerElement.id = bannerElementID;

        document.body.appendChild(bannerElement);
        UpdateElementStyle(isAlmostAbandonedAttic);
    });
}

function UpdateElementStyle(isAlmostAbandonedAttic) {
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


function AddCSSStyle(bannerID) {
    const t = document.createElement("style");
    t.textContent = bannerID, document.head.append(t)
}

function ClickToRefreshShop() {
    document.querySelector("div.shop-bg").click()
}

function UpdateBannerAndDocument(title, message) {
    UpdateBannerStatus(title), UpdateDocument(title, message, true);
}

function UpdateBannerStatus(runningStatus) {
    var bannerElement = document.getElementById(bannerElementID);

    if (bannerElement) {
        // Update the banner text with the running status
        bannerElement.innerText = "Autobuyer Running: " + runningStatus;
    }
}

// Updates the page's title;
function UpdateDocument(title, message, shouldSendMessage) {
    // Update the document title to uppercase
    chrome.storage.local.get({
        SHOULD_CHANGE_DOCUMENT_DATA: false,
    }, (function(autobuyerVariables) {
        // Update the document title to uppercase
        if(autobuyerVariables.SHOULD_CHANGE_DOCUMENT_DATA) document.title = title.toUpperCase();

        if(shouldSendMessage){
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
    }));
}


//// AutoBuyers' Data Controlling Functions;



function SaveToPurchaseHistory(itemName, shopName, price, status) {
    chrome.storage.local.get({ ITEM_HISTORY: [] }, function (result) {
        var itemHistory = result.ITEM_HISTORY;
        
        // Determine the current user's account
        var accountName = "";

        if(shopName === "Attic"){
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

function FormatMillisecondsToSeconds(milliseconds) {
    return (milliseconds / 1e3).toFixed(2) + " seconds"
}

//######################################################################################################################################
// Page Error Handling;

var isInErrorPage = false;

// Handle page errors by refreshing;
function HandleServerErrors() {
    chrome.storage.local.get({
        MIN_PAGE_LOAD_FAILURES: 10000,
        MAX_PAGE_LOAD_FAILURES: 20000
    }, (function(autobuyerVariables) {
        var errorRefreshed = false;

        // Destructing the variables extracted from the extension;
        const {
            MIN_PAGE_LOAD_FAILURES: minPageReloadTime,
            MAX_PAGE_LOAD_FAILURES: maxPageReloadTime
        } = autobuyerVariables;

        const errorMessages = [
        "502 Bad Gateway",
        "504 Gateway Time-out",
        "Loading site please wait...",
        "An error occurred while processing your request.",
        "Internal Server Error"
        ];
    
        const pageText = document.body.innerText;
        
        // Page errors and captchas;
        if (errorMessages.some(message => pageText.includes(message))) {
            const indexOfMessage = errorMessages.findIndex(message => pageText.includes(message));

            // Captcha;
            if (indexOfMessage === 2) {
                UpdateDocument("Captcha page detected", "Captcha page detected. Pausing.", true);
                return;
            } else { // Refresh on page errors;
                function RefreshWindow() {
                    if (!errorRefreshed) {
                        errorRefreshed = true;
                        
                        location.reload();
                    }
                }

                setTimeout(RefreshWindow, GetRandomFloat(minPageReloadTime, maxPageReloadTime));
            }
        }
        
        // Browser errors;
        else if(window.location.title == "www.neopets.com"){
            setTimeout(() => { location.reload(); }, GetRandomFloat(minPageReloadTime, maxPageReloadTime));
        }
    }));
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

                case 3:
                    // This case returns a NodeList, not a single element
                    element = document.querySelectorAll(selector);
                break;

                case 4:
                    const allElements = document.querySelectorAll('*');

                    for (const selectedElement of allElements) {
                        // Check if the element's text content contains the target text
                        if (selectedElement.textContent.includes(selector)) {
                            element = selectedElement;
                        }
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

// Email management;
class Email {
    constructor(Entry, ID, Author, Date, Subject, Title, Contents, Read){
        this.Entry = Entry;
        this.ID = ID;
        this.Author = Author;
        this.Date = Date;
        this.Subject = Subject;
        this.Title = Title;
        this.Contents = Contents;
        this.Read = Read;
    }
}

//######################################################################################################################################


//Page management;
function ShowOrHideLoading(status){
    const loadingIcon = document.getElementById("loading");

    loadingIcon.style.width = '1.6%';
    loadingIcon.style.height = '1.6%';

    if(status.includes("Complete") || status.includes("Inactive") || 
       status.includes("Updated!") || status.includes("Sleep") || 
       status.includes("Stopped") || status.includes("Cancelled") ||
       status.includes("Usable")){
        loadingIcon.style.visibility = 'hidden';
    } else {
        loadingIcon.style.visibility = 'visible';
    }
}


//######################################################################################################################################


function GetRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1) + min); }

function GetRandomIntExclusive(min, max) { return Math.floor(Math.random() * (max - min) + min); }

function GetRandomFloat(min, max) { return Math.random() * (max - min + 1) + min; }

function GetRandomFloatExclusive(min, max) { return Math.random() * (max - min) + min; }

function PageIncludes(input){
    return document.body.innerText.includes(input);
}

// Waits 'X' amount of milliseconds. 'await Sleep(min, max)';
function Sleep(min, max, showConsoleMessage = true) {
    const milliseconds = GetRandomFloat(min, max);
    //if(showConsoleMessage) console.log(`Sleeping for ${milliseconds / 1000} seconds...`, min, max);
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function Sleep(sleepTime) {
    return new Promise(resolve => setTimeout(resolve, sleepTime));
}

//######################################################################################################################################

//Charts

// Function to separate the dataset by month and year
function FormatDatasetByMonthAndYear(dataset, monthIndex) {
    var separatedData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Iterate over each entry in the dataset
    dataset.forEach(function(entry) {
        // Splitting the date;
        var dateParts = entry['Date & Time'].split('/');
        var year = parseInt(dateParts[2], 10);
        var month = parseInt(dateParts[0], 10) - 1;
        var key = months[month] + " " + year;
        
        // Initialize an array for the key if it doesn't exist
        if (!separatedData[key]) {
            separatedData[key] = [];
        }

        // Push the entry to the corresponding array
        separatedData[key].push(entry);
    });

    return separatedData;
}

//######################################################################################################################################

const showEntries = 15;

// Format for the percentage datalabels in the charts;
function FormatDatalabelsOptions(){
    return options = {
        tooltips: {
            enabled: false
        },
        plugins: {
            datalabels: {
            formatter: (value, ctx) => {
                const datapoints = ctx.chart.data.datasets[0].data
                const total = datapoints.reduce((total, datapoint) => total + datapoint, 0)
                const percentage = value / total * 100
                return percentage.toFixed(2) + "%";
            },
            color: '#fff',
            backgroundColor: 'rgba(3, 169, 244, 0.5)',
            borderColor: ['rgba(3, 169, 244, 0.6)'],
            borderRadius: 5,
            borderWidth: 2,
            font: {
                weight: 'bold',
                family: "Cafeteria",
                size: 20,
            },
            }
        }
    };
}

var notEnoughData = "Additional data is necessary for analytics to operate effectively...";
var chartSize = "400px";

// Create a chart with datalabels;
function CreateChartWithLabels(id, type, labels, data, options){
    const canvas = document.getElementById(id),
    context = canvas.getContext("2d");

    if(!CheckIfEnoughData(canvas, data)) return false;

    new Chart(context, {
        type: type,
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: GenerateRGBAArray(labels.length),
                    borderColor: ['rgba(255, 255, 255, 1)'],
                    borderWidth: 3
                }
            ]
        },
        options: options,
        plugins: [ChartDataLabels],
    });

    return true;
}

// Create a Bar chart;
function CreateBarChart(id, type, labels, data, options, datasetName = "Data") {
    const canvas = document.getElementById(id),
    context = canvas.getContext("2d");

    if(!CheckIfEnoughData(canvas, data)) return false;

    var datasets = []; // Array to store datasets

    // Iterate over each pet name and create a dataset
    labels.forEach(function(label, index) {
        var dataset = {
            label: label,
            backgroundColor: CalculateColorInIndex(index, labels.length),
            data: [data[index]]
        };
        datasets.push(dataset);
    });
    
    new Chart(context, {
        type: type,
        data: {
            labels: [datasetName],
            datasets: datasets // Use the dynamically created datasets
        },
        options: options
    });

    return true;
}

// Create a Bar chart;
function CreateTimelineChart(id, labels, data, datasetName = "Data") {
    const canvas = document.getElementById(id),
    context = canvas.getContext("2d");

    if(!CheckIfEnoughData(canvas, data)) return false;

    var chartData = { labels: labels, datasets: [] };
    
    // Create a single dataset containing all the data points
    var dataset = {
        label: datasetName,
        data: data,
        borderColor: CalculateColorInIndex(0, 1), // Assuming you want a single color for all data points
        backgroundColor:  CalculateColorInIndex(0, 1),
        borderWidth: 3,
        fill: false
    };

    chartData.datasets.push(dataset);

    // Set up Chart.js with a line chart configuration
    new Chart(context, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Data Occurrences Timeline'
            },
        }
    });

    return true;
}

// Generate a RGBA array for charts that require a color array to function;
function GenerateRGBAArray(divisions) {
    var rgbaArray = [];

    if(divisions == 1) return ["rgba(3, 169, 244, 1)"]

    for (var i = 0; i < divisions; i++) {
        rgbaArray.push(CalculateColorInIndex(i, divisions));
    }

    return rgbaArray;
}

// Based on an input index, it returns a color based on a base color;
function CalculateColorInIndex(index, divisions){
    if(divisions == 1) return ["rgba(3, 169, 244, 1)"]

    var alpha = 1 - (index / (divisions - 1)) * 0.8;
    return `rgba(${[3, 169, 244].join(', ')}, ${alpha.toFixed(1)})`;
}

// Resize the chart in case of page size changes in an interval;
function ResizeChartInterval(id, sizeX, sizeY = ""){
    ResizeChart(id, sizeX, sizeY);

    var hasUpdated = false;

    setInterval(function(){
        hasUpdated = ResizeChart(id, sizeX, sizeY, hasUpdated);
    }, 100);
}

function ResizeChart(id, sizeX, sizeY = "", hasUpdated) {
    var canvas = document.getElementById(id);
    canvas.style.width = sizeX;

    if (sizeY == "") {
        canvas.style.height = sizeX;
    } else {
        canvas.style.height = sizeY;
    }

    // Get the Chart.js instance associated with the canvas
    if(!hasUpdated){
        var chartInstance = Chart.getChart(id);

        if (chartInstance) {
            chartInstance.resize();
            chartInstance.update();
        }

        return true;
    }

    return true;
}

function CheckIfEnoughData(canvas, data){
    if(AreAllZeroes(data)){
        canvas.parentElement.textContent = notEnoughData;
        canvas.remove();
        return false;
    }

    return true;
}

function AreAllZeroes(data){
    return data.every(datapoint => datapoint === 0)
}

function ShowAndHideTabs(tabsToShow, tabsToHide){
    tabsToHide.forEach(function(id){
        var hide = document.getElementById(id);
        hide.style.display = 'none';
    });

    tabsToShow.forEach(function(id){
        var show = document.getElementById(id);
        show.style.display = 'initial';
    });
}

function ShowAndHideElements(tabsToShow, tabsToHide){
    tabsToHide.forEach(function(element){
        element.style.display = 'none';
    });

    tabsToShow.forEach(function(element){
        element.style.display = 'initial';
    });
}

// Number with NP at the end;
function FormatNPNumber(input) {
    return input.toLocaleString() + " NP"
}

function ParseNPNumber(input){
    return Number(input.replace(/[^\d.-]/g, ''));
}

//If a value is NaN or not, then it'll display one option or the other;
function CheckIsNaNDisplay(input, outputTrue, outputFalse){
    return isNaN(input) ? outputTrue : outputFalse;
}


//######################################################################################################################################


function EncryptData(input, key, counter = 5){
    var keyArray = StringToArray32(key);
    var textBytes = aesjs.utils.utf8.toBytes(input);
    
    // Encrypting the data;
    var aesCtr = new aesjs.ModeOfOperation.ctr(keyArray, new aesjs.Counter(counter));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);

    return encryptedHex;
}

function DecryptData(encryptedMessage, key, counter = 5){
    var keyArray = StringToArray32(key);

    // Converting the data to bytes for decrypting;
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedMessage);
    
    // Decrypting instance;
    var aesCtr = new aesjs.ModeOfOperation.ctr(keyArray, new aesjs.Counter(counter));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
    
    // Convert our bytes back into text;
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);

    return decryptedText;
}

function StringToArray32(inputString) {
    // Ensure input string is at least 32 characters long
    while (inputString.length < 32) {
        inputString += inputString; // Pad with itself if shorter
    }
    // Truncate to 32 characters if longer
    inputString = inputString.substring(0, 32);

    // Convert each character to ASCII and store in the array
    const array32 = [];
    for (let i = 0; i < inputString.length; i++) {
        array32.push(inputString.charCodeAt(i));
    }
    
    return array32;
}

function InjectExternalScript(url) {
    var script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
}