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

// DisplayChunkData.js
const chunkSize = 30;

// Initial load
LoadCurrentPage();

LoadCurrentPage = function(){
    ProcessPurchaseHistory(true)

    // Update navigation
    UpdateNavigation();
}

// GUI Functions;
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
            DisplayTableData(processedData, ["JN"], chunkSize, FilterFunction);

            try { AveragePurchaseRatios(processedData, "mainShopRatioChart", "atticRatioChart"); } catch {}
        }

        // Updating the page data;
        totalPages = Math.ceil(processedData.length / chunkSize);
        UpdateNavigation();
    }))
}


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

function FilterFunction(header, cell, data){
    switch (header) {
        case "Date & Time":
            cell.appendChild(document.createTextNode(data[0]));
            cell.classList.add('class-DateTime');
        break;

        case "Item Name":
            const name = document.createElement("div");
            name.innerText = data[0];
            cell.appendChild(name);
            lastName = data[0];
            cell.appendChild(name);
        break;

        case "Status":
            // Create a colored span element for the "Status" column
            var statusSpan = CreatePurchaseStatusSpan(data[0]);
            cell.appendChild(statusSpan);
        break;

        case "Price":
            var priceValue = parseInt(data[0]);
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
            cell.appendChild(document.createTextNode(data[0]));
        break;
    }

    return cell;
}

// Handles the JN link of the item;
function CreatePurchaseStatusSpan(cellValue){
    var statusSpan = document.createElement("a");
    statusSpan.innerText = cellValue;
    statusSpan.style.fontWeight = "bold";

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

//######################################################################################################################################

// Charts

const showEntries = 15;

function AveragePurchaseRatios(data, mainShopId, atticId){
    var mainShopBuyRatio = [0, 0],
    atticShopBuyRatio = [0, 0],
    mostCommonItems = new Map();

    data.forEach(function(entry, index){
        AtticAndMainShopRatios(data, index, entry, atticShopBuyRatio, mainShopBuyRatio);
        
        MostCommonItems(entry, mostCommonItems);
    });
    
    var mainShopRatioChart = CreateChartWithLabels(mainShopId, "pie", ["Bought", "Missed"], mainShopBuyRatio, FormatDatalabelsOptions());

    if(mainShopRatioChart) ResizeChartInterval(mainShopId, chartSize);

    var atticRatioChart = CreateChartWithLabels(atticId, "pie", ["Bought", "Missed"], atticShopBuyRatio, FormatDatalabelsOptions());

    if(atticRatioChart) ResizeChartInterval(atticId, chartSize);

    // Convert the map to an array of entries and sort it based on occurrence count
    var mostCommonEntries = [...mostCommonItems.entries()].sort((a, b) => b[1].Entries - a[1].Entries).slice(0, showEntries),
    mostCommonData = [];

    // Log the most common entries up to showEntries
    mostCommonEntries.forEach(entry => {
        mostCommonData[entry[0]] = entry[1].Entries;
    });

    var isChartActive = CreateBarChart("mostCommonItemsChart", "bar", Object.keys(mostCommonData), Object.values(mostCommonData), FormatDatalabelsOptions(), `Top ${showEntries} Most Commonly Bought Items`);

    if(isChartActive) ResizeChartInterval("mostCommonItemsChart", "760px", chartSize);

    var mostProfitableEntries = [...mostCommonItems.entries()].sort((a, b) => b[1].Value - a[1].Value).slice(0, showEntries),
    mostProfitableData = [];

    // Log the most common entries up to showEntries
    mostProfitableEntries.forEach(entry => {
        mostProfitableData[entry[0]] = entry[1].Value;
    });

    var isChartActive = CreateBarChart("mostValuableItemsChart", "bar", Object.keys(mostProfitableData), Object.values(mostProfitableData), FormatDatalabelsOptions(), `Top ${showEntries} Most Valuable Bought Items`);

    if(isChartActive) ResizeChartInterval("mostValuableItemsChart", "760px", chartSize);

    console.log(totalProfit, totalValue);
}

function AtticAndMainShopRatios(data, index, entry, atticShopBuyRatio, mainShopBuyRatio){
    switch(entry["Shop Name"]){
        case "Attic":
            try{
                var lastEntry = data[index - 1];
                
                // If the item was bought in the same session;
                if(lastEntry.Name == entry.Name && entry.Status == "Bought"){
                    atticShopBuyRatio[0] += 1; // Add to the purchase positive ratio;
                } else { // If not, the item was not bought, add it to the negative ratio;
                    atticShopBuyRatio[1] += 1;
                }
            } catch {
                atticShopBuyRatio[1] += 1;
            }
        break;

        default:
            switch(entry.Status){
                case "Bought":
                    mainShopBuyRatio[0] += 1;
                break;

                default: // Missed items;
                    mainShopBuyRatio[1] += 1;
                break;
            }
        break;
    }
}


function MostCommonItems(entry, mostCommonItems){
    var entryMin = {
        Name: entry["Item Name"],
        Status: entry.Status,
        Value: Number(entry["Est. Value"].replace(/[^\d.-]/g, '')),
        Profit: Number(entry["Est. Profit"].replace(/[^\d.-]/g, '')),
        Shop: entry["Shop Name"],
        Entries: 1,
    }

    var entryName = entryMin.Name;

    if (entry.Status === "Bought") {
        if(mostCommonItems.has(entryName)){
            var entryCall = mostCommonItems.get(entryName);
            entryCall.Entries += 1;
            
            mostCommonItems.set(entryCall.Name, entryCall);
            
        } else {
            mostCommonItems.set(entryName, entryMin);
        }
    }
}