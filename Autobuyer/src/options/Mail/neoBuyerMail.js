const emailURL = "https://raw.githubusercontent.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/main/Autobuyer/src/options/Mail/MailDocument.html";

fetch(emailURL)
  .then(response => response.text())
  .then(htmlContent => {
    getSKIP_CURRENT_MAIL(function (isSkippingCurrentMail){
        var loading = document.getElementById("loading-messages");
        loading.style.visibility = "hidden";
        
        if(isSkippingCurrentMail) return;

        getEMAIL_LIST(function (emailList){
            for(var i = 0; i < emailList.length; i++) {
                var email = emailList[i];
                InsertNewEmailRow(email);
            }
        });
});

}).catch(error => {
    console.error("An error ocurred during the execution... Try again later...", error);
});

var inbox = document.getElementById("inbox");
var activeEmail = null;

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

    emailReadCell.addEventListener("click", function(event){
        var cellIndex = Number(newEmailRow.querySelector("td:first-child").textContent);

        getEMAIL_LIST(function (emailList){
            activeEmail = emailList[cellIndex - 1];
            
            inbox.style.display = "none";
            messageContainer.style.display = "block";
            returnToInboxButton.style.display = "block";
            
            authorBox.innerHTML = activeEmail.Author;
            sentDateBox.innerHTML = activeEmail.Date;
            subjectBox.innerHTML = activeEmail.Subject;
            titleBox.innerHTML = activeEmail.Title;
            messageBox.innerHTML = activeEmail.Contents;
        });
    });

    inbox.appendChild(newEmailRow);
}

var messageContainer = document.getElementById("message-container");
var authorBox = document.getElementById("author");
var sentDateBox = document.getElementById("sent-date");
var subjectBox = document.getElementById("subject");
var titleBox = document.getElementById("message-title");
var messageBox = document.getElementById("message");

var returnToInboxButton = document.getElementById("return-to-inbox");

returnToInboxButton.addEventListener("click", ShowInbox);

ShowInbox();

function ShowInbox(){
    inbox.style.removeProperty("display");
    messageContainer.style.display = "none";
    returnToInboxButton.style.display = "none";
}

var deleteEmailsButton = document.getElementById("reset");
deleteEmailsButton.addEventListener("click", DeleteMails);

function DeleteMails(){
    getEMAIL_LIST( function (mails){
        console.log(mails[0]);

        try {
            setCURRENT_MAIL_INDEX(mails[0].ID);
        } catch {
            setCURRENT_MAIL_INDEX(-1);
        }
    });

    setEMAIL_LIST([]);
    setSKIP_CURRENT_MAIL(true);
    window.alert("All NeoBuyer+ mails have been successfully deleted!");
    window.location.reload();
}