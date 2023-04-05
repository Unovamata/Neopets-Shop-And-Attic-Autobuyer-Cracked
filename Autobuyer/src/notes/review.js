function setREVIEW_ACK(t) { chrome.storage.local.set({ REVIEW_ACK: t }, function () {}) }
const button = document.getElementById("ack");
button.addEventListener("click", function () { setREVIEW_ACK(!0), window.location.href = "https://chrome.google.com/webstore/detail/neopets-shop-attic-highli/gcoedojijoejlngkneocccmnjkbbbfmd" });