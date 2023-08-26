// Get the URL of the current script
const scriptUrl = document.currentScript.src;

// Extract the part before "src"
const srcPath = scriptUrl.substring(0, scriptUrl.indexOf("src") + 3);

console.log(srcPath);

// Construct the URL for logo.png using the directory path
const logoUrl = `${srcPath}/logo.png`;
const shopIconUrl = `${srcPath}/toolbar/shop-icon.svg`;
const atticIconUrl = `${srcPath}/toolbar/mypets-icon.svg`;
const npIconUrl = `${srcPath}/toolbar/np-icon.svg`;
const sdbIconUrl = `${srcPath}/toolbar/safetydeposit-icon.svg`;
const historyIconUrl = `${srcPath}/toolbar/transferlog-icon.svg`;
const databaseIconUrl = `${srcPath}/toolbar/settings-icon.svg`;
const infoIconUrl = `${srcPath}/toolbar/search-icon.svg`;

// Styles
const toolbarCSS = `${srcPath}/toolbar/toolbar.css`;

// Links
const autobuyerUrl = `${srcPath}/options/Autobuyer/autobuyer.html`;
const atticUrl = `${srcPath}/options/attic.html`;
const autopricerUrl = `${srcPath}/options/autopricer.html`;
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
            Attic </a>

            <a href="${autopricerUrl}">
                <img  class = "toolbar-icon" src="${npIconUrl}" alt="Info Icon"> 
            AutoPricer </a>

            <a href="${autosdbUrl}">
                <img  class = "toolbar-icon" src="${sdbIconUrl}" alt="Info Icon"> 
            AutoSDB </a>


            <a href="${historyUrl}">
                <img  class = "toolbar-icon" src="${historyIconUrl}" alt="Info Icon"> 
            History </a>

            <a href="${databaseUrl}">
                <img  class = "toolbar-icon" src="${databaseIconUrl}" alt="Info Icon"> 
            Database </a>

            <a href="${databaseUrl}">
                <img  class = "toolbar-icon" src="${infoIconUrl}" alt="Info Icon"> 
            Info </a>
            <!--<a target="_blank" href="https://forms.gle/zwvVoE7KYxKWJHuU6">Bug Reporting | </a>
            <a target="_blank" href="https://docs.google.com/document/d/e/2PACX-1vQ1bYmz2o92LG4sVq7CIO7tgCVl-lVreJxpIuDjd9TmFuXX166UZlqQdTWkt7VUyRkF33DvWD8ldVS8/pub">Author's FAQ | </a>
            <a target="_blank" href="https://chrome.google.com/webstore/detail/neobuyer-main-shop-autobu/gcoedojijoejlngkneocccmnjkbbbfmd">Original Extension</a>-->
        </div>
    </div>

    <div class="toolbar-bottom">
        <span class = "notice-text">This extension is not affiliated to Neopets. Names are owned by Neopets. The software is provided as-is. Use it wisely to avoid freezes with your Neopet account(s).</span>
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
injectToolbar();