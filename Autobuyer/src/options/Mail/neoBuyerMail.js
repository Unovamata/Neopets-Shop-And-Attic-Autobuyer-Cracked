const emailURL = "https://raw.githubusercontent.com/Unovamata/Neopets-Shop-And-Attic-Autobuyer-Cracked/main/Autobuyer/src/options/Mail/MailDocument.html"; // Replace with the URL you want to ping

class Email {
    constructor(ID, Author, Date, Subject, Contents){
        this.ID = ID;
        this.Author = Author;
        this.Date = Date;
        this.Subject = Subject;
        this.Contents = Contents;
    }
}


fetch(emailURL)
  .then(response => response.text())
  .then(htmlContent => {
    // 'html' contains the HTML content of the site
    console.log(htmlContent);

    var ID = document.getElementById("id");
    var author = document.getElementById("author");
    var date = document.getElementById("date");
    var subject = document.getElementById("subject");
    var contents = document.getElementById("contents");

    //message.innerHTML = htmlContent;

    var testEmail = new Email(ID, author, date, subject, contents);
    
    InsertNewEmailRow(testEmail);

}).catch(error => {
    console.error("Error:", error);
});

function InsertNewEmailRow(email){
    var inbox = document.getElementById("inbox");

    var newEmailRow = inbox.insertRow();

    var emailIDCell = newEmailRow.insertCell(0);
    emailIDCell.textContent = email.ID;

    var emailAuthorCell = newEmailRow.insertCell(1);
    emailAuthorCell.textContent = email.Author;

    var emailDateCell = newEmailRow.insertCell(2);
    emailDateCell.textContent = email.Date;

    var emailSubjectCell = newEmailRow.insertCell(3);
    emailSubjectCell.textContent = email.Subject;

    var emailReadCell = newEmailRow.insertCell(4);
    emailReadCell.textContent = "Read";

    inbox.appendChild(newEmailRow);
}