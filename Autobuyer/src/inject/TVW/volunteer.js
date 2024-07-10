const BrightvaleIButton = document.getElementById("VolunteerButton3");

StartVolunteerProcess();

async function TimeLeftUpdate(){
    var timeLeft = document.querySelector(".vc-fight-time");
    timeLeft.removeChild(timeLeft.lastElementChild);
    timeLeft = timeLeft.textContent.trim().split(":");
    
    var endTime = new Date();

    endTime.setHours(endTime.getHours() + Number(timeLeft[0]));
    endTime.setMinutes(endTime.getHours() + Number(timeLeft[1]));
    endTime.setSeconds(endTime.getSeconds() + Number(timeLeft[2]));

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

    console.log(minVolunteerWait, maxVolunteerWait);

    const waitTime = GetRandomInt(Number(minVolunteerWait), Number(maxVolunteerWait));

    endTime = endTime.getTime() + waitTime;
    
    setVARIABLE("VOLUNTEER_TIME", endTime);
    setVARIABLE("TAB_ID", null);
    
    chrome.runtime.sendMessage({ action: 'closeTab' });
}

async function StartVolunteerProcess(){
    var isRunningVolunteerProcess = await getVARIABLE("IS_RUNNING_TVW_PROCESS");
    
    switch(BrightvaleIButton.textContent){
        case "Complete":
            BrightvaleIButton.click();
            window.location.reload();
            return;
        break;

        case "Cancel":
            TimeLeftUpdate();
            return;
        break;
    }

    if(isRunningVolunteerProcess){
        BrightvaleIButton.click();
    } else {
        return;
    }

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

    petTabs = Array.from(petTabs);

    petTabs.pop();

    const volunteerPet = await getVARIABLE("VOLUNTEER_PET");

    if(volunteerPet != undefined){
        petTabs.forEach(tab => {
            const nameContainer = tab.querySelector(".vc-name");
    
            if(nameContainer.textContent == volunteerPet){
                tab.click();
            }
        });

        const joinVolunteerButton = document.getElementById("VolunteerJoinButton");

        await Sleep(1000);

        joinVolunteerButton.click();

        const volunteerJoinedPopup = await WaitForElement('VolunteerJoinedPopup', 1),
              closeButton = volunteerJoinedPopup.querySelector(".popup-exit-icon");

        closeButton.click();

        TimeLeftUpdate();
    } else {
        UpdateBannerAndDocument("Volunteer Pet Not Defined.", "Volunteer pet not defined, load your pets in NeoBuyer+'s GUI and restart the process. This process will stop...");
        setVARIABLE("IS_RUNNING_TVW_PROCESS", false);
        setVARIABLE("TVW_STATUS", "Inactive");
    }
}

