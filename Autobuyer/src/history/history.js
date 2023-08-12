// Number formatting
function formatNumberWithSymbols(number, decimalPlaces) {
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

        return (regexNumber);
    } else {
        return "0";
    }
}


// Toggle tab contents
function toggleTabs(selectedTabId, contentIdToShow) {
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
function addThousandSeparators(number) {
    var inputString = number.toString();
    var formattedString = inputString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return formattedString;
}

// Number with NP at the end;
function formatNPNumber(e) {
    return addThousandSeparators(e) + " NP"
}

//Updating "Bought" status;
function updatePurchaseStatus(itemA, itemB) {
    var isItemPriceValid = itemA.Price !== null && itemA.Price !== "" && itemA.Price !== "-";

    if(isItemPriceValid){
        itemA.Status = "Bought";
        return itemA;
    } else {
        itemB.Status = "Bought";
        return itemA;
    }
}

//Checking if both purchases are equal;
// This function checks if two objects represent the same purchase.
function arePurchasesEqual(purchaseA, purchaseB) {
    // Check if item names, accounts, and shop names match
    var areItemNamesEqual = purchaseA["Item Name"] === purchaseB["Item Name"];
    var areAccountsEqual = purchaseA.Account === purchaseB.Account;
    var areShopNamesEqual = purchaseA["Shop Name"] === purchaseB["Shop Name"];
    
    // If the shop name is "Attic", additional conditions are checked
    if (areShopNamesEqual && purchaseA["Shop Name"] === "Attic") {
        var isAttemptedOrBoughtA = purchaseA.Status === "Attempted" || purchaseA.Status === "Bought";
        var isAttemptedOrBoughtB = purchaseB.Status === "Attempted" || purchaseB.Status === "Bought";
        
        // Check if both purchases are either "Attempted" or "Bought"
        return areItemNamesEqual && areAccountsEqual && isAttemptedOrBoughtA && isAttemptedOrBoughtB;
    }
    
    // Return true if all conditions are met, indicating purchases are equal
    return areItemNamesEqual && areAccountsEqual && areShopNamesEqual;
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
function displayTableData(dataArray) {
    var tableContainer = document.getElementById("table-container");

    // Returning if there's no data to process;
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
    tableContainer.appendChild(AppendDataToTable(dataArray));
    
    MakeSortableTable();

    // FUNCTION'S FUNCTIONS;
    // Loading data into the rows of the table;
    function AppendDataToTable(dataArray){
            // Creating the header rows for information (Account, Date & Time, Item Name, Price...)
            dataArray = dataArray.reverse;
            tableRowClone = CreateHeaderRowKeys(dataArray, tableClone);
    
            for (a = 0; a < dataArray.length; ++a) {
                var itemCells = tableRow.cloneNode(false);
                itemCells.classList.add("item");
    
                // Navigating through the columns;
                for (var s = 0; s < tableRowClone.length; ++s) {
                    // Clone a cell node for the current row
                    var cell = tableDataCell.cloneNode(false);
                    
                    // Get the value of the current cell or assign an empty string if undefined
                    var cellValue = dataArray[a][tableRowClone[s]] || "";
                    
                    // Setting the information nodes in the table cells;
                    switch(tableRowClone[s]){
                        case "Item Name":
                            var JellyneoLink = CreateJellyneoLink(cellValue);
                            cell.appendChild(JellyneoLink);
                        break;
    
                        case "Status":
                            // Create a colored span element for the "Status" column
                            var statusSpan = CreatePurchaseStatusSpan(cellValue);
                            cell.appendChild(statusSpan);
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
                }
            }
        }
        
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
    var statusSpan = CreateJellyneoLink(cellValue);
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
        }
    });
}



//######################################################################################################################################


var i = 20;

