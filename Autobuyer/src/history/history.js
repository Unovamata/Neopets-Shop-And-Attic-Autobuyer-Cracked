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
    var tabContents = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // Remove "active" class from all tab links
    var tabLinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Add "active" class to the selected tab link and display the corresponding content
    document.getElementById(selectedTabId).classList.add("active");
    document.getElementById(contentIdToShow).style.display = "block";
}



function r(e) {
    return e.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


function a(e) {
    return r(e) + " NP"
}

function o(e, t) {
    return null != e.Price && "" != e.Price && "-" != e.Price ? (e.Status = "Bought", e) : (t.Status = "Bought", t)
}

function l(e, t) {
    return e["Item Name"] == t["Item Name"] && (e.Account == t.Account && (e["Shop Name"] == t["Shop Name"] && ("Attic" == e["Shop Name"] && (("Attempted" == e.Status || "Attempted" == t.Status) && ("Bought" == e.Status || "Bought" == t.Status)))))
}

var n = document.getElementById("reset");
var v = document.createElement("table");

function s(e) {
    e.length > 0 ? (document.getElementById("table-container")
        .innerHTML = "", document.getElementById("table-container")
        .appendChild(function(e) {
            for (var t = v.cloneNode(!1), r = y.cloneNode(!1), n = function(e, t) {
                    for (var r = [], n = b.cloneNode(!1), a = 0, o = e.length; a < o; a++)
                        for (var l in e[a])
                            if (e[a].hasOwnProperty(l) && -1 === r.indexOf(l)) {
                                r.push(l);
                                var s = g.cloneNode(!1);
                                s.appendChild(document.createTextNode(l)), n.appendChild(s)
                            } var i = h.cloneNode(!1);
                    return i.appendChild(n), t.appendChild(i), r
                }(e, t), a = 0, o = e.length; a < o; ++a) {
                var l = b.cloneNode(!1);
                l.classList.add("item");
                for (var s = 0, i = n.length; s < i; ++s) {
                    var c = I.cloneNode(!1);
                    if (cellValue = e[a][n[s]] || "", "Item Name" == n[s]) {
                        var u = document.createElement("a");
                        u.href = "https://items.jellyneo.net/search/?name=" + cellValue + "&name_type=3", u.innerText = cellValue, u.setAttribute("target", "_blank"), c.appendChild(u)
                    } else if ("Status" == n[s]) {
                        var f = document.createElement("span");
                        f.innerText = cellValue, "Bought" == cellValue ? f.style.color = "green" : "Attempted" == cellValue ? f.style.color = "grey" : f.style.color = "red", c.appendChild(f)
                    } else c.appendChild(document.createTextNode(cellValue));
                    l.appendChild(c)
                }
                r.appendChild(l)
            }
            return t.appendChild(r), t.classList.add("sortable"), t
        }(e.reverse())), forEach(document.getElementsByTagName("table"), (function(e) {
            -1 != e.className.search(/\bsortable\b/) && sorttable.makeSortable(e)
        }))) : ($("#table-container")
        .text("No items purchased yet."), n.setAttribute("disabled", !0))
}

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
                    for (var r = [], n = 0; n < e.length; n++) n == e.length - 1 ? r.push(e[n]) : l(e[n], e[n + 1]) ? (t = o(e[n], e[n + 1]), r.push(t), n++) : r.push(e[n]);
                    return r
                }(t.ITEM_HISTORY),
                d = function(e) {
                    var t = 0;
                    for (var n of e) {
                        var a = item_db[n["Item Name"]],
                            o = null;
                        if (a && (o = a.Price, n.Rarity = a.Rarity), null != o && "" != o)
                            if (n["Est. Value"] = r(o), parseInt(n.Price) && "Bought" == n.Status) {
                                var l = parseInt(n.Price),
                                    s = parseInt(o.toString()
                                        .replaceAll(",", "")) - l;
                                t += s, n["Est. Profit"] = r(s)
                            } else n["Est. Profit"] = "-";
                        else n["Est. Value"] = "-", n["Est. Profit"] = "-", n.Rarity = "-";
                        "-" != n.Price && (n.Price = r(parseInt(n.Price)))
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
            s(m), c(m, d, p), i = a(d), u = a(p), document.getElementById("total-profit")
                .innerText = i, document.getElementById("total-value")
                .innerText = u, d > 5e7 && !t.REVIEW_ACK && (f = !0, chrome.storage.local.set({
                    REVIEW_ACK: f
                }, (function() {})), chrome.tabs.create({
                    url: "../../src/notes/review.html"
                }))
        }
    }))
}

h = document.createElement("thead"),
y = document.createElement("tbody"),
b = document.createElement("tr"),
g = document.createElement("th"),
I = document.createElement("td");
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

    n.onclick = function(e) {
        1 == confirm("Are you sure you want to clear your purchase history? This action cannot be undone.") && chrome.storage.local.remove(["ITEM_HISTORY"], (function() {
            location.reload()
        }))
    };
    
    A(!1), setInterval((function() {
        A(!1)
    }), 5e3)
}

wrapper();