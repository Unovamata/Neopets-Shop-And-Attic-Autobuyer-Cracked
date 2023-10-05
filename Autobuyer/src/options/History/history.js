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



var clearButton = document.getElementById("reset");
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
        tableContainer.textContent = "No items purchased yet.";
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

        headerKeys.push("Est. Profit"); // Adding the key;
        var headerCell = tableHeader.cloneNode(false);
        headerCell.appendChild(document.createTextNode("Est. Profit"));
        tableRowClone.appendChild(headerCell);   

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

function ProcessPurchaseHistory(forceUpdateHistory) {
    //Getting the item history from the cache;
    var chromeItemHistory = chrome.storage.local.get({ ITEM_HISTORY: [] });

    chrome.storage.local.get({
        ITEM_HISTORY: [],
    }, (function(t) {
        const historySize = t.ITEM_HISTORY.length;
        var purchaseManager = ManagePurchases(t.ITEM_HISTORY)
        var itemData = ProcessItemData(purchaseManager);

        if (forceUpdateHistory || currentHistorySize != historySize) {
            currentHistorySize = historySize;
            DisplayTableData(purchaseManager);
            Analytics(purchaseManager, itemData, totalProfit)
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

var totalProfit = 0, totalValue = 0;

// Processes and formats the item data in the table;
function ProcessItemData(itemArray){
    totalProfit = 0;
    totalValue = 0;

    for(var item of itemArray){
        const itemInfo = item_db[item["Item Name"]];

        if(itemInfo == undefined){
            item.Rarity = "?";
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
            var totalProfitLabel = document.getElementById("total-profit"); 
            var totalValueLabel = document.getElementById("total-value");

            if(!isNaN(profit)) totalProfit += profit;

            item["Price"] = CheckIsNaNDisplay(boughtPrice, "-", boughtPrice);
        }
    }

    document.getElementById("total-profit").innerText = FormatNPNumber(totalProfit);
    document.getElementById("total-value").innerText = FormatNPNumber(totalValue);

    return totalProfit;
}

//--------------------------------

//If a value is NaN or not, then it'll display one option or the other;
function CheckIsNaNDisplay(input, outputTrue, outputFalse){
    return isNaN(input) ? outputTrue : outputFalse;
}


//######################################################################################################################################


var i = 20;

function Analytics(t, r, n) {
    var a = "No analytics are available yet. Check back after some more successful purchases!";
    t.length > 10 && r > 5e5 && n > 5e5 && document.getElementById("analytics-container")
        .innerHTML != a ? (function(t) {
            var r = function(e) {
                var t = new Map;
                for (var r of e) t.set(r["Shop Name"], 0);
                for (var r of e) t.set(r["Shop Name"], t.get(r["Shop Name"]) + ParseNumericString(r["Est. Profit"]));
                return t = new Map([...t.entries()].sort(((e, t) => t[1] - e[1]))), t
            }(t);
            new Chartist.Bar("#profit-by-store", {
                labels: Array.from(r.keys()),
                series: [Array.from(r.values())]
            }, {
                low: 0,
                axisX: {
                    showGrid: !1,
                    offset: 75
                },
                axisY: {
                    offset: 100,
                    labelInterpolationFnc: function(t) {
                        return FormatNumberWithSymbols(t) + " NP"
                    }
                }
            })
        }(t), function(t) {
            var r = function(e) {
                var t = new Map;
                for (var r of e) t.set(r["Item Name"], 0);
                for (var r of e) t.set(r["Item Name"], t.get(r["Item Name"]) + 1);
                for (var n = new Map, a = 0; a < i; a++) {
                    var o = [...t.entries()].reduce(((e, t) => t[1] > e[1] ? t : e));
                    if (o[1] <= 0) break;
                    n.set(o[0], o[1]), t.set(o[0], -1)
                }
                return n = new Map([...n.entries()].sort(((e, t) => t[1] - e[1])))
            }(t);
            new Chartist.Bar("#most-common-items", {
                labels: Array.from(r.keys()),
                series: [Array.from(r.values())]
            }, {
                low: 0,
                axisX: {
                    showGrid: !1,
                    offset: 75
                },
                axisY: {
                    offset: 100,
                    labelInterpolationFnc: function(t) {
                        return FormatNumberWithSymbols(t)
                    }
                }
            })
        }(t), function(t) {
            var r = function(e) {
                var t = new Map;
                for (var r of e) t.set(r["Item Name"], 0);
                for (var r of e) t.set(r["Item Name"], t.get(r["Item Name"]) + ParseNumericString(r["Est. Profit"]));
                for (var n = new Map, a = 0; a < i; a++) {
                    var o = [...t.entries()].reduce(((e, t) => t[1] > e[1] ? t : e));
                    if (o[1] <= 0) break;
                    n.set(o[0], o[1]), t.set(o[0], -1)
                }
                return n = new Map([...n.entries()].sort(((e, t) => t[1] - e[1])))
            }(t);
            new Chartist.Bar("#best-items", {
                labels: Array.from(r.keys()),
                series: [Array.from(r.values())]
            }, {
                low: 0,
                axisX: {
                    showGrid: !1,
                    offset: 75
                },
                axisY: {
                    offset: 100,
                    labelInterpolationFnc: function(t) {
                        return FormatNumberWithSymbols(t)
                    }
                }
            })
        }(t), function(t) {
            var r = function(e) {
                var t = new Map;
                for (var r of e) t.set(r.Account, 0);
                for (var r of e) t.set(r.Account, t.get(r.Account) + ParseNumericString(r["Est. Profit"]));
                return t = new Map([...t.entries()].sort(((e, t) => t[1] - e[1]))), t
            }(t);
            new Chartist.Bar("#profit-by-account", {
                labels: Array.from(r.keys()),
                series: [Array.from(r.values())]
            }, {
                low: 0,
                axisX: {
                    showGrid: !1,
                    offset: 75
                },
                axisY: {
                    offset: 100,
                    labelInterpolationFnc: function(t) {
                        return FormatNumberWithSymbols(t) + " NP"
                    }
                }
            })
        }(t), function(t) {
            var r = function(e) {
                var t = new Map;
                for (var r of e) {
                    var n = FormatDate(r["Date & Time"]);
                    t.set(n, 0)
                }
                for (var r of e) {
                    n = FormatDate(r["Date & Time"]);
                    t.set(n, t.get(n) + ParseNumericString(r["Est. Profit"]))
                }
                return t = new Map([...t.entries()].reverse()), t
            }(t);
            new Chartist.Line("#timeline", {
                labels: Array.from(r.keys()),
                series: [Array.from(r.values())]
            }, {
                low: 0,
                axisX: {
                    showGrid: !1,
                    offset: 75
                },
                axisY: {
                    offset: 100,
                    labelInterpolationFnc: function(t) {
                        return FormatNumberWithSymbols(t)
                    }
                }
            })
        }(t), function(e, t) {
            new Chartist.Pie("#ratio", {
                series: [e, t]
            }, {
                donut: !0,
                donutWidth: 50,
                startAngle: 270,
                total: e + t,
                labelInterpolationFnc: function(r) {
                    return (r / (e + t) * 100)
                        .toFixed(1) + "%"
                }
            })
        }(r, n), function(t) {
            var r = CalculateProfitsByTime(t, "Est. Profit"),
                n = CalculateProfitsByTime(t, "Est. Value");
            new Chartist.Line("#hourly", {
                labels: Array.from(n.keys()),
                series: [Array.from(r.values()), Array.from(n.values())]
            }, {
                low: 0,
                axisX: {
                    showGrid: !1,
                    offset: 75,
                    labelInterpolationFnc: function(e) {
                        return e
                    }
                },
                axisY: {
                    offset: 100,
                    labelInterpolationFnc: function(t) {
                        return FormatNumberWithSymbols(t)
                    }
                }
            })
        }(t), function(e) {
            for (var t = CalculateProfitsByTime(e, "Est. Profit"), r = CalculateProfitsByTime(e, "Est. Value"), n = [], a = 0; a < Array.from(t.values())
                .length; a++) n.push(Number(Array.from(t.values())[a]) / Number(Array.from(r.values())[a]));
            new Chartist.Line("#hourly-percent", {
                labels: Array.from(r.keys()),
                series: [Array.from(n)]
            }, {
                low: 0,
                axisX: {
                    showGrid: !1,
                    offset: 75,
                    labelInterpolationFnc: function(e) {
                        return e
                    }
                },
                axisY: {
                    offset: 100,
                    labelInterpolationFnc: function(e) {
                        return (100 * e)
                            .toFixed(0) + "%"
                    }
                }
            })
        }(t)) : (document.getElementById("analytics-container")
            .innerHTML = "", $("#analytics-container")
            .text(a))
}

//--------------------------------

// Calculates profits by time by sorting them;
function CalculateProfitsByTime(entries, entryType) {
    const timeProfitMap = new Map;

    // Add profits by time;
    for(const entry of entries){
        const time = GetTimeFromEntry(entry["Date & Time"]);
        // Set to 0 non existant entries, update profits for a specific timeframe;
        timeProfitMap.set(time, (timeProfitMap.get(time) || 0) + CalculateEstimatedProfit(entry[entryType]));
    }

    // Creating the sorted graph;
    const sortedTimeProfitMap = new Map([...timeProfitMap.entries()].sort((entryA, entryB) => {
        const timeA = entryA[0];
        const timeB = entryB[0];

        // Checking profits between AM and PM times;
        if(timeA.includes("A") && !timeB.includes("A")){
            return -1;
        } else if(!timeA.includes("A") && timeB.includes("A")){
            return 1;
        } else{
            //Extracting numeric hours;
            const regex = /(\d+)/;
            const numericTimeA = Number(timeA.match(regex)[0]);
            const numericTimeB = Number(timeB.match(regex)[0]);

            if(numericTimeA === 12){
                return -1;
            } else if(numericTimeB === 12){
                return 1;
            } else {
                return numericTimeA - numericTimeB;
            }
        }
    }));

    return sortedTimeProfitMap;
}

// Extract the date and time from a string;
function GetTimeFromEntry(dateTime){
    return dateTime.split(" ")[1].split(":")[0] + dateTime.split(" ")[2];
}

// Calculate profit from string;
function CalculateEstimatedProfit(profit) {
    // Check if profit is a valid string
    if (profit === undefined || profit === null) {
        return 0; // Return a default value or handle the error as needed
    }

    const numericProfit = Number(profit.replaceAll(",", ""));
    return isNaN(numericProfit) ? 0 : numericProfit;
}

// Parses a date to a specific format;
function FormatDate(dateString) {
    const dateComponents = dateString.split("/");

    const month = dateComponents[0];
    const year = dateComponents[2];

    // Keeping the last two digits from the year;
    const formattedYear = year.replace(",", "".substring(2));

    return month + "/" + formattedYear;
}

function ParseNumericString(inputString) {
    // Check if inputString is valid
    if (inputString === undefined) {
        return 0; // Return a default value or handle the error as needed
    }

    const numbersOnly = inputString.replace(",", "");
    const number = isNaN(Number(numbersOnly)) ? 0 : Number(numbersOnly);
    return number;
}


//######################################################################################################################################


function wrapper() {
    //On click, toggle tabs and its containers;
    document.getElementById("table").onclick = function(e) {
        ToggleTabs("table", "table-container")
    } 
    
    //On click, toggle analytics and its containers;
    document.getElementById("analytics").onclick = function(e) {
        ToggleTabs("analytics", "analytics-container"), ProcessPurchaseHistory(true)
    }
    
    //Toggling the main tab;
    ToggleTabs("table", "table-container");

    //Clearing purchase history;
    clearButton.onclick = function(e) {
        1 == confirm("Are you sure you want to clear your purchase history? This action cannot be undone.") && chrome.storage.local.remove(["ITEM_HISTORY"], (function() {
            location.reload()
        }))
    };
    
    //Update the history data every 5 seconds;
    ProcessPurchaseHistory(false), setInterval((function() {
        ProcessPurchaseHistory(false)
    }), 5e3)
}

wrapper();