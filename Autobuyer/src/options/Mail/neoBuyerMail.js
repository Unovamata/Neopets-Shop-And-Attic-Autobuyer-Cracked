const url = "https://raw.githubusercontent.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/main/Autobuyer/src/options/Mail/MailDocument.html"; // Replace with the URL you want to ping

fetch(url)
  .then(response => response.text())
  .then(htmlContent => {
    // 'html' contains the HTML content of the site
    console.log(htmlContent);

    var message = document.getElementById("message");

    message.innerHTML = htmlContent;

}).catch(error => {
    console.error("Error:", error);
});

class Email {
    constructor(ID, Author, Date, Subject, Contents){
        this.ID = ID;
        this.Author = Author;
        this.Date = Date;
        this.Subject = Subject;
        this.Contents = Contents;
    }
}

var testEmail = new Email(0, "Unovamata", "10/20/2023", "Test", "Test");

var inbox = document.getElementById("inbox");

var newEmailRow = inbox.insertRow();

var emailIDCell = newEmailRow.insertCell(0);
emailIDCell.textContent = testEmail.ID;

var emailAuthorCell = newEmailRow.insertCell(1);
emailAuthorCell.textContent = testEmail.Author;

var emailDateCell = newEmailRow.insertCell(2);
emailDateCell.textContent = testEmail.Date;

var emailSubjectCell = newEmailRow.insertCell(3);
emailSubjectCell.textContent = testEmail.Subject;

var emailReadCell = newEmailRow.insertCell(4);
emailReadCell.textContent = "Read";


inbox.appendChild(newEmailRow);