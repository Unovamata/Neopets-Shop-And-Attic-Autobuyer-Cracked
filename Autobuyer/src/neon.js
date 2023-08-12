var results = document.querySelector(".container");
var userSection = getShopIndex(document.querySelector('.nav-profile-dropdown-text'));
var user = document.querySelector('.nav-profile-dropdown-text')
    .getElementsByTagName("a")[0].innerHTML;
var searchItem = "";
var subShops = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var sectionsSearched = 0;
var shops = new Array();
var shopsToDisplay = 20;
var updated = false;
var completePossible = true;
var lastResultsGrid = null;

const noResults = 'I did not find anything.  :(  Please try again and I will search elsewhere!';
const shopBan = 'I am too busy right now,';

var progressStatus = document.createElement("div");
progressStatus.style.width = "100%"
progressStatus.style.height = "24px";
progressStatus.style.background = "#DDD";
progressStatus.style.borderRadius = "12px";
progressStatus.style.gridColumn = "span 2";
progressStatus.style.textAlign = "center";
progressStatus.style.borderStyle = "solid";
progressStatus.style.borderWidth = "thin";

var progressBar = document.createElement("div");
progressBar.style.height = "24px";
progressBar.style.lineHeight = "24px";
progressBar.style.background = "#39FF14";
progressBar.style.borderRadius = "12px";
progressBar.style.fontFamily = "MuseoSansRounded700";
progressBar.style.fontSize = "10pt";

// SHOP SECTIONS
// 0an = 0
// 1bo = 1
// 2cp = 2
// 3dq = 3
// 4er = 4
// 5fs = 5
// 6gt = 6
// 7hu = 7
// 8iv = 8
// 9jw = 9
// _kx = 10
// ly = 11
// mz = 12

function compare(a, b) {
    if (a.price < b.price) {
        return -1;
    }
    if (a.price > b.price) {
        return 1;
    }
    return 0;
}

function removeAllChildNodes(parent) {
    first = parent.firstChild; //saves the header

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    parent.appendChild(first); // adds the header back
}

function getShopIndex(shopDom) {
    var shopOwner = shopDom.getElementsByTagName("a")[0].innerHTML;
    let c = shopOwner.charCodeAt(0);
    let subShopIndex = 0;

    if (c < 60) {
        //Should be a character should be a digit
        subShopIndex = c % 48;
    } else {
        subShopIndex = c % 97;
        if (subShopIndex >= 13) {
            subShopIndex = subShopIndex % 13;
        } else if (subShopIndex == 95) {
            //underscore
            console.log("underscore___");
            subShopIndex = 10;
        }
    }

    return subShopIndex;
}

function addNewShops(results, sectionIndex) {
    // Add all new search results to list of shops
    for (let i = 1; i < results.length; i++) {

        const shop = {
            owner: results[i].getElementsByTagName("a")[0].innerHTML,
            price: Number(results[i].getElementsByTagName("div")[0].innerHTML.substring(0, results[i].getElementsByTagName("div")[0].innerHTML.length - 3)
                .replace(/,/g, '')),
            section: sectionIndex,
            qty: Number(results[i].getElementsByTagName("p")[0].innerHTML),
            dom: results[i]
        }

        shops.push(shop);
    }

    shops.sort(compare);
}

function populate() {
    //Remove all shops populated by neo from DOM
    const shopList = document.querySelector('.wizard-results-grid')
        .getElementsByTagName("ul")[0];
    removeAllChildNodes(shopList);

    paintedCheapest = false;

    // Add cheapest shops to DOM
    for (let i = 0; i < Math.min(shopsToDisplay, shops.length); i++) {
        if (!paintedCheapest && shops[i].section == userSection) {
            shops[i].dom.style.background = "#FF10F0";
            shops[i].dom.style.color = "#FFFFFF";
            paintedCheapest = true;
        }
        document.querySelector('.wizard-results-grid')
            .getElementsByTagName("ul")[0].appendChild(shops[i].dom);
    }

    lastResultsGrid = document.querySelector('.wizard-results-grid');
}

var callback = function(mutationsList) {
    for (var mutation of mutationsList) {
        //pass
        // console.log(`${mutation.type} has been changed.`);
    }

    // Get search item name
    try {
        var newSearchItem = document.querySelector('.wizard-results-text')
            .getElementsByTagName("h3")[0].innerHTML;

        if (newSearchItem != null) {
            if (newSearchItem === searchItem) {
                //pass
            } else {
                console.log(newSearchItem);
                searchItem = newSearchItem;
                subShops = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                shops.length = 0;
                sectionsSearched = 0;
            }
        }

        var results = document.querySelector('.wizard-results-grid')
            .getElementsByTagName("li");

        // results[0] is the table header so we get results[1]
        subShopIndex = getShopIndex(results[1]);

        // new subShop
        if (subShops[subShopIndex] == 0) {
            console.log("New Shop Section");
            subShops[subShopIndex] = 1;
            sectionsSearched++;

            addNewShops(results, subShopIndex);
            populate();

            // update the progress bar
            progressBar.style.width = ((100 / 13.0) * sectionsSearched)
                .toString() + "%";
            progressBar.innerHTML = sectionsSearched.toString() + "/13";
            progressStatus.appendChild(progressBar);

            document.querySelector('.wizard-results-header')
                .appendChild(progressStatus);

            // console.log("Sending to database");
            // chrome.runtime.sendMessage({command: "post", data: "999"}, (response) => {success();});
            // console.log("SENT");
        }

        // Seen this subShop section before
        else if (!updated) {
            populate();
            document.querySelector('.wizard-results-header')
                .appendChild(progressStatus);
            updated = true;
        }

        //this is to prevent infinite loops with the mutation dectector
        else {
            updated = false;
        }
    } catch (e) {
        // Error should be  for 1 of 3 cases:
        var p = document.querySelector('.wizard-results__2020')
            .getElementsByTagName("p");
        var text = p[p.length - 1].innerHTML;

        //Case 1: no users selling item in this shop section:
        if (text == noResults) {
            console.log("No results");
            //print out results found so far anyway
            document.querySelector('.wizard-results__2020')
                .insertBefore(lastResultsGrid, document.querySelector('.wizard-results__2020')
                    .children[4]);
            // document.querySelector('.wizard-results__2020').appendChild(lastResultsGrid);
        }

        //Case 2: shop wizard ban
        else if (text.includes(shopBan)) {
            console.log("Shop Wizard Ban");
            document.querySelector('.wizard-results__2020')
                .appendChild(lastResultsGrid);
        }

        //Case 3: Item doesn't exist
        else {
            console.log(text);
            //Do nothing probably
        }
    }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
var targetNode = document.querySelector('.container');
observer.observe(targetNode, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true
});