function getSTART_AUTOKQ_PROCESS(callback) {
    chrome.storage.local.get(['START_AUTOKQ_PROCESS'], function (result) {
        const value = result.START_AUTOKQ_PROCESS;

        if (typeof callback === 'function') {
        callback(value);
        }
    });
}

//######################################################################################################################################


const statusTag = document.getElementById("status-tag");


getAUTOKQ_STATUS(function (status){
    ShowOrHideLoading(status);
    statusTag.textContent = status;
});

// Checks constantly if the inventory page needs to update;
function UpdateGUIData() {
    getAUTOKQ_STATUS(function (status){
        ShowOrHideLoading(status);
        statusTag.textContent = status;
    });
}

// Updates the page's data every half a second when opened and needed;
setInterval(UpdateGUIData, 500);



//######################################################################################################################################

const KQpageButton = document.getElementById("page");

KQpageButton.addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://www.neopets.com/island/kitchen.phtml', active: true });
});


const startAutoPricingButton = document.getElementById("start");
startAutoPricingButton.addEventListener('click', StartAutoKQ);

var autoPricingList = [];

function StartAutoKQ(){
    setSTART_INVENTORY_PROCESS(false);
    setSTART_INVENTORY_PROCESS(false);
    setSUBMIT_PRICES_PROCESS(false);

    getSTART_AUTOPRICING_PROCESS(function (isActive) {
        if(isActive){
            setAUTOPRICER_STATUS("AutoPricer Process Cancelled by the AutoKQ Process...");
        }
    });

    setSTART_AUTOPRICING_PROCESS(false);

    setSTART_AUTOKQ_PROCESS(true);
    setSUBMIT_AUTOKQ_PROCESS(false);
    setAUTOKQ_STATUS("Navigating to the KQ Page...");
    

    chrome.tabs.create({ url: 'https://www.neopets.com/island/kitchen.phtml', active: true });

    setAUTOKQ_STATUS("AutoKQ Process Running...");
}

const cancelAutoPricingButton = document.getElementById("cancel");
cancelAutoPricingButton.addEventListener('click', CancelAutoPricer);

function CancelAutoPricer(){
    if(confirm("Do you want to terminate the current AutoPricer process?")){
        setSTART_AUTOPRICING_PROCESS(false);
        setAUTOPRICER_INVENTORY([]);
        setCURRENT_PRICING_INDEX(0);
        setSUBMIT_PRICES_PROCESS(false);
        setNEXT_PAGE_INDEX(0);

        setSUBMIT_AUTOKQ_PROCESS(false);
        setSTART_AUTOKQ_PROCESS(false);
        setAUTOKQ_STATUS("Inactive");
    }
}

function HideKQButtons(){
    getSTART_AUTOKQ_PROCESS(function (isActive) {
        if(isActive){
            startAutoPricingButton.style.display = "none";
            cancelAutoPricingButton.style.display = "inline";
        } else {
            cancelAutoPricingButton.style.display = "none";
            startAutoPricingButton.style.display = "inline";
        }
    });
}

setInterval(HideKQButtons, 100);


//######################################################################################################################################


const stockContainer = document.getElementById('history-container');
const optionsContainer = document.getElementById('autokq-options-container');

const optionsButton = document.getElementById("options");
optionsButton.addEventListener('click', ShowOptions);

function ShowOptions(){
    stockContainer.style.display = 'none';
    optionsContainer.style.display = 'block';
}

const stockButton = document.getElementById("history");
stockButton.addEventListener('click', ShowShopStock);

function ShowShopStock(){
    optionsContainer.style.display = 'none';
    stockContainer.style.display = 'block';
}

optionsContainer.style.display = 'none';


//######################################################################################################################################


// Number formatting
function FormatNumberWithSymbols(number, decimalPlaces) {
    // Mapping of value thresholds to symbols
    const symbolMap = [
        { value: 1e12, symbol: "t" },
        { value: 1e9, symbol: "b" },
        { value: 1e6, symbol: "m" },
        { value: 1e3, symbol: "k" },
        { value: 1, symbol: "" }
    ];

    // Reverse the symbol map and find the appropriate symbol
    const matchedSymbol = symbolMap.find(symbolInfo => {
        return number >= symbolInfo.value;
    });

    // Format the number with the matched symbol
    if (matchedSymbol) {
        var numberValue = number / matchedSymbol.value;
        var numberToFixed = numberValue.toFixed(decimalPlaces);
        var formattedNumber = numberToFixed.replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + matchedSymbol.symbol;

        return (formattedNumber);
    } else {
        return "0";
    }
}


