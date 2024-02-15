const data = item_db_array;
const itemCount = data.length;

var dbCount = document.getElementById("itemcount");
dbCount.innerText = itemCount;

const tableContainer = document.getElementById("table-container");

// DisplayChunkData.js
const chunkSize = 500;
totalPages = Math.ceil(data.length / chunkSize);

LoadCurrentPage = function(){
    DisplayTableData(data, ["JN"], chunkSize, FilterFunction);

    // Update navigation
    UpdateNavigation();
}

function FilterFunction(header, cell, data){
    switch (header) {
        case "Name":
            const name = document.createElement("div");
            name.innerText = data[0];
            cell.appendChild(name);
            lastName = data[0];
            cell.classList.add('class-Name');
        break;
        
        case "Rarity":
            cell.textContent = data[0];
            cell.classList.add('class-Rarity');
        break;

        case "Price":
            cell.textContent = NumberWithCommas(data[0]);
            cell.classList.add('class-Price');
        break;

        case "JN":
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

    function NumberWithCommas(e) {
        return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    return cell;
}

LoadCurrentPage();