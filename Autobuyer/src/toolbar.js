// Get the URL of the current script
const scriptUrl = document.currentScript.src;

// Extract the part before "src"
const srcPath = scriptUrl.substring(0, scriptUrl.indexOf("src") + 3);

//console.log(srcPath);

// Construct the URL for logo.png using the directory path
const logoUrl = `${srcPath}/logo.png`;
const shopIconUrl = `${srcPath}/toolbar/shop-icon.svg`;
const atticIconUrl = `${srcPath}/toolbar/mypets-icon.svg`;
const npIconUrl = `${srcPath}/toolbar/np-icon.svg`;
const sdbIconUrl = `${srcPath}/toolbar/safetydeposit-icon.svg`;
const historyIconUrl = `${srcPath}/toolbar/transferlog-icon.svg`;
const databaseIconUrl = `${srcPath}/toolbar/settings-icon.svg`;
const infoIconUrl = `${srcPath}/toolbar/search-icon.svg`;
const checkIconUrl = `${srcPath}/toolbar/check.png`;
const crossIconUrl = `${srcPath}/toolbar/delete.png`;

// Styles
const toolbarCSS = `${srcPath}/toolbar/toolbar.css`;

// Links
const autobuyerUrl = `${srcPath}/options/Autobuyer/autobuyer.html`;
const atticUrl = `${srcPath}/options/attic.html`;
const autopricerUrl = `${srcPath}/options/Autopricer/autopricer.html`;
const autosdbUrl = `${srcPath}/options/autosdb.html`;
const historyUrl = `${srcPath}/options/history/history.html`;
const databaseUrl = `${srcPath}/options/ItemDB/item_db.html`;
const infoUrl = `${srcPath}/options/info.html`;


// content.js
function injectToolbar() {
    const toolbarHTML = `
    <div class="toolbar">
        <div class = "toolbar-pattern"></div>
        <span class="github-btn">
            <a class="gh-btn" href="https://github.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked" rel="noopener noreferrer" target="_blank" aria-label="Star Star Unovamata/https://github.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked On Github">
                <span class="gh-ico" aria-hidden="true"></span>
                <span class="gh-text">Star</span>
            </a>
        </span>

        <img class="logo" src="${logoUrl}"></img>

        <div class = "toolbar-text">
            <a href="${autobuyerUrl}">
                <img  class = "toolbar-icon" src="${shopIconUrl}" alt="Info Icon"> 
            AutoBuyer </a>

            <a href="${atticUrl}">
                <img  class = "toolbar-icon" src="${atticIconUrl}" alt="Info Icon"> 
            AutoAttic </a>

            <a href="${autopricerUrl}">
                <img  class = "toolbar-icon" src="${npIconUrl}" alt="Info Icon"> 
            AutoPricer </a>

            <!--<a href="${autosdbUrl}">
                <img  class = "toolbar-icon" src="${sdbIconUrl}" alt="Info Icon"> 
            AutoSDB </a>-->


            <a href="${historyUrl}">
                <img  class = "toolbar-icon" src="${historyIconUrl}" alt="Info Icon"> 
            History </a>

            <a href="${databaseUrl}">
                <img  class = "toolbar-icon" src="${databaseIconUrl}" alt="Info Icon"> 
            Database </a>

            <a href="${infoUrl}">
                <img  class = "toolbar-icon" src="${infoIconUrl}" alt="Info Icon"> 
            Info </a>
        </div>
    </div>

    <div class="toolbar-bottom">
        <span class = "notice-text">This extension is not affiliated to Neopets. Names are owned by Neopets. The software is provided as-is. Use it wisely to avoid freezes with your Neopet account(s).</span>
        <span class = "version-text">${chrome.runtime.getManifest().version}v</span>
    </div>`;

    //const toolbarCSS = `<link rel="stylesheet" type="text/css" href="toolbar.css" />`

    // Create a container element for the off-screen rendering
    const offScreenContainer = document.createElement('div');
    offScreenContainer.style.position = 'absolute';
    offScreenContainer.style.left = '-9999px';
    offScreenContainer.innerHTML = toolbarHTML;

    // Append the off-screen container to the body
    document.body.appendChild(offScreenContainer);

    // Add the CSS link to the head of the document
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.type = 'text/css';
    cssLink.href = toolbarCSS;
    document.head.appendChild(cssLink);
}

