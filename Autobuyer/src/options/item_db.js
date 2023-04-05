function numberWithCommas(e) {
    return e.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
function populateTable() {
    $("#itemcount")
        .text(item_db_array.length), document.getElementById("table-container")
        .appendChild(buildHtmlTable(item_db_array));
    var e = document.createElement("script");
    e.setAttribute("src", "../../js/sortable.js"), document.head.append(e), $("#loading")
        .hide()
}
function hideTable() {
    $("#loading")
        .hide(), $("#subscribe")
        .show()
}
var _table_ = document.createElement("table"),
    _thead_ = document.createElement("thead"),
    _tbody_ = document.createElement("tbody"),
    _tr_ = document.createElement("tr"),
    _th_ = document.createElement("th"),
    _td_ = document.createElement("td");
function buildHtmlTable(e) {
    for (var t = _table_.cloneNode(!1), a = _tbody_.cloneNode(!1), n = addAllColumnHeaders(e, t), l = 0, r = e.length; l < r; ++l) {
        var o = _tr_.cloneNode(!1);
        o.classList.add("item");
        for (var d = 0, i = n.length; d < i; ++d) {
            var c = _td_.cloneNode(!1);
            if (cellValue = e[l][n[d]] || "", "Name" == n[d]) {
                var h = document.createElement("a");
                h.href = "https://items.jellyneo.net/search/?name=" + cellValue + "&name_type=3", h.innerText = cellValue, h.setAttribute("target", "_blank"), c.appendChild(h)
            } else if ("Status" == n[d]) {
                var p = document.createElement("span");
                p.innerText = cellValue, "Bought" == cellValue ? p.style.color = "green" : p.style.color = "red", c.appendChild(p)
            } else c.appendChild(document.createTextNode(numberWithCommas(cellValue)));
            o.appendChild(c)
        }
        a.appendChild(o)
    }
    return t.appendChild(a), t.classList.add("sortable"), t
}
function addAllColumnHeaders(e, t) {
    for (var a = [], n = _tr_.cloneNode(!1), l = 0, r = e.length; l < r; l++)
        for (var o in e[l])
            if (e[l].hasOwnProperty(o) && -1 === a.indexOf(o)) {
                a.push(o);
                var d = _th_.cloneNode(!1);
                d.appendChild(document.createTextNode(o)), n.appendChild(d)
            } var i = _thead_.cloneNode(!1);
    return i.appendChild(n), t.appendChild(i), a
}
function openPaymentPage() {
    ExtPay("restock-highligher-autobuyer")
        .openPaymentPage()
}
$("#PAYMENT_LINK")
    .bind("click", function() {
        openPaymentPage()
    });
var extpay = ExtPay("restock-highligher-autobuyer");
extpay.getUser()
    .then(user => {
        const paid = user.paid;
        chrome.storage.local.set({
            EXT_P_S: paid
        }, function() {});
        populateTable();
    })
    .catch(error => {
        window.alert("It looks like you are not connected to the internet, please try again.");
    });