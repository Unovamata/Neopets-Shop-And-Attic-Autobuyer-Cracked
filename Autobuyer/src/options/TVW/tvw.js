CheckIfUserLoadedPets();

// CheckIfUserLoadedPets(); Loading pets & GUI Load Pets Button;
async function CheckIfUserLoadedPets(){
    var ownedPets = await getVARIABLE("OWNED_PETS");

    if(ownedPets == undefined){
        setVARIABLE("OWNED_PETS", []);
        ownedPets = [];
    }

    const ownedPetsSelector = $("#OWNED_PETS");

    if(ownedPets.length == 0){
        var loadPetDataButton = $("#loadPetData").clone();
        loadPetDataButton.find(':first-child').removeClass("autobuyerButton").addClass("volunteerButton");
        ownedPetsSelector.parent().append(loadPetDataButton);
        ownedPetsSelector.remove();
        loadPetDataButton.on('click', StartLoadOwnedPetsProcess);

        setInterval(async function(){
            ownedPets = await getVARIABLE("OWNED_PETS");

            if(ownedPets.length > 0){
                location.reload();
            }
        }, 1000);
    }
}

//////////////////////////////////////////////////////////////////////////////


// Navigating to Quickref Page for Pet Loading;
const loadPetsButton = document.getElementById("loadPetData"),
      volunteerSelector = $("#OWNED_PETS");

loadPetsButton.addEventListener('click', StartLoadOwnedPetsProcess);

async function StartLoadOwnedPetsProcess(){
    setVARIABLE("IS_LOADING_PETS", true);

    setVARIABLE("TVW_STATUS", "Navigating to Quickref Page...");

    chrome.tabs.create({ url: `https://www.neopets.com/quickref.phtml`, active: true });
}


//////////////////////////////////////////////////////////////////////////////


ProcessVolunteerData();

// Handle the Volunteer information in the GUI to translate it to the Volunteer Centre page.
async function ProcessVolunteerData() {
    // Selectors
    var timerContainer = document.querySelector('.timeContainer');

    var volunteerPetContainer = document.querySelector('.volunteerPet');
    const volunteerSelector = document.querySelector('#OWNED_PETS');
    const removeVolunteerButton = document.querySelector('.removeVolunteer');
    const insertVolunteerButton = document.querySelector('.insertVolunteer');

    var ownedPets = await getVARIABLE("OWNED_PETS");
    var volunteerPets = await getVARIABLE("VOLUNTEER_PETS");

    // LoadOwnedPets(); Loading the information in the pet select fields;
    function LoadOwnedPets() {
        // Loading the pet names in the pet select fields;
        ownedPets.forEach(petName => {
            const optionElement = document.createElement("option");
            optionElement.value = petName;
            optionElement.textContent = petName;
            volunteerSelector.appendChild(optionElement);
        });

        LoadVolunteerPetsInSelectFields();

        // Remove the base elements to place the script generated ones;
        if(ownedPets.length > 0){
            volunteerPetContainer.remove();
            timerContainer.remove();
        } 

        volunteerPetContainer = document.querySelector('.volunteerPet');
        timerContainer = document.querySelector('.timeContainer');

        ElementEventHandler();
    }

    //LoadVolunteerPetsInSelectFields(); Load the volunteer pets data to the initial load GUI;
    function LoadVolunteerPetsInSelectFields() {
        if(volunteerPets.length == 0 && ownedPets.length > 0){
            setVARIABLE("VOLUNTEER_PETS", [ownedPets[0]]);
            window.location.reload();
        }

        volunteerPets.forEach(function(petName, index) {
            // Create the timers and pet select fields;
            const clonedVolunteerPet = volunteerPetContainer.cloneNode(true);
            const select = clonedVolunteerPet.querySelector('select');
            select.value = petName;
            volunteerPetContainer.parentElement.appendChild(clonedVolunteerPet);

            const clonedTimer = timerContainer.cloneNode(true);
            timerContainer.parentElement.appendChild(clonedTimer);
        });
    }

    // ElementEventHandler(); Manages selection box creation & events;
    function ElementEventHandler() {
        // Create new pet select boxes;
        insertVolunteerButton.addEventListener("click", async function() {
            volunteerPets = await getVARIABLE("VOLUNTEER_PETS");
            ownedPets = await getVARIABLE("OWNED_PETS");

            // Limit the amount of select boxes based on the number of owned pets;
            if (volunteerPets.length >= ownedPets.length) return;

            // Cloning select boxes;
            const clonedVolunteerPet = volunteerPetContainer.cloneNode(true);
            volunteerPetContainer.parentElement.appendChild(clonedVolunteerPet);

            // Cloning timers;
            const clonedTimer = timerContainer.cloneNode(true);
            clonedTimer.querySelector(".tvwDatetime").value = "";
            timerContainer.parentElement.appendChild(clonedTimer);
            
            ExtractPetVolunteerData();

            console.log(volunteerPets.length, ownedPets.length);
            
            UpdateEventListeners();
        });

        // Delete existing pet select boxes;
        removeVolunteerButton.addEventListener("click", function() {
            // Selectors;
            const volunteerPets = document.querySelectorAll('.volunteerPet'),
                  timers = document.querySelectorAll('.timeContainer'),

                  // Timer selection;
                  index = volunteerPets.length - 1;
                  input = timers[index].querySelector(".tvwDatetime");

            // If the user will not delete an important row; delete it;
            if (volunteerPets.length > 1 && input.value == "") {
                volunteerPets[volunteerPets.length - 1].remove();
                timers[volunteerPets.length - 1].remove();
            }

            ExtractPetVolunteerData();

            UpdateEventListeners();
        });

         // Add listener to initial select elements;
        UpdateEventListeners();
    }

    // UpdateEventListeners(); Manages the behavior of all select boxes;
    function UpdateEventListeners() {
        const volunteers = Array.from(document.querySelectorAll(".volunteerPet"));

        try{
            volunteers.forEach(function(volunteer){
                const select = volunteer.querySelector("select");
    
                // If the data of a select box changes, save the pet volunteer data;
                select.addEventListener('change', function() {
                    ExtractPetVolunteerData();
                });
            });
        } catch {}
    }

    // ExtractPetVolunteerData(); Save the volunteer data;
    function ExtractPetVolunteerData() {
        const petVolunteers = Array.from(document.querySelectorAll(".volunteerPet"));
        const pets = petVolunteers.map(element => element.querySelector("select").value);
        setVARIABLE("VOLUNTEER_PETS", pets);
    }

    // Save the pet volunteer data on window close;
    window.addEventListener('beforeunload', function (event) {
        ExtractPetVolunteerData();
    });

    
    LoadOwnedPets();
}


