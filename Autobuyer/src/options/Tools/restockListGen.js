const inputList = document.getElementById("inputList");

inputList.onchange = function (){
    var inflatedItems = [], 
    unpricedItems = [],
    filteredItems = [];

    var inputListString = inputList.value;

    // Checking if the data comes from the JN Database page or the Print page;
    var matchPrintLine = /.*\(r\d{1,3}\).*/; // Matches the "Item Name (r##)" format from the print page;
    var isPrintPageData = TestPattern(matchPrintLine, inputListString);

    // Get the input text from the textarea
    var rarityMatcher = / - r\d+$/;

    var inputData = inputList.value.split("\n")
    .filter(item => item.trim() !== '')
    .filter(item => !TestPattern(rarityMatcher, item));

    if(isPrintPageData){
        // Filtering lines that are not items;
        inputData = inputData.filter(item => matchPrintLine.test(item));
        
        inputData.forEach(function(item, index){
            var cleanedItem = item.substring(0, item.indexOf('(')).trim();

            // If the item is unpriced, add it to the unpriced item list;
            if(!item.includes("NP") && !item.includes("Inflation Notice")){
                unpricedItems.push(cleanedItem);
            } 
            // If an item has been inflated, add it to the inflated item list;
            else if(item.includes("Inflation Notice")){
                inflatedItems.push(cleanedItem);
            } 
            // Else, it's a priced item, so add it to the regular item list;
            else {
                filteredItems.push(cleanedItem);
            }
        });
    } 
    
    // The inputted data comes from the JN Database page;
    else {
        for(var i = 0; i < inputData.length; i++){
            var currentItem = inputData[i];
    
            // Checking the next and current line indexes to detect if an item is unpriced;
            try{
                var nextItem = inputData[i + 1];
                var isRegularItem = !currentItem.includes("NP") && !currentItem.includes("Inflation Notice");
                var itemHasPrice = nextItem.includes("NP") || nextItem.includes("Inflation Notice");
    
                // If it is unpriced, add it to the unpriced list;
                if(isRegularItem && !itemHasPrice){
                    unpricedItems.push(currentItem);
                    inputData.splice(i, 1);
                } 
            } catch {}
    
            // If an item is inflated, add it to the inflated list;
            if(currentItem == "Inflation Notice"){
                try{
                    var pastItem = inputData[i - 1];
    
                    inflatedItems.push(pastItem);
                    inputData.splice(i - 1, 1);
                } catch {}
            }
        }
    
        // Filtering out items that match the pattern
        var rarityAndPricedItemsMatcher = /^\d{1,3}(,\d{3})*\sNP$/

        filteredItems = inputData
        .filter(item => !inflatedItems.includes(item) && !unpricedItems.includes(item))
        .filter(item => !item.includes('Inflation Notice'))
        .filter(item => !TestPattern(rarityAndPricedItemsMatcher, item));
    }

    filteredItems = [...unpricedItems, ...inflatedItems, ...filteredItems];
    
    var resultingList = "";
    
    filteredItems.forEach(item => {
        resultingList += item + "\n";
    });

    var outputList = document.getElementById('outputList');
    outputList.innerHTML = '';

    // Display the cleaned dataset
    outputList.value = resultingList;
}

function TestPattern(pattern, element){
    return pattern.test(element);
}

//######################################################################################################################################