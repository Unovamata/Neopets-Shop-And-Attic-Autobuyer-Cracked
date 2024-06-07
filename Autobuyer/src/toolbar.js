// Get the URL of the current script
const scriptUrl = document.currentScript.src;

// Extract the part before "src"
const srcPath = scriptUrl.substring(0, scriptUrl.indexOf("src") + 3);

// Construct the URL for logo.png using the directory path
const logoUrl = `${srcPath}/logo.png`;
const shopIconUrl = `${srcPath}/toolbar/shop-icon.svg`;
const atticIconUrl = `${srcPath}/toolbar/mypets-icon.svg`;
const swIconUrl = `${srcPath}/toolbar/sw-icon.svg`;
const npIconUrl = `${srcPath}/toolbar/np-icon.svg`;
const tpIconUrl = `${srcPath}/toolbar/tradingpost-icon.png`;
const sdbIconUrl = `${srcPath}/toolbar/safetydeposit-icon.svg`;
const historyIconUrl = `${srcPath}/toolbar/transferlog-icon.svg`;
const toolsIconUrl = `${srcPath}/toolbar/settings-icon.svg`;
const databaseIconUrl = `${srcPath}/toolbar/database-icon.svg`;
const infoIconUrl = `${srcPath}/toolbar/search-icon.svg`;
const creditsIconUrl = `${srcPath}/toolbar/gallery-icon.svg`;
const checkIconUrl = `${srcPath}/toolbar/check.png`;
const crossIconUrl = `${srcPath}/toolbar/delete.svg`;
const mailIconUrl = `${srcPath}/toolbar/neomail.svg`;
const dropdownIconUrl = `${srcPath}/toolbar/dropdown-arrow.png`;
const communityIconUrl = `${srcPath}/toolbar/communitycentral-icon.png`;
const restockListIconUrl = `${srcPath}/toolbar/myalbums-icon.svg`;
const manualIconUrl = `${srcPath}/toolbar/mymanual-icon.svg`;
const buyersIconUrl = `${srcPath}/toolbar/myshop-icon.png`;
const bugUrl = `${srcPath}/toolbar/wonderclaw-icon.png`;
const suggestionsUrl = `${srcPath}/toolbar/quests-icon.svg`;
const discordUrl = `${srcPath}/toolbar/discord-border.svg`;

// Styles
const toolbarCSS = `${srcPath}/toolbar/toolbar.css`;

// Links
const autobuyerUrl = `${srcPath}/options/Autobuyer/autobuyer.html`;
const atticUrl = `${srcPath}/options/AutoAttic/attic.html`;
const autopricerUrl = `${srcPath}/options/Autopricer/autopricer.html`;
const autoKQURL = `${srcPath}/options/AutoKQ/autokq.html`;
const autosdbUrl = `${srcPath}/options/autosdb.html`;
const historyUrl = `${srcPath}/options/history/history.html`;
const databaseUrl = `${srcPath}/options/ItemDB/item_db.html`;
const restockListUrl = `${srcPath}/options/Tools/restockListGen.html`;
const infoUrl = `${srcPath}/options/Tools/info.html`;
const mailUrl = `${srcPath}/options/Mail/mail.html`;

// Scripts
const utilsScriptUrl = `${srcPath}/common/utils.js`

function ExtractPageType() {
    var url = window.location.href;

    // Extracting the page's name;
    const lastIndex = url.lastIndexOf('/');
    const htmlIndex = url.indexOf('.html');
    const pageName = url.substring(lastIndex + 1, htmlIndex);
    
    return pageName;
}

const pageName = ExtractPageType();
const baseManualUrl = "https://github.com/Unovamata/AutoBuyerPlus/wiki/";
var manualReferenceUrl = "";