function c(t, r, n) {
    var a = "No analytics are available yet. Check back after some more successful purchases!";
    t.length > 10 && r > 5e5 && n > 5e5 && document.getElementById("analytics-container")
        .innerHTML != a ? (function(t) {
            var r = function(e) {
                var t = new Map;
                for (var r of e) t.set(r["Shop Name"], 0);
                for (var r of e) t.set(r["Shop Name"], t.get(r["Shop Name"]) + p(r["Est. Profit"]));
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
                        return formatNumberWithSymbols(t) + " NP"
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
                        return formatNumberWithSymbols(t)
                    }
                }
            })
        }(t), function(t) {
            var r = function(e) {
                var t = new Map;
                for (var r of e) t.set(r["Item Name"], 0);
                for (var r of e) t.set(r["Item Name"], t.get(r["Item Name"]) + p(r["Est. Profit"]));
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
                        return formatNumberWithSymbols(t)
                    }
                }
            })
        }(t), function(t) {
            var r = function(e) {
                var t = new Map;
                for (var r of e) t.set(r.Account, 0);
                for (var r of e) t.set(r.Account, t.get(r.Account) + p(r["Est. Profit"]));
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
                        return formatNumberWithSymbols(t) + " NP"
                    }
                }
            })
        }(t), function(t) {
            var r = function(e) {
                var t = new Map;
                for (var r of e) {
                    var n = d(r["Date & Time"]);
                    t.set(n, 0)
                }
                for (var r of e) {
                    n = d(r["Date & Time"]);
                    t.set(n, t.get(n) + p(r["Est. Profit"]))
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
                        return formatNumberWithSymbols(t)
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
            var r = u(t),
                n = f(t);
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
                        return formatNumberWithSymbols(t)
                    }
                }
            })
        }(t), function(e) {
            for (var t = u(e), r = f(e), n = [], a = 0; a < Array.from(t.values())
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

function u(e) {
    var t = new Map;
    for (var r of e) {
        var n = m(r["Date & Time"]);
        t.set(n, 0)
    }
    for (var r of e) {
        n = m(r["Date & Time"]);
        t.set(n, t.get(n) + p(r["Est. Profit"]))
    }
    return t = new Map([...t.entries()].sort(((e, t) => e[0].includes("A") && !t[0].includes("A") ? -1 : !e[0].includes("A") && t[0].includes("A") ? 1 : (e = Number(e[0].match(/(\d+)/)[0]), t = Number(t[0].match(/(\d+)/)[0]), 12 == e ? -1 : 12 == t ? 1 : e - t))))
}

function f(e) {
    var t = new Map;
    for (var r of e) {
        var n = m(r["Date & Time"]);
        t.set(n, 0)
    }
    for (var r of e) {
        n = m(r["Date & Time"]);
        t.set(n, t.get(n) + p(r["Est. Value"]))
    }
    return t = new Map([...t.entries()].sort(((e, t) => e[0].includes("A") && !t[0].includes("A") ? -1 : !e[0].includes("A") && t[0].includes("A") ? 1 : (e = Number(e[0].match(/(\d+)/)[0]), t = Number(t[0].match(/(\d+)/)[0]), 12 == e ? -1 : 12 == t ? 1 : e - t))))
}

function m(e) {
    var t = e.split(" ");
    return t[1].split(":")[0] + t[2]
}

function d(e) {
    var t = e.split(" ")[0].split("/");
    return t[0] + "/" + t[2].replace(",", "")
        .substring(2)
}

function p(e) {
    return isNaN(Number(e.replaceAll(",", ""))) ? 0 : Number(e.replaceAll(",", ""))
}

function A(e) {
    chrome.storage.local.get({
        ITEM_HISTORY: [],
        REVIEW_ACK: !1
    }, (function(t) {
        var n = t.ITEM_HISTORY.length;
        if (e || n != N) {
            N = n;
            var i, u, f, m = function(e) {
                    for (var t of e) t.Price = ("" + t.Price)
                        .replace(",", "")
                        .trim();
                    if (0 == e.length || 1 == e.length) return e;
                    for (var r = [], n = 0; n < e.length; n++) n == e.length - 1 ? r.push(e[n]) : arePurchasesEqual(e[n], e[n + 1]) ? (t = updatePurchaseStatus(e[n], e[n + 1]), r.push(t), n++) : r.push(e[n]);
                    return r
                }(t.ITEM_HISTORY),
                d = function(e) {
                    var t = 0;
                    for (var n of e) {
                        var a = item_db[n["Item Name"]],
                            o = null;
                        if (a && (o = a.Price, n.Rarity = a.Rarity), null != o && "" != o)
                            if (n["Est. Value"] = addThousandSeparators(o), parseInt(n.Price) && "Bought" == n.Status) {
                                var l = parseInt(n.Price),
                                    s = parseInt(o.toString()
                                        .replaceAll(",", "")) - l;
                                t += s, n["Est. Profit"] = addThousandSeparators(s)
                            } else n["Est. Profit"] = "-";
                        else n["Est. Value"] = "-", n["Est. Profit"] = "-", n.Rarity = "-";
                        "-" != n.Price && (n.Price = addThousandSeparators(parseInt(n.Price)))
                    }
                    return t
                }(m),
                p = function(e) {
                    var t = 0;
                    for (var r of e) {
                        var n = item_db[r["Item Name"]],
                            a = null;
                        n && (a = n.Price), null != a && "" != a && (t += a)
                    }
                    return t
                }(m);
            displayTableData(m), c(m, d, p), i = formatNPNumber(d), u = formatNPNumber(p), document.getElementById("total-profit")
                .innerText = i, document.getElementById("total-value")
                .innerText = u, d > 5e7 && !t.REVIEW_ACK && (f = !0, chrome.storage.local.set({
                    REVIEW_ACK: f
                }, (function() {})), chrome.tabs.create({
                    url: "../../src/notes/review.html"
                }))
        }
    }))
}

var N = -1;

function wrapper() {
    document.getElementById("table")
        .onclick = function(e) {
            toggleTabs("table", "table-container")
        }, document.getElementById("analytics")
        .onclick = function(e) {
            toggleTabs("analytics", "analytics-container"), A(!0)
        }, toggleTabs("table", "table-container"), $("#PAYMENT_LINK")
        .bind("click", (function() {
            ExtPay("restock-highligher-autobuyer")
                .openPaymentPage()
        }));

    clearButton.onclick = function(e) {
        1 == confirm("Are you sure you want to clear your purchase history? This action cannot be undone.") && chrome.storage.local.remove(["ITEM_HISTORY"], (function() {
            location.reload()
        }))
    };
    
    A(!1), setInterval((function() {
        A(!1)
    }), 5e3)
}

wrapper();