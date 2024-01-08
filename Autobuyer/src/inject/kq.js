getSTART_AUTOKQ_PROCESS(function(isActive){
    if(!isActive) return;

    // Kitchen Quest Auto Solver
    startButton = document.getElementById("kitchen2");

    if(startButton){
        setAUTOKQ_STATUS("Starting Kitchen Quest...");
        startButton.click();
        ExtractItemsFromKQ();
    } else {
        setAUTOKQ_STATUS("Kitchen Quest Already Started, Searching Items...");
        ExtractItemsFromKQ();
    }

    async function ExtractItemsFromKQ(){
        var submitIngredients = document.getElementById("gotingredients")
        setAUTOKQ_STATUS("Waiting for Ingredients...");

        if(!submitIngredients) window.location.reload();
        getSUBMIT_AUTOKQ_PROCESS(async function(isDone){
            if(isDone){
                submitIngredients.click();
                setSUBMIT_AUTOKQ_PROCESS(false);
                window.location.reload();
                return;
            }

            var ingredients = await WaitForElement('.ingredient-grid', 0);
            var items = ingredients.querySelectorAll("b");
            var itemArray = [];

            items.forEach(function(element) {
                itemArray.push(element.innerText);
            });

            await setKQ_INVENTORY(itemArray);

            const url = `https://www.neopets.com/shops/wizard.phtml?string=${itemArray[0]}`;
            window.open(url, '_blank');
            setAUTOKQ_STATUS(`Ingredients Read! Initializing SW for ${itemArray.length} items...`);
        });

        
    }


});