getSTART_AUTOKQ_PROCESS(async function(isActive){

    if(!isActive) return;

    if(document.body.textContent.includes("Item not found!")) return;

    console.log("Running...")
    
    await getKQ_INVENTORY(function(ingredients){
        // Find the anchor element
        var buyLink = document.querySelector('div[style="text-align: center; margin: 10px;"] table tbody tr td a');
        var itemName = buyLink.parentNode.querySelector("b").textContent;
        
        var ingredientList = [...ingredients];
        var removedIngredient = ingredientList.shift();

        if(removedIngredient == itemName){
            console.log("Removed " + removedIngredient);    
        } else {
            console.log("List stayed the same..." + ingredients);
        }

        if(ingredientList.length == 0){
            window.location.href = 'https://www.neopets.com/island/kitchen.phtml';
        }
    })


    

    /*if (buyLink) {
          var middleClickEvent = new MouseEvent('click', {
            bubbles: true,
            which: 2,   // 1: left, 2: middle, 3: right button
        });
        
        window.location.reload();
        buyLink.dispatchEvent(middleClickEvent);


    }*/
});