function setSHOP_INVENTORY(value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ SHOP_INVENTORY: value }, function () {
            resolve();
        });
    });
}

function getSHOP_INVENTORY(callback) {
    chrome.storage.local.get(['SHOP_INVENTORY'], async function (result) {
        const value = result.SHOP_INVENTORY;

        if(value == undefined || value == null){
            await setSHOP_INVENTORY([]);
        }

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
    return new Promise((resolve) => {
        chrome.storage.local.set({ AUTOPRICER_INVENTORY: value }, function () {
            resolve();
        });
    });
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

function setSUBMIT_PRICES_PROCESS(value) {
    chrome.storage.local.set({ SUBMIT_PRICES_PROCESS: value }, function () {});
}

function getSUBMIT_PRICES_PROCESS(callback) {
    chrome.storage.local.get(['SUBMIT_PRICES_PROCESS'], function (result) {
        const value = result.SUBMIT_PRICES_PROCESS;

        // Check if value is undefined or null, and set it to false
        if (value === undefined || value === null) {
            setSUBMIT_PRICES_PROCESS(false);
        }

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}

function setNEXT_PAGE_INDEX(value) {
    chrome.storage.local.set({ NEXT_PAGE_INDEX: value }, function () {});
}

function setAUTOPRICER_STATUS(value) {
    chrome.storage.local.set({ AUTOPRICER_STATUS: value }, function () {});
}

function getAUTOPRICER_STATUS(callback) {
    chrome.storage.local.get(['AUTOPRICER_STATUS'], function (result) {
        const value = result.AUTOPRICER_STATUS;

        // Check if value is undefined or null, and set it to false
        if (value === undefined || value === null) {
            setAUTOPRICER_STATUS("Inactive");
        }

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}


//######################################################################################################################################


function Item(Name, Price, IsPricing, Index, ListIndex, Stock){
    this.Name = Name;
    this.Price = Price;
    this.IsPricing = IsPricing;
    this.Index = Index;
    this.ListIndex = ListIndex;
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
        setSUBMIT_PRICES_PROCESS(false);
        setSTART_AUTOPRICING_PROCESS(false);
        setAUTOPRICER_STATUS("Loading Shop's Stock...");
        window.open('https://www.neopets.com/market.phtml?type=your', '_blank');
    }
}

const submitPricesButton = document.getElementById("submit");

submitPricesButton.addEventListener('click', StartPriceSubmittingProcess);

function StartPriceSubmittingProcess(){
    if (confirm("Do you want to submit your list of prices to your shop?\n\nPlease, make sure the items to submit are checked in the list below.")) {
        setNEXT_PAGE_INDEX(1);
        setSUBMIT_PRICES_PROCESS(true);
        setSTART_INVENTORY_PROCESS(false);
        window.open('https://www.neopets.com/market.phtml?type=your', '_blank');
    }
}


function HideButtonsWhenAutoPricing(){
    getSTART_AUTOPRICING_PROCESS(function (isActive) {
        if(isActive){
            loadInventoryButton.style.display = "none";
            submitPricesButton.style.display = "none";
        } else {
            loadInventoryButton.style.display = "inline";
            submitPricesButton.style.display = "inline";
        }
    });
}

setInterval(HideButtonsWhenAutoPricing, 100);


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
    
            var indexRow = row.insertCell(0);
            indexRow.innerHTML = Item.ListIndex + 1;

            var cellName = row.insertCell(1);
            cellName.innerHTML = Item.Name;

            var cellStock = row.insertCell(2);
            cellStock.innerHTML = Item.Stock;
            stockCounter += Item.Stock;
    
            var cellPrice = row.insertCell(3);
            var priceInput = document.createElement("input");
            priceInput.value = Item.Price;
            priceInput.type = "number";
            priceInput.max = 999999;
            priceInput.min = 0;
            
            priceInput.addEventListener('change', function () {
                Item.Price = parseInt(priceInput.value);

                if(Item.Price < 0 || priceInput.value == ""){
                    Item.Price = 0;
                    priceInput.value = 0;
                } else if(Item.Price > 999999){
                    Item.Price = 999999;
                    priceInput.value = 999999;
                }

                setSHOP_INVENTORY(inventoryData);
            });
            
            shopValue += parseInt(Item.Price * Item.Stock);
            shopValueElement.innerHTML = `${shopValue} NP`;

            cellPrice.appendChild(priceInput);
    
            var cellShouldPrice = row.insertCell(4);
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

                Item.IsPricing = shouldPriceInput.checked;
                setSHOP_INVENTORY(inventoryData);
            });

            cellShouldPrice.appendChild(shouldPriceInput);

            // Add class to the row based on the checkbox value
            if (Item.IsPricing) {
                row.classList.add("checked-row");
            }

            var cellJN = row.insertCell(5);

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


const checkAll = document.getElementById("check-all");
checkAll.addEventListener('click', () => UpdateAllCheckboxes(true));

const uncheckAll = document.getElementById("uncheck-all");
uncheckAll.addEventListener('click', () => UpdateAllCheckboxes(false));

function UpdateAllCheckboxes(checked) {
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(function (checkbox) {
        checkbox.checked = checked;
        checkbox.closest("tr").classList.toggle("checked-row", checked);
    });

    getSHOP_INVENTORY(function (inventoryData) {
        inventoryData.forEach(function (Item) {
            Item.IsPricing = checked;
        });

        setSHOP_INVENTORY(inventoryData);
        setINVENTORY_UPDATED(true);
    });
}


var tempList = [];

const checkUnpriced = document.getElementById("check-unpriced");
checkUnpriced.addEventListener('click', () => UpdateAllUnpricedCheckboxes(true));

const uncheckUnpriced = document.getElementById("uncheck-unpriced");
uncheckUnpriced.addEventListener('click', () => UpdateAllUnpricedCheckboxes(false));

function UpdateAllUnpricedCheckboxes(value, instance = 0){
    var rows = table.querySelectorAll('tr');

    getSHOP_INVENTORY(function (inventoryData) {
        tempList = inventoryData;
        
        rows.forEach( async function (row){
            var checkbox = row.querySelector('input[type="checkbox"]');
            if(checkbox == null) return;

            var input = parseInt(row.querySelector('input[type="number"]').value);

            switch(instance){
                case 0:
                    if(input === 0){
                        if(value) row.classList.add("checked-row");
                        else row.classList.remove("checked-row");
        
                        checkbox.checked = value;
                    }
                break;

                default:
                    if(input !== 0){
                        if(value) row.classList.add("checked-row");
                        else row.classList.remove("checked-row");
        
                        checkbox.checked = value;
                    }
                break;
            }
            

            var index = parseInt(row.querySelector("td:first-child").textContent) - 1;

            tempList[index].IsPricing = checkbox.checked;

            setSHOP_INVENTORY(tempList);
            setINVENTORY_UPDATED(true);
        });
    });
}

const checkPriced = document.getElementById("check-priced");
checkPriced.addEventListener('click', () => UpdateAllUnpricedCheckboxes(true, 1));

const uncheckPriced = document.getElementById("uncheck-priced");
uncheckPriced.addEventListener('click', () => UpdateAllUnpricedCheckboxes(false, 1));

const statusTag = document.getElementById("status-tag");
const loadingIcon = document.getElementById("loading");

getAUTOPRICER_STATUS(function (status){
    ShowOrHideLoading(status);
    statusTag.textContent = status;
});

// Checks constantly if the inventory page needs to update;
function UpdateGUIData() {
    getINVENTORY_UPDATED(function (value) {
        if (value === true) {
            location.reload();
            setINVENTORY_UPDATED(false);
        }
    });

    getAUTOPRICER_STATUS(function (status){
        ShowOrHideLoading(status);
        statusTag.textContent = status;
    });
}

function ShowOrHideLoading(status){
    loadingIcon.style.width = '1.6%';
    loadingIcon.style.height = '1.6%';

    if(status.includes("Complete") || status.includes("Inactive") || status.includes("Updated!") || status.includes("Sleep") || status.includes("Stopped")){
        loadingIcon.style.visibility = 'hidden';
    } else {
        loadingIcon.style.visibility = 'visible';
    }
}

// Updates the page's data every half a second when opened and needed;
setInterval(UpdateGUIData, 500);


//######################################################################################################################################


const startAutoPricingButton = document.getElementById("start");
startAutoPricingButton.addEventListener('click', StartAutoPricer);

var autoPricingList = [];

var swTab = null;

function StartAutoPricer(){
    var selectedRows = document.querySelectorAll(".checked-row");
    autoPricingList = [];

    selectedRows.forEach((row) => {
        const nameCell = row.cells[1];
        const priceCell = row.cells[3];
        const priceInput = priceCell.querySelector('input[type=number]');
        
        const name = nameCell.textContent;
        const price = parseInt(priceInput.value);
        const index = row.rowIndex;

        
        //Item(Name, Price, IsPricing, Index, ListIndex, Stock)
        const item = new Item(name, price, true, index, 0, 1);
        autoPricingList.push(item);
    });

    setAUTOPRICER_INVENTORY(autoPricingList);
    setSTART_AUTOPRICING_PROCESS(true);
    setCURRENT_PRICING_INDEX(0);

    // Function to create a new tab if swTab is null
    function CreateNewTab() {
        chrome.tabs.create({ url: 'https://www.neopets.com/shops/wizard.phtml', active: false }, function (tab) {
            swTab = tab;
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

    setAUTOPRICER_STATUS("AutoPricer Process Running...");
}

const cancelAutoPricingButton = document.getElementById("cancel");
cancelAutoPricingButton.addEventListener('click', CancelAutoPricer);

function CancelAutoPricer(){
    if(confirm("Do you want to terminate the current AutoPricer process?")){
        setSTART_AUTOPRICING_PROCESS(false);
        setAUTOPRICER_INVENTORY([]);
        //setSHOP_INVENTORY([]);
        //setINVENTORY_UPDATED(true);
        setCURRENT_PRICING_INDEX(0);
        setSUBMIT_PRICES_PROCESS(false);
        setNEXT_PAGE_INDEX(0);
        setAUTOPRICER_STATUS("Inactive");
    }
}


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


//######################################################################################################################################