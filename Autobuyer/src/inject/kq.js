chrome.storage.local.get({
    START_AUTOKQ_PROCESS: false,
    SUBMIT_AUTOKQ_PROCESS: false,
    BLACKLIST_KQ: [],
    KQ_TRACKER: [0, 0, 0, 0, 0, 0, 0],
}, (function(autoKQVariables) {
    const { 
        START_AUTOKQ_PROCESS: isStartingAutoKQProcess,
        SUBMIT_AUTOKQ_PROCESS: isKQProcessDone,
        BLACKLIST_KQ: blacklistKQ,
        KQ_TRACKER: kqTracker,
    } = autoKQVariables;

    // Checking if the AutoKQs can be done;
    if(!isStartingAutoKQProcess) return;
    if(document.body.textContent.includes("Sorry, there is a limit of 10 quests per day.")){
        setAUTOKQ_STATUS("AutoKQ's Tasks have been Completed!");
        setSTART_AUTOKQ_PROCESS(false);
        return;
    }

    // Start quest button;
    startButton = document.getElementById("kitchen2");

    if(startButton){
        // The items have just become available to see;
        setAUTOKQ_STATUS("Starting Kitchen Quest...");
        startButton.click();
        ExtractItemsFromKQ();
    } else {
        // The KQ was already initialized before;
        setAUTOKQ_STATUS("Kitchen Quest Already Started, Searching Items...");
        ExtractItemsFromKQ();
    }

    // ExtractItemsFromKQ(); Extracts the items needed to complete the quest to search them in the SW;
    async function ExtractItemsFromKQ(){
        // "I have the ingredients" button;
        var submitIngredients = document.getElementById("gotingredients")

        if(!submitIngredients) window.location.reload();

        // Submitting the ingredients if the user already has them;
        if(isKQProcessDone){
            submitIngredients.click();
            setSUBMIT_AUTOKQ_PROCESS(false);
            setAUTOKQ_STATUS("Quest Completed!");
            await ReadPrizeElement();
            window.location.reload();
            return;
        }

        // Reading the ingredients from the elements in the page;
        var ingredients = await WaitForElement('.ingredient-grid', 0);
        var items = ingredients.querySelectorAll("b");
        var itemArray = [];
        setAUTOKQ_STATUS("Waiting for Ingredients...");

        // Adding the ingredients to a search list;
        items.forEach(function(element) {
            itemArray.push(element.innerText);
        });
        
        
        var questContainsBlacklistedItem = false;
        questContainsBlacklistedItem = ArrayHasCommonElement(itemArray, blacklistKQ);

        // If the quest asks for blacklisted items, halt the process;
        if(questContainsBlacklistedItem){
            setAUTOKQ_STATUS("Blacklisted Item Detected... Quest Cancelled!");
            setSUBMIT_AUTOKQ_PROCESS(false);
            setKQ_INVENTORY([]);
            window.alert("Blacklisted Item Detected in Quest!\n\nThis quest involves a blacklisted item and as a result, the AutoKQ process will be halted. You may consider reactivating AutoKQ once the quest expires or, alternatively, removing the blacklisted item to proceed with this specific quest.")
            return;
        }

        await setKQ_INVENTORY(itemArray);
        

        // Launching the SW;
        window.location.href = `https://www.neopets.com/shops/wizard.phtml?string=${encodeURIComponent(itemArray[0])}`;
        setAUTOKQ_STATUS(`Ingredients Read! Initializing SW for ${itemArray.length} items...`);
    }
    
    async function ReadPrizeElement(){
        return new Promise(async (resolve) => {
            var levelOrHitPointText = " has gained a ", statText = " has become better at ", itemText = "You get a ", neopointsText = "You have been given ";
            var prizeElement = await SearchInAllElements(levelOrHitPointText, statText, itemText, neopointsText);
            var prizeText;

            try {
                prizeText = prizeElement.textContent
            } catch { 
                window.location.reload();
            }

            var petName = document.querySelectorAll('.profile-dropdown-link')[0].textContent;
    
            
            if(prizeText.includes(levelOrHitPointText)){
                var statType = ExtractPrizeData(prizeText, levelOrHitPointText);
    
                await SaveToKQTracker(petName, "Stat", statType);
            } 
            
            else if(prizeText.includes(statText)){
                var statType = ExtractPrizeData(prizeText, statText);
    
                await SaveToKQTracker(petName, "Stat", statType);
            }
            
            else if(prizeText.includes(itemText)){
                var itemGiven = ExtractPrizeData(prizeText, itemText);
    
                await SaveToKQTracker("", "Item", itemGiven);
            } 
            
            else if(prizeText.includes(neopointsText)){
                var neopointsGiven = ExtractPrizeData(prizeText, neopointsText);
    
                await SaveToKQTracker("", "Neopoints", neopointsGiven);
            } else {
                window.alert("An error occured in the processing of the KQ tracker...")
            }
    
            async function SaveToKQTracker(petName, prizeType, prizeName) {                
                // Determine the current user's account
                const usernameElement = document.querySelector('a.text-muted');
                const username = usernameElement.textContent;
        
                var newEntry = {
                    "Account": username,
                    "Date & Time": new Date().toLocaleString(),
                    "Pet Name": petName,
                    "Type": prizeType,
                    "Prize": prizeName,
                };
                
                //Saving the new history;
                kqTracker.push(newEntry);

                await setKQ_TRACKER(kqTracker);
            }
    
            function ExtractPrizeData(text, keyword) {
                const index = text.indexOf(keyword);
                
                if (index !== -1) {
                    var result;
    
                    // Remove everything before and including the keyword
                    result = text.substring(index + keyword.length).trim().replace(".", "").replace("!!!", "").replace(" Neopoints as a reward!", "");
    
                    return CapitalizeFirstLetter(result);
                } 
                // If the keyword is not found, return the original text;
                else {
                    return text;
                }
            }
    
            function CapitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
    
            resolve(prizeElement);
        }, 1000);
    }
    
    async function SearchInAllElements(selectorA, selectorB, selectorC, selectorD) {
        return new Promise((resolve) => {
            const maxRetries = 20; // Maximum number of retries
            let retries = 0;
    
            const intervalId = setInterval(async () => {
                const allElements = document.querySelectorAll('p');
                let element;
    
                for (const selectedElement of allElements) {
                    // Check if the element is defined and its text content contains the target text
                    if (selectedElement && 
                        (selectedElement.textContent.includes(selectorA) ||
                         selectedElement.textContent.includes(selectorB) ||
                         selectedElement.textContent.includes(selectorC) || 
                         selectedElement.textContent.includes(selectorD))) {
                        element = selectedElement;
                        break; // Stop the loop once a matching element is found
                    }
                }
    
                if (element) {
                    clearInterval(intervalId);
                    resolve(element); // Resolve with the found element
                } else if (retries >= maxRetries) {
                    clearInterval(intervalId);
                    resolve(null); // Resolve with null if max retries reached
                }
    
                retries++;
                await Sleep(500, 1000);
            }, 1000); // Retry every second
        });
    }
}));