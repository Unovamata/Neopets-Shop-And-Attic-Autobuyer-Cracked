// URL to fetch emails;
const emailURL = "https://raw.githubusercontent.com/Unovamata/AutoBuyerPlus/main/Autobuyer/Mail/MailDocument.html";

SkipCurrentEmail();

// Loading the email list if not skipping the current most recent email;
async function SkipCurrentEmail(){
    var isSkippingCurrentMail = await getVARIABLE("SKIP_CURRENT_MAIL");

    var loading = document.getElementById("loading-messages");
    loading.style.visibility = "hidden";

    if(isSkippingCurrentMail) return;

    var emailList = await getVARIABLE("EMAIL_LIST");

    for(var i = 0; i < emailList.length; i++) {
        var email = emailList[i];
        InsertNewEmailRow(email);
    }
}

var inbox = document.getElementById("inbox");
var activeEmail = null;

// Inserting rows inside the inbox;
function InsertNewEmailRow(email){
    var newEmailRow = inbox.insertRow();

    var emailEntryCell = newEmailRow.insertCell(0);
    emailEntryCell.textContent = email.Entry;

    var emailAuthorCell = newEmailRow.insertCell(1);
    emailAuthorCell.textContent = email.Author;

    var emailDateCell = newEmailRow.insertCell(2);
    emailDateCell.textContent = email.Date;

    var emailSubjectCell = newEmailRow.insertCell(3);
    emailSubjectCell.textContent = email.Subject;

    var emailReadCell = newEmailRow.insertCell(4);

    // Adding the envelope icon;
    var aElement = document.createElement('a');
    var imgElement = document.createElement('img');
    imgElement.src = "../../toolbar/neomail.svg";
    imgElement.classList.add("mail-inbox");

    aElement.appendChild(imgElement);
    emailReadCell.appendChild(aElement);
    emailReadCell.style.cursor = "pointer";

    // If the envelope is clicked, it will load the information from the email;
    emailReadCell.addEventListener("click", async function(event){
        var emailList = await getVARIABLE("EMAIL_LIST");
        
        // Formatting the email to load as they are organized on more recent first;
        var cellIndex = Number(newEmailRow.querySelector("td:first-child").textContent) - 1;
        var emailIndex = (emailList.length - 1) - cellIndex;

        activeEmail = emailList[emailIndex];
        activeEmail.Read = true;
        setVARIABLE("EMAIL_LIST", emailList);
        
        // Hiding elements and filling other fields;
        inbox.style.display = "none";
        messageContainer.style.display = "block";
        returnToInboxButton.style.display = "block";
        
        authorBox.innerHTML = activeEmail.Author;
        idBox.textContent = activeEmail.ID;
        sentDateBox.innerHTML = activeEmail.Date;
        subjectBox.innerHTML = activeEmail.Subject;
        titleBox.innerHTML = activeEmail.Title;
        messageBox.innerHTML = activeEmail.Contents;
    });

    inbox.appendChild(newEmailRow);
}

// Message input fields;
var messageContainer = document.getElementById("message-container");
var authorBox = document.getElementById("author");
var sentDateBox = document.getElementById("sent-date");
var subjectBox = document.getElementById("subject");
var titleBox = document.getElementById("message-title");
var messageBox = document.getElementById("message");
var idBox = document.getElementById("id-mail");
var returnToInboxButton = document.getElementById("return-to-inbox");

// Show the inbox initially;
returnToInboxButton.addEventListener("click", ShowInbox);

ShowInbox();

// Hides the message box and displays the inbox;
async function ShowInbox(){
    inbox.style.removeProperty("display");
    messageContainer.style.display = "none";
    returnToInboxButton.style.display = "none";
}

// Deleting the emails;
var deleteEmailsButton = document.getElementById("reset");
deleteEmailsButton.addEventListener("click", DeleteMails);

async function DeleteMails(){
    // Getting the email list for deletion and telling the system to not receive the newest email if its ID is equal to 'X';
    var emailList = await getVARIABLE("EMAIL_LIST");

    try {
        setVARIABLE("CURRENT_MAIL_INDEX", emailList[0].ID);
    } catch {
        setVARIABLE("CURRENT_MAIL_INDEX", -1);
    }

    // Resetting the data;
    setVARIABLE("EMAIL_LIST", []);
    setVARIABLE("SKIP_CURRENT_MAIL", true);

    // And alerting the user;
    var currentIndex = await getVARIABLE("CURRENT_MAIL_INDEX");

    if(currentIndex == -1){
        window.alert("All NeoBuyer+ mails have been successfully deleted!");
    } else {
        CheckNewMail();
        setVARIABLE("RETRIEVED_NEWEST_EMAIL", true);
    }

    window.location.reload();
}

async function UpdateDeleteButton(){
    var currentIndex = await getVARIABLE("CURRENT_MAIL_INDEX");

    if(currentIndex != -1){
        deleteEmailsButton.textContent = "Get the Latest Email for Next Update Check";
    }
}

UpdateDeleteButton();


// Checks constantly if the inventory page needs to update;
async function UpdateGUIData() {
    var newestRetrieved = await getVARIABLE("RETRIEVED_NEWEST_EMAIL");

    if (newestRetrieved) {
        location.reload();
        setVARIABLE("RETRIEVED_NEWEST_EMAIL", false);
    }
}

setInterval(UpdateGUIData, 1000);