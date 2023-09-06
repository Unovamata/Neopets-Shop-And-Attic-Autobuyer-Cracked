function setSTART_AUTOPRICING_PROCESS(value) {
    chrome.storage.local.set({ START_AUTOPRICING_PROCESS: value }, function () {});
}

function getSTART_AUTOPRICING_PROCESS(callback) {
    chrome.storage.local.get(['START_AUTOPRICING_PROCESS'], function (result) {
        const value = result.START_AUTOPRICING_PROCESS;

        if (typeof callback === 'function') {
        callback(value);
        }
    });
}

var startProcessButton = document.getElementById("start");

startProcessButton.onclick = function(_) {
    confirmReset();
}

function confirmReset() {
    if (confirm("Do you want to start the shop auto pricing process")) {
        StartAutoPricingProcess();
    }
}

function StartAutoPricingProcess(){
    setSTART_AUTOPRICING_PROCESS(true);
}