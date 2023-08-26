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

        <img class="logo" src="logo.png"><a href="../options/index.html"></a></img>

        <div class = "toolbar-text">
            <a href="../options/autobuyer.html">
                <img  class = "toolbar-icon" src="../icons/shop-icon.svg" alt="Info Icon"> 
            AutoBuyer </a>

            <a href="../options/attic.html">
                <img  class = "toolbar-icon" src="../icons/mypets-icon.svg" alt="Info Icon"> 
            Attic </a>

            <a href="../options/autopricer.html">
                <img  class = "toolbar-icon" src="../icons/np-icon.svg" alt="Info Icon"> 
            AutoPricer </a>

            <a href="../options/autosdb.html">
                <img  class = "toolbar-icon" src="../icons/safetydeposit-icon.svg" alt="Info Icon"> 
            AutoSDB </a>


            <a href="../history/history.html">
                <img  class = "toolbar-icon" src="../icons/transferlog-icon.svg" alt="Info Icon"> 
            History </a>

            <a href="../src/options/ItemDB/item_db.html">
                <img  class = "toolbar-icon" src="../icons/settings-icon.svg" alt="Info Icon"> 
            Database </a>

            <a href="../options/item_db.html">
                <img  class = "toolbar-icon" src="../icons/search-icon.svg" alt="Info Icon"> 
            Info </a>
            <!--<a target="_blank" href="https://forms.gle/zwvVoE7KYxKWJHuU6">Bug Reporting | </a>
            <a target="_blank" href="https://docs.google.com/document/d/e/2PACX-1vQ1bYmz2o92LG4sVq7CIO7tgCVl-lVreJxpIuDjd9TmFuXX166UZlqQdTWkt7VUyRkF33DvWD8ldVS8/pub">Author's FAQ | </a>
            <a target="_blank" href="https://chrome.google.com/webstore/detail/neobuyer-main-shop-autobu/gcoedojijoejlngkneocccmnjkbbbfmd">Original Extension</a>-->
        </div>
    </div>

    <div class="toolbar-bottom">
        <span class = "notice-text">This extension is not affiliated to Neopets. Names are owned by Neopets. The software is provided as-is. Use it wisely to avoid freezes with your Neopet account(s).</span>
    </div>`;

    const toolbarCSS = `<link rel="stylesheet" type="text/css" href="toolbar.css" />`

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
    cssLink.href = 'toolbar.css';
    document.head.appendChild(cssLink);
}

// Wait for the entire page, including CSS, to be fully loaded
window.onload = function() {
    injectToolbar();
};