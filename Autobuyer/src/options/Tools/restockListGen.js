const inputList = document.getElementById("inputList");
var inflatedItems = [], unpricedItems = [];

inputList.onchange = function (){
    // Get the input text from the textarea
    var inputData = inputList.value.split("\n")
    .filter(item => item.trim() !== '')
    .filter(item => !/ - r\d+$/.test(item));

    for(var i = 0; i < inputData.length; i++){
        var currentItem = inputData[i];

        try{
            var nextItem = inputData[i + 1];
            var isRegularItem = !currentItem.includes("NP") && !currentItem.includes("Inflation Notice");
            var itemHasPrice = nextItem.includes("NP") || nextItem.includes("Inflation Notice");

            if(isRegularItem && !itemHasPrice){
                unpricedItems.push(currentItem);
            } 
        } catch {}

        if(currentItem == "Inflation Notice"){
            try{
                var pastItem = inputData[i - 1];

                inflatedItems.push(pastItem);
            } catch {}
        }
    }

    console.log(inflatedItems);

    // Filtering out items that match the pattern
    var filteredItems = inputData
    .filter(item => !inflatedItems.includes(item) && !unpricedItems.includes(item))
    .filter(item => !item.includes('Inflation Notice'))
    .filter(item => !/^\d{1,3}(,\d{3})*\sNP$/.test(item));

    filteredItems = [...unpricedItems, ...inflatedItems, ...filteredItems];

    var resultingList = "";
    
    filteredItems.forEach(item => {
        resultingList += item + "\n";
    });

    // Display the cleaned dataset
    document.getElementById('outputList').value = resultingList;
}


//######################################################################################################################################


const shopsDirectoryButton = document.getElementById("shopDirectory");

shopsDirectoryButton.addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://www.jellyneo.net/?go=shopsdirectory', active: true });
});


//######################################################################################################################################


const generatorContainer = document.getElementById('restock-list-generator');
const tutorialContainer = document.getElementById('tutorial-display');

const generatorButton = document.getElementById("generator");
generatorButton.addEventListener('click', ShowListGenerator);

function ShowListGenerator(){
    generatorContainer.style.display = 'block';
    tutorialContainer.style.display = 'none';
}

const tutorialButton = document.getElementById("tutorial");
tutorialButton.addEventListener('click', ShowTutorialStock);

function ShowTutorialStock(){
    tutorialContainer.style.display = 'block';
    generatorContainer.style.display = 'none';
}

tutorialContainer.style.display = 'none';


//######################################################################################################################################