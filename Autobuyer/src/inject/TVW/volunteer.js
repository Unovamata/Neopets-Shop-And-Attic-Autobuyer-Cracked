HandleVolunteerEvents();

async function HandleVolunteerEvents(){
    var status = await getVARIABLE("UPDATE_STATUS_A");

    if(!status){
        UpdateBannerAndDocument(updateAlert, updateBanner);
        chrome.runtime.sendMessage({ action: "outdatedVersion" });
        return;
    } 

    HandleServerErrors();

    HandleVolunteerEvents();
}

function HandleVolunteerEvents(){
    var availableFights = Array.from(document.querySelectorAll('[id*="VolunteerFight"]')),
    fights = availableFights.slice(2);

    var endTimes = [];

    fights.forEach(function(fight, index){
        StartVolunteerProcess(fight, index);
    });

    async function TimeLeftUpdate(fightTime, index){
        var time = fightTime.textContent.split(":");

        var endTime = new Date();

        endTime.setHours(endTime.getHours() + Number(time[0]));
        endTime.setMinutes(endTime.getHours() + Number(time[1]));
        endTime.setSeconds(endTime.getSeconds() + Number(time[2]));

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

        const waitTime = GetRandomInt(Number(minVolunteerWait), Number(maxVolunteerWait));

        endTime = endTime.getTime() + waitTime;

        endTimes.push(endTime);

        if(index == fights.length - 1){
            setVARIABLE("VOLUNTEER_TIME", endTimes);
            
            chrome.runtime.sendMessage({ action: 'closeTab' });
        } 
    }

    async function StartVolunteerProcess(fight, index){
        var isRunningVolunteerProcess = true; //await getVARIABLE("IS_RUNNING_TVW_PROCESS");

        if(!isRunningVolunteerProcess || !fight) return;

        const volunteerButton = fight.querySelector('[id*="VolunteerButton"]'),
            fightTime = fight.querySelector('.vc-fight-time');

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

        volunteerButton.click();

        const ImReadyButton = await WaitForElement('button.button-default__2020.button-yellow__2020[onclick="showPets()"]');

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

        var petTabs = await WaitForElement('.vc-pet', 3);

        while(petTabs.length < 2) {
            petTabs = await WaitForElement('.vc-pet', 3);

            await Sleep(100);
        }

        // Converting the pet tabs to an array and removing the first empty cell;
        petTabs = Array.from(petTabs);
        petTabs.pop();

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

            await Sleep(1000);

            joinVolunteerButton.click();

            const volunteerJoinedPopup = await WaitForElement('VolunteerJoinedPopup', 1),
                closeButton = volunteerJoinedPopup.querySelector(".popup-exit-icon");

            closeButton.click();

            window.location.reload();
        } else {
            UpdateBannerAndDocument("Volunteer Pet Not Defined.", "Volunteer pet not defined, load your pets in NeoBuyer+'s GUI and restart the process. This process will stop...");
            setVARIABLE("IS_RUNNING_TVW_PROCESS", false);
            setVARIABLE("TVW_STATUS", "Inactive");
        }
    }
}