// Toggle tab contents
function ToggleTabs(selectedTabId, contentIdToShow) {
    // Hide all tab content elements
    var tabContents = document.querySelectorAll(".tabcontent");
    var tabLinks = document.querySelectorAll(".tablinks");

    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
        tabLinks[i].classList.remove("active");
    }

    // Add "active" class to the selected tab link and display the corresponding content
    document.getElementById(selectedTabId).classList.add("active");
    document.getElementById(contentIdToShow).style.display = "block";
}

// Adds thousands and commas to separate and format a more readable number;
function AddThousandSeparators(number) {
    return number.toLocaleString();
}

// Number with NP at the end;
function FormatNPNumber(input) {
    return AddThousandSeparators(input) + " NP"
}


//######################################################################################################################################


const clearButton = document.getElementById("resetKQ");
clearButton.addEventListener('click', ClearKQLog);

function ClearKQLog(){
    if(confirm("Do you want to delete all entries in your Kitchen Quest Log?")){
        if(confirm("Are you sure you want to clear your Kitchen Quest Log? This action cannot be undone unless you have a backup of you configuration presets.")){
            setKQ_TRACKER([])
        }
    }
}

var newTable = document.createElement("table");
var tableBody = document.createElement("tbody");
var tableRow = document.createElement("tr");
var tableHead = document.createElement("thead");
var tableHeader = document.createElement("th");
var tableDataCell = document.createElement("td");

// Data Table with purchase history and information;
function DisplayTableData(dataArray) {
    var tableContainer = document.getElementById("table-container");

    if (dataArray.length === 0) {
        tableContainer.classList.add("rarity-info");
        tableContainer.textContent = "No Kitchen Quests done yet.";
        clearButton.setAttribute("disabled", true);
        return;
    }

    document.getElementById("table-container").innerHTML = "";
    
    var tableClone = newTable.cloneNode(false);
    var tableBodyClone = tableBody.cloneNode(false);
    var tableRowClone = tableRow.cloneNode(false);
    
    // Appending data to the table;
    tableContainer.appendChild(AppendDataToTable(dataArray.reverse()));
    
    MakeSortableTable();


    // FUNCTION'S FUNCTIONS;
    // Creating the header rows for information (Account, Date & Time, Item Name, Price...)
    function AppendDataToTable(dataArray){
        tableRowClone = CreateHeaderRowKeys(dataArray, tableClone);

        for (a = 0; a < dataArray.length; ++a) {
            var itemCells = tableRow.cloneNode(false);
            itemCells.classList.add("item");
            var lastName = "";

            // Navigating through the columns;
            for (var s = 0; s < tableRowClone.length; ++s) {
                // Clone a cell node for the current row
                var cell = tableDataCell.cloneNode(false);
                
                // Get the value of the current cell or assign an empty string if undefined
                var cellValue = dataArray[a][tableRowClone[s]] || "";
                var prizeType = dataArray[a].Type;

                // Setting the information nodes in the table cells;
                switch(tableRowClone[s]){
                    case "Date & Time":
                        cell.appendChild(document.createTextNode(cellValue));
                        cell.classList.add('class-DateTime');
                    break;

                    case "Item Name":
                        const name = document.createElement("div");
                        name.innerText = cellValue;
                        cell.appendChild(name);
                        lastName = cellValue;
                        cell.appendChild(name);
                    break;

                    case "Status":
                        // Create a colored span element for the "Status" column
                        var statusSpan = CreatePurchaseStatusSpan(cellValue);
                        cell.appendChild(statusSpan);
                    break;

                    case "Prize":
                        if(prizeType == "Neopoints"){
                            var priceValue = parseInt(cellValue);
                            var priceSpan = CheckIsNaNDisplay(priceValue, "-", FormatNPNumber(priceValue));
                            cell.appendChild(document.createTextNode(priceSpan));
                        } else {
                            cell.appendChild(document.createTextNode(cellValue));
                        }
                    break;

                    case "JN":
                        if(prizeType == "Item"){
                            var itemName = dataArray[a].Prize;

                            // Create the <a> element
                            var linkElement = document.createElement("a");
                            linkElement.href = `https://items.jellyneo.net/search/?name=${itemName}&name_type=3`;

                            // Create the <img> element
                            var imgElement = document.createElement("img");
                            imgElement.src = "../JN.png";
                            imgElement.alt = "Info Icon";

                            linkElement.appendChild(imgElement);

                            cell.appendChild(linkElement);
                            cell.classList.add('class-JellyNeo');
                        }
                    break;

                    default:
                        cell.appendChild(document.createTextNode(cellValue));
                    break;
                }
                
                // Append the cell to the current row
                itemCells.appendChild(cell);
            }
            
            tableBodyClone.appendChild(itemCells)
        }
        return tableClone.appendChild(tableBodyClone), tableClone.classList.add("sortable"), tableClone;
    }

    // Creating the header rows for information (Account, Date & Time, Item Name, Price...)
    function CreateHeaderRowKeys(dataArray, tableClone) {
        const headerKeys = [];

        for(i = 0; i < dataArray.length; i++){
            for(key in dataArray[i]){ // Check all the keys in the current data;
                // Check if the key is unique;
                if(dataArray[i].hasOwnProperty(key) && headerKeys.indexOf(key) == -1){
                    headerKeys.push(key); // Adding the key;

                    // Creating the cell and appending it;
                    const headerCell = tableHeader.cloneNode(false);
                    headerCell.appendChild(document.createTextNode(key));
                    tableRowClone.appendChild(headerCell);   
                } else break;
            }
        }

        headerKeys.push("JN");
        headerCell = tableHeader.cloneNode(false);
        headerCell.appendChild(document.createTextNode("JN"));
        tableRowClone.appendChild(headerCell);
        
        //Creating the header rows;
        const headerRow = tableHead.cloneNode(false);
        headerRow.appendChild(tableRowClone);
        tableClone.appendChild(headerRow);

        return headerKeys;
    }  
}


