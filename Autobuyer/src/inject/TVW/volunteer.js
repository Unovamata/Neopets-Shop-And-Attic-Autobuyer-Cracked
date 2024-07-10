StartTVWBot();

async function StartTVWBot(){
    var status = await getVARIABLE("UPDATE_STATUS_A");

    if(!status){
        UpdateBannerAndDocument(updateAlert, updateBanner);
        chrome.runtime.sendMessage({ action: "outdatedVersion" });
        return;
    } 

    HandleServerErrors();

    HandleVolunteerEvents();
}

// HandleVolunteerEvents(); TVW Volunteer Bot;
function HandleVolunteerEvents(){
    console.log("Volunteering!")

    // Reading all the available volunteer shifts;
    var availableFights = Array.from(document.querySelectorAll('[id*="VolunteerFight"]')),
    fights = availableFights.slice(2);

    var endTimes = [];

    // Starting the process per volunteer shift;
    fights.forEach(function(fight, index){
        StartVolunteerProcess(fight, index);
    });

    // TimeLeftUpdate(); Updates the schedules at which the extension should exit volunteering shifts;
    async function TimeLeftUpdate(fightTime, index){
        // Parsing the ending time;
        var time = fightTime.textContent.split(":"),
            endTime = new Date();

        endTime.setHours(endTime.getHours() + Number(time[0]));
        endTime.setMinutes(endTime.getHours() + Number(time[1]));
        endTime.setSeconds(endTime.getSeconds() + Number(time[2]));

        // Generating a random time to exit the shift to make it look more human;
        var minVolunteerWait = await getVARIABLE("MIN_TVW_VISIT"),
            maxVolunteerWait = await getVARIABLE("MAX_TVW_VISIT");

        if(minVolunteerWait == undefined){
            minVolunteerWait = 1800000;
            setVARIABLE("MIN_TVW_VISIT", 1800000);
        }

        if(maxVolunteerWait == undefined){
            maxVolunteerWait = 3600000;
            setVARIABLE("MAX_TVW_VISIT", 3600000);
        }

        // Creating the final shift exit time;
        const waitTime = GetRandomInt(Number(minVolunteerWait), Number(maxVolunteerWait));
        endTime = endTime.getTime() + waitTime;
        endTimes.push(endTime);

        // If the bot has checked all the possible shifts, then update the exit shift times;
        if(index == fights.length - 1){
            setVARIABLE("VOLUNTEER_TIME", endTimes);

            chrome.runtime.sendMessage({ action: 'closeTab' });
        } 
    }

    // StartVolunteerProcess(); Read the data in the GUI and act accordingly;
    async function StartVolunteerProcess(fight, index){
        var isRunningVolunteerProcess = await getVARIABLE("IS_RUNNING_TVW_PROCESS");

        if(!isRunningVolunteerProcess || !fight) return;

        const volunteerButton = fight.querySelector('[id*="VolunteerButton"]'),
            fightTime = fight.querySelector('.vc-fight-time');

        // Shift status actions;
        switch(volunteerButton.textContent){
            case "Complete":
                shiftButton.click();
                window.location.reload();
                return;
            break;

            case "Cancel":
                fightTime.removeChild(fightTime.lastElementChild);
                TimeLeftUpdate(fightTime, index);
                return;
            break;
        }

        // Starting a new volunteering shift;
        volunteerButton.click();

        const ImReadyButton = await WaitForElement('button.button-default__2020.button-yellow__2020[onclick="showPets()"]');

        // Clicking the "I'm Ready" button;
        if(ImReadyButton){
            // Create a new MouseEvent
            var event = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });

            // Dispatch the event to the button
            ImReadyButton.dispatchEvent(event);
        }

        // Parsing the pet selection tabs;
        var petTabs = await WaitForElement('.vc-pet', 3);

        while(petTabs.length < 2) {
            petTabs = await WaitForElement('.vc-pet', 3);

            await Sleep(100);
        }

        // Converting the pet tabs to an array and removing the first empty cell;
        petTabs = Array.from(petTabs);
        petTabs.pop();

        // Selecting a volunteer pet in the GUI;
        const volunteerPetList = await getVARIABLE("VOLUNTEER_PETS");
        const selectedPet = volunteerPetList[index];

        if(selectedPet != undefined){
            petTabs.forEach(tab => {
                const nameContainer = tab.querySelector(".vc-name");
        
                if(nameContainer.textContent == selectedPet){
                    tab.click();
                }
            });

            const joinVolunteerButton = document.getElementById("VolunteerJoinButton");

            await Sleep(500, 5000);

            joinVolunteerButton.click();

            // Closing the tab and reloading for time processing;
            const volunteerJoinedPopup = await WaitForElement('VolunteerJoinedPopup', 1),
                closeButton = volunteerJoinedPopup.querySelector(".popup-exit-icon");

            closeButton.click();

            window.location.reload();
        } 
        
        // In case the undefined pet does not exist in the selection of volunteers;
        else {
            UpdateBannerAndDocument("Volunteer Pet Not Defined.", "Volunteer pet not defined, load your pets in NeoBuyer+'s GUI and restart the process. This process will stop...");
            setVARIABLE("IS_RUNNING_TVW_PROCESS", false);
            setVARIABLE("TVW_STATUS", "Inactive");
        }
    }
}