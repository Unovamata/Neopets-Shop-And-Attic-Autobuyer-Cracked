CheckShopLayoutDeletionStatus();

async function CheckShopLayoutDeletionStatus(){
    var isDeletingLayouts = await getVARIABLE("SHOULD_DELETE_SHOP_LAYOUTS");

    if(!isDeletingLayouts) return;
    
    var pageContents = document.getElementsByClassName('content')[0];
    pageContents.innerHTML = pageContents.innerHTML.replace(/<!-- desc start -->[\s\S]*<!-- desc end -->/ig, "");
}

StartUserBuyer();

// Allows the user to buy from another user's shops;
async function StartUserBuyer(){
    var isActive = await getVARIABLE("START_AUTOKQ_PROCESS");

    if(!isActive) return;
    
    var ingredients = await getVARIABLE("KQ_INVENTORY");

    // If the item has been sold out or the owner has been frozen, search them again;
    if(PageIncludes("Item not found!") || 
    PageIncludes("Sorry - The owner of this shop has been frozen!") ||
    PageIncludes("There are no items for sale in this shop!") ||
    PageIncludes("This transaction has expired!") ||
    PageIncludes("You do not have enough Neopoints to purchase this item!")) {
        setVARIABLE("AUTOKQ_STATUS", "Shop Owner Either Frozen or the Item Just Sold Out, Restarting Search...");

        // If there are ingredients to search left, then go to the SW after purchase;
        if(ingredients.length > 0){
            window.location.href = `https://www.neopets.com/shops/wizard.phtml?string=${encodeURIComponent(ingredients[0])}`;
        } else { // If not, it means the quest can be completed;
            setVARIABLE("SUBMIT_AUTOKQ_PROCESS", true);
            setVARIABLE("AUTOKQ_STATUS", "Ingredients Bought! Preparing for Quest Completion...");
            window.location.href = 'https://www.neopets.com/island/kitchen.phtml';
        }
    }

    // Finding the purchase link to extract its href;
    var buyLink = document.querySelector('div[style="text-align: center; margin: 10px;"] table tbody tr td a');
    var itemName = buyLink.parentNode.querySelector("b").textContent;

    // If the ingredient has been taken off the purchase list, then proceed;
    if(!ingredients.includes(itemName)){
        window.location.href = `https://www.neopets.com/shops/wizard.phtml?string=${encodeURIComponent(ingredients[0])}`;
    }

    if (buyLink) {
        // Decode the link to actually purchase the item;
        const buyIngredientURL = DecodeLink(buyLink.href);

        // Take the item off the purchase list after buying it;
        if (ingredients.length > 0) {
            var newIngredientsList = [...ingredients];
            var removedIngredient = newIngredientsList.shift();

            if(removedIngredient == itemName){
                setVARIABLE("AUTOKQ_STATUS", `Buying ${removedIngredient}...`);
                setVARIABLE("KQ_INVENTORY", newIngredientsList);
                window.location.href = buyIngredientURL;
            } else { 
                // If there's a different item at the top of the page, most likely the user is buying something for themselves;
                return;
            }
        } else {
            setVARIABLE("SUBMIT_AUTOKQ_PROCESS", true);
            setVARIABLE("AUTOKQ_STATUS", "Ingredients Bought! Preparing for Quest Completion...");
            window.location.href = 'https://www.neopets.com/island/kitchen.phtml';
        }
    }
};

// DecodeLink(); Decodes a link in a format that Neopets can understand;
function DecodeLink(inputLink) {
    setVARIABLE("AUTOKQ_STATUS", "Decoding Purchase Link...");

    let decodedLink = decodeURIComponent(inputLink);
    decodedLink = decodedLink.replace(/&amp;/g, '&');
    
    if (!decodedLink.startsWith('https://www.neopets.com/')) {
        decodedLink = 'https://www.neopets.com/' + decodedLink;
    }

    return decodedLink;
}