//--------------------------------


// Handles the JN link of the item;
function CreateJellyneoLink(cellValue){
    var itemLink = document.createElement("a");
    itemLink.href = "https://items.jellyneo.net/search/?name=" + cellValue + "&name_type=3";
    itemLink.innerText = cellValue;
    itemLink.setAttribute("target", "_blank");
    return itemLink;
}

// Handles the JN link of the item;
function CreatePurchaseStatusSpan(cellValue){
    var statusSpan = document.createElement("a");
    statusSpan.innerText = cellValue;

    // Coloring the span based on the purchase interaction type;
    switch(cellValue){
        case "Bought":
            statusSpan.style.color = "green";
        break;

        case "Attempted":
            statusSpan.style.color = "grey";
        break;

        default:
            statusSpan.style.color = "red";
        break;
    }

    return statusSpan;
}

function MakeSortableTable(){
    // Loop through all the table elements in the document
    forEach(document.getElementsByTagName("table"), function(tableElement) {
        // Find sortable elements and make them sortable;
        if (tableElement.className.search(/\bsortable\b/) !== -1) {
            sorttable.makeSortable(tableElement);
            tableElement.classList.add("table");
        }
    });
}

//######################################################################################################################################

var currentHistorySize = -1;

function ProcessAutoKQLog(forceUpdateHistory) {
    chrome.storage.local.get({
        KQ_TRACKER: [],
    }, (function(t) {
        const historySize = t.KQ_TRACKER.length;
        var purchaseManager = ManagePurchases(t.KQ_TRACKER)

        if (forceUpdateHistory || currentHistorySize != historySize) {
            currentHistorySize = historySize;
            DisplayTableData(purchaseManager);
            //Analytics(purchaseManager, itemData, totalProfit)
        }
    }))
}

//--------------------------------

function ManagePurchases(purchases){
    if(purchases.length <= 1) return purchases;

    const optimizedPurchases = [];

    //Optimized purchases;
    for(var purchase of purchases){
        optimizedPurchases.push(purchase);
    }

    return optimizedPurchases;
}

//--------------------------------

//If a value is NaN or not, then it'll display one option or the other;
function CheckIsNaNDisplay(input, outputTrue, outputFalse){
    return isNaN(input) ? outputTrue : outputFalse;
}


//######################################################################################################################################


//Update the history data every 5 seconds;
ProcessAutoKQLog(false), setInterval((function() {
    ProcessAutoKQLog(false)
}), 5e3)