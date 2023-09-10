function setSHOP_INVENTORY(value) {
    chrome.storage.local.set({ SHOP_INVENTORY: value }, function () {});
}

function getSHOP_INVENTORY(callback) {
    chrome.storage.local.get(['SHOP_INVENTORY'], function (result) {
        const value = result.SHOP_INVENTORY;

        if (typeof callback === 'function') {
            callback(value);
        }
    });
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

function setCURRENT_PRICING_INDEX(value) {
    chrome.storage.local.set({ CURRENT_PRICING_INDEX: value }, function () {});
}


//######################################################################################################################################


function Item(Name, Price, IsPricing, Index, Stock){
    this.Name = Name;
    this.Price = Price;
    this.IsPricing = IsPricing;
    this.Index = Index;
    this.Stock = Stock
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

function HideLoadInventoryButton(){
    getSTART_AUTOPRICING_PROCESS(function (value) {
        if(value){
            loadInventoryButton.style.display = "none";
        } else {
            loadInventoryButton.style.display = "inline";
        }
    });
}


setInterval(HideLoadInventoryButton, 100);


//######################################################################################################################################


const table = document.getElementById("shop-inventory");
var shopValueElement = document.getElementById("total-value");
var shopValue = 0;

// Create the <thead> element
var thead = document.createElement("thead");
var headers = ["Name", "Price", "Should be Priced?"];

var shopItemsElement = document.getElementById("total-items");
var stockCounter = 0;

var inventoryData = [];


function ReadInventoryData(){
    shopValue = 0;

    getSHOP_INVENTORY(function (inventoryData){    
        inventoryData.forEach( Item => {
            var row = table.insertRow();
    
            var cellName = row.insertCell(0);
            cellName.innerHTML = Item.Name;

            var cellStock = row.insertCell(1);
            cellStock.innerHTML = Item.Stock;
            stockCounter += Item.Stock;
    
            var cellPrice = row.insertCell(2);
            var priceInput = document.createElement("input");
            priceInput.value = Item.Price;
            priceInput.type = "number";
            priceInput.max = 999999;
            priceInput.min = 0;
            
            shopValue += parseInt(Item.Price * Item.Stock);
            shopValueElement.innerHTML = `${shopValue} NP`;

            cellPrice.appendChild(priceInput);
    
            var cellShouldPrice = row.insertCell(3);
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

            var cellJN = row.insertCell(4);

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

        shopItemsElement.innerHTML += stockCounter;
    });
}

ReadInventoryData();


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

var swTab = null;

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

    // Function to create a new tab if swTab is null
    function CreateNewTab() {
        chrome.tabs.create({ url: 'https://www.neopets.com/shops/wizard.phtml', active: false }, function (tab) {
            swTab = tab;
            console.log(tab);
        });
    }

    // Check if swTab is null and create a new tab if necessary
    if (swTab === null) {
        CreateNewTab();
    } else {
        window.alert("NeoBuyer's+ AutoPricer is already running.");
    }

    // Listen for the tab removal event and set swTab to null when the tab is closed
    chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
        if (swTab && tabId === swTab.id) {
            swTab = null;
        }
    });

    //setSTART_AUTOPRICING_PROCESS(false);
}

function CancelAutoPricer(){
    setSTART_AUTOPRICING_PROCESS(false);
    setAUTOPRICER_INVENTORY([]);
    setSHOP_INVENTORY([]);
    setINVENTORY_UPDATED(true);
    setCURRENT_PRICING_INDEX(0);
}

const cancelAutoPricingButton = document.getElementById("cancel");
cancelAutoPricingButton.addEventListener('click', CancelAutoPricer);


//######################################################################################################################################


const stockContainer = document.getElementById('shop-stock-container');
const optionsContainer = document.getElementById('autopricer-options-container');

const optionsButton = document.getElementById("options");
optionsButton.addEventListener('click', ShowOptions);

function ShowOptions(){
    stockContainer.style.display = 'none';
    optionsContainer.style.display = 'block';
}

const stockButton = document.getElementById("stock");
stockButton.addEventListener('click', ShowShopStock);

function ShowShopStock(){
    optionsContainer.style.display = 'none';
    stockContainer.style.display = 'block';
}

optionsContainer.style.display = 'none';