switch(pageName){
    case "autobuyer":
        manualReferenceUrl = baseManualUrl + "AutoBuyer";
    break;

    case "attic":
        manualReferenceUrl = baseManualUrl + "AutoAttic";
    break;

    case "autopricer":
        manualReferenceUrl = baseManualUrl + "AutoPricer";
    break;

    case "autokq":
        manualReferenceUrl = baseManualUrl + "AutoKQ";
    break;

    case "history":
        manualReferenceUrl = baseManualUrl + "History";
    break;

    case "item_db":
        manualReferenceUrl = baseManualUrl + "Database";
    break;

    case "restockListGen":
        manualReferenceUrl = baseManualUrl + "Restock-List-Generator";
    break;

    case "info":
        manualReferenceUrl = baseManualUrl + "Export-&-Load-Settings-Presets";
    break;

    case "mail":
        manualReferenceUrl = baseManualUrl + "Mail";
    break;
}

// content.js
function InjectToolbar() {
    const toolbarHTML = `
    <div class="toolbar">
        <div class = "toolbar-pattern"></div>
        <span class="github-btn">
            <button class="gh-btn" data-href="https://github.com/Unovamata/AutoBuyerPlus" aria-label="Star Unovamata/https://github.com/Unovamata/AutoBuyerPlus On Github">
                <span class="gh-ico" aria-hidden="true"></span>
                <!--<span class="gh-text">Star</span>-->
            </button>
        </span>
        <span class="github-btn">
            <button class="gh-btn" data-href="https://www.buymeacoffee.com/unovamata" aria-label="Buy Me A Coffee">
                <span class="gh-ico coffee-ico" aria-hidden="true"></span>
                <!--<span class="gh-text">Donate</span>-->
            </button>
        </span>
        <span class="github-btn">
            <button class="gh-btn" data-href="https://discord.gg/USnT8ayRE6" aria-label="Star Unovamata/https://github.com/Unovamata/AutoBuyerPlus On Github">
                <span class="gh-ico discord-ico" aria-hidden="true"></span>
                <!--<span class="gh-text">Star</span>-->
            </button>
        </span>

        <img class="logo" src="${logoUrl}"></img>

        <div class = "toolbar-text">
            <div class="toolbar-category">
                <a>
                    <img class="toolbar-icon" src="${buyersIconUrl}">
                    AutoBuyers
                    <img  class = "dropdown-arrow" src="${dropdownIconUrl}">
                </a>
                <div class="hover-menu">
                    <ul>
                        <li>
                            <a href="${autobuyerUrl}" class = "toolbar-category dropdown-category">
                                <img  class = "dropdown-icon" src="${shopIconUrl}"> 
                            AutoBuyer </a>
                        </li>
                        <li><a href="${atticUrl}" class = "toolbar-category dropdown-category">
                            <img  class = "dropdown-icon" src="${atticIconUrl}"> 
                            AutoAttic </a>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="toolbar-category">
                <a>
                    <img class="toolbar-icon" src="${swIconUrl}">
                    AutoSW
                    <img  class = "dropdown-arrow" src="${dropdownIconUrl}">
                </a>
                <div class="hover-menu">
                    <ul>
                        <li>
                            <a href="${autopricerUrl}" class = "toolbar-category dropdown-category">
                                <img  class = "dropdown-icon" src="${npIconUrl}"> 
                            AutoPricer </a>
                        </li>
                        <li><a href="${autoKQURL}" class = "toolbar-category dropdown-category">
                            <img  class = "dropdown-icon" src="${tpIconUrl}"> 
                            AutoKQ </a>
                        </li>
                    </ul>
                </div>
            </div>

            <!--<a href="${autosdbUrl}" class = "toolbar-category"> 
                <img  class = "toolbar-icon" src="${sdbIconUrl}"> 
            AutoSDB </a>-->

            <div class="toolbar-category">
                <a>
                    <img class="toolbar-icon" src="${toolsIconUrl}">
                    Tools
                    <img  class = "dropdown-arrow" src="${dropdownIconUrl}">
                </a>
                <div class="hover-menu">
                    <ul>
                        <li>
                            <a href="${historyUrl}" class = "toolbar-category dropdown-category"> 
                                <img  class = "dropdown-icon" src="${historyIconUrl}"> 
                                History 
                            </a>
                        </li>
                        <li><a href="${databaseUrl}" class = "toolbar-category dropdown-category">
                            <img  class = "dropdown-icon" src="${databaseIconUrl}"> 
                            Database </a>
                        </li>
                        <li>
                            <a href="${restockListUrl}" class = "toolbar-category dropdown-category">
                                <img  class = "dropdown-icon" src="${restockListIconUrl}"> 
                                Restock List
                            </a>
                        </li>
                        <li>
                            <a href="${infoUrl}" class = "toolbar-category dropdown-category">
                                <img  class = "dropdown-icon" src="${suggestionsUrl}"> 
                                Config Presets
                            </a>
                        </li>
                        <li>
                            <div class="hover-submenu">
                                <ul>
                                    <a href="https://github.com/Unovamata/AutoBuyerPlus/wiki/FAQs" rel="noopener noreferrer" target="_blank" class = "toolbar-category dropdown-category"> 
                                        <img  class = "dropdown-icon" src="${infoIconUrl}"> 
                                        FAQs 
                                    </a>
                                    <a href="https://github.com/Unovamata/AutoBuyerPlus/issues" rel="noopener noreferrer" target="_blank" class = "toolbar-category dropdown-category"> 
                                        <img  class = "dropdown-icon" src="${bugUrl}"> 
                                        Bug Report 
                                    </a>
                                    <a href="https://github.com/Unovamata/AutoBuyerPlus/issues/1" rel="noopener noreferrer" target="_blank" class = "toolbar-category dropdown-category"> 
                                        <img  class = "dropdown-icon" src="${suggestionsUrl}"> 
                                        Suggestions
                                    </a>
                                    <a href="https://github.com/Unovamata/AutoBuyerPlus/wiki/Credits" rel="noopener noreferrer" target="_blank" class = "toolbar-category dropdown-category">
                                        <img  class = "dropdown-icon" src="${creditsIconUrl}"> 
                                        Credits
                                    </a>
                                </ul>
                            </div>

                            <a class = "toolbar-category dropdown-category"> 
                                <img  class = "dropdown-icon" src="${toolsIconUrl}"> 
                                Github 
                                <img  class = "dropleft-arrow" src="${dropdownIconUrl}">
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <a href="${mailUrl}" class = "toolbar-category">
                <img class="toolbar-icon" src="${mailIconUrl}">
                <span class="notification-dot"></span>
            Mail </a>
        </div>
    </div>

    <div class="manual-container-bottom">
        <button class="manual-button">
            <a href="${manualReferenceUrl}" rel="noopener noreferrer" target="_blank" class = "toolbar-category dropdown-category"> 
                <img class="manual-img" src="${manualIconUrl}"> 
                <div class="button-description-manual">User Manual</div>
            </a>
        </button>
    </div>

    <div class="toolbar-bottom">
        <span class = "notice-text">This extension is not affiliated to Neopets. Names are owned by Neopets. The software is provided as-is. Use it wisely to avoid freezes with your Neopet account(s).</span>
        <span class = "version-text">${chrome.runtime.getManifest().version}v</span>
    </div>
    `;

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
    
    try { InjectExternalScript(`${srcPath}/inject/AES.js`); } catch {}

    document.querySelectorAll('.github-btn button').forEach(button => {
        button.addEventListener('click', function() {
            const url = this.getAttribute('data-href');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
}

// Wait for the entire page, including CSS, to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    InjectToolbar();

    chrome.storage.local.get({ WARNING_ACK: false }, function (result) {
        if(!result.WARNING_ACK){
            var toolbarElements = document.getElementsByClassName("toolbar-category");

            // Convert the collection to an array and then iterate over it
            Array.from(toolbarElements).forEach(function(menu){
                menu.style.display = "none";
            });
        }
    });

    UpdateNotification();

    FormatDangerTooltips();
});


//######################################################################################################################################


const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

var successColor = "#2196F3";
var errorColor = "#f22046";
var warningColor = "#ff8214";

async function UpdateNotification(){
    const currentDate = new Date();
    const parsedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDay()}, ${currentDate.getFullYear()}`;
    
    try{
        // Checking the latest version of the extension daily;
        var date = await getVARIABLE("UPDATE_DATE");
        var hasDoneDailyVersionCheck = date === parsedDate;
        var status = await getVARIABLE("UPDATE_STATUS_A");

        if(hasDoneDailyVersionCheck && status || location.href.includes("warning")){
            return;
        }

        if(status){
            CreateNotificationElement(status, successColor);
            setVARIABLE("UPDATE_DATE", parsedDate);
        } else {
            // If the version checker has not been run, check the latest version of the extension;
            CreateNotificationElement(status, errorColor, "NeoBuyer+ Update Required", crossIconUrl, true, "update-notification-full", [await getVARIABLE("UPDATE_VERSION"), chrome.runtime.getManifest().version + "v"]);
        }

        // Check for new NeoBuyer+ mail updates;
        CheckNewMail();
    } catch {}
    
}

var notifications = 0;

function CreateNotificationElement(isLatestVersion, color, text = "NeoBuyer+ is up to Date!", imageSrc = checkIconUrl, isOutdated = false, classToolbar = "update-notification", versions = []){
    setTimeout(async () => {
        if(versions[0] == "") return;

        const updateNotification = document.createElement("span");
        updateNotification.className = classToolbar;
        notifications += 2; // For time delays per notifications;

        // Creating the image component;
        const updateImage = document.createElement("img");
        updateImage.className = "valid-version-image";
        updateImage.src = imageSrc;

        // Setting the update status;
        const updateStatus = document.createElement("a");
        updateStatus.className = "update-status";

        const versionStatus = versions[0],
            isVersionValid = versionStatus != 'a' && versionStatus != 'b',
            isConnectivityIssue = versionStatus == 'a',
            isUnknownError = versionStatus == 'b';

        const updateTitle = document.createElement("a");
        updateTitle.className = "update-title";
        if(isVersionValid) updateTitle.textContent = text;
        else if(isConnectivityIssue) updateTitle.textContent = "Connectivity Issues";
        else if(isUnknownError) updateTitle.textContent = "Unknown Error";

        

        updateStatus.appendChild(updateTitle);

        updateNotification.style.backgroundColor = color;

        // For outdated versions of the extension;
        if(isOutdated){
            updateImage.className = "update-image";

            updateStatus.appendChild(document.createElement("br"));

            if(isVersionValid){
                CreateMessage(`You are currently using an older version of NeoBuyer+. The latest version available is ${versions[0]}, whereas you are currently using version ${versions[1]}.`);
                CreateMessage(`We advise you to update to the latest version as soon as possible. These updates contain critical fixes or optimizations that allow NeoBuyer+ to become undetectable to TNT. `);
                CreateMessage(`Please take the necessary steps to update NeoBuyer+ to the latest version to continue enjoying its features seamlessly and securely. NeoBuyer+'s usage has been locked until said update occurs.`);
                CreateMessage(`Thank you for your attention to this matter.`);
            } else if(isConnectivityIssue){
                CreateMessage(`There was an issue trying to reach out to NeoBuyer+'s version check API servers.`);
                CreateMessage(`Ensure you have a stable internet connection and refresh the extension data in the "Extensions" Chromium page. NeoBuyer+'s usage has been locked for your safety.`);
                CreateMessage(``);
                CreateMessage(`Thank you for your attention to this matter.`);
            } else if(isUnknownError){
                var error = await getVARIABLE("ERROR_STATUS");  

                CreateMessage(`There was an issue while trying to initialize the extension. Please refresh the extension data in the "Extensions" Chromium page.`);
                CreateMessage(`Please report a bug pasting this error:`);
                CreateMessage(`${error}`);
                CreateMessage(`Thank you for your attention to this matter.`);
            }
            
            updateStatus.appendChild(document.createElement("br"));

            if(!isVersionValid) URLText("https://github.com/Unovamata/AutoBuyerPlus/issues", "Click Here to Report a Bug");

            URLText("https://github.com/Unovamata/AutoBuyerPlus/wiki/FAQs#1-how-can-i-update-neobuyer-correctly", 
            "Click Here to Learn How to Update NeoBuyer+ Correctly");

            if(isVersionValid) URLText("https://github.com/Unovamata/AutoBuyerPlus/releases/latest", "Click Here to Update NeoBuyer+");

            ExtensionLock();

            function ExtensionLock(){
                document.querySelector('.center').remove();
                document.querySelector('.toolbar').remove();
                document.querySelector('.toolbar-bottom').remove();    
                document.querySelector('.manual-container-bottom').remove();    
            }           

            function URLText(url, text){
                updateStatus.appendChild(document.createElement("br"));
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.textContent = text;
                link.style.fontSize = "2.5vw";
                updateStatus.appendChild(link);
                updateStatus.appendChild(document.createElement("br"));
            }
        }

        updateNotification.appendChild(updateStatus);
        updateNotification.appendChild(updateImage);
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

        function CreateMessage(message){
            updateStatus.appendChild(document.createElement("br"));
            const messageElement = document.createElement("a");
            messageElement.className = "update-message";
            messageElement.textContent = message;
            updateStatus.appendChild(messageElement);
            updateStatus.appendChild(document.createElement("br"));
        }
    }, 1500 * notifications);
}

