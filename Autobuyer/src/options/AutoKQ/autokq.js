AutoKitchenQuest();

async function AutoKitchenQuest(){
    var autoKQStatus = await getVARIABLE("AUTOKQ_STATUS");

    const statusTag = document.getElementById("status-tag");

    ShowOrHideLoading(autoKQStatus);
    statusTag.textContent = autoKQStatus;

    // Checks constantly if the inventory page needs to update;
    async function UpdateGUIData() {
        ShowOrHideLoading(autoKQStatus);
        statusTag.textContent = autoKQStatus;
        autoKQStatus = await getVARIABLE("AUTOKQ_STATUS");
    }

    // Updates the page's data every half a second when opened and needed;
    setInterval(UpdateGUIData, 100);

    //######################################################################################################################################


    const startAutoKQButton = document.getElementById("start");
    startAutoKQButton.addEventListener('click', StartAutoKQ);

    var autoPricingList = [];

    async function StartAutoKQ(){
        setVARIABLE("START_INVENTORY_PROCESS", false);
        setVARIABLE("START_INVENTORY_PROCESS", false);
        setVARIABLE("SUBMIT_PRICES_PROCESS", false);

        var isAutoPricerActive = await getVARIABLE("START_AUTOPRICING_PROCESS");

        if(isAutoPricerActive){
            setVARIABLE("AUTOPRICER_STATUS", "AutoPricer Process Cancelled by the AutoKQ Process...");
        }

        setVARIABLE("START_AUTOPRICING_PROCESS", false);

        setVARIABLE("START_AUTOKQ_PROCESS", true);
        setVARIABLE("SUBMIT_AUTOKQ_PROCESS", false);
        setVARIABLE("AUTOKQ_STATUS", "Navigating to the KQ Page...");
        

        chrome.tabs.create({ url: 'https://www.neopets.com/island/kitchen.phtml', active: true });

        setVARIABLE("AUTOKQ_STATUS", "AutoKQ Process Running...");
    }

    const cancelAutoKQButton = document.getElementById("cancel");
    cancelAutoKQButton.addEventListener('click', CancelAutoPricer);

    async function CancelAutoPricer(){
        if(confirm("Do you want to terminate the current AutoPricer process?")){
            setVARIABLE("START_AUTOPRICING_PROCESS", false);
            setVARIABLE("AUTOPRICER_INVENTORY", []);
            setVARIABLE("CURRENT_PRICING_INDEX", 0);
            setVARIABLE("SUBMIT_PRICES_PROCESS", false);
            setVARIABLE("NEXT_PAGE_INDEX", 0);
            setVARIABLE("SUBMIT_AUTOKQ_PROCESS", false);
            setVARIABLE("START_AUTOKQ_PROCESS", false);
            setVARIABLE("AUTOKQ_STATUS", "Inactive");
        }
    }

    async function HideKQButtons(){
        var isAutoKQActive = await getVARIABLE("START_AUTOKQ_PROCESS");

        if(isAutoKQActive){
            startAutoKQButton.style.display = "none";
            cancelAutoKQButton.style.display = "inline";
        } else {
            cancelAutoKQButton.style.display = "none";
            startAutoKQButton.style.display = "inline";
        }
    }

    setInterval(HideKQButtons, 100);


    //######################################################################################################################################


    const stockContainer = document.getElementById('history-container');
    const optionsContainer = document.getElementById('autokq-options-container');
    const analyticsContainer = document.getElementById('analytics-container');

    const optionsButton = document.getElementById("options");
    optionsButton.addEventListener('click', ShowOptions);

    function ShowOptions(){
        ShowAndHideElements([optionsContainer], [stockContainer, analyticsContainer])
    }

    const stockButton = document.getElementById("history");
    stockButton.addEventListener('click', ShowHistory);

    function ShowHistory(){
        ShowAndHideElements([stockContainer], [optionsContainer, analyticsContainer])
    }

    const analyticsButton = document.getElementById("analytics");
    analyticsButton.addEventListener('click', ShowAnalytics);

    function ShowAnalytics(){
        ShowAndHideElements([analyticsContainer], [optionsContainer, stockContainer])
    }

    ShowHistory();

    const clearButton = document.getElementById("resetKQ");
    clearButton.addEventListener('click', ClearKQLog);

    async function ClearKQLog(){
        if(confirm("Do you want to delete all entries in your Kitchen Quest Log?")){
            if(confirm("Are you sure you want to clear your Kitchen Quest Log? This action cannot be undone unless you have a backup of you configuration presets.")){
                setVARIABLE("KQ_TRACKER", [0, 0, 0, 0, 0, 0, 0]);
            }
        }
    }

    const KQpageButton = document.getElementById("page");

    KQpageButton.addEventListener('click', function() {
        chrome.tabs.create({ url: 'https://www.neopets.com/island/kitchen.phtml', active: true });
    });


    //######################################################################################################################################


    // DisplayChunkData.js
    const chunkSize = 30;

    // Initial load
    LoadCurrentPage();

    LoadCurrentPage = function(){
        ProcessAutoKQLog(true)

        // Update navigation
        UpdateNavigation();
    }


    var currentHistorySize = -1;
    tableContainer = document.getElementById("table-container"),
    kqTracker = await getVARIABLE("KQ_TRACKER");
    
    async function ProcessAutoKQLog(forceUpdateHistory) {
        const history = kqTracker.reverse();
        const historySize = history.length;

        // Force updating if necessary;
        if (forceUpdateHistory || currentHistorySize != historySize) {
            currentHistorySize = historySize;
            DisplayTableData(history, ["JN"], chunkSize, FilterFunction);
        }

        // Updating the page data;
        totalPages = Math.ceil(history.length / chunkSize);
        UpdateNavigation();
    }

    function FilterFunction(header, cell, data){    
        // Setting the information nodes in the table cells;
        switch(header){
            case "Account":
                cell.appendChild(document.createTextNode(data[0]));
                cell.classList.add('class-DateTime');
            break;

            case "Date & Time":
                cell.appendChild(document.createTextNode(data[0]));
                cell.classList.add('class-DateTime');
            break;

            case "Pet Name":
                cell.appendChild(document.createTextNode(data[0]));
                cell.classList.add('class-DateTime');
            break;

            case "Prize":
                if(data[1].Type == "Neopoints"){
                    var priceValue = parseInt(data[0]);
                    var priceSpan = CheckIsNaNDisplay(priceValue, "-", FormatNPNumber(priceValue));
                    cell.appendChild(document.createTextNode(priceSpan));
                } else {
                    cell.appendChild(document.createTextNode(data[0]));
                }

                cell.classList.add('class-Prize');
            break;

            case "Type":
                cell.appendChild(document.createTextNode(data[0]));
                cell.classList.add('class-Type');
            break;

            case "JN":
                if(data[1].Type == "Item"){
                    var itemName = data[1].Prize;

                    // Create the <a> element
                    var linkElement = document.createElement("a");
                    linkElement.href = `https://items.jellyneo.net/search/?name=${itemName}&name_type=3`;

                    // Create the <img> element
                    var imgElement = document.createElement("img");
                    imgElement.src = "../JN.png";
                    imgElement.alt = "Info Icon";

                    linkElement.appendChild(imgElement);

                    cell.appendChild(linkElement);
                    cell.classList.add('class-JellyNeo');
                }
            break;

            default:
                cell.appendChild(document.createTextNode(data[0]));
            break;
        }

        return cell;
    }

    //######################################################################################################################################


    var nullDataMessage = "No Kitchen Quests Done Yet.";

    //Update the history data every 5 seconds;
    ProcessAutoKQLog(false), setInterval((function() {
        ProcessAutoKQLog(false)
    }), 5e3)

        var data = kqTracker;

        // Processing prizes obtained today only;
        PrizesObtained(FilterDataToday(data), "prizesObtainedTodayChart");

        var stats = data.filter(function (entry){
            return entry["Type"] == "Stat";
        });

        // Processing stats obtained today only;
        StatsObtained(FilterDataToday(stats), "statsObtainedTodayChart");

        PrizesObtained(data, "prizesObtainedChart");

        StatsObtained(stats, "statsObtainedChart");

        StatsObtainedPerPet(stats, "benefitedPetsChart")

        PrizeTypesPerMonth(data, "prizesPerMonth")

    function FilterDataToday(data){
        return data.filter(function(entry){
            var today = new Date();
            var formattedDate = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();

            return entry["Date & Time"].includes(formattedDate);
        });
    }

    function PrizesObtained(prizes, id){
        var prizesInputData = [0, 0, 0];

        prizes.forEach(function(object){
            switch(object.Type){
                case "Stat": prizesInputData[0] += 1; break;
                case "Item": prizesInputData[1] += 1; break;
                default: prizesInputData[2] += 1; break;
            }
        });

        var isChartActive = CreateChartWithLabels(id, "pie", ["Stat", "Item", "Neopoints"], prizesInputData, FormatDatalabelsOptions());
        
        if(isChartActive) ResizeChartInterval(id, chartSize);
    }

    function StatsObtained(stats, id){
        var statsInputData = [0, 0, 0, 0, 0];

        stats.forEach(function(object){
            switch(object.Prize){
                case "Level": statsInputData[0] += 1; break;
                case "Hit point": statsInputData[1] += 1; break;
                case "Attack": statsInputData[2] += 1; break;
                case "Defence": statsInputData[3] += 1; break;
                case "Agility": statsInputData[4] += 1; break;
            }
        })

        var isChartActive = CreateChartWithLabels(id, "pie", ["Level", "Hit point", "Strength", "Defence", "Agility"], statsInputData, FormatDatalabelsOptions());

        if(isChartActive) ResizeChartInterval(id, chartSize);
    }

    function StatsObtainedPerPet(data, id){
        // Count the appearances of each unique Pet Name
        var filteredPets = data.filter(function(object) {
            return object['Pet Name'] !== "";
        });

        var petNameCounts = filteredPets.reduce(function(counts, entry) {
            var petName = entry['Pet Name'];
            counts[petName] = (counts[petName] || 0) + 1;
            
            return counts;
        }, {});

        var isChartActive = CreateBarChart(id, "bar", Object.keys(petNameCounts), Object.values(petNameCounts), FormatDatalabelsOptions(), "Stat Increases per Pet");

        if(isChartActive) ResizeChartInterval(id, "760px", "380px");
    }

    function PrizeTypesPerMonth(data, id){
        const canvas = document.getElementById(id),
        context = canvas.getContext("2d");

        if(!CheckIfEnoughData(canvas, data)) return;

        var separatedDataset = FormatDatasetByMonthAndYear(data);
        var keys = Object.keys(separatedDataset)
        var keyDataset = [];

        keys.forEach(function (key, index){
            keyDataset.push({key: key, value: [{key: "Stat", value: 0}, {key: "Item", value: 0}, {key: "Neopoints", value: 0}]});

            separatedDataset[key].forEach(function(object){
                switch(object.Type){
                    case "Stat": keyDataset[index].value[0].value += 1; break;
                    case "Item": keyDataset[index].value[1].value += 1; break;
                    default: keyDataset[index].value[2].value += 1; break;
                }
            })
        });

        // Parse the dataset into a format that Chart.js can understand
        var chartData = { labels: [], datasets: [] };

        // Extract labels and data for each dataset
        keyDataset.forEach(function(monthData) {
            chartData.labels.push(monthData.key); // Assuming the key represents the month

            monthData.value.forEach(function(dataType, index) {
                var existingDataset = chartData.datasets.find(function(dataset) {
                    return dataset.label === dataType.key;
                });
                
                if (existingDataset) {
                    existingDataset.data.push(dataType.value);
                } else {
                    var colors = CalculateColorInIndex(index, 3);

                    chartData.datasets.push({
                        label: dataType.key,
                        data: [dataType.value],
                        borderColor: colors, // Function to generate random colors
                        backgroundColor:  colors,
                        borderWidth: 3,
                        fill: false
                    });
                }
            });
        });

        // Set up Chart.js with a line chart configuration
        new Chart(context, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Data Occurrences Timeline'
                },
            }
        });

        ResizeChartInterval(id, "760px", "380px")
    }
}