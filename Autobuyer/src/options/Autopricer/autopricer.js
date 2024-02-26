var loadInventoryButton = document.getElementById("load-inventory");

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

const checkUpdated = document.getElementById("check-updated");
checkUpdated.addEventListener('click', () => UpdateAllUpdatedItemCheckboxes(true));

const uncheckUpdated = document.getElementById("uncheck-updated");
uncheckUpdated.addEventListener('click', () => UpdateAllUpdatedItemCheckboxes(false));


function UpdateAllUpdatedItemCheckboxes(input){
    var rows = document.querySelectorAll("tr");

    getAUTOPRICER_INVENTORY(function (autoPricerInventory){
        getSHOP_INVENTORY(function (shopInventory){
            var namesList = autoPricerInventory.map((item) => item.Name);

            rows.forEach(async function (row){
                var checkbox = row.querySelector('input[type="checkbox"]');
                if(!checkbox) return;

                var itemName = row.cells[1].textContent; //Name cell;

                if(namesList.includes(itemName)){
                    if(input) row.classList.add("checked-row");
                    else row.classList.remove("checked-row");

                    checkbox.checked = input;

                    var index = parseInt(row.querySelector("td:first-child").textContent) - 1;

                    shopInventory[index].IsPricing = checkbox.checked;
                }
            });

            setSHOP_INVENTORY(shopInventory);
            setINVENTORY_UPDATED(true);
        });
    });
}


const statusTag = document.getElementById("status-tag");
const loadingIcon = document.getElementById("loading");

getAUTOPRICER_STATUS(function (status){
    ShowOrHideLoading(status);
    statusTag.textContent = status;
});

// Checks constantly if the inventory page needs to update;
function UpdateGUIData() {
    getINVENTORY_UPDATED(function (hasUpdated) {
        if (hasUpdated) {
            location.reload();
            setINVENTORY_UPDATED(false);
        }
    });

    getAUTOPRICER_STATUS(function (status){
        ShowOrHideLoading(status);
        statusTag.textContent = status;
    });
}

// Updates the page's data every half a second when opened and needed;
setInterval(UpdateGUIData, 500);


//######################################################################################################################################


const startAutoPricingButton = document.getElementById("start");
startAutoPricingButton.addEventListener('click', StartAutoPricer);

var autoPricingList = [];

var swTab = null;

function StartAutoPricer(){
    getBLACKLIST_SW(function(blacklist){
        getIS_TURBO(function(isTurbo){
            var selectedRows = document.querySelectorAll(".checked-row");
            autoPricingList = [];

            selectedRows.forEach((row) => {
                const nameCell = row.cells[1];
                const priceCell = row.cells[3];
                const priceInput = priceCell.querySelector('input[type=number]');
                
                const name = nameCell.textContent;
                const price = parseInt(priceInput.value);
                const index = row.rowIndex;

                
                // Filtering out all the blacklisted items before they are submitted for AutoPricing;
                var isInBlacklist = blacklist.some(function(blacklistedItem){
                    return blacklistedItem === name;
                });

                if(!isInBlacklist){
                    const item = new Item(name, price, true, index, 0, 1);
                    autoPricingList.push(item);
                }
            });
        
            setAUTOPRICER_INVENTORY(autoPricingList);
            setSTART_AUTOPRICING_PROCESS(true);
            setCURRENT_PRICING_INDEX(0);

            setSUBMIT_AUTOKQ_PROCESS(false);

            getSTART_AUTOKQ_PROCESS(function (isActive) {
                if(isActive){
                    setAUTOKQ_STATUS("AutoKQ Process Cancelled by the AutoPricer Process...");
                }
            });

            setSTART_AUTOKQ_PROCESS(false);

            // Function to create a new tab if swTab is null
            if(isTurbo){
                chrome.tabs.create({ url: `https://www.neopets.com/shops/wizard.phtml?string=${autoPricingList[0].Name}`, active: true });
            } else {
                chrome.tabs.create({ url: 'https://www.neopets.com/shops/wizard.phtml', active: true });
            }

            setAUTOPRICER_STATUS("AutoPricer Process Running...");
        });
    });
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
        setSUBMIT_AUTOKQ_PROCESS(false);
        setSTART_AUTOKQ_PROCESS(false);
        setAUTOPRICER_STATUS("Inactive");
    }
}


//######################################################################################################################################


const stockContainer = document.getElementById('shop-stock-container');
const optionsContainer = document.getElementById('autopricer-options-container');
const analyiticsContainer = document.getElementById('analytics-container');

const optionsButton = document.getElementById("options");
optionsButton.addEventListener('click', ShowOptions);

function ShowOptions(){
    ShowAndHideElements([optionsContainer], [stockContainer, analyiticsContainer]);
}

const stockButton = document.getElementById("stock");
stockButton.addEventListener('click', ShowShopStock);

function ShowShopStock(){
    ShowAndHideElements([stockContainer], [optionsContainer, analyiticsContainer]);
}

const analyticsButton = document.getElementById("analytics");
analyticsButton.addEventListener('click', ShowAnalytics);

function ShowAnalytics(){
    ShowAndHideElements([analyiticsContainer], [optionsContainer, stockContainer]);
}

ShowShopStock();


//######################################################################################################################################


// Analytics
const deleteSalesHistoryButton = document.getElementById("deleteHistory");
deleteSalesHistoryButton.addEventListener('click', DeleteSalesHistory);

async function DeleteSalesHistory(){
    if(confirm("Do you want to remove your sales history data from NeoBuyer+?\n\nThis will inutilize the AutoPricer's Analytics until you import your data again.")){
        await setSHOP_HISTORY([]);
        location.reload();
    }
}