function setSHOP_INVENTORY(value) {
    chrome.storage.local.set({ SHOP_INVENTORY: value }, function () {});
}

function setINVENTORY_UPDATED(value) {
    chrome.storage.local.set({ INVENTORY_UPDATED: value }, function () {});
}

function getINVENTORY_UPDATED(callback) {
    chrome.storage.local.get(['INVENTORY_UPDATED'], function (result) {
        const value = result.INVENTORY_UPDATED;

        if (typeof callback === 'function') {
        callback(value);
        }
    });
}

function setSTART_INVENTORY_PROCESS(value) {
    chrome.storage.local.set({ START_INVENTORY_PROCESS: value }, function () {});
}

function getSTART_INVENTORY_PROCESS(callback) {
    chrome.storage.local.get(['START_INVENTORY_PROCESS'], function (result) {
        const value = result.START_INVENTORY_PROCESS;

        if (typeof callback === 'function') {
        callback(value);
        }
    });
}

function setAUTOPRICER_INVENTORY(value) {
    chrome.storage.local.set({ AUTOPRICER_INVENTORY: value }, function () {});
}

function getAUTOPRICER_INVENTORY(callback) {
    chrome.storage.local.get(['AUTOPRICER_INVENTORY'], function (result) {
        const value = result.AUTOPRICER_INVENTORY;

        if (typeof callback === 'function') {
        callback(value);
        }
    });
}

function setSTART_AUTOPRICING_PROCESS(value) {
    chrome.storage.local.set({ START_AUTOPRICING_PROCESS: value }, function () {});
}

function getSTART_AUTOPRICING_PROCESS(callback) {
    chrome.storage.local.get(['START_AUTOPRICING_PROCESS'], function (result) {
        const value = result.START_AUTOPRICING_PROCESS;

        if (typeof callback === 'function') {
        callback(value);
        }
    });
}


//######################################################################################################################################


var loadInventoryButton = document.getElementById("load");

loadInventoryButton.onclick = function(_) {
    LoadInventoryFromStockPage();
}

function LoadInventoryFromStockPage() {
    if (confirm("Do you want to load your shop stock into NeoBuyer+ for AutoPricing?")) {
        setSTART_INVENTORY_PROCESS(true);
        window.open('https://www.neopets.com/market.phtml?type=your', '_blank');
    }
}


//######################################################################################################################################


const table = document.getElementById("shop-inventory");
var shopValueElement = document.getElementById("total-value");
var shopValue = 0;

// Create the <thead> element
var thead = document.createElement("thead");
var headers = ["Name", "Price", "Should be Priced?"];

var shopItemsElement = document.getElementById("total-items");

// Loop through the header text and create <th> elements
/*for (var i = 0; i < headers.length; i++) {
    var th = document.createElement("th");
    
    // Add a class to each <th> element
    if (i === 0) {
        th.className = "name-autopricer";
    } else if (i === 1) {
        th.className = "price-autopricer";
    } else if (i === 2) {
        th.className = "canprice-autopricer";
    }
    
    // Set the header text
    th.textContent = headers[i];
    
    // Append the <th> element to the <thead>
    thead.appendChild(th);
}*/

var inventoryData = [];

function ReadInventoryData(){
    //table.innerHTML = "";
    shopValue = 0;
    
    //table.appendChild(thead);

    chrome.storage.local.get(['SHOP_INVENTORY'], function (result) {
        inventoryData = result.SHOP_INVENTORY;
    
        console.log(inventoryData);
    
        inventoryData.forEach( Item => {
            var row = table.insertRow();
    
            var cellName = row.insertCell(0);
            cellName.innerHTML = Item.Name;
    
            var cellPrice = row.insertCell(1);
            var priceInput = document.createElement("input");
            priceInput.value = Item.Price;
            priceInput.type = "number";
            priceInput.max = 999999;
            priceInput.min = 0;
            
            shopValue += parseInt(Item.Price);
            shopValueElement.innerHTML = `${shopValue} NP`;

            cellPrice.appendChild(priceInput);
    
            var cellShouldPrice = row.insertCell(2);
            var shouldPriceInput = document.createElement("input");
            shouldPriceInput.type = "checkbox";
            shouldPriceInput.checked = Item.IsPricing;
            
            // Add an event listener to the checkbox for real-time updates
            shouldPriceInput.addEventListener("change", function () {
                if (shouldPriceInput.checked) {
                    row.classList.add("checked-row");
                } else {
                    row.classList.remove("checked-row");
                }
            });

            cellShouldPrice.appendChild(shouldPriceInput);

            // Add class to the row based on the checkbox value
            if (Item.IsPricing) {
                row.classList.add("checked-row");
            }

            var cellJN = row.insertCell(3);

            // Create the <a> element
            var linkElement = document.createElement("a");
            linkElement.href = `https://items.jellyneo.net/search/?name=${Item.Name}&name_type=3`;

            // Create the <img> element
            var imgElement = document.createElement("img");
            imgElement.src = "../JN.png";
            imgElement.alt = "Info Icon";

            linkElement.appendChild(imgElement);

            cellJN.appendChild(linkElement);

            //console.log(Item.Name);
        });

        shopItemsElement.innerHTML = inventoryData.length;
    });

    table.classList.add("sortable")

    MakeSortableTable();
}


//######################################################################################################################################


const checkAll = document.getElementById("check-true");
checkAll.addEventListener('click', CheckAllCheckboxes);

const uncheckAll = document.getElementById("check-false");
uncheckAll.addEventListener('click', UncheckAllCheckboxes);

function CheckAllCheckboxes(){
    var checkboxes = table.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(function (checkbox) {
        checkbox.checked = true;
        checkbox.closest("tr").classList.add("checked-row");
    });
}

function UncheckAllCheckboxes(){
    var checkboxes = table.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
        checkbox.closest("tr").classList.remove("checked-row");
    });
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

ReadInventoryData();

// Checks constantly if the inventory page needs to update;
function UpdateInventoryData() {
    getINVENTORY_UPDATED(function (value) {
        if (value === true) {
            location.reload();
            setINVENTORY_UPDATED(false);
        }
    });
}

// Updates the page's data every half a second when opened and needed;
setInterval(UpdateInventoryData, 500);


//######################################################################################################################################


const startAutoPricingButton = document.getElementById("start");
startAutoPricingButton.addEventListener('click', StartAutoPricer);

var autoPricingList = [];

function StartAutoPricer(){
    var selectedRows = document.querySelectorAll(".checked-row");

    var name, price;

    selectedRows.forEach((row) => {
        const nameCell = row.cells[0];
        const priceCell = row.cells[1];
        const priceInput = priceCell.querySelector('input[type=number]');

        const name = nameCell.textContent;
        const price = priceInput.value;
        const index = row.rowIndex;

        const item = new Item(name, price, true, index);
        autoPricingList.push(item);
    });

    setAUTOPRICER_INVENTORY(autoPricingList);
    setSTART_AUTOPRICING_PROCESS(true);
    
    //https://www.neopets.com/shops/wizard.phtml?string=Pretzel+Brush
}

function Item(Name, Price, IsPricing, Index){
    this.Name = Name;
    this.Price = Price;
    this.IsPricing = IsPricing;
    this.Index = Index;
}