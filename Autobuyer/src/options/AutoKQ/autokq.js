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
const analyticsContainer = document.getElementById('analytics-container');

const optionsButton = document.getElementById("options");
optionsButton.addEventListener('click', ShowOptions);

function ShowOptions(){
    stockContainer.style.display = 'none';
    analyticsContainer.style.display = 'none';
    optionsContainer.style.display = 'block';
}

const stockButton = document.getElementById("history");
stockButton.addEventListener('click', ShowHistory);

function ShowHistory(){
    optionsContainer.style.display = 'none';
    analyticsContainer.style.display = 'none';
    stockContainer.style.display = 'block';
}

const analyticsButton = document.getElementById("analytics");
analyticsButton.addEventListener('click', ShowAnalytics);

function ShowAnalytics(){
    optionsContainer.style.display = 'none';
    stockContainer.style.display = 'none';
    analyticsContainer.style.display = 'block';
}


ShowAnalytics();


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
var nullDataMessage = "No Kitchen Quests Done Yet.";

// Data Table with purchase history and information;
function DisplayTableData(dataArray) {
    var tableContainer = document.getElementById("table-container");

    if (dataArray.length === 0) {
        tableContainer.classList.add("subcategory-info");
        tableContainer.textContent = "No Kitchen Quests Done Yet.";
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

  chrome.storage.local.get({
    KQ_TRACKER: [],
}, (function(tracker) {
    var data = tracker.KQ_TRACKER;

    PrizesObtained(data, "prizesObtainedChart");

    StatsObtained(data, "statsObtainedChart");

    PetStatsObtained(data, "benefitedPetsChart")

    PrizeTypesPerMonth(data, "prizesPerMonth")
}))

var chartSize = "400px";

function PrizesObtained(data, id){
    var prizes = data.filter(function(entry){
        return entry.Type == "Stat" || "Item" || "Neopoints";
    });

    var prizesInputData = [0, 0, 0];

    prizes.forEach(function(object){
        switch(object.Type){
            case "Stat": prizesInputData[0] += 1; break;
            case "Item": prizesInputData[1] += 1; break;
            default: prizesInputData[2] += 1; break;
        }
    });

    var isChartActive = CreateChartWithLabels(id, "pie", ["Stat", "Item", "Neopoints"], prizesInputData, FormatDatalabelsOptions());
    
    if(isChartActive) ResizeChartInterval(id, chartSize);
}

function StatsObtained(data, id){
    var stats = data.filter(function(entry){
        return entry.Type == "Stat";
    });

    var statsInputData = [0, 0, 0, 0, 0];

    stats.forEach(function(object){
        switch(object.Prize){
            case "Level": statsInputData[0] += 1; break;
            case "Hit point": statsInputData[1] += 1; break;
            case "Attack": statsInputData[2] += 1; break;
            case "Defence": statsInputData[3] += 1; break;
            default: statsInputData[4] += 1; break;
        }
    })

    var isChartActive = CreateChartWithLabels(id, "pie", ["Level", "Hit point", "Strength", "Defence", "Agility"], statsInputData, FormatDatalabelsOptions());

    if(isChartActive) ResizeChartInterval(id, chartSize);
}

function PetStatsObtained(data, id){
    // Count the appearances of each unique Pet Name
    var filteredPets = data.filter(function(object) {
        return object['Pet Name'] !== "";
    });

    var petNameCounts = filteredPets.reduce(function(counts, entry) {
        var petName = entry['Pet Name'];
        counts[petName] = (counts[petName] || 0) + 1;
        
        return counts;
    }, {});

    var isChartActive = CreateBarChart(id, "bar", Object.keys(petNameCounts), Object.values(petNameCounts), FormatDatalabelsOptions());

    if(isChartActive) ResizeChartInterval(id, "760px", chartSize);
}

function PrizeTypesPerMonth(data, id){
    const canvas = document.getElementById(id),
    context = canvas.getContext("2d");

    if(!CheckIfEnoughData(canvas, data)) return;

    var separatedDataset = FormatDatasetByMonthAndYear(data);
    var keys = Object.keys(separatedDataset)
    var keyDataset = [];

    keys.forEach(function (key, index){
        keyDataset.push({key: key, value: [{key: "Stat", value: 0}, {key: "Item", value: 0}, {key: "Neopoints", value: 0}]});

        separatedDataset[key].forEach(function(object){
            switch(object.Type){
                case "Stat": keyDataset[index].value[0].value += 1; break;
                case "Item": keyDataset[index].value[1].value += 1; break;
                default: keyDataset[index].value[2].value += 1; break;
            }
        })
    });

    // Parse the dataset into a format that Chart.js can understand
    var chartData = { labels: [], datasets: [] };

    // Extract labels and data for each dataset
    keyDataset.forEach(function(monthData) {
        chartData.labels.push(monthData.key); // Assuming the key represents the month

        monthData.value.forEach(function(dataType, index) {
            var existingDataset = chartData.datasets.find(function(dataset) {
                return dataset.label === dataType.key;
            });
            
            if (existingDataset) {
                existingDataset.data.push(dataType.value);
            } else {
                var colors = CalculateColorInIndex(index, 3);

                chartData.datasets.push({
                    label: dataType.key,
                    data: [dataType.value],
                    borderColor: colors, // Function to generate random colors
                    backgroundColor:  colors,
                    borderWidth: 3,
                    fill: false
                });
            }
        });
    });

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

    ResizeChartInterval(id, "760px", "380px")
}

// Function to separate the dataset by month and year
function FormatDatasetByMonthAndYear(dataset) {
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
function CreateBarChart(id, type, labels, data, options) {
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
            labels: ["Data"],
            datasets: datasets // Use the dynamically created datasets
        },
        options: options
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

    setInterval(function(){
        ResizeChart(id, sizeX, sizeY);
    }, 100);
}

function ResizeChart(id, sizeX, sizeY = ""){
    // Set fixed width and height for the canvas
    document.getElementById(id).style.width = sizeX;

    if(sizeY == "") document.getElementById(id).style.height = sizeX;
    else document.getElementById(id).style.height = sizeY;
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