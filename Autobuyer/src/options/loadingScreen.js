// Create the loading screen div
const loadingScreen = document.createElement("div");
loadingScreen.id = "loading-screen";

// Create the loading contents div
const loadingContents = document.createElement("div");
loadingContents.className = "loading-contents";

// Create the loading logo image
const loadingLogo = document.createElement("img");
loadingLogo.className = "loading-logo";
// Get the URL of the current script and Extract the part before "src"
var currentScriptUrl = document.currentScript.src;
var logoPath = currentScriptUrl.substring(0, currentScriptUrl.indexOf("src") + 3);
loadingLogo.src = `${logoPath}/logo.png`;

loadingContents.appendChild(loadingLogo);
loadingScreen.appendChild(loadingContents);

// Create the loading bar container div
var isInWarningPage = window.location.href.includes("warning");

if(!isInWarningPage){
    const loadingBarContainer = document.createElement("div");
    loadingBarContainer.className = "loading-bar-container";

    // Create the loading bar div
    const loadingBar = document.createElement("div");
    loadingBar.className = "loading-bar";
    loadingBar.id = "loading-bar";

    // Append elements to their parent elements
    loadingBarContainer.appendChild(loadingBar);
    loadingContents.appendChild(loadingBarContainer);
}

// Append the loading screen to the document body
document.body.appendChild(loadingScreen);

var pageProgress = 0;
var intervalID = null;

// Load the notifications as soon as the page has finished loading;
document.addEventListener("DOMContentLoaded", function () {
    LoadingScreen();
});

function LoadingScreen(){
    const loadingBar = document.getElementById("loading-bar");
    const loadingScreen = document.getElementById("loading-screen");
    const totalResources = CountResources(); // Function to count total resources

    function CountResources() {
        const totalLinks = document.querySelectorAll("link").length;
        const totalScripts = document.querySelectorAll("script").length;
        const totalImages = document.querySelectorAll("img").length;
        return totalLinks + totalScripts + totalImages;
    }

    var loadedResources = 0;

    function UpdateLoadingProgress() {
        loadedResources++;
        pageProgress = (loadedResources / totalResources) * 100;

        if(!isInWarningPage) loadingBar.style.width = Clamp(pageProgress, 0, 99.4) + "%";
        

        // Check if all resources have been loaded
        if (loadedResources >= totalResources) {
            clearInterval(intervalID); // Stop the interval
            loadingScreen.classList.add("loading-fade-out");
            document.getElementsByClassName("center")[0].style.opacity = 1;
            document.body.style.backgroundColor = "white";
        }
    }

    intervalID = setInterval(UpdateLoadingProgress, 2);
}

function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}