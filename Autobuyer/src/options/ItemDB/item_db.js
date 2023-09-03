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
    headerRow.classList.add("header-row"); // Add class for table header row
    
    for (const row of data) {
        for (const key in row) {
            if (row.hasOwnProperty(key) && headers.indexOf(key) === -1) {
                headers.push(key);
                const headerCell = document.createElement("th");
                headerCell.textContent = key;
                headerRow.appendChild(headerCell);
                headerRow.classList.add(`class-${key}`);
            }
        }
    }

    const jnRow = document.createElement("th");
    jnRow.classList.add("header-row"); // Add class for table header row
    jnRow.textContent = "JellyNeo";
    jnRow.classList.add("class-jellyneo");
    headerRow.appendChild(jnRow);
    headers.push("JellyNeo");
    

    thead.appendChild(headerRow);
    table.appendChild(thead);

    table.appendChild(tbody);
    table.classList.add("table", "sortable"); // Add classes for styling
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
        var lastName = "";

        for (const header of headers) {
            const cell = document.createElement("td");
            cell.classList.add("table-cell"); // Add class for table cells
            let cellValue = row[header] || "";

            switch (header) {
                case "Date & Time":
                    cell.classList.add('class-DateTime');
                break;

                case "Name":
                    const name = document.createElement("div");
                    name.innerText = cellValue;
                    cell.appendChild(name);
                    lastName = cellValue;
                    cell.classList.add('class-Name');
                break;
                
                case "Rarity":
                    cell.textContent = NumberWithCommas(cellValue);
                    cell.classList.add('class-Rarity');
                break;

                case "Price":
                    cell.textContent = NumberWithCommas(cellValue);
                    cell.classList.add('class-Price');
                break;

                case "JellyNeo":
                    // Create the <a> element
                    var linkElement = document.createElement("a");
                    linkElement.href = `https://items.jellyneo.net/search/?name=${lastName}&name_type=3`;

                    // Create the <img> element
                    var imgElement = document.createElement("img");
                    imgElement.src = "../JN.png";
                    imgElement.alt = "Info Icon";

                    linkElement.appendChild(imgElement);

                    cell.appendChild(linkElement);
                    cell.classList.add('class-JellyNeo');
                break;
                
                
            }

            rowElement.appendChild(cell);
        }

        tbody.appendChild(rowElement);
    }

    table.appendChild(tbody);
    table.classList.add("table", "sortable"); // Add classes for styling
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