const emailCheckURL = "https://raw.githubusercontent.com/Unovamata/AutoBuyerPlus/main/Autobuyer/Mail/MailDocument.html";
var mailSuccessColor = "#20f36a";

// Checks for new NeoBuyer+ mails daily;
function CheckNewMail(){
    // Fetching the data from the URL to check for new mails;
    fetch(emailCheckURL)
    .then(response => response.text())
    .then(async htmlContent => {
        const parser = new DOMParser();
        const githubDocument = parser.parseFromString(htmlContent, 'text/html');

        // Reading the email contents;
        var ID = githubDocument.getElementById("id").textContent;
        var author = githubDocument.getElementById("author").textContent;
        var date = githubDocument.getElementById("date").textContent;
        var subject = githubDocument.getElementById("subject").textContent;
        var title = githubDocument.getElementById("title").innerHTML;
        var contents = githubDocument.getElementById("contents").innerHTML;
        var read = false;
        
        var extractedEmail = new Email(0, ID, author, date, subject, title, contents, read);

        var emailList = await getVARIABLE("EMAIL_LIST");

        const hasEmail = emailList.some(email => email.ID === ID);

        if (!hasEmail) {
            var skipCurrentEmail = await getVARIABLE("SKIP_CURRENT_MAIL");
            var currentIndex = await getVARIABLE("CURRENT_MAIL_INDEX");

            // If the user opted-out from receiving the current message active;
            if(ID != currentIndex){
                setVARIABLE("SKIP_CURRENT_MAIL", false);
                setVARIABLE("CURRENT_MAIL_INDEX", currentIndex);
            } else {
                if(skipCurrentEmail) return;
            }

            // Notificate the user for new mails while also updating the mail list;
            CreateNotificationElement(true, mailSuccessColor, "You've Got Mail!");
            extractedEmail.Entry = emailList.length + 1;
            emailList.unshift(extractedEmail);
            setVARIABLE("EMAIL_LIST", emailList);
        }
    }).catch(error => {
        console.error("An error ocurred during the execution... Try again later...", error);
    });
}

