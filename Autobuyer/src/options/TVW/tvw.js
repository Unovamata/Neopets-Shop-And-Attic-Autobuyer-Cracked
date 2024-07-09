StatusManagement();

async function StatusManagement(){
    var tvwStatus = await getVARIABLE("TVW_STATUS");

    if(tvwStatus == undefined){
        tvwStatus = "Inactive";
        setVARIABLE("TVW_STATUS", "Inactive");
    }

    const statusTag = document.getElementById("status-tag");

    ShowOrHideLoading(tvwStatus);
    statusTag.textContent = tvwStatus;

    // Checks constantly if the inventory page needs to update;
    async function UpdateGUIData() {
        ShowOrHideLoading(tvwStatus);
        statusTag.textContent = tvwStatus;
        tvwStatus = await getVARIABLE("TVW_STATUS");
    }

    // Updates the page's data every half a second when opened and needed;
    setInterval(function() {
        ManageProcessButtons();
        UpdateGUIData();
    }, 100);
}

const loadPetsButton = document.getElementById("loadPetData"),
      ownedPetsSelector = $("#OWNED_PETS");

loadPetsButton.addEventListener('click', StartLoadOwnedPetsProcess);

async function StartLoadOwnedPetsProcess(){
    setVARIABLE("IS_LOADING_PETS", true);

    setVARIABLE("TVW_STATUS", "Navigating to Quickref Page...");

    chrome.tabs.create({ url: `https://www.neopets.com/quickref.phtml`, active: true });
}

LoadOwnedPets();

async function LoadOwnedPets(){
    var ownedPets = await getVARIABLE("OWNED_PETS");

    ownedPets.forEach(petName => {
        var optionElement = document.createElement("option");
        optionElement.value = petName;
        optionElement.textContent = petName;
        ownedPetsSelector.append(optionElement);
    });

    var selectedPet = await getVARIABLE("VOLUNTEER_PET");

    if(selectedPet != null){
        ownedPetsSelector.val(selectedPet);

        setVARIABLE("VOLUNTEER_PET", ownedPetsSelector.val());

        ownedPetsSelector.on("change", (async function(){
            setVARIABLE("VOLUNTEER_PET", ownedPetsSelector.val());
        }));
    } else {
        ownedPetsSelector.prop("selectedIndex", 0);

        setVARIABLE("VOLUNTEER_PET", ownedPetsSelector.val());
    }
}

const startProcessButton = document.getElementById("startVolunteerProcess");

startProcessButton.addEventListener('click', StartVolunteerProcess);

async function StartVolunteerProcess(){
    setVARIABLE("TVW_STATUS", "Navigating to Quickref Page...");
    setVARIABLE("IS_RUNNING_TVW_PROCESS", true);

    var selectedPet = await getVARIABLE("VOLUNTEER_PET");

    if(selectedPet != undefined) chrome.tabs.create({ url: `https://www.neopets.com/hospital/volunteer.phtml`, active: true });
}

const cancelProcessButton = document.getElementById("cancelVolunteerProcess");

cancelProcessButton.addEventListener('click', CancelVolunteerProcess);

function CancelVolunteerProcess(){
    setVARIABLE("IS_RUNNING_TVW_PROCESS", false);
    setVARIABLE("TVW_STATUS", "Inactive");
}

async function ManageProcessButtons(){
    var isRunningVolunteerProcess = await getVARIABLE("IS_RUNNING_TVW_PROCESS");

    if(isRunningVolunteerProcess == undefined){
        setVARIABLE("IS_RUNNING_TVW_PROCESS", false);
        isRunningVolunteerProcess = false;
    }

    if(isRunningVolunteerProcess){
        startProcessButton.hidden = true;
        cancelProcessButton.hidden = false;
    } else {
        startProcessButton.hidden = false;
        cancelProcessButton.hidden = true;
    }
}

