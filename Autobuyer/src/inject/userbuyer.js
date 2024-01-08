getSTART_AUTOKQ_PROCESS(async function(isActive){
    if(!isActive) return;
    
    await getKQ_INVENTORY(function(ingredients){
        if(document.body.textContent.includes("Item not found!")) {
            window.location.href = `https://www.neopets.com/shops/wizard.phtml?string=${ingredients[0]}`;
        }

        // Find the anchor element
        var buyLink = document.querySelector('div[style="text-align: center; margin: 10px;"] table tbody tr td a');
        var itemName = buyLink.parentNode.querySelector("b").textContent;
        
        var newIngredientsList = [...ingredients];
        var removedIngredient = newIngredientsList.shift();

        if(removedIngredient == itemName){
            setKQ_INVENTORY(newIngredientsList);
        } else {
            return;
        }

        if (buyLink) {
            var middleClickEvent = new MouseEvent('click', {
              bubbles: true,
              which: 2,   // 1: left, 2: middle, 3: right button
            });
            
            if(newIngredientsList.length > 0){
                `https://www.neopets.com/shops/wizard.phtml?string=${newIngredientsList[0]}`;
                buyLink.dispatchEvent(middleClickEvent);
            } else {
                setSUBMIT_AUTOKQ_PROCESS(true);
                window.location.href = 'https://www.neopets.com/island/kitchen.phtml';
            }
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