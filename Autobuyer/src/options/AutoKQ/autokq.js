function getSTART_AUTOKQ_PROCESS(callback) {
    chrome.storage.local.get(['START_AUTOKQ_PROCESS'], function (result) {
        const value = result.START_AUTOKQ_PROCESS;

        if (typeof callback === 'function') {
        callback(value);
        }
    });
}

//######################################################################################################################################


const statusTag = document.getElementById("status-tag");
const loadingIcon = document.getElementById("loading");

getAUTOKQ_STATUS(function (status){
    ShowOrHideLoading(status);
    statusTag.textContent = status;
});

// Checks constantly if the inventory page needs to update;
function UpdateGUIData() {
    getAUTOKQ_STATUS(function (status){
        ShowOrHideLoading(status);
        statusTag.textContent = status;
    });
}

function ShowOrHideLoading(status){
    loadingIcon.style.width = '1.6%';
    loadingIcon.style.height = '1.6%';

    if(status.includes("Complete") || status.includes("Inactive") || status.includes("Updated!") || status.includes("Sleep") || status.includes("Stopped")){
        loadingIcon.style.visibility = 'hidden';
    } else {
        loadingIcon.style.visibility = 'visible';
    }
}

// Updates the page's data every half a second when opened and needed;
setInterval(UpdateGUIData, 500);



//######################################################################################################################################


const startAutoPricingButton = document.getElementById("start");
startAutoPricingButton.addEventListener('click', StartAutoKQ);

var autoPricingList = [];

function StartAutoKQ(){
    setSTART_INVENTORY_PROCESS(false);
    setSTART_INVENTORY_PROCESS(false);
    setSUBMIT_PRICES_PROCESS(false);
    setSTART_AUTOPRICING_PROCESS(false);
    setSTART_AUTOKQ_PROCESS(true);
    setAUTOKQ_STATUS("Navigating to the KQ Page...");

    chrome.tabs.create({ url: 'https://www.neopets.com/island/kitchen.phtml', active: false });

    setAUTOKQ_STATUS("AutoKQ Process Running...");
}

const cancelAutoPricingButton = document.getElementById("cancel");
cancelAutoPricingButton.addEventListener('click', CancelAutoPricer);

function CancelAutoPricer(){
    if(confirm("Do you want to terminate the current AutoPricer process?")){
        setSTART_AUTOPRICING_PROCESS(false);
        setAUTOPRICER_INVENTORY([]);
        setCURRENT_PRICING_INDEX(0);
        setSUBMIT_PRICES_PROCESS(false);
        setNEXT_PAGE_INDEX(0);

        setSTART_AUTOKQ_PROCESS(false);
        setAUTOKQ_STATUS("Inactive");
    }
}

function HideKQButtons(){
    getSTART_AUTOKQ_PROCESS(function (isActive) {
        if(isActive){
            startAutoPricingButton.style.display = "none";
            cancelAutoPricingButton.style.display = "inline";
        } else {
            cancelAutoPricingButton.style.display = "none";
            startAutoPricingButton.style.display = "inline";
        }
    });
}

setInterval(HideKQButtons, 100);


//######################################################################################################################################


const stockContainer = document.getElementById('shop-stock-container');
const optionsContainer = document.getElementById('autopricer-options-container');


//######################################################################################################################################