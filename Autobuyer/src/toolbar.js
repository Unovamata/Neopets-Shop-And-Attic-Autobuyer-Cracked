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
const baseManualUrl = "https://github.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/wiki/";
var manualReferenceUrl = "";

switch(pageName){
    case "autobuyer":
        manualReferenceUrl = baseManualUrl + "AutoBuyer";
    break;

    case "attic":
        manualReferenceUrl = baseManualUrl + "AutoAttic";
    break;

    case "autopricer":
        //manualReferenceUrl = baseManualUrl + "AutoAttic";
    break;

    case "autokq":
        //manualReferenceUrl = baseManualUrl + "AutoAttic";
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
        //manualReferenceUrl = baseManualUrl + "Export-&-Load-Settings-Presets";
    break;
}

// content.js
function InjectToolbar() {
    const toolbarHTML = `
    <div class="toolbar">
        <div class = "toolbar-pattern"></div>
        <span class="github-btn">
            <a class="gh-btn" href="https://github.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked" rel="noopener noreferrer" target="_blank" aria-label="Star Unovamata/https://github.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked On Github">
                <span class="gh-ico" aria-hidden="true"></span>
                <span class="gh-text">Star</span>
            </a>
        </span>
        <span class="github-btn">
            <a class="gh-btn" href="https://www.buymeacoffee.com/unovamata" rel="noopener noreferrer" target="_blank" aria-label="Buy Me A Coffee">
                <span class="coffee-ico" aria-hidden="true"></span>
                <span class="gh-text">Donate</span>
            </a>
        </span>

        <img class="logo" src="${logoUrl}"></img>

        <div class = "toolbar-text">
            <div class="toolbar-category">
                <a>
                    <img class="toolbar-icon" src="${shopIconUrl}">
                    AutoBuyers
                    <img  class = "dropdown-arrow" src="${dropdownIconUrl}">
                </a>
                <div class="hover-menu">
                    <ul>
                        <li>
                            <a href="${autobuyerUrl}" class = "toolbar-category dropdown-category">
                                <img  class = "dropdown-icon" src="${buyersIconUrl}"> 
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
                                    <a href="https://github.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/wiki/FAQs" rel="noopener noreferrer" target="_blank" class = "toolbar-category dropdown-category"> 
                                        <img  class = "dropdown-icon" src="${infoIconUrl}"> 
                                        FAQs 
                                    </a>
                                    <a href="https://github.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/issues" rel="noopener noreferrer" target="_blank" class = "toolbar-category dropdown-category"> 
                                        <img  class = "dropdown-icon" src="${bugUrl}"> 
                                        Bug Report 
                                    </a>
                                    <a href="https://github.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/issues/10" rel="noopener noreferrer" target="_blank" class = "toolbar-category dropdown-category"> 
                                        <img  class = "dropdown-icon" src="${suggestionsUrl}"> 
                                        Suggestions
                                    </a>
                                    <a href="https://github.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/wiki/Credits" rel="noopener noreferrer" target="_blank" class = "toolbar-category dropdown-category">
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

function UpdateNotification(){
    const currentDate = new Date();
    const parsedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDay()}, ${currentDate.getFullYear()}`;
    //setUPDATE_DATE(""); //DEBUG!!!!

    try{
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

            switch(parsedVersion){
                // Github's API can't be reached;
                case 'a':
                    CreateNotificationElement(isLatestVersion, errorColor, "NeoBuyer+ API Can't Be Reached...", crossIconUrl, true, "update-notification-full", [githubLatestVersion, currentVersion + "v"]);
                    isLatestVersion = false; // It can be the latest version for all we know;
                break;

                // Unknown error;
                case 'b':
                    CreateNotificationElement(isLatestVersion, errorColor, "NeoBuyer+ Update Checker Failed...", crossIconUrl, true, "update-notification-full", [githubLatestVersion, currentVersion + "v"]);
                    isLatestVersion = false; // It can be the latest version for all we know;
                break;

                // Normal version checking;
                default:
                    if(isLatestVersion){
                        CreateNotificationElement(isLatestVersion, successColor);
                        setUPDATE_DATE(parsedDate);
                    } else {
                        CreateNotificationElement(isLatestVersion, errorColor, "NeoBuyer+ Update Required", crossIconUrl, true, "update-notification-full", [githubLatestVersion, currentVersion + "v"]);
                    }
                break;
            }

            // Check for new NeoBuyer+ mail updates;
            CheckNewMail();
        });
    } catch {}
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

