// ==UserScript==
// @name         Neopets Restock Timer
// @version      1.0.7
// @description  Tells you how quickly you restock an item or get to the sold out message. The timer starts when you refresh the shop inventory page and ends once you reach the page telling you that you either successfully restocked the item or that it is sold out. The haggle time starts when the haggle page is loaded and ends once you click on the pet captcha. This script has been approved by the moderators of the r/Neopets Discord server.
// @author       jackmb, dgoldman
// @match        *://*.neopets.com/objects.phtml*
// @match        *://*.neopets.com/haggle.phtml*
// @icon         https://www.neopets.com/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  if(window.location.href.includes("halloween/garage")) return;

  const urlSearchParams = new URLSearchParams(window.location.search);

  if (urlSearchParams.get("type") == "shop" || sessionStorage.getItem("refreshTime") == null) {
    sessionStorage.setItem("refreshTime", JSON.stringify(new Date()));
    sessionStorage.removeItem("haggleStartTime");
    sessionStorage.removeItem("haggleEndTime");
    return;
  }

  if (urlSearchParams.get("stock_id")) {
    sessionStorage.setItem("haggleStartTime", JSON.stringify(new Date()));
  }

  const haggleForm = document.forms.haggleform;
  if (haggleForm) {
    haggleForm.addEventListener("submit", () => sessionStorage.setItem("haggleEndTime", JSON.stringify(new Date())));
    return;
  }

  const refreshTime = sessionStorage.getItem("refreshTime");
  const haggleStartTime = sessionStorage.getItem("haggleStartTime");
  const haggleEndTime = sessionStorage.getItem("haggleEndTime");

  const totalRestockTime = (new Date().getTime() - new Date(JSON.parse(refreshTime)).getTime()) / 1000;
  let haggleTimeMessage = "";
  if (haggleStartTime && haggleEndTime) {
    const haggleTime = (new Date(JSON.parse(haggleEndTime)).getTime() - new Date(JSON.parse(haggleStartTime)).getTime()) / 1000;
    haggleTimeMessage = ` with a haggle time of ${haggleTime} seconds`;
  }

  const restockTimeElement = document.createElement("p");

  if (document.body.innerHTML.search("has been added to your inventory") != -1) {
    restockTimeElement.innerHTML = `<br>You restocked this item in ${totalRestockTime} seconds ${haggleTimeMessage}. You should go do something productive now.`;
    sessionStorage.removeItem("refreshTime");
    sessionStorage.removeItem("haggleStartTime");
    sessionStorage.removeItem("haggleEndTime");
  } else if (document.body.innerHTML.search("is SOLD OUT!") != -1) {
    if (document.body.innerHTML.search("Ice Hissi Morphing Potion") != -1) {
      restockTimeElement.innerHTML = `<br>Well at least you didn't miss a Golden Shell. Your time was ${totalRestockTime} seconds${haggleTimeMessage}.`;
    } else {
      restockTimeElement.innerHTML = `<br>Well at least you didn't miss an Ice Hissi Morphing Potion. Your time was ${totalRestockTime} seconds${haggleTimeMessage}.`;
    }
    sessionStorage.removeItem("refreshTime");
    sessionStorage.removeItem("haggleStartTime");
    sessionStorage.removeItem("haggleEndTime");
  }
  document.querySelector("div#container__2020.container.theme-bg").appendChild(restockTimeElement);
})();
