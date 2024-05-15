var loadInventoryButton = document.getElementById("load-inventory");

loadInventoryButton.onclick = function(_) {
    LoadInventoryFromStockPage();
}

function LoadInventoryFromStockPage() {
    if (confirm("Do you want to load your shop stock into NeoBuyer+ for AutoPricing?")) {
        setVARIABLE("START_INVENTORY_PROCESS", true);
        setVARIABLE("SUBMIT_PRICES_PROCESS", false);
        setVARIABLE("START_AUTOPRICING_PROCESS", false);
        setVARIABLE("AUTOPRICER_STATUS", "Loading Shop's Stock...");
        window.open('https://www.neopets.com/market.phtml?type=your', '_blank');
    }
}

const submitPricesButton = document.getElementById("submit");

submitPricesButton.addEventListener('click', StartPriceSubmittingProcess);

function StartPriceSubmittingProcess(){
    if (confirm("Do you want to submit your list of prices to your shop?\n\nPlease, make sure the items to submit are checked in the list below.")) {
        setVARIABLE("NEXT_PAGE_INDEX", 1);
        setVARIABLE("SUBMIT_PRICES_PROCESS", true);
        setVARIABLE("START_INVENTORY_PROCESS", false);
        window.open('https://www.neopets.com/market.phtml?type=your', '_blank');
    }
}


async function HideButtonsWhenAutoPricing(){
    var isActive = await getVARIABLE("START_AUTOPRICING_PROCESS");

    if(isActive){
        loadInventoryButton.style.display = "none";
        submitPricesButton.style.display = "none";
    } else {
        loadInventoryButton.style.display = "inline";
        submitPricesButton.style.display = "inline";
    }
}

setInterval(HideButtonsWhenAutoPricing, 100);


//######################################################################################################################################


var table = document.getElementById("shop-inventory");
var baseTableHTML = table.innerHTML;

var shopValueElement = document.getElementById("total-value");
var shopValue = 0;

// Create the <thead> element
var thead = document.createElement("thead");
var headers = ["Name", "Price", "Should be Priced?"];

var shopItemsElement = document.getElementById("total-items");
var stockCounter = 0;

var inventoryData = [];

async function ReadInventoryData(){
    const activeElement = document.activeElement;
    const tagName = activeElement.tagName;
    const inputType = activeElement.getAttribute('type');
    const isSelectingInputBox = tagName === 'INPUT' && inputType !== 'checkbox';
    
    if(isSelectingInputBox) return;

    shopValue = 0;
    stockCounter = 0;

    var tableInventoryCopy = document.createElement('table');

    var inventoryData = await getVARIABLE("SHOP_INVENTORY");

    inventoryData.forEach( Item => {
        var row = tableInventoryCopy.insertRow();

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
        shopValue += Number(Item.Price);
        priceInput.type = "number";
        priceInput.max = 999999;
        priceInput.min = 0;

        cellPrice.appendChild(priceInput);

        var cellShouldPrice = row.insertCell(4);
        var shouldPriceInput = document.createElement("input");
        shouldPriceInput.type = "checkbox";
        shouldPriceInput.checked = Item.IsPricing;

        if (Item.IsPricing) {
            cellShouldPrice.closest('tr').classList.add("checked-row");
        } else {
            cellShouldPrice.closest('tr').classList.remove("checked-row");
        }
        
        cellShouldPrice.appendChild(shouldPriceInput);

        var cellJN = row.insertCell(5);

        var linkElement = document.createElement("a");
        linkElement.href = `https://items.jellyneo.net/search/?name=${Item.Name}&name_type=3`;

        var imgElement = document.createElement("img");
        imgElement.src = "../JN.png";
        imgElement.alt = "Info Icon";

        linkElement.appendChild(imgElement);

        cellJN.appendChild(linkElement);
    });

    shopItemsElement.innerHTML = stockCounter;
    shopValueElement.innerHTML = shopValue + " NP";

    // Clear the table's current content
    table.innerHTML = "";

    // Append each row from tableInventoryCopy to table
    tableInventoryCopy.querySelectorAll('tr').forEach(row => {
        table.appendChild(row.cloneNode(true));
    });

    // Attach event listeners to priceInput and shouldPriceInput after cloning
    table.querySelectorAll('input[type="number"]').forEach((input, index) => {
        input.addEventListener('change', function () {
            inventoryData[index].Price = parseInt(input.value);

            if(inventoryData[index].Price < 0 || input.value == ""){
                inventoryData[index].Price = 0;
                input.value = 0;
            } else if(inventoryData[index].Price > 999999){
                inventoryData[index].Price = 999999;
                input.value = 999999;
            }

            setVARIABLE("SHOP_INVENTORY", inventoryData);
        });
    });

    table.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                checkbox.closest('tr').classList.add("checked-row");
            } else {
                checkbox.closest('tr').classList.remove("checked-row");
            }
    
            inventoryData[index].IsPricing = checkbox.checked;
            setVARIABLE("SHOP_INVENTORY", inventoryData);
        });
    });

    table.insertAdjacentHTML('afterbegin', baseTableHTML);
}


