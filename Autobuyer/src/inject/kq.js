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

    var ingredients = await WaitForElement('.ingredient-grid', 0);
    var items = ingredients.querySelectorAll("b");
    var itemArray = [];

    items.forEach(function(element) {
        itemArray.push(element.innerText);
    });

    await setKQ_INVENTORY(itemArray);

    window.location.href = `https://www.neopets.com/shops/wizard.phtml?string=${itemArray[0]}`;
}

//console.log(startButton);