// Activates the red dot notification whenever a new mail arrives;
async function ActivateNewMailNotification(){
    try{
        var emailList = await getVARIABLE("EMAIL_LIST");

        const isUnread = emailList.some(email => email.Read === false);
        var notification = document.getElementsByClassName("notification-dot")[0];

        if(isUnread) notification.style.visibility = "visible";
        else notification.style.visibility = "hidden";
    } catch {}
}

setInterval(ActivateNewMailNotification, 500);

function FormatDangerTooltips(){
    if(location.href.includes("info.html")) return;

    var dangerElements = document.getElementsByClassName("dangertooltip");

    Array.from(dangerElements).forEach(function(element){
        const span = document.createElement("span");

        // Create the text node for the span
        const textNode = document.createTextNode("Although inoffensive, Neopets can possibly detect the use of NeoBuyer+ through this feature.");

        // Create the <a> element
        const anchor = document.createElement("a");
        anchor.textContent = "Activate this option at your own risk.";

        // Append the text node to the span
        span.appendChild(textNode);

        // Append the <br>, span, and <a> elements to another element with id "container"
        element.appendChild(document.createElement("br"));
        element.appendChild(document.createElement("br"));
        element.appendChild(span);
        element.appendChild(document.createElement("br"));
        element.appendChild(document.createElement("br"));
        element.appendChild(anchor);
    });
}