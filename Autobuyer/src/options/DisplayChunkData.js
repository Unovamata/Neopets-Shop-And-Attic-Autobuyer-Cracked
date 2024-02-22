var currentPage = 1;
var totalPages = 1;

const firstButton = document.getElementById("first-button");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const lastButton = document.getElementById("last-button");
const pageIndicator = document.getElementById("page-indicator");

function HideNavigationButtons(){
    ShowAndHideElements([], [firstButton, prevButton, nextButton, lastButton, pageIndicator]);
}

function ShowNavigationButtons(){
    ShowAndHideElements([firstButton, prevButton, nextButton, lastButton, pageIndicator], []);
}

// Function to update navigation buttons and page indicator
function UpdateNavigation() {
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Event listener for previous button
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
    }

    LoadCurrentPage();
});

// Event listener for next button
nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
    }

    LoadCurrentPage();
});

// Event listener for first page button
firstButton.addEventListener("click", () => {
    currentPage = 1;

    LoadCurrentPage();
});

// Event listener for last page button
lastButton.addEventListener("click", () => {
    currentPage = totalPages;

    LoadCurrentPage();
});

// Function to load data for the current page
function LoadCurrentPage() { }


//######################################################################################################################################


var table = document.createElement("table");
table.classList.add("table", "sortable"); // Add classes for styling
var tableBody = document.createElement("tbody");
var tableRow = document.createElement("tr");
var tableHead = document.createElement("thead");
var tableHeader = document.createElement("th");
var tableDataCell = document.createElement("td");

CallSortingScript();

function CallSortingScript(){
    const tableSortingScript = document.createElement("script");
    tableSortingScript.src = "../../../js/sortable.js";
    document.head.appendChild(tableSortingScript);
}

// Data Table with purchase history and information;
function DisplayTableData(data, keysToPush, chunkSize, FilterFunction) {
    if(data.length == 0){
        HideNavigationButtons();
        tableContainer.innerHTML = "";
        tableContainer.appendChild(table);
        return;
    } else {
        ShowNavigationButtons();
    }

    // Resetting table data;
    tableBody.innerHTML = '';
    table.innerHTML = '';

    // Creating the row headers;
    var keys = CreateHeaderRowKeys(data, keysToPush);

    LoadChunksOfData(data, keys);
    
    function LoadChunksOfData(data, headers){
        const startIndex = (currentPage - 1) * chunkSize;
        const endIndex = startIndex + chunkSize;
        const dataChunk = data.slice(startIndex, endIndex);
    
        for (var i = 0; i < chunkSize && dataChunk[i] != null; i++) {
            const row = dataChunk[i];
            const rowElement = document.createElement("tr");
            rowElement.classList.add("item");

            for (const header of headers) {
                var cell = document.createElement("td");
                cell.classList.add("table-cell"); // Add class for table cells
                let cellValue = row[header] || "";
                
                cell = FilterFunction(header, cell, [cellValue, row]);
    
                rowElement.appendChild(cell);
            }
    
            tableBody.appendChild(rowElement);
        }
    
        table.appendChild(tableBody);
        table.classList.add("table", "sortable"); // Add classes for styling
        tableContainer.innerHTML = "";
        tableContainer.appendChild(table);
    }
}



function CreateHeaderRowKeys(dataArray, keysToPush) {
    var tableRowClone = tableRow.cloneNode(false);

    const headerKeys = [];
    const firstItem = dataArray[0];

    for(key in firstItem){ // Check all the keys in the current data;
        // Check if the key is unique;
        if(firstItem.hasOwnProperty(key) && headerKeys.indexOf(key) == -1){
            headerKeys.push(key); // Adding the key;

            // Creating the cell and appending it;
            const headerCell = tableHeader.cloneNode(false);
            headerCell.appendChild(document.createTextNode(key));
            tableRowClone.appendChild(headerCell);   
        } else break;
    }

    // Pushing extra keys to the DB;
    keysToPush.forEach(function(key){
        headerKeys.push(key);
        headerCell = tableHeader.cloneNode(false);
        headerCell.appendChild(document.createTextNode(key));
        tableRowClone.appendChild(headerCell);
    });

    //Creating the header rows;
    const headerRow = tableHead.cloneNode(false);
    headerRow.appendChild(tableRowClone);
    table.appendChild(headerRow);

    return headerKeys;
}


