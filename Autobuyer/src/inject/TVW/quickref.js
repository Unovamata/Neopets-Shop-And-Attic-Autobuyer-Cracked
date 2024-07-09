LoadOwnedPets();

async function LoadOwnedPets(){
    var isLoadingPets = await getVARIABLE("IS_LOADING_PETS");
    setVARIABLE("TVW_STATUS", "Loading Pet Name Data...");
    
    if(isLoadingPets){
        var pets = document.getElementsByClassName("pet_toggler"),
        petArray = [];

        // Saving the owned pet names;
        Array.from(pets).forEach(element => {
            var petName = element.getAttribute("onclick");

            petName = petName.replace("togglePetDetails('", "").replace("')", "");

            petArray.push(petName);
        });

        setVARIABLE("OWNED_PETS", petArray);
        setVARIABLE("IS_LOADING_PETS", false);

        window.close();
    }

    setVARIABLE("TVW_STATUS", "Pet Data Loading Complete!");
}