//////////////////////////////////////////////////////////////////////////////


// Starting the volunteering process;
const startProcessButton = document.getElementById("startVolunteerProcess");
startProcessButton.addEventListener('click', StartVolunteerProcess);

// StartVolunteerProcess(); Open the volunteering tab and start the bot;
async function StartVolunteerProcess(){
    setVARIABLE("TVW_STATUS", "Navigating to Quickref Page...");
    setVARIABLE("IS_RUNNING_TVW_PROCESS", true);

    var selectedPet = await getVARIABLE("VOLUNTEER_PETS");

    if(selectedPet != undefined) chrome.tabs.create({ url: `https://www.neopets.com/hospital/volunteer.phtml`, active: true });
}


//////////////////////////////////////////////////////////////////////////////


// Cancelling up the Volunteering Process;
const cancelProcessButton = document.getElementById("cancelVolunteerProcess");
cancelProcessButton.addEventListener('click', CancelVolunteerProcess);

// CancelVolunteerProcess(); Cancel the volunteering process;
function CancelVolunteerProcess(){
    setVARIABLE("IS_RUNNING_TVW_PROCESS", false);
    setVARIABLE("TVW_STATUS", "Inactive");
}


//////////////////////////////////////////////////////////////////////////////


// Bot status messages;
StatusManagement();

var timerContainer = document.querySelector('.timeContainer');

// StatusManagement(); Change the "Status" text in the GUI;
async function StatusManagement(){
    var tvwStatus = await getVARIABLE("TVW_STATUS");

    // Setting a base status;
    if(tvwStatus == undefined){
        tvwStatus = "Inactive";
        setVARIABLE("TVW_STATUS", "Inactive");
    }

    const statusTag = document.getElementById("status-tag");

    ShowOrHideLoading(tvwStatus);
    statusTag.textContent = tvwStatus;

    // Updates constantly the GUI information;
    async function UpdateGUIData() {
        ShowOrHideLoading(tvwStatus);
        statusTag.textContent = tvwStatus;
        tvwStatus = await getVARIABLE("TVW_STATUS");

        var completionTime = await getVARIABLE("VOLUNTEER_TIME"),
            timerContainer = document.querySelectorAll('.tvwDatetime');

        // Updating/Resetting the timers if necessary;
        timerContainer.forEach(async function(timer, index){
            try { 
                var time = completionTime[index];

                if(time == undefined) throw "Error";

                timer.value = FormatTime(new Date(time)); 
            } catch {
                timer.value = ""; 
            }
        });
    }

    // FormatTime(); Formatting the time for the input fields;
    function FormatTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    // Update page data;
    setInterval(function() {
        ManageProcessButtons();
        UpdateGUIData();
    }, 100);
}

// ManageProcessButtons(); Manage GUI Elements;
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