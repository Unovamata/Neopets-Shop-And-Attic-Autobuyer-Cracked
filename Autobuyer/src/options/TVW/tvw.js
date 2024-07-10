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

    const ownedPets = await getVARIABLE("OWNED_PETS");
    const volunteerPets = await getVARIABLE("VOLUNTEER_PETS");

    //LoadVolunteerPets(); Load the volunteer pets data to the initial load GUI;
    function LoadVolunteerPets() {
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

    // 
    function LoadOwnedPets() {
        ownedPets.forEach(petName => {
            const optionElement = document.createElement("option");
            optionElement.value = petName;
            optionElement.textContent = petName;
            volunteerSelector.appendChild(optionElement);
        });

        LoadVolunteerPets(); // Create initial volunteerPet elements
        volunteerPetContainer.remove();
        volunteerPetContainer = document.querySelector('.volunteerPet');
        timerContainer.remove();
        timerContainer = document.querySelector('.timeContainer');
        ManageVolunteerTabs(); // Initialize event listeners
    }

    // Function to manage volunteer tabs and event listeners
    function ManageVolunteerTabs() {
        insertVolunteerButton.addEventListener("click", function() {
            if (volunteerPets.length >= ownedPets.length) return; // Prevent adding more than ownedPets

            const clonedVolunteerPet = volunteerPetContainer.cloneNode(true);
            volunteerPetContainer.parentElement.appendChild(clonedVolunteerPet);

            const clonedTimer = timerContainer.cloneNode(true);
            clonedTimer.querySelector(".tvwDatetime").value = "";
            timerContainer.parentElement.appendChild(clonedTimer);
            
            updateEventListeners(); // Update event listeners
        });

        removeVolunteerButton.addEventListener("click", function() {
            const volunteerPets = document.querySelectorAll('.volunteerPet'),
                  timers = document.querySelectorAll('.timeContainer'),
                  index = volunteerPets.length - 1;
                  input = timers[index].querySelector(".tvwDatetime");

            if (volunteerPets.length > 1 && input.value == "") {
                volunteerPets[volunteerPets.length - 1].remove();
                timers[volunteerPets.length - 1].remove();
            }

            updateEventListeners(); // Update event listeners
        });

        updateEventListeners(); // Add listener to initial selects
    }

    // Function to update change event listeners
    function updateEventListeners() {
        const volunteers = Array.from(document.querySelectorAll(".volunteerPet"));
        volunteers.forEach(function(volunteer){
            const select = volunteer.querySelector("select");
            select.addEventListener('change', function() {
                ExtractPetVolunteerData();
            });
        });
    }

    // Function to extract and process volunteer data
    function ExtractPetVolunteerData() {
        const petVolunteers = Array.from(document.querySelectorAll(".volunteerPet"));
        const pets = petVolunteers.map(element => element.querySelector("select").value);
        setVARIABLE("VOLUNTEER_PETS", pets);
    }

    window.addEventListener('beforeunload', function (event) {
        ExtractPetVolunteerData();
    });

    // Initial function call to load owned pets and set up listeners
    LoadOwnedPets();
}


//////////////////////////////////////////////////////////////////////////////

// Setting up the Volunteering Process;
const startProcessButton = document.getElementById("startVolunteerProcess");
startProcessButton.addEventListener('click', StartVolunteerProcess);

// StartVolunteerProcess(); Open the volunteering tab and start the bot;
async function StartVolunteerProcess(){
    setVARIABLE("TVW_STATUS", "Navigating to Quickref Page...");
    setVARIABLE("IS_RUNNING_TVW_PROCESS", true);

    var selectedPet = await getVARIABLE("VOLUNTEER_PETS");

    if(selectedPet != undefined) chrome.tabs.create({ url: `https://www.neopets.com/hospital/volunteer.phtml`, active: true });
}

// Cancelling up the Volunteering Process;
const cancelProcessButton = document.getElementById("cancelVolunteerProcess");
cancelProcessButton.addEventListener('click', CancelVolunteerProcess);

// CancelVolunteerProcess(); Cancel the volunteering process;
function CancelVolunteerProcess(){
    setVARIABLE("IS_RUNNING_TVW_PROCESS", false);
    setVARIABLE("TVW_STATUS", "Inactive");
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

// Bot status messages;

StatusManagement();

var timerContainer = document.querySelector('.timeContainer');

// StatusManagement(); Change the "Status" text in the GUI;
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

        var completionTime = await getVARIABLE("VOLUNTEER_TIME");
        
        var timerContainer = document.querySelectorAll('.tvwDatetime');

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
