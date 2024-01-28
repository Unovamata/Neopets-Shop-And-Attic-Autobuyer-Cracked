getKQ_TRACKER(async function(tracker){
    console.log(tracker);
});

getSTART_AUTOKQ_PROCESS(function(isActive){
    // Checking if the AutoKQs can be done;
    if(!isActive) return;
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
        getSUBMIT_AUTOKQ_PROCESS(async function(isDone){
            if(isDone){
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
    return new Promise((resolve) => {
        getKQ_TRACKER(async function(tracker){
            var levelOrHitPointText = " has gained a ", statText = " has become better at ", itemText = "You get a ", neopointsText = "Neopoints";
            var prizeElement = await SearchInAllElements(levelOrHitPointText, statText, itemText, neopointsText);
            var prizeText = prizeElement.textContent;

            /* [Level, Hit Points, Strength, Defence, Agility, Items, Neopoints];
            * KQ_TRACKER: [
                0 - Level, 
                1 - Hit Points, 
                2 - Strength, 
                3 - Defence, 
                4 - Agility, 
                5 - Items,
                6 - Neopoints]; */

            
            if(prizeText.includes(levelOrHitPointText)){
                var statType = ExtractStatGained(prizeText, levelOrHitPointText);

                //Levels;
                if(statType == "level"){
                    tracker[0] = tracker[0] + 1;
                    console.log("HP attained");
                } 

                // Hit points;
                else { 
                    tracker[1] = tracker[1] + 1;
                    console.log("Level attained");
                }
            } else if(prizeText.includes(statText)){
                var statType = ExtractStatGained(prizeText, statText);

                switch(statType){
                    case "strength":
                        tracker[2] = tracker[2] + 1;
                        console.log("strength attained");
                    break;

                    case "defence":
                        tracker[3] = tracker[3] + 1;
                        console.log("defence attained");
                    break;

                    case "agility":
                        tracker[4] = tracker[4] + 1;
                        console.log("agility attained");
                    break;
                }
            } else if(prizeText.includes(itemText)){
                tracker[5] = tracker[5] + 1;
                console.log("item attained");
            } else if(prizeText.includes(neopointsText)){
                tracker[6] = tracker[6] + 1;
                console.log("neopoints attained");
            } else {
                window.alert("An error occured in the processing of the KQ tracker...")
            }

            setKQ_TRACKER(tracker);

            function ExtractStatGained(text, keyword) {
                const index = text.indexOf(keyword);
                
                if (index !== -1) {
                    // Remove everything before and including the keyword
                    const result = text.substring(index + keyword.length).trim().replace(".", "").replace("!!!", "");
                    return result;
                } else {
                    // If the keyword is not found, return the original text
                    return text;
                }
            }

            console.log(prizeElement.textContent);

            resolve(prizeElement);
        });
    }, 1000);
}

async function SearchInAllElements(selectorA, selectorB, selectorC, selectorD) {
    return new Promise((resolve) => {
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

            clearInterval(intervalId);
            resolve(element); // Resolve with the found element
        }, 1000);
    });
}