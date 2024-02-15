// GUI Interaction;

const tableButton = document.getElementById("table-button");
const tableContainer = document.getElementById("table-container");
const analyticsContainer = document.getElementById("analytics-container");

tableButton.onclick = function(e) {
    ShowHistory();
} 

function ShowHistory(){
    ShowAndHideElements([tableContainer], [analyticsContainer]);
}

const analyticsButton = document.getElementById("analytics-button");

analyticsButton.onclick = function(e) {
    ShowAndHideElements([analyticsContainer], [tableContainer])
}

//Toggling the main tab;
ShowHistory();

var currentPage = 1;
var totalPages = 1;

// Function to update navigation buttons and page indicator
function UpdateNavigation() {
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const pageIndicator = document.getElementById("page-indicator");

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Event listener for previous button
document.getElementById("prev-button").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
    }

    LoadCurrentPage();
});

// Event listener for next button
document.getElementById("next-button").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
    }

    LoadCurrentPage();
});

// Event listener for first page button
document.getElementById("first-button").addEventListener("click", () => {
    currentPage = 1;

    LoadCurrentPage();
});

// Event listener for last page button
document.getElementById("last-button").addEventListener("click", () => {
    currentPage = totalPages;

    LoadCurrentPage();
});

// Initial load
LoadCurrentPage();

// Function to load data for the current page
function LoadCurrentPage() {
    ProcessPurchaseHistory(true)
}


//Update the history data every 5 seconds;
ProcessPurchaseHistory(false), setInterval((function() {
    ProcessPurchaseHistory(false)
}), 5e3)

const clearButton = document.getElementById("reset");
clearButton.addEventListener('click', ClearHistory);

function ClearHistory(){
    if(confirm("Do you want to delete all entries in your item purchase history?")){
        if(confirm("Are you sure you want to clear your purchase history? This action cannot be undone unless you have a backup of you configuration presets.")){
            setITEM_HISTORY([])
        }
    }
}

//######################################################################################################################################

// GUI Functions;

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

// Number with formatted with commas and NP at the end;
function FormatNPNumber(number) {
    return number.toLocaleString() + " NP"
}

var currentHistorySize = -1;

function ProcessPurchaseHistory(forceUpdateHistory) {
    chrome.storage.local.get({
        ITEM_HISTORY: [],
    }, (function(t) {
        // Processing the history data;
        const history = t.ITEM_HISTORY;
        const historySize = t.ITEM_HISTORY.length;
        const processedData = ProcessItemData(history);

        // Force updating if necessary;
        if (forceUpdateHistory || currentHistorySize != historySize) {
            currentHistorySize = historySize;
            DisplayTableData(processedData);
        }

        // Updating the page data;
        totalPages = Math.ceil(processedData.length / chunkSize);
        const pageIndicator = document.getElementById("page-indicator");

        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    }))
}

//--------------------------------

var totalProfit = 0, totalValue = 0;

// Processes and formats the item data in the table;
function ProcessItemData(itemArray){
    var proccessedData = [];
    totalProfit = 0;
    totalValue = 0;

    itemArray.forEach(function(item, index){
        const itemInfo = item_db[item["Item Name"]];

        if(itemInfo == undefined){
            item.Rarity = "?";
            item["Est. Value"] = "";
            item["Est. Profit"] = "";
        } else {
            // If the item info exists, update price and rarity
            item.Rarity = itemInfo.Rarity;

            const boughtPrice = parseInt(item.Price);
            const itemValue = parseInt(itemInfo.Price);
            
            // Measuring the value of the purchase
            var value = itemValue;
            item["Est. Value"] = CheckIsNaNDisplay(value, "-", FormatNPNumber(value));
            if(!isNaN(value)) totalValue += value;

            // Measuring the profit from the purchase;
            var profit = itemValue - boughtPrice;
            item["Est. Profit"] = CheckIsNaNDisplay(profit, "-", FormatNPNumber(profit));

            if(!isNaN(profit)) totalProfit += profit;

            item["Price"] = CheckIsNaNDisplay(boughtPrice, "-", boughtPrice);
        }

        proccessedData.push(item);
    });

    document.getElementById("total-profit").innerText = FormatNPNumber(totalProfit);
    document.getElementById("total-value").innerText = FormatNPNumber(totalValue);
    document.getElementById("total-entries").innerText = itemArray.length + " items listed";

    return proccessedData.reverse();
}


