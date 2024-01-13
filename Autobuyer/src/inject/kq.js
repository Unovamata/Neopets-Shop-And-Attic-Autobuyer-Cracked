getSTART_AUTOKQ_PROCESS(function(isActive){
    // Checking if the AutoKQs can be done;
    if(!isActive) return;
    if(document.body.textContent.includes("Sorry, there is a limit of 10 quests per day.")){
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
        getSUBMIT_AUTOKQ_PROCESS(async function(isDone){
            if(isDone){
                submitIngredients.click();
                setSUBMIT_AUTOKQ_PROCESS(false);
                setAUTOKQ_STATUS("Quest Completed!");
                ReadPrizeElement();
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

            getBLACKLIST_KQ(async function(blacklist){
                questContainsBlacklistedItem = ArrayHasCommonElement(itemArray, blacklist);

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
                window.location.href = `https://www.neopets.com/shops/wizard.phtml?string=${itemArray[0]}`;
                setAUTOKQ_STATUS(`Ingredients Read! Initializing SW for ${itemArray.length} items...`);
            });
        });
    }
});

async function ReadPrizeElement(){
    var prizeElement = await SearchInAllElements(" has gained a ", "You get a", "Neopoints");
    console.log(prizeElement.textContent);
}

async function SearchInAllElements(selectorA, selectorB, selectorC){
    return new Promise((resolve) => {
        const intervalId = setInterval(async () => {
            const allElements = await WaitForElement('p', 3);
            let element;

            for (const selectedElement of allElements) {
                // Check if the element's text content contains the target text
                if (selectedElement.textContent.includes(selectorA) ||
                    selectedElement.textContent.includes(selectorB) ||
                    selectedElement.textContent.includes(selectorC)) {
                    element = selectedElement;
                }
            }

            clearInterval(intervalId);
            resolve(element); // Resolve with the found element
        }, 1000);
    });
}




