StartTVWBot();

var canCloseWindow = false;

async function StartTVWBot() {
    var status = await getVARIABLE("UPDATE_STATUS_A");

    if (!status) {
        UpdateBannerAndDocument(updateAlert, updateBanner);
        chrome.runtime.sendMessage({ action: "outdatedVersion" });
        return;
    }

    await HandleServerErrors();

    await HandleVolunteerEvents();

    setInterval(function() {
        if (canCloseWindow) {
            chrome.runtime.sendMessage({ action: 'closeTab' });
            canCloseWindow = false;
        }
    }, 5000);
}

// HandleVolunteerEvents(); TVW Volunteer Bot;
async function HandleVolunteerEvents() {
    // Reading all the available volunteer shifts;
    var availableFights = Array.from(document.querySelectorAll('[id*="VolunteerFight"]')),
        fights = availableFights.slice(2);

    var endTimes = [];

    // Starting the process per volunteer shift;
    for (let index = 0; index < fights.length; index++) {
        await StartVolunteerProcess(fights[index], index);
    }

    // TimeLeftUpdate(); Updates the schedules at which the extension should exit volunteering shifts;
    async function TimeLeftUpdate(fightTime, index) {
        return new Promise(async (resolve, reject) => {
            try {
                // Parsing the ending time;
                var time = fightTime.textContent.split(":"),
                    endTime = new Date();

                endTime.setHours(endTime.getHours() + Number(time[0]));
                endTime.setMinutes(endTime.getMinutes() + Number(time[1]));
                endTime.setSeconds(endTime.getSeconds() + Number(time[2]));

                // Generating a random time to exit the shift to make it look more human;
                var minVolunteerWait = await getVARIABLE("MIN_TVW_VISIT"),
                    maxVolunteerWait = await getVARIABLE("MAX_TVW_VISIT");

                if (minVolunteerWait == undefined) {
                    minVolunteerWait = 120000;
                    setVARIABLE("MIN_TVW_VISIT", 120000);
                }

                if (maxVolunteerWait == undefined) {
                    maxVolunteerWait = 300000;
                    setVARIABLE("MAX_TVW_VISIT", 300000);
                }

                // Creating the final shift exit time;
                const waitTime = GetRandomInt(Number(minVolunteerWait), Number(maxVolunteerWait));
                endTime = endTime.getTime() + waitTime + (maxVolunteerWait * index);
                endTimes.push(endTime);

                // If the bot has checked all the possible shifts, then update the exit shift times;
                if (index == fights.length - 1) {
                    await setVARIABLE("VOLUNTEER_TIME", endTimes);
                    setVARIABLE("TVW_STATUS", "Waiting for Scheduled Times...");
                    canCloseWindow = true;
                }

                resolve();
            } catch (error) {
                window.location.reload();
                reject(error);
            }
        });
    }

    // StartVolunteerProcess(); Read the data in the GUI and act accordingly;
    async function StartVolunteerProcess(fight, index) {
        return new Promise(async (resolve, reject) => {
            try {
                var isRunningVolunteerProcess = await getVARIABLE("IS_RUNNING_TVW_PROCESS");

                if (!isRunningVolunteerProcess || !fight) {
                    resolve();
                    return;
                }

                const volunteerButton = fight.querySelector('[id*="VolunteerButton"]'),
                    fightTime = fight.querySelector('.vc-fight-time');
                setVARIABLE("TVW_STATUS", "Parsing TVW Data...");

                // Shift status actions;
                switch (volunteerButton.textContent) {
                    case "Complete":
                        volunteerButton.click();
                        setVARIABLE("TVW_STATUS", "Completing a Volunteer Shift...");

                        await Sleep(5000, 10000);

                        window.location.reload();
                        resolve();
                        return;

                    case "Cancel":
                        fightTime.removeChild(fightTime.lastElementChild);
                        setVARIABLE("TVW_STATUS", "Updating the Volunteer Shift Completion Times...");
                        await TimeLeftUpdate(fightTime, index);
                        resolve();
                        return;
                }

                // Starting a new volunteering shift;
                volunteerButton.click();

                const ImReadyButton = await WaitForElement('button.button-default__2020.button-yellow__2020[onclick="showPets()"]');

                // Clicking the "I'm Ready" button;
                if (ImReadyButton) {
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

                while (petTabs.length < 2) {
                    petTabs = await WaitForElement('.vc-pet', 3);

                    await Sleep(1000, 3000);
                }

                // Converting the pet tabs to an array and removing the first empty cell;
                petTabs = Array.from(petTabs);
                petTabs.pop();

                // Selecting a volunteer pet in the GUI;
                const volunteerPetList = await getVARIABLE("VOLUNTEER_PETS");
                const selectedPet = volunteerPetList[index];
                setVARIABLE("TVW_STATUS", `Signing up ${selectedPet} for a Volunteer Shift...`);

                if (selectedPet != undefined) {
                    petTabs.forEach(tab => {
                        const nameContainer = tab.querySelector(".vc-name");

                        if (nameContainer.textContent == selectedPet) {
                            tab.click();
                        }
                    });

                    const joinVolunteerButton = document.getElementById("VolunteerJoinButton");

                    await Sleep(1000, 5000);

                    joinVolunteerButton.click();

                    // Closing the tab and reloading for time processing;
                    const volunteerJoinedPopup = await WaitForElement('VolunteerJoinedPopup', 1),
                        closeButton = volunteerJoinedPopup.querySelector(".popup-exit-icon");

                    closeButton.click();

                    window.location.reload();
                } else {
                    UpdateBannerAndDocument("Volunteer Pet Not Defined.", "Volunteer pet not defined, load your pets in NeoBuyer+'s GUI and restart the process. This process will stop...");
                    setVARIABLE("IS_RUNNING_TVW_PROCESS", false);
                    setVARIABLE("TVW_STATUS", "Inactive");
                }

                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}