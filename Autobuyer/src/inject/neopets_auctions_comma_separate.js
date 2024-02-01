// ==UserScript==
// @name         Neopets Auctions - Comma Separate
// @namespace    neopets
// @version      2023.19.13
// @description  Comma seperates numbers in the auctions in a readable format
// @match        *://*.neopets.com/genie.phtml*
// @match        *://*.neopets.com/auctions.phtml
// @match        *://*.neopets.com/auctions.phtml?auction_counter=*
// @author       Zara Kayn
// ==/UserScript==
 
 
(function() {
    'use strict';
 
    // Function to add commas to a number
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
 
    // Select all <b> elements within <td> tags that are directly followed by " NP"
    let bElements = document.querySelectorAll('td b:not(:has(font))');
 
    // Loop through all the selected elements
    for (let elem of bElements) {
        // Check if the content directly after the <b> tag is " NP"
        if (elem.nextSibling && elem.nextSibling.nodeValue && elem.nextSibling.nodeValue.trim() === "NP") {
            let number = parseInt(elem.textContent, 10);
 
            // Check if it's a valid number
            if (!isNaN(number)) {
                elem.textContent = numberWithCommas(number); // Setting formatted number
            }
        }
    }
})();