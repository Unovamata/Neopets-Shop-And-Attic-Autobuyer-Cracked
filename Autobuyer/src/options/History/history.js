// GUI Interaction;

const tableButton = document.getElementById("table-button");
const tableNavigation = document.getElementById("history-navigation");
const tableContainer = document.getElementById("table-container");
const analyticsContainer = document.getElementById("analytics-container");

tableButton.onclick = function(e) {
    ShowHistory();
} 

function ShowHistory(){
    ShowAndHideElements([tableContainer, tableNavigation], [analyticsContainer]);
}

function ShowAnalytics(){
    ShowAndHideElements([analyticsContainer], [tableContainer, tableNavigation]);
}

const analyticsButton = document.getElementById("analytics-button");

analyticsButton.onclick = function(e) {
    ShowAnalytics();
}

//Toggling the main tab;
ShowHistory();

//Update the history data every 5 seconds;
ProcessPurchaseHistory(false), setInterval((function() {
    ProcessPurchaseHistory(false)
}), 5e3)

const clearButton = document.getElementById("reset-history");
clearButton.addEventListener('click', ClearHistory);

function ClearHistory(){
    if(confirm("Do you want to delete all entries in your item purchase history?")){
        if(confirm("Are you sure you want to clear your purchase history? This action cannot be undone unless you have a backup of you configuration presets.")){
            setVARIABLE("ITEM_HISTORY", []);
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

async function ProcessPurchaseHistory(forceUpdateHistory) {
    // Processing the history data;
    var history = await getVARIABLE("ITEM_HISTORY");
    var historySize = history.length;
    
    var processedData = ProcessItemData(history);

    // Force updating if necessary;
    if (forceUpdateHistory || currentHistorySize != historySize) {
        // Removing the NeoPass message;
        const filteredList = history.filter(entry => !entry["Item Name"].includes("We are excited to announce that we have upgraded our system to"));

        history = filteredList;
        historySize = history.length;

        processedData = ProcessItemData(filteredList);

        //if(currentHistorySize != historySize) setVARIABLE("ITEM_HISTORY", processedData);

        currentHistorySize = historySize;
        DisplayTableData(processedData, ["JN"], chunkSize, FilterFunction);            

        try { AveragePurchaseRatios(processedData, "mainShopRatioChart", "atticRatioChart"); } catch {}
    }

    // Updating the page data;
    totalPages = Math.ceil(processedData.length / chunkSize);
    UpdateNavigation();
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
    var totalProfitVsAttempted = CreateChartWithLabels("totalProfitVsAttempted", "pie", ["Total Attempted Value", "Total Estimated Profit"], [totalValue, totalProfit], FormatDatalabelsOptions(), `Top ${showEntries} Most Valuable Bought Items`);

    if(totalProfitVsAttempted) ResizeChartInterval("totalProfitVsAttempted", chartSize);

    var mainShopBuyRatio = [0, 0],
    atticShopBuyRatio = [0, 0],
    groupedItems = new Map();

    data.forEach(function(entry){
        AtticAndMainShopRatios(entry, atticShopBuyRatio, mainShopBuyRatio);
        
        MostCommonItems(entry, groupedItems);
    });
    
    var mainShopRatioChart = CreateChartWithLabels(mainShopId, "pie", ["Bought", "Missed"], mainShopBuyRatio, FormatDatalabelsOptions());

    if(mainShopRatioChart) ResizeChartInterval(mainShopId, chartSize);

    var atticRatioChart = CreateChartWithLabels(atticId, "pie", ["Bought", "Missed"], atticShopBuyRatio, FormatDatalabelsOptions());

    if(atticRatioChart) ResizeChartInterval(atticId, chartSize);

    // Convert the map to an array of entries and sort it based on occurrence count
    var mostCommonEntries = [...groupedItems.entries()].sort((a, b) => b[1].Entries - a[1].Entries).slice(0, showEntries),
    mostCommonData = [];

    // Log the most common entries up to showEntries
    mostCommonEntries.forEach(entry => {
        mostCommonData[entry[0]] = entry[1].Entries;
    });

    var mostCommonItemsChart = CreateBarChart("mostCommonItemsChart", "bar", Object.keys(mostCommonData), Object.values(mostCommonData), FormatDatalabelsOptions(), `Top ${showEntries} Most Commonly Bought Items`);

    if(mostCommonItemsChart) ResizeChartInterval("mostCommonItemsChart", "760px", "380px");

    var mostProfitableEntries = [...groupedItems.entries()].sort((a, b) => b[1].Value - a[1].Value).slice(0, showEntries),
    mostProfitableData = [];

    // Log the most common entries up to showEntries
    mostProfitableEntries.forEach(entry => {
        mostProfitableData[entry[0]] = entry[1].Value;
    });

    //console.log(mostProfitableData);

    var mostValuableItemsChart = CreateBarChart("mostValuableItemsChart", "bar", Object.keys(mostProfitableData), Object.values(mostProfitableData), FormatDatalabelsOptions(), `Top ${showEntries} Most Valuable Bought Items`);

    if(mostValuableItemsChart) ResizeChartInterval("mostValuableItemsChart", "760px", "380px");
    
    // Profit Per Store Name
    var shopNames = {};
    var hourMainShopRatios = {}, hourAtticRatios = {};

    for(var i = 0; i <= 23; i++){
        hourMainShopRatios[i] = {Ratio: 0, Profit: 0, Attempted: 0};
        hourAtticRatios[i] = {Ratio: 0, Profit: 0, Attempted: 0};
    }

    data.forEach(function(entry){
        var value = Number(entry["Est. Value"].replace(/[^\d.-]/g, ''));

        if(entry.Status == "Bought"){
            if(!shopNames.hasOwnProperty(entry["Shop Name"])){
                shopNames[entry["Shop Name"]] = value;
            } else {
                shopNames[entry["Shop Name"]] += value;
            }
        }

        var entryHour = new Date(entry["Date & Time"]).getHours();
        var hourMainShopObject = hourMainShopRatios[entryHour];
        var hourAtticObject = hourAtticRatios[entryHour];

        switch(entry["Shop Name"]){
            case "Attic":
                // If the item was bought in the same session;
                if(entry.Status == "Bought"){
                    hourAtticObject.Profit += value;
                } else { // If not, the item was not bought, add it to the negative ratio;
                    hourAtticObject.Attempted += value;
                }
            break;
    
            default:
                switch(entry.Status){
                    case "Bought":
                        hourMainShopObject.Profit += value;
                    break;
    
                    default: // Missed items;
                        hourMainShopObject.Attempted += value;
                    break;
                }
            break;
        }        
    });

    var mostProfitableShops = CreateBarChart("mostProfitableShops", "bar", Object.keys(shopNames), Object.values(shopNames), FormatDatalabelsOptions(), `Most Profitable Shops for NeoBuyer+`);

    if(mostProfitableShops) ResizeChartInterval("mostProfitableShops", "760px", "380px");

    // Profit pet hour;
    var hourProfit = [], atticHourProfit = [], hourAttempted = [], atticHourAttempted = [], hourRatio = [], atticHourRatio = [];

    for(var i = 0; i <= 23; i++){
        // Main Shops;
        var entry = hourMainShopRatios[i];
        var profitPerHour = entry.Profit;
        var attemptedPerHour = entry.Attempted;
        var ratio = (profitPerHour /  attemptedPerHour * 100).toFixed(2);

        if(attemptedPerHour == 0) ratio = 0;

        entry.Ratio = Number(ratio);

        hourProfit.push(profitPerHour);
        hourAttempted.push(attemptedPerHour);
        hourRatio.push(ratio);

        //Attic;
        entry = hourAtticRatios[i];
        profitPerHour = entry.Profit;
        attemptedPerHour = entry.Attempted;
        ratio = (profitPerHour /  attemptedPerHour * 100).toFixed(2);

        if(attemptedPerHour == 0) ratio = 0;

        entry.Ratio = Number(ratio);

        atticHourProfit.push(profitPerHour);
        atticHourAttempted.push(attemptedPerHour);
        atticHourRatio.push(ratio);
    };

    var profitPerHour = CreateBarChart("profitPerHour", "bar", Object.keys(hourMainShopRatios), hourProfit, FormatDatalabelsOptions(), `Profitability Per Hour of the Day`);

    if(profitPerHour) ResizeChartInterval("profitPerHour", "760px", "380px");

    var atticProfitPerHour = CreateBarChart("atticProfitPerHour", "bar", Object.keys(hourAtticRatios), atticHourProfit, FormatDatalabelsOptions(), `Profitability Per Hour of the Day`);

    if(atticProfitPerHour) ResizeChartInterval("atticProfitPerHour", "760px", "380px");

    var ratioPerHour = CreateBarChart("ratioPerHour", "bar", Object.keys(hourMainShopRatios), hourRatio, FormatDatalabelsOptions(), `Probability of Buying an Item in a set Hour`);

    if(ratioPerHour) ResizeChartInterval("ratioPerHour", "760px", "380px");

    var atticRatioPerHour = CreateBarChart("atticRatioPerHour", "bar", Object.keys(hourAtticRatios), atticHourRatio, FormatDatalabelsOptions(), `Probability of Buying an Item in a set Hour`);

    if(atticRatioPerHour) ResizeChartInterval("atticRatioPerHour", "760px", "380px");

    
    var datesDataset = FormatDatasetByMonthAndYear(Object.values(data));
    var datesProfits = [];

    Object.keys(datesDataset).forEach(function(entry){
        var items = datesDataset[entry];

        var profits = items
            .filter(item => item.Status === "Bought")
            .map(item => Number(item["Est. Value"].replace(/[^\d.-]/g, '')));
        var sumOfProfits = profits.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        
        datesProfits.push(sumOfProfits);
    });

    const datesReversedKeys = Object.keys(datesDataset).reverse();

    // Set up Chart.js with a line chart configuration
    var profitsOverTime = CreateTimelineChart("profitsOverTime", datesReversedKeys, datesProfits.reverse(), "Profits");
    
    if(profitsOverTime) ResizeChartInterval("profitsOverTime", "760px", "380px");
}

function AtticAndMainShopRatios(entry, atticShopBuyRatio, mainShopBuyRatio){
    switch(entry["Shop Name"]){
        case "Attic":
            try{
                // If the item was bought in the same session;
                if(entry.Status == "Bought"){
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
        Date: entry["Date & Time"],
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