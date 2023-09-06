function setSHOP_INVENTORY(value) {
    chrome.storage.local.set({ SHOP_INVENTORY: value }, function () {});
}

var inventoryData = [];

const table = document.getElementById("shop-inventory");

function ReadInventoryData(){
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
    
            cellPrice.appendChild(priceInput);
    
            var cellShouldPrice = row.insertCell(2);
            var shouldPriceInput = document.createElement("input");
            shouldPriceInput.type = "checkbox";
            shouldPriceInput.checked = Item.IsPricing;
    
            cellShouldPrice.appendChild(shouldPriceInput);
            
            // Add an event listener to the checkbox for real-time updates
            shouldPriceInput.addEventListener("change", function () {
                if (shouldPriceInput.checked) {
                    row.classList.add("checked-row");
                } else {
                    row.classList.remove("checked-row");
                }
            });

            //console.log(Item.Name);

            // Add class to the row based on the checkbox value
            if (Item.IsPricing) {
                row.classList.add("checked-row");
            }
        });
    });

    table.classList.add("sortable")

    MakeSortableTable();
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

//setInterval(ReadInventoryData, 5000);