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

function AveragePurchaseRatios(data, mainShopId, atticId){
    var mainShopBuyRatio = [0, 0],
    atticShopBuyRatio = [0, 0];

    data.forEach(function(entry, index){
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
    });
    
    var mainShopRatioChart = CreateChartWithLabels(mainShopId, "pie", ["Bought", "Missed"], mainShopBuyRatio, FormatDatalabelsOptions());

    if(mainShopRatioChart) ResizeChartInterval(mainShopId, chartSize);

    var atticRatioChart = CreateChartWithLabels(atticId, "pie", ["Bought", "Missed"], atticShopBuyRatio, FormatDatalabelsOptions());

    if(atticRatioChart) ResizeChartInterval(atticId, chartSize);
}