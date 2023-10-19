chrome.storage.local.get(null, function(items) {
    function FormatDateToCustomFormat(date) {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
    
        return `${month} ${day}, ${year}`;
    }

    document.getElementById("save").addEventListener("click", function(){
        const jsonString = JSON.stringify(items);
        const blob = new Blob([jsonString], {type : "application/json"});
        const currentDate = FormatDateToCustomFormat(new Date());

        // Download the settings;
        chrome.downloads.download({
            url: URL.createObjectURL(blob),
            filename: "NeoBuyer+ Config " + currentDate + ".json",
            conflictAction: "overwrite", // Overwrite the file if it already exists;
        });
    });

    document.getElementById("load").addEventListener("change" , function(event){
        if(event.target.files.length == 0) return;

        var selectedFile = event.target.files[0];


        const reader = new FileReader();

        reader.onload = function (e) {
            const fileContent = e.target.result;

            try {
                var jsonData = JSON.parse(fileContent);
                console.log(jsonData == items);
                chrome.storage.local.set(jsonData);
                window.alert("All options have imported successfully!\n\nThank you for continuing to use NeoBuyer+!");
            } catch {
                window.alert("There was an error parsing the data back into NeoBuyer+...\n\nPlease make sure you're loading the correct file or try again.");
            }
        };

        reader.readAsText(selectedFile); // Read the file as text
    })
});