ReadInventoryData();
setInterval(ReadInventoryData, 5000);

//######################################################################################################################################


const checkAll = document.getElementById("check-all");
checkAll.addEventListener('click', () => UpdateAllCheckboxes(true));

const uncheckAll = document.getElementById("uncheck-all");
uncheckAll.addEventListener('click', () => UpdateAllCheckboxes(false));

async function UpdateAllCheckboxes(checked) {
    const checkboxes = table.querySelectorAll('input[type="checkbox"]');

    checkboxes.forEach(function (checkbox) {
        checkbox.checked = checked;
        checkbox.closest("tr").classList.toggle("checked-row", checked);
    });

    var inventoryData = await getVARIABLE("SHOP_INVENTORY");

    inventoryData.forEach(function (Item) {
        Item.IsPricing = checked;
    });

    setVARIABLE("SHOP_INVENTORY", inventoryData);
    setVARIABLE("INVENTORY_UPDATED", true);
}


var tempList = [];

const checkUnpriced = document.getElementById("check-unpriced");
checkUnpriced.addEventListener('click', () => UpdateAllUnpricedCheckboxes(true));

const uncheckUnpriced = document.getElementById("uncheck-unpriced");
uncheckUnpriced.addEventListener('click', () => UpdateAllUnpricedCheckboxes(false));

async function UpdateAllUnpricedCheckboxes(value, instance = 0){
    var rows = table.querySelectorAll('tr');

    var inventoryData = await getVARIABLE("SHOP_INVENTORY");

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

        setVARIABLE("SHOP_INVENTORY", tempList);
        setVARIABLE("INVENTORY_UPDATED", true);
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


async function UpdateAllUpdatedItemCheckboxes(input){
    var rows = document.querySelectorAll("tr");
    var autoPricerInventory = await getVARIABLE("AUTOPRICER_INVENTORY");
    var shopInventory = await getVARIABLE("SHOP_INVENTORY");

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

    setVARIABLE("SHOP_INVENTORY", shopInventory);
    setVARIABLE("INVENTORY_UPDATED", true);
}


const statusTag = document.getElementById("status-tag");
const loadingIcon = document.getElementById("loading");


// Checks constantly if the inventory page needs to update;
async function UpdateGUIData() {
    var hasUpdated = await getVARIABLE("INVENTORY_UPDATED");

    if (hasUpdated) {
        setVARIABLE("INVENTORY_UPDATED", false);
    }

    var status = await getVARIABLE("AUTOPRICER_STATUS");

    ShowOrHideLoading(status);
    statusTag.textContent = status;
}

UpdateGUIData();

// Updates the page's data every half a second when opened and needed;
setInterval(UpdateGUIData, 500);


//######################################################################################################################################


const startAutoPricingButton = document.getElementById("start");
startAutoPricingButton.addEventListener('click', StartAutoPricer);

var autoPricingList = [];

var swTab = null;

async function StartAutoPricer(){
    var blacklist = await getVARIABLE("BLACKLIST_SW");
    var isTurbo = await getVARIABLE("IS_TURBO");

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
        var isInBlacklist = false;

        try{    
            isInBlacklist = blacklist.some(function(blacklistedItem){
                return blacklistedItem === name;
            });
        } catch {}
        

        if(!isInBlacklist){
            const item = new Item(name, price, true, index, 0, 1);
            autoPricingList.push(item);
        }
    });

    setVARIABLE("AUTOPRICER_INVENTORY", autoPricingList);
    setVARIABLE("START_AUTOPRICING_PROCESS", true);
    setVARIABLE("CURRENT_PRICING_INDEX", 0);

    setVARIABLE("SUBMIT_AUTOKQ_PROCESS", false);

    var isActive = await getVARIABLE("START_AUTOKQ_PROCESS");

    if(isActive){
        setVARIABLE("AutoKQ Process Cancelled by the AutoPricer Process...");
    }

    setVARIABLE("START_AUTOKQ_PROCESS", false);

    // Function to create a new tab if swTab is null
    if(isTurbo){
        chrome.tabs.create({ url: `https://www.neopets.com/shops/wizard.phtml?string=${encodeURIComponent(autoPricingList[0].Name)}`, active: true });
    } else {
        chrome.tabs.create({ url: 'https://www.neopets.com/shops/wizard.phtml', active: true });
    }

    setVARIABLE("AUTOPRICER_STATUS", "AutoPricer Process Running...");
}

