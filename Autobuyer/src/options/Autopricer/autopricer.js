function setSHOP_INVENTORY(value) {
    chrome.storage.local.set({ SHOP_INVENTORY: value }, function () {});
}

var inventoryData = [];

chrome.storage.local.get(['SHOP_INVENTORY'], function (result) {
    inventoryData = result.SHOP_INVENTORY;

    console.log(inventoryData);

    //Update the history data every 5 seconds;
    ProcessPurchaseHistory(false), setInterval((function() {
        ProcessPurchaseHistory(false)
    }), 5e3)
});