var notifications = 0;

function CreateNotificationElement(isLatestVersion, color, text = "NeoBuyer+ is up to Date!", imageSrc = checkIconUrl, isOutdated = false, classToolbar = "update-notification", versions = []){
    setTimeout(() => {
        const updateNotification = document.createElement("span");
        updateNotification.className = classToolbar;
        notifications += 1.5; // For time delays per notifications;

        // Creating the image component;
        const updateImage = document.createElement("img");
        updateImage.className = "valid-version-image";
        updateImage.src = imageSrc;

        // Setting the update status;
        const updateStatus = document.createElement("a");
        updateStatus.className = "update-status";

        const updateTitle = document.createElement("a");
        updateTitle.className = "update-title";
        updateTitle.textContent = text;
        updateStatus.appendChild(updateTitle);

        updateNotification.style.backgroundColor = color;

        // For outdated versions of the extension;
        if(isOutdated){
            updateImage.className = "update-image";

            updateStatus.appendChild(document.createElement("br"));
            CreateMessage(`You are currently using an older version of NeoBuyer+. The latest version available is ${versions[0]}, whereas you are currently using version ${versions[0]}.`);
            CreateMessage(`We advise you to update to the latest version as soon as possible. These updates contain critical fixes or optimizations that allow NeoBuyer+ to become undetectable to TNT. `);
            CreateMessage(`Please take the necessary steps to update NeoBuyer+ to the latest version to continue enjoying its features seamlessly and securely. NeoBuyer+'s usage has been locked until said update occurs.`);
            CreateMessage(`Thank you for your attention to this matter.`);
            updateStatus.appendChild(document.createElement("br"));

            updateStatus.appendChild(document.createElement("br"));
            const updateLink = document.createElement("a");
            updateLink.href = "https://github.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/releases/latest";
            updateLink.textContent = "Click Here to Update NeoBuyer+";
            updateLink.style.fontSize = "2.5vw";
            updateStatus.appendChild(updateLink);

            document.querySelector('.center').remove();
            document.querySelector('.toolbar').remove();
            document.querySelector('.toolbar-bottom').remove();          
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

const emailCheckURL = "https://raw.githubusercontent.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/main/Autobuyer/src/options/Mail/MailDocument.html";
var mailSuccessColor = "#20f36a";

// Checks for new NeoBuyer+ mails daily;
function CheckNewMail(){
    // Fetching the data from the URL to check for new mails;
    fetch(emailCheckURL)
    .then(response => response.text())
    .then(htmlContent => {
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

        getEMAIL_LIST(function (emailList){
            const hasEmail = emailList.some(email => email.ID === ID);

            if (!hasEmail) {
                getSKIP_CURRENT_MAIL(function(skipCurrentEmail){
                    getCURRENT_MAIL_INDEX(function (currentIndex){
                        // If the user opted-out from receiving the current message active;
                        if(ID != currentIndex){
                            setSKIP_CURRENT_MAIL(false);
                            setCURRENT_MAIL_INDEX(currentIndex);
                        } else {
                            if(skipCurrentEmail) return;
                        }

                        // Notificate the user for new mails while also updating the mail list;
                        CreateNotificationElement(true, mailSuccessColor, "You've Got Mail!");
                        extractedEmail.Entry = emailList.length + 1;
                        emailList.unshift(extractedEmail);
                        setEMAIL_LIST(emailList);
                    });
                })
            }
        });
    }).catch(error => {
        console.error("An error ocurred during the execution... Try again later...", error);
    });
}

// Activates the red dot notification whenever a new mail arrives;
function ActivateNewMailNotification(){
    try{
        getEMAIL_LIST(function (emailList){
            const isUnread = emailList.some(email => email.Read === false);
            var notification = document.getElementsByClassName("notification-dot")[0];
    
            if(isUnread) notification.style.visibility = "visible";
            else notification.style.visibility = "hidden";
        });
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