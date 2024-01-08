getSTART_AUTOKQ_PROCESS(async function(isActive){
    if(!isActive) return;
    
    await getKQ_INVENTORY(async function(ingredients){
        if(document.body.textContent.includes("Item not found!") || 
        document.body.textContent.includes("Sorry - The owner of this shop has been frozen!")) {
            if(ingredients.length > 0){
                window.location.href = `https://www.neopets.com/shops/wizard.phtml?string=${ingredients[0]}`;
            } else {
                setSUBMIT_AUTOKQ_PROCESS(true);
                window.location.href = 'https://www.neopets.com/island/kitchen.phtml';
            }
        }

        // Find the anchor element
        var buyLink = document.querySelector('div[style="text-align: center; margin: 10px;"] table tbody tr td a');
        var itemName = buyLink.parentNode.querySelector("b").textContent;

        console.log(ingredients);

        if(!ingredients.includes(itemName)){
            window.location.href = `https://www.neopets.com/shops/wizard.phtml?string=${ingredients[0]}`;
        }

        if (buyLink) {
            const buyIngredientURL = DecodeLink(buyLink.href);

            if (ingredients.length > 0) {
                var newIngredientsList = [...ingredients];
                var removedIngredient = newIngredientsList.shift();

                if(removedIngredient == itemName){
                    await setKQ_INVENTORY(newIngredientsList);
                    window.location.href = buyIngredientURL;
                } else {
                    return;
                }
            } else {
                setSUBMIT_AUTOKQ_PROCESS(true);
                window.location.href = 'https://www.neopets.com/island/kitchen.phtml';
            }
        }
    })
});

function DecodeLink(inputLink) {
    // Replace encoded characters in Link #1
    let decodedLink = decodeURIComponent(inputLink);

    // Replace &amp; with &
    decodedLink = decodedLink.replace(/&amp;/g, '&');
    
    // Check if the link already starts with the correct protocol and domain
    if (!decodedLink.startsWith('https://www.neopets.com/')) {
        // Add the missing protocol and domain to the link
        decodedLink = 'https://www.neopets.com/' + decodedLink;
    }

    return decodedLink;
}