// Wait for the entire page, including CSS, to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    injectToolbar();
});


//######################################################################################################################################



function setUPDATE_DATE(value) {
    chrome.storage.local.set({ UPDATE_DATE: value }, function () {});
}

function getUPDATE_DATE(callback) {
    chrome.storage.local.get(['UPDATE_DATE'], function (result) {
        const value = result.UPDATE_DATE;

        if(value === undefined || value === null){
            setUPDATE_DATE("");
        } 

        if (typeof callback === 'function') {
            callback(value);
        }
    });
}


//######################################################################################################################################

const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

var successColor = "#2196F3";
var errorColor = "#f22046";
var warningColor = "#ff8214";

function UpdateNotification(){
    const currentDate = new Date();
    const parsedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDay()}, ${currentDate.getFullYear()}`;
    //setUPDATE_DATE(""); //DEBUG!!!!

    getUPDATE_DATE(async function (date){
        // Checking the latest version of the extension daily;
        var hasDoneDailyVersionCheck = date === parsedDate;

        if(hasDoneDailyVersionCheck){
            return;
        }

        // If the version checker has not been run, check the latest version of the extension;
        var currentVersion = chrome.runtime.getManifest().version;
        var apiUrl = "https://api.github.com/repos/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/releases/latest";
        var githubLatestVersion = await FetchLatestGitHubVersion(apiUrl);
        var parsedVersion = githubLatestVersion.replace("v", "");
        var isLatestVersion = parsedVersion == currentVersion;

        const updateNotification = document.createElement("span");
        updateNotification.className = "update-notification";

        // Creating the image component;
        const updateImage = document.createElement("img");
        updateImage.className = "update-image";
        updateImage.src = "../../../icons/check.png"; // Replace with your image URL

        // Setting the update status;
        const updateStatus = document.createElement("a");
        updateStatus.className = "update-status";
        updateStatus.textContent = "NeoBuyer+ is up to Date!"

        switch(parsedVersion){
            // Github's API can't be reached;
            case 'a':
                updateNotification.style.backgroundColor = warningColor;
                updateImage.src = "../../../icons/delete.png";
                updateStatus.textContent = "Unable to Check for Updates...";
                isLatestVersion = true; // It can be the latest version for all we know;
            break;

            // Unknown error;
            case 'b':
                updateNotification.style.backgroundColor = errorColor;
                updateImage.src = "../../../icons/delete.png";
                updateStatus.textContent = " Update Checker Failed...";
                isLatestVersion = true; // It can be the latest version for all we know;
            break;

            // Normal version checking;
            default:
                if(isLatestVersion){
                    updateNotification.style.backgroundColor = successColor;
                    setUPDATE_DATE(parsedDate);
                } else {
                    updateNotification.style.backgroundColor = errorColor;
                    updateImage.src = "../../../icons/delete.png";
                    updateStatus.textContent = "NeoBuyer+ is Outdated!";
                    updateStatus.appendChild(document.createElement("br"));
                    //updateStatus.appendChild(document.createElement("br"));
                    const updateLink = document.createElement("a");
                    updateLink.href = "https://github.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/releases/latest";
                    updateLink.textContent = "Update NeoBuyer";
                    updateLink.style.fontSize = "26.5px";
                    updateStatus.appendChild(updateLink);
                }
            break;
        }

        updateNotification.appendChild(updateImage);
        updateNotification.appendChild(updateStatus);
        document.body.appendChild(updateNotification);

        // If it's the latest version, then animate the popup;
        if(isLatestVersion){
            updateNotification.addEventListener("animationend", () => {
                var canTrigger = true;

                // Change the animation and the opacity to 0;
                if (canTrigger) {
                    setTimeout(() => {
                        updateNotification.style.animation = "slideUp 2s ease-out";

                        canTrigger = false;

                        updateNotification.style.opacity = 0;
                    }, 1500);
                }
            });
        }
    });
}

async function FetchLatestGitHubVersion(apiUrl) {
    try {
        // Checking the Github API for the latest extension version;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            return 'a'; // API can't be reached;
        }

        // Parsing the data and returning it;
        const data = await response.json();

        const githubLatestVersion = data.tag_name;

        return githubLatestVersion;
    } catch (error) {
        return 'b'; // Error in the execution;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    UpdateNotification();
});