const cancelAutoPricingButton = document.getElementById("cancel");
cancelAutoPricingButton.addEventListener('click', CancelAutoPricer);

function CancelAutoPricer(){
    if(confirm("Do you want to terminate the current AutoPricer process?")){
        setVARIABLE("START_AUTOPRICING_PROCESS", false);
        setVARIABLE("AUTOPRICER_INVENTORY", []);
        //setVARIABLE("SHOP_INVENTORY", []);
        setVARIABLE("CURRENT_PRICING_INDEX", 0);
        setVARIABLE("SUBMIT_PRICES_PROCESS", false);
        setVARIABLE("NEXT_PAGE_INDEX", 0);
        setVARIABLE("SUBMIT_AUTOKQ_PROCESS", false);
        setVARIABLE("START_AUTOKQ_PROCESS", false);
        setVARIABLE("AUTOPRICER_STATUS", "Inactive");
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
        setVARIABLE("SHOP_HISTORY", []);
    }
}

// Processing the shop sales history;
chrome.storage.local.get({
    SHOP_HISTORY: []
}, (function(context) {
    var data = context.SHOP_HISTORY;
    var formattedData = FormatDatasetByMonthAndYear(data);
    var profitsPerMonth = [];

    // Process the data for the profit per month graph;
    Object.values(formattedData).forEach(function(entry, index){
        var profits = entry.map(item => item.Price * item.Entries);
        var sumOfProfits = profits.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        
        profitsPerMonth.push(sumOfProfits);
    });

    // Monthly Profits timeline chart;
    var monthlyProfits = CreateTimelineChart("monthlyProfits", Object.keys(formattedData), profitsPerMonth, "Monthly Profits");

    if(monthlyProfits) ResizeChartInterval("monthlyProfits", "760px", "380px");

    // Create charts for the most profitable items sold and most commonly items sold;
    var allItemsSold = [...data.entries()].sort((a, b) => b[1].Price - a[1].Price);

    var mostProfitableNames = [], mostProfitablePrices = [];

    allItemsSold.slice(0, showEntries)
        .map(item => [item[1].Item, item[1].Price])
        .forEach(function(entry){
            mostProfitableNames.push(entry[0]);
            mostProfitablePrices.push(entry[1]);
    });

    var mostProfitableItemsSold = CreateBarChart("mostProfitableItemsSold", "bar", mostProfitableNames, mostProfitablePrices, FormatDatalabelsOptions(), `Top ${showEntries} Most Profitable Items Sold`);

    if(mostProfitableItemsSold) ResizeChartInterval("mostProfitableItemsSold", "760px", "380px");

    var commonnessData = CountDatasetEntries(data, "Item");

    var mostCommonItemsSold = CreateBarChart("mostCommonItemsSold", "bar", Object.keys(commonnessData), Object.values(commonnessData), FormatDatalabelsOptions(), `Top ${showEntries} Most Commonly Sold Items`);

    if(mostCommonItemsSold) ResizeChartInterval("mostCommonItemsSold", "760px", "380px");

    // Recurring buyers chart;

    var recurringBuyers = CountDatasetEntries(data, "Buyer");

    var topRecurringBuyers = CreateBarChart("topRecurringBuyers", "bar", Object.keys(recurringBuyers), Object.values(recurringBuyers), FormatDatalabelsOptions(), `Top ${showEntries} Most Recurring Users`);

    if(topRecurringBuyers) ResizeChartInterval("topRecurringBuyers", "760px", "380px");

}));

function CountDatasetEntries(data, lookupValue){
    var commonnessData = {};

    // Reading the amount of appeareances of a specific item;
    data.forEach(function(entry){
        var itemName = entry[lookupValue];

        if(commonnessData[itemName]){
            commonnessData[itemName] += 1;
        } else {
            commonnessData[itemName] = 1;
        }
    });

    // Sorting the entries to most common to least common and only showing the first 15 entries;
    commonnessData = Object.entries(commonnessData).sort((a, b) => b[1] - a[1]).slice(0, showEntries);

    // Returning the list to a key-value pair for chart processing;
    commonnessData = commonnessData.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
    }, {});

    return commonnessData;
}