//If a value is NaN or not, then it'll display one option or the other;
function CheckIsNaNDisplay(input, outputTrue, outputFalse){
    return isNaN(input) ? outputTrue : outputFalse;
}


//######################################################################################################################################


var table = document.createElement("table");
table.classList.add("table", "sortable"); // Add classes for styling
var tableBody = document.createElement("tbody");
var tableRow = document.createElement("tr");
var tableHead = document.createElement("thead");
var tableHeader = document.createElement("th");
var tableDataCell = document.createElement("td");
const pageIndicator = document.getElementById("page-indicator");
const chunkSize = 50;

// Data Table with purchase history and information;
function DisplayTableData(dataArray) {
    tableBody.innerHTML = '';
    table.innerHTML = '';

    // Creating the row headers;
    var keys = CreateHeaderRowKeys(dataArray, ["JN"], tableHeader);

    LoadChunksOfData(dataArray, chunkSize, keys);
    
    function LoadChunksOfData(data, chunkSize, headers){
        const tableSortingScript = document.createElement("script");
        tableSortingScript.src = "../../../js/sortable.js";
        document.head.appendChild(tableSortingScript);
        
        const startIndex = (currentPage - 1) * chunkSize;
        const endIndex = startIndex + chunkSize;
        const dataChunk = data.slice(startIndex, endIndex);
    
        for (var i = 0; i < chunkSize && dataChunk[i] != null; i++) {
            const row = dataChunk[i];
            const rowElement = document.createElement("tr");
            rowElement.classList.add("item");
            var lastName = "";

            for (const header of headers) {
                const cell = document.createElement("td");
                cell.classList.add("table-cell"); // Add class for table cells
                let cellValue = row[header] || "";
                
                switch (header) {
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

                    case "Price":
                        var priceValue = parseInt(cellValue);
                        var priceSpan = CheckIsNaNDisplay(priceValue, "-", FormatNPNumber(priceValue));
                        cell.appendChild(document.createTextNode(priceSpan));
                    break;

                    case "JN":
                        // Create the <a> element
                        var linkElement = document.createElement("a");
                        linkElement.href = `https://items.jellyneo.net/search/?name=${lastName}&name_type=3`;

                        // Create the <img> element
                        var imgElement = document.createElement("img");
                        imgElement.src = "../JN.png";
                        imgElement.alt = "Info Icon";

                        linkElement.appendChild(imgElement);

                        cell.appendChild(linkElement);
                        cell.classList.add('class-JellyNeo');
                    break;

                    default:
                        cell.appendChild(document.createTextNode(cellValue));
                    break;
                }
    
                rowElement.appendChild(cell);
            }
    
            tableBody.appendChild(rowElement);
        }
    
        table.appendChild(tableBody);
        table.classList.add("table", "sortable"); // Add classes for styling
        tableContainer.innerHTML = "";
        tableContainer.appendChild(table);
    }
}

function CreateHeaderRowKeys(dataArray, keysToPush, tableHeader) {
    var tableRowClone = tableRow.cloneNode(false);

    const headerKeys = [];
    const firstItem = dataArray[0];

    for(key in firstItem){ // Check all the keys in the current data;
        // Check if the key is unique;
        if(firstItem.hasOwnProperty(key) && headerKeys.indexOf(key) == -1){
            headerKeys.push(key); // Adding the key;

            // Creating the cell and appending it;
            const headerCell = tableHeader.cloneNode(false);
            headerCell.appendChild(document.createTextNode(key));
            tableRowClone.appendChild(headerCell);   
        } else break;
    }

    // Pushing extra keys to the DB;
    keysToPush.forEach(function(key){
        headerKeys.push(key);
        headerCell = tableHeader.cloneNode(false);
        headerCell.appendChild(document.createTextNode(key));
        tableRowClone.appendChild(headerCell);
    });

    //Creating the header rows;
    const headerRow = tableHead.cloneNode(false);
    headerRow.appendChild(tableRowClone);
    table.appendChild(headerRow);

    return headerKeys;
}

function NumberWithCommas(e) {
    return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Handles the JN link of the item;
function CreatePurchaseStatusSpan(cellValue){
    var statusSpan = document.createElement("a");
    statusSpan.innerText = cellValue;

    // Coloring the span based on the purchase interaction type;
    switch(cellValue){
        case "Bought":
            statusSpan.style.color = "#2196F3";
        break;

        default:
            statusSpan.style.color = "grey";
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

/*
const data = item_db_array;
const chunkSize = 500;
var currentPage = 1;


// Calculate the total number of pages
const totalPages = Math.ceil(data.length / chunkSize);

// Function to load data for the current page
function LoadCurrentPage() {
    LoadTableData(data, chunkSize, currentPage);

    // Update navigation
    UpdateNavigation();
}

function LoadTableData(data, chunkSize, currentPage){
    table.innerHTML = "";
    thead.innerHTML = "";
    tbody.innerHTML = "";
    const headers = [];

    const headerRow = document.createElement("tr");
    headerRow.classList.add("header-row"); // Add class for table header row
    
    for (const row of data) {
        for (const key in row) {
            if (row.hasOwnProperty(key) && headers.indexOf(key) === -1) {
                headers.push(key);
                const headerCell = document.createElement("th");
                headerCell.textContent = key;
                headerRow.appendChild(headerCell);
                headerRow.classList.add(`class-${key}`);
            }
        }
    }

    const jnRow = document.createElement("th");
    jnRow.classList.add("header-row"); // Add class for table header row
    jnRow.textContent = "JellyNeo";
    jnRow.classList.add("class-jellyneo");
    headerRow.appendChild(jnRow);
    headers.push("JellyNeo");
    

    thead.appendChild(headerRow);
    table.appendChild(thead);

    table.appendChild(tbody);
    table.classList.add("table", "sortable"); // Add classes for styling
    tableContainer.appendChild(table);

    LoadChunksOfData(data, chunkSize, currentPage, headers);
}

function LoadChunksOfData(data, chunkSize, currentPage, headers){
    var e = document.createElement("script");
    e.setAttribute("src", "../../../js/sortable.js"), document.head.append(e)
    
    const startIndex = (currentPage - 1) * chunkSize;
    const endIndex = startIndex + chunkSize;
    const dataChunk = data.slice(startIndex, endIndex);

    for (var i = 0; i < chunkSize && dataChunk[i] != null; i++) {
        const row = dataChunk[i];
        const rowElement = document.createElement("tr");
        rowElement.classList.add("item");
        var lastName = "";

        for (const header of headers) {
            const cell = document.createElement("td");
            cell.classList.add("table-cell"); // Add class for table cells
            let cellValue = row[header] || "";

            switch (header) {
                case "Date & Time":
                    cell.classList.add('class-DateTime');
                break;

                case "Name":
                    const name = document.createElement("div");
                    name.innerText = cellValue;
                    cell.appendChild(name);
                    lastName = cellValue;
                    cell.classList.add('class-Name');
                break;
                
                case "Rarity":
                    cell.textContent = NumberWithCommas(cellValue);
                    cell.classList.add('class-Rarity');
                break;

                case "Price":
                    cell.textContent = NumberWithCommas(cellValue);
                    cell.classList.add('class-Price');
                break;

                case "JellyNeo":
                    // Create the <a> element
                    var linkElement = document.createElement("a");
                    linkElement.href = `https://items.jellyneo.net/search/?name=${lastName}&name_type=3`;

                    // Create the <img> element
                    var imgElement = document.createElement("img");
                    imgElement.src = "../JN.png";
                    imgElement.alt = "Info Icon";

                    linkElement.appendChild(imgElement);

                    cell.appendChild(linkElement);
                    cell.classList.add('class-JellyNeo');
                break;
                
                
            }

            rowElement.appendChild(cell);
        }

        tbody.appendChild(rowElement);
    }

    table.appendChild(tbody);
    table.classList.add("table", "sortable"); // Add classes for styling
    tableContainer.appendChild(table);
}

// Function to update navigation buttons and page indicator
function UpdateNavigation() {
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const pageIndicator = document.getElementById("page-indicator");

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Event listener for previous button
document.getElementById("prev-button").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
    }

    LoadCurrentPage();
});

// Event listener for next button
document.getElementById("next-button").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;

    }

    LoadCurrentPage();
});

// Event listener for next button
document.getElementById("first-button").addEventListener("click", () => {
    currentPage = 1;

    LoadCurrentPage();
});

// Event listener for next button
document.getElementById("last-button").addEventListener("click", () => {
    currentPage = totalPages;

    LoadCurrentPage();
});

// Initial load
LoadCurrentPage();
*/

//######################################################################################################################################