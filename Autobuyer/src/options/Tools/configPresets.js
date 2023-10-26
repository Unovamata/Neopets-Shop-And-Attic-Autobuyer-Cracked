chrome.storage.local.get(null, function(items) {
    function FormatDateToCustomFormat(date) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
    
        return `${month} ${day}, ${year}`;
    }

    document.getElementById("save").addEventListener("click", function(){
        var itemsCopy = items;

        if(!items.SHOULD_SHARE_RESTOCK_LIST){
            itemsCopy.RESTOCK_LIST = [];
        }

        if(!items.SHOULD_SHARE_STORES_TO_VISIT){
            itemsCopy.STORES_TO_CYCLE_THROUGH_WHEN_STOCKED = [];
        }

        // Resetting the Auto Pricer and data sharing;
        if(!items.SHOULD_SHARE_SHOP_STOCK){
            itemsCopy.SHOP_INVENTORY = [];
            itemsCopy.AUTOPRICER_INVENTORY = [];
        }

        if(!items.SHOULD_SHARE_BLACKLISTS){
            // Resetting blacklists to their default value;
            itemsCopy.BLACKLIST = ['Forgotten Shore Map Piece', 'Petpet Laboratory Map', 'Piece of a treasure map', 'Piece of a treasure map', 'Secret Laboratory Map', 'Space Map', 'Spooky Treasure Map', 'Underwater Map Piece'],
            itemsCopy.BLACKLIST_SW = [];
        }
        
        itemsCopy.CURRENT_PRICING_INDEX = 0;
        itemsCopy.SUBMIT_PRICES_PROCESS = false;
        itemsCopy.NEXT_PAGE_INDEX = 0;
        itemsCopy.AUTOPRICER_STATUS = "Inactive";
        itemsCopy.START_AUTOPRICING_PROCESS = false;

        // Sharing PIN;
        if(!items.SHOULD_SHARE_PIN){
            itemsCopy.NEOPETS_SECURITY_PIN = "";
        }

        // Sharing last refresh time;
        if(!items.SHOULD_SHARE_ATTIC_LAST_REFRESH){
            itemsCopy.ATTIC_LAST_REFRESH_MS = undefined;
        }

        itemsCopy.ATTIC_PREV_NUM_ITEMS = 0;

        // Sharing item history;
        if(!items.SHOULD_SHARE_EMAIL){
            itemsCopy.EMAIL_TEMPLATE = "";
            itemsCopy.EMAIL_USER_ID = "";
            itemsCopy.EMAIL_SERVICE_ID = "";
        }

        // Sharing item history;
        if(!items.SHOULD_SHARE_HISTORY){
            itemsCopy.ITEM_HISTORY = [];
        }

        // Sharing NeoBuyer+ emails;
        if(!items.SHOULD_SHARE_NEOBUYER_MAILS){
            itemsCopy.SKIP_CURRENT_MAIL = false;
            itemsCopy.EMAIL_LIST = [];
            itemsCopy.RETRIEVED_NEWEST_EMAIL = false;
            itemsCopy.CURRENT_MAIL_INDEX = -1;
        }

        itemsCopy.UPDATE_DATE = "";

        const jsonString = JSON.stringify(itemsCopy);
        const blob = new Blob([jsonString], {type : "application/json"});
        const currentDate = FormatDateToCustomFormat(new Date());

        // Download the settings;
        chrome.downloads.download({
            url: URL.createObjectURL(blob),
            filename: "NeoBuyer+ Config " + currentDate + ".json",
            conflictAction: "overwrite", // Overwrite the file if it already exists;
        });
    });

    document.getElementById("load").addEventListener("change" , function(event){
        if(event.target.files.length == 0) return;

        var selectedFile = event.target.files[0];


        const reader = new FileReader();

        reader.onload = function (e) {
            const fileContent = e.target.result;

            try {
                var jsonData = JSON.parse(fileContent);
                chrome.storage.local.set(jsonData);
                window.alert("All options have imported successfully!\n\nThank you for continuing to use NeoBuyer+!");
                window.location.reload();
            } catch {
                window.alert("There was an error parsing the data back into NeoBuyer+...\n\nPlease make sure you're loading the correct file or try again.");
            }
        };

        reader.readAsText(selectedFile); // Read the file as text
    })
});