/*function populateTable() {
    $("#itemcount").text(item_db_array.length)
    loadTableData(item_db_array);
    
    var e = document.createElement("script");

    e.setAttribute("src", "../../js/sortable.js"), document.head.append(e)
    
    $("#loading").hide();
}*/

$("#itemcount").text(item_db_array.length)

const tableContainer = document.getElementById("table-container");
tableContainer.innerHTML = ""; // Clear existing content

const table = document.createElement("table");
const tbody = document.createElement("tbody");
const thead = document.createElement("thead");

const data = item_db_array;
const chunkSize = 500;
var currentPage = 1;


function NumberWithCommas(e) {
    return e.toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}





// Calculate the total number of pages
const totalPages = Math.ceil(data.length / chunkSize);

// Function to load data for the current page
function LoadCurrentPage() {
    LoadTableData(data, chunkSize, currentPage);

    // Update navigation
    UpdateNavigation();
}

function LoadTableData(data, chunkSize, currentPage){
    table.innerHTML = "";
    thead.innerHTML = "";
    tbody.innerHTML = "";
    const headers = [];

    const headerRow = document.createElement("tr");
    for (const row of data) {
        for (const key in row) {
            if (row.hasOwnProperty(key) && headers.indexOf(key) === -1) {
                headers.push(key);
                const headerCell = document.createElement("th");
                headerCell.textContent = key;
                headerRow.appendChild(headerCell);
            }
        }
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    table.appendChild(tbody);
    table.classList.add("sortable");
    tableContainer.appendChild(table);

    LoadChunksOfData(data, chunkSize, currentPage, headers);
}

function LoadChunksOfData(data, chunkSize, currentPage, headers){
    var e = document.createElement("script");
    e.setAttribute("src", "../../js/sortable.js"), document.head.append(e)
    
    const startIndex = (currentPage - 1) * chunkSize;
    const endIndex = startIndex + chunkSize;
    const dataChunk = data.slice(startIndex, endIndex);

    for (var i = 0; i < chunkSize && dataChunk[i] != null; i++) {
        const row = dataChunk[i];
        const rowElement = document.createElement("tr");
        rowElement.classList.add("item");

        for (const header of headers) {
            const cell = document.createElement("td");
            let cellValue = row[header] || "";

            switch (header) {
                case "Name":
                    const link = document.createElement("a");
                    link.href = `https://items.jellyneo.net/search/?name=${cellValue}&name_type=3`;
                    link.innerText = cellValue;
                    link.setAttribute("target", "_blank");
                    cell.appendChild(link);
                    break;

                default:
                    cell.textContent = NumberWithCommas(cellValue);
                    break;
            }

            rowElement.appendChild(cell);
        }

        tbody.appendChild(rowElement);
    }

    table.appendChild(tbody);
    table.classList.add("sortable");
    tableContainer.appendChild(table);
}

// Function to update navigation buttons and page indicator
function UpdateNavigation() {
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const pageIndicator = document.getElementById("page-indicator");

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
}

// Event listener for previous button
document.getElementById("prev-button").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
    }

    LoadCurrentPage();
});

// Event listener for next button
document.getElementById("next-button").addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;

    }

    LoadCurrentPage();
});

// Initial load
LoadCurrentPage();