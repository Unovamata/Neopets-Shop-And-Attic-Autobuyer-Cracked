var extpay = ExtPay("restock-highligher-autobuyer");

function openPaymentPage() { extpay.openPaymentPage() }

function setATTIC_CLICK_ITEM(_) { chrome.storage.local.set({ ATTIC_CLICK_ITEM: _ }, function () {}) }

function setATTIC_ENABLED(_) { chrome.storage.local.set({ ATTIC_ENABLED: _ }, function () {}) }

function setATTIC_SHOULD_REFRESH(_) { chrome.storage.local.set({ ATTIC_SHOULD_REFRESH: _ }, function () {}) }

function setATTIC_MIN_BUY_TIME(_) { chrome.storage.local.set({ ATTIC_MIN_BUY_TIME: _ }, function () {}) }

function setATTIC_MAX_BUY_TIME(_) { chrome.storage.local.set({ ATTIC_MAX_BUY_TIME: _ }, function () {}) }

function setATTIC_MIN_REFRESH(_) { chrome.storage.local.set({ ATTIC_MIN_REFRESH: Number(_) }, function () {}) }

function setATTIC_MAX_REFRESH(_) { chrome.storage.local.set({ ATTIC_MAX_REFRESH: Number(_) }, function () {}) }

function setATTIC_ITEM_DB_MIN_PROFIT_NPS(_) { chrome.storage.local.set({ ATTIC_ITEM_DB_MIN_PROFIT_NPS: _ }, function () {}) }

function setATTIC_ITEM_DB_MIN_PROFIT_PERCENT(_) { chrome.storage.local.set({ ATTIC_ITEM_DB_MIN_PROFIT_PERCENT: _ }, function () {}) }

function setATTIC_HIGHLIGHT(_) { chrome.storage.local.set({ ATTIC_HIGHLIGHT: _ }, function () {}) }

function setATTIC_RUN_BETWEEN_HOURS(_) { chrome.storage.local.set({ ATTIC_RUN_BETWEEN_HOURS: _ }, function () {}) }

function setMIN_REFRESH(_) { chrome.storage.local.set({ MIN_REFRESH: Number(_) }, function () {}) }

function setMAX_REFRESH(_) { chrome.storage.local.set({ MAX_REFRESH: Number(_) }, function () {}) }

function setMIN_REFRESH_STOCKED(_) { chrome.storage.local.set({ MIN_REFRESH_STOCKED: Number(_) }, function () {}) }

function setMAX_REFRESH_STOCKED(_) { chrome.storage.local.set({ MAX_REFRESH_STOCKED: Number(_) }, function () {}) }

function setSHOULD_CLICK_NEOPET(_) { chrome.storage.local.set({ SHOULD_CLICK_NEOPET: _ }, function () {}) }

function setENABLED(_) { chrome.storage.local.set({ ENABLED: _ }, function () {}) }

function setUSE_ITEM_DB(_) { chrome.storage.local.set({ USE_ITEM_DB: _ }, function () {}) }

function setITEM_DB_MIN_PROFIT_NPS(_) { chrome.storage.local.set({ ITEM_DB_MIN_PROFIT_NPS: _ }, function () {}) }

function setITEM_DB_MIN_PROFIT_PERCENT(_) { chrome.storage.local.set({ ITEM_DB_MIN_PROFIT_PERCENT: _ }, function () {}) }

function setHIGHLIGHT(_) { chrome.storage.local.set({ HIGHLIGHT: _ }, function () {}) }

function setCLICK_ITEM(_) { chrome.storage.local.set({ CLICK_ITEM: _ }, function () {}) }

function setCLICK_CONFIRM(_) { chrome.storage.local.set({ CLICK_CONFIRM: _ }, function () {}) }

function setSHOULD_SHOW_BANNER(_) { chrome.storage.local.set({ SHOULD_SHOW_BANNER: _ }, function () {}) }

function setSHOULD_ANNOTATE_IMAGE(_) { chrome.storage.local.set({ SHOULD_ANNOTATE_IMAGE: _ }, function () {}) }

function setSHOULD_SOUND_ALERTS(_) { chrome.storage.local.set({ SHOULD_SOUND_ALERTS: _ }, function () {}) }

function setSHOULD_ENTER_OFFER(_) { chrome.storage.local.set({ SHOULD_ENTER_OFFER: _ }, function () {}) }

function setSHOULD_SEND_EMAIL(_) { chrome.storage.local.set({ SHOULD_SEND_EMAIL: _ }, function () {}) }

function setSHOULD_GO_FOR_SECOND_MOST_VALUABLE(_) { chrome.storage.local.set({ SHOULD_GO_FOR_SECOND_MOST_VALUABLE: _ }, function () {}) }

function setSTORES_TO_CYCLE_THROUGH_WHEN_STOCKED(_) { chrome.storage.local.set({ STORES_TO_CYCLE_THROUGH_WHEN_STOCKED: _ }, function () {}) }

function setRUN_BETWEEN_HOURS(_) { chrome.storage.local.set({ RUN_BETWEEN_HOURS: _ }, function () {}) }

function setITEMS_TO_CONSIDER_STOCKED(_) { chrome.storage.local.set({ ITEMS_TO_CONSIDER_STOCKED: Number(_) }, function () {}) }

function setMIN_CLICK_ITEM_IMAGE(_) { chrome.storage.local.set({ MIN_CLICK_ITEM_IMAGE: Number(_) }, function () {}) }

function setMAX_CLICK_ITEM_IMAGE(_) { chrome.storage.local.set({ MAX_CLICK_ITEM_IMAGE: Number(_) }, function () {}) }

function setMIN_CLICK_CONFIRM(_) { chrome.storage.local.set({ MIN_CLICK_CONFIRM: Number(_) }, function () {}) }

function setMAX_CLICK_CONFIRM(_) { chrome.storage.local.set({ MAX_CLICK_CONFIRM: Number(_) }, function () {}) }

function setMIN_OCR_PAGE(_) { chrome.storage.local.set({ MIN_OCR_PAGE: Number(_) }, function () {}) }

function setMAX_OCR_PAGE(_) { chrome.storage.local.set({ MAX_OCR_PAGE: Number(_) }, function () {}) }

function setEMAIL_TEMPLATE(_) { chrome.storage.local.set({ EMAIL_TEMPLATE: _ }, function () {}) }

function setEMAIL_USER_ID(_) { chrome.storage.local.set({ EMAIL_USER_ID: _ }, function () {}) }

function setEMAIL_SERVICE_ID(_) { chrome.storage.local.set({ EMAIL_SERVICE_ID: _ }, function () {}) }

function setRESTOCK_LIST(_) { chrome.storage.local.set({ RESTOCK_LIST: _ }, function () {}) }

function setATTIC_LAST_REFRESH_MS(_) { chrome.storage.local.set({ ATTIC_LAST_REFRESH_MS: _ }, function () {}) }

function setUSE_BLACKLIST(_) { chrome.storage.local.set({ USE_BLACKLIST: _ }, function () {}) }

function setBLACKLIST(_) { chrome.storage.local.set({ BLACKLIST: _ }, function () {}) }

function setITEM_DB_MIN_RARITY(_) { chrome.storage.local.set({ ITEM_DB_MIN_RARITY: _ }, function () {}) }

function setBUY_UNKNOWN_ITEMS_PROFIT(_) { chrome.storage.local.set({ BUY_UNKNOWN_ITEMS_PROFIT: _ }, function () {}) }

function updateLastRefreshMs() { "" != $("#ATTIC_LAST_REFRESH_DATE").val() && "" != $("#ATTIC_LAST_REFRESH_TIME").val() && setATTIC_LAST_REFRESH_MS(getPacificTimeDateObjFromInputs().valueOf()) }

function updateDateTimeInputs(_) {
    var E = moment(_).tz("America/Los_Angeles").format("YYYY-MM-DD"),
        I = moment(_).tz("America/Los_Angeles").format("YYYY-MM-DD HH:mm:ss").split(" ")[1];
    $("#ATTIC_LAST_REFRESH_DATE").val(E), $("#ATTIC_LAST_REFRESH_TIME").val(I)
}

function getPacificTimeDateObjFromInputs() { return moment.tz($("#ATTIC_LAST_REFRESH_DATE").val() + " " + $("#ATTIC_LAST_REFRESH_TIME").val(), "America/Los_Angeles").toDate() }

function showOrHide() { $("#USE_ITEM_DB").is(":checked") ? ($(".db-hide").show(), $(".restock-hide").hide()) : ($(".restock-hide").show(), $(".db-hide").hide()), $("#USE_BLACKLIST").is(":checked") ? $(".blacklist-hide").show() : $(".blacklist-hide").hide(), $("#CLICK_ITEM").is(":checked") ? $(".click-hide").show() : $(".click-hide").hide(), $("#ATTIC_CLICK_ITEM").is(":checked") ? $(".attic-click-hide").show() : $(".attic-click-hide").hide(), $("#ATTIC_SHOULD_REFRESH").is(":checked") ? $(".attic-refresh-hide").show() : $(".attic-refresh-hide").hide(), $("#CLICK_CONFIRM").is(":checked") ? $(".confirm-hide").show() : $(".confirm-hide").hide(), $("#SHOULD_SEND_EMAIL").is(":checked") ? $(".email-hide").show() : $(".email-hide").hide(), $("#ATTIC_ENABLED").is(":checked") ? $(".attic-settings").show() : $(".attic-settings").hide(), $("#ENABLED").is(":checked") ? $(".main-shop-settings").show() : $(".main-shop-settings").hide() } $("#PAYMENT_LINK").bind("click", function () { openPaymentPage() }), chrome.storage.local.get({ EXT_P_S: !1 }, function (_) { _.EXT_P_S || extpay.getUser().then(_ => { _.paid ? chrome.storage.local.set({ EXT_P_S: !0 }, function () {}) : chrome.storage.local.set({ EXT_P_S: !1 }, function () {}) }).catch(_ => { console.error(_) }) }), setTimeout(function () { chrome.storage.local.get({ WARNING_ACK: !1, EXT_P_S: !1 }, function (_) {!_.WARNING_ACK && _.EXT_P_S && (setATTIC_SHOULD_REFRESH(!1), chrome.tabs.create({ url: "../../src/notes/warning.html" })) }) }, 2e3), $("#USE_BLACKLIST").on("change", function () { setUSE_BLACKLIST($("#USE_BLACKLIST").is(":checked")), showOrHide() }), $("#ITEM_DB_MIN_RARITY").bind("input propertychange", function () {
    var _ = $("#ITEM_DB_MIN_RARITY").val();
    _ < 1 && (_ = 1), _ > 99 && (_ = 99), setITEM_DB_MIN_RARITY(Math.trunc(_))
}), $("#BUY_UNKNOWN_ITEMS_PROFIT").bind("input propertychange", function () { setBUY_UNKNOWN_ITEMS_PROFIT(Math.trunc($("#BUY_UNKNOWN_ITEMS_PROFIT").val())) }), $("#BLACKLIST").bind("input propertychange", function () { try { setBLACKLIST($("#BLACKLIST").val().split("\n").map(_ => _.trim()).filter(_ => "" != _)) } catch (_) { window.alert("Error in parsing your blacklist: " + _) } }), $("#ATTIC_CLICK_ITEM").on("change", function () { setATTIC_CLICK_ITEM($("#ATTIC_CLICK_ITEM").is(":checked")), showOrHide() }), $("#ATTIC_HIGHLIGHT").on("change", function () { setATTIC_HIGHLIGHT($("#ATTIC_HIGHLIGHT").is(":checked")) }), $("#ATTIC_SHOULD_REFRESH").on("change", function () { setATTIC_SHOULD_REFRESH($("#ATTIC_SHOULD_REFRESH").is(":checked")), showOrHide() }), $("#ATTIC_ENABLED").on("change", function () { setATTIC_ENABLED($("#ATTIC_ENABLED").is(":checked")), showOrHide() }), $("#ATTIC_MIN_REFRESH").bind("input propertychange", function () { setATTIC_MIN_REFRESH($("#ATTIC_MIN_REFRESH").val()) }), $("#ATTIC_MAX_REFRESH").bind("input propertychange", function () { setATTIC_MAX_REFRESH($("#ATTIC_MAX_REFRESH").val()) }), $("#ATTIC_LAST_REFRESH_DATE").on("change", function () { updateLastRefreshMs() }), $("#ATTIC_LAST_REFRESH_TIME").on("change", function () { updateLastRefreshMs() }), $("#ATTIC_ITEM_DB_MIN_PROFIT_NPS").bind("input propertychange", function () { setATTIC_ITEM_DB_MIN_PROFIT_NPS($("#ATTIC_ITEM_DB_MIN_PROFIT_NPS").val()) }), $("#ATTIC_ITEM_DB_MIN_PROFIT_PERCENT").bind("input propertychange", function () { setATTIC_ITEM_DB_MIN_PROFIT_PERCENT($("#ATTIC_ITEM_DB_MIN_PROFIT_PERCENT").val()) }), $("#ATTIC_MIN_BUY_TIME").bind("input propertychange", function () { setATTIC_MIN_BUY_TIME($("#ATTIC_MIN_BUY_TIME").val()) }), $("#ATTIC_MAX_BUY_TIME").bind("input propertychange", function () { setATTIC_MAX_BUY_TIME($("#ATTIC_MAX_BUY_TIME").val()) }), $("#ATTIC_RUN_BETWEEN_HOURS").bind("input propertychange", function () {
    try {
        var _ = JSON.parse($("#ATTIC_RUN_BETWEEN_HOURS").val());
        (!Array.isArray(_) || _.length < 2 || _.length > 2) && (_ = [0, 23]), _[0] < 0 && (_[0] = 0), _[1] > 23 && (_[1] = 23), _[1] < 0 && (_[1] = 0), _[0] > 23 && (_[0] = 23), _[0] > _[1] && (_ = [0, 23]), setATTIC_RUN_BETWEEN_HOURS(_)
    } catch (_) {}
}), $("#RESTOCK_LIST").bind("input propertychange", function () { try { setRESTOCK_LIST($("#RESTOCK_LIST").val().split("\n").map(_ => _.trim()).filter(_ => "" != _)) } catch (_) { window.alert("Error in parsing your restock list: " + _) } }), $("#MIN_REFRESH").bind("input propertychange", function () { setMIN_REFRESH($("#MIN_REFRESH").val()) }), $("#MAX_REFRESH").bind("input propertychange", function () { setMAX_REFRESH($("#MAX_REFRESH").val()) }), $("#ITEM_DB_MIN_PROFIT_NPS").bind("input propertychange", function () { setITEM_DB_MIN_PROFIT_NPS($("#ITEM_DB_MIN_PROFIT_NPS").val()) }), $("#ITEM_DB_MIN_PROFIT_PERCENT").bind("input propertychange", function () { setITEM_DB_MIN_PROFIT_PERCENT($("#ITEM_DB_MIN_PROFIT_PERCENT").val()) }), $("#MIN_REFRESH_STOCKED").bind("input propertychange", function () { setMIN_REFRESH_STOCKED($("#MIN_REFRESH_STOCKED").val()) }), $("#MAX_REFRESH_STOCKED").bind("input propertychange", function () { setMAX_REFRESH_STOCKED($("#MAX_REFRESH_STOCKED").val()) }), $("#ITEMS_TO_CONSIDER_STOCKED").bind("input propertychange", function () { setITEMS_TO_CONSIDER_STOCKED($("#ITEMS_TO_CONSIDER_STOCKED").val()) }), $("#MIN_CLICK_ITEM_IMAGE").bind("input propertychange", function () { setMIN_CLICK_ITEM_IMAGE($("#MIN_CLICK_ITEM_IMAGE").val()) }), $("#MAX_CLICK_ITEM_IMAGE").bind("input propertychange", function () { setMAX_CLICK_ITEM_IMAGE($("#MAX_CLICK_ITEM_IMAGE").val()) }), $("#MIN_CLICK_CONFIRM").bind("input propertychange", function () { setMIN_CLICK_CONFIRM($("#MIN_CLICK_CONFIRM").val()) }), $("#MAX_CLICK_CONFIRM").bind("input propertychange", function () { setMAX_CLICK_CONFIRM($("#MAX_CLICK_CONFIRM").val()) }), $("#MIN_OCR_PAGE").bind("input propertychange", function () { setMIN_OCR_PAGE($("#MIN_OCR_PAGE").val()) }), $("#MAX_OCR_PAGE").bind("input propertychange", function () { setMAX_OCR_PAGE($("#MAX_OCR_PAGE").val()) }), $("#EMAIL_TEMPLATE").bind("input propertychange", function () { setEMAIL_TEMPLATE($("#EMAIL_TEMPLATE").val()) }), $("#EMAIL_USER_ID").bind("input propertychange", function () { setEMAIL_USER_ID($("#EMAIL_USER_ID").val()) }), $("#EMAIL_SERVICE_ID").bind("input propertychange", function () { setEMAIL_SERVICE_ID($("#EMAIL_SERVICE_ID").val()) }), $("#RUN_BETWEEN_HOURS").bind("input propertychange", function () {
    try {
        var _ = JSON.parse($("#RUN_BETWEEN_HOURS").val());
        (!Array.isArray(_) || _.length < 2 || _.length > 2) && (_ = [0, 23]), _[0] < 0 && (_[0] = 0), _[1] > 23 && (_[1] = 23), _[1] < 0 && (_[1] = 0), _[0] > 23 && (_[0] = 23), _[0] > _[1] && (_ = [0, 23]), setRUN_BETWEEN_HOURS(_)
    } catch (_) {}
}), $("#STORES_TO_CYCLE_THROUGH_WHEN_STOCKED").bind("input propertychange", function () { try { setSTORES_TO_CYCLE_THROUGH_WHEN_STOCKED(JSON.parse($("#STORES_TO_CYCLE_THROUGH_WHEN_STOCKED").val())) } catch (_) {} }), $("#ENABLED").on("change", function () { setENABLED($("#ENABLED").is(":checked")), showOrHide() }), $("#HIGHLIGHT").on("change", function () { setHIGHLIGHT($("#HIGHLIGHT").is(":checked")) }), $("#CLICK_ITEM").on("change", function () { setCLICK_ITEM($("#CLICK_ITEM").is(":checked")), $("#CLICK_ITEM").is(":checked") || ($("#SHOULD_GO_FOR_SECOND_MOST_VALUABLE").prop("checked", !1), setSHOULD_GO_FOR_SECOND_MOST_VALUABLE(!1)), showOrHide() }), $("#SHOULD_GO_FOR_SECOND_MOST_VALUABLE").on("change", function () { setSHOULD_GO_FOR_SECOND_MOST_VALUABLE($("#SHOULD_GO_FOR_SECOND_MOST_VALUABLE").is(":checked")), $("#SHOULD_GO_FOR_SECOND_MOST_VALUABLE").is(":checked") && ($("#CLICK_ITEM").prop("checked", !0), setCLICK_ITEM(!0)) }), $("#CLICK_CONFIRM").on("change", function () { setCLICK_CONFIRM($("#CLICK_CONFIRM").is(":checked")), showOrHide() }), $("#SHOULD_SHOW_BANNER").on("change", function () { setSHOULD_SHOW_BANNER($("#SHOULD_SHOW_BANNER").is(":checked")) }), $("#USE_ITEM_DB").on("change", function () { setUSE_ITEM_DB($("#USE_ITEM_DB").is(":checked")), showOrHide() }), $("#SHOULD_CLICK_NEOPET").on("change", function () { setSHOULD_CLICK_NEOPET($("#SHOULD_CLICK_NEOPET").is(":checked")) }), $("#SHOULD_ANNOTATE_IMAGE").on("change", function () { setSHOULD_ANNOTATE_IMAGE($("#SHOULD_ANNOTATE_IMAGE").is(":checked")) }), $("#SHOULD_SOUND_ALERTS").on("change", function () { setSHOULD_SOUND_ALERTS($("#SHOULD_SOUND_ALERTS").is(":checked")) }), $("#SHOULD_ENTER_OFFER").on("change", function () { setSHOULD_ENTER_OFFER($("#SHOULD_ENTER_OFFER").is(":checked")) }), $("#SHOULD_SEND_EMAIL").on("change", function () { setSHOULD_SEND_EMAIL($("#SHOULD_SEND_EMAIL").is(":checked")), showOrHide() });
var resetButton = document.getElementById("reset");

function confirmReset() { 1 == confirm("Are you sure you want to reset all settings and reset your restock list to the default?") ? resetSettings() : console.log("Action cancelled") }

function resetSettings() { chrome.storage.local.remove(["BUY_UNKNOWN_ITEMS_PROFIT", "ITEM_DB_MIN_RARITY", "USE_BLACKLIST", "BLACKLIST", "MIN_REFRESH", "MAX_REFRESH", "MIN_REFRESH_STOCKED", "MAX_REFRESH_STOCKED", "SHOULD_CLICK_NEOPET", "ENABLED", "HIGHLIGHT", "CLICK_ITEM", "CLICK_CONFIRM", "SHOULD_SHOW_BANNER", "SHOULD_ANNOTATE_IMAGE", "SHOULD_SOUND_ALERTS", "SHOULD_ENTER_OFFER", "SHOULD_SEND_EMAIL", "SHOULD_GO_FOR_SECOND_MOST_VALUABLE", "STORES_TO_CYCLE_THROUGH_WHEN_STOCKED", "RUN_BETWEEN_HOURS", "ITEMS_TO_CONSIDER_STOCKED", "MIN_CLICK_ITEM_IMAGE", "MAX_CLICK_ITEM_IMAGE", "MIN_CLICK_CONFIRM", "MAX_CLICK_CONFIRM", "MIN_OCR_PAGE", "MAX_OCR_PAGE", "EMAIL_TEMPLATE", "EMAIL_USER_ID", "EMAIL_SERVICE_ID", "RESTOCK_LIST", "USE_ITEM_DB", "ITEM_DB_MIN_PROFIT_NPS", "ITEM_DB_MIN_PROFIT_PERCENT", "ATTIC_ENABLED", "ATTIC_HIGHLIGHT", "ATTIC_CLICK_ITEM", "ATTIC_ITEM_DB_MIN_PROFIT_NPS", "ATTIC_ITEM_DB_MIN_PROFIT_PERCENT", "ATTIC_MIN_BUY_TIME", "ATTIC_MAX_BUY_TIME", "ATTIC_RUN_BETWEEN_HOURS", "ATTIC_MIN_REFRESH", "ATTIC_MAX_REFRESH", "ATTIC_SHOULD_REFRESH", "ATTIC_LAST_REFRESH_MS"], function () { console.log("Settings cleared"), location.reload() }) } resetButton.onclick = function (_) { confirmReset() }, chrome.storage.local.get({ BUY_UNKNOWN_ITEMS_PROFIT: 1e5, ITEM_DB_MIN_RARITY: 1, USE_BLACKLIST: !1, BLACKLIST: [], ENABLED: !0, USE_ITEM_DB: !0, ITEM_DB_MIN_PROFIT_NPS: 1e4, ITEM_DB_MIN_PROFIT_PERCENT: .5, HIGHLIGHT: !0, CLICK_ITEM: !0, CLICK_CONFIRM: !0, SHOULD_SHOW_BANNER: !0, MIN_REFRESH: 2500, MAX_REFRESH: 3500, MIN_REFRESH_STOCKED: 37500, MAX_REFRESH_STOCKED: 45e3, ITEMS_TO_CONSIDER_STOCKED: 1, MIN_CLICK_ITEM_IMAGE: 500, MAX_CLICK_ITEM_IMAGE: 1e3, MIN_CLICK_CONFIRM: 100, MAX_CLICK_CONFIRM: 200, MIN_OCR_PAGE: 750, MAX_OCR_PAGE: 1100, EMAIL_TEMPLATE: "", EMAIL_USER_ID: "", EMAIL_SERVICE_ID: "", SHOULD_CLICK_NEOPET: !0, SHOULD_ANNOTATE_IMAGE: !0, SHOULD_SOUND_ALERTS: !0, SHOULD_ENTER_OFFER: !0, SHOULD_SEND_EMAIL: !1, SHOULD_GO_FOR_SECOND_MOST_VALUABLE: !1, STORES_TO_CYCLE_THROUGH_WHEN_STOCKED: [2, 58], RUN_BETWEEN_HOURS: [0, 23], RESTOCK_LIST: defaultDesiredItems, ATTIC_ENABLED: !0, ATTIC_HIGHLIGHT: !0, ATTIC_CLICK_ITEM: !0, ATTIC_ITEM_DB_MIN_PROFIT_NPS: 1e4, ATTIC_ITEM_DB_MIN_PROFIT_PERCENT: .5, ATTIC_MIN_BUY_TIME: 500, ATTIC_MAX_BUY_TIME: 1e3, ATTIC_RUN_BETWEEN_HOURS: [0, 23], ATTIC_MIN_REFRESH: 2500, ATTIC_MAX_REFRESH: 3500, ATTIC_SHOULD_REFRESH: !1, ATTIC_LAST_REFRESH_MS: -1 }, function (_) { $("#USE_BLACKLIST").prop("checked", _.USE_BLACKLIST), $("#BLACKLIST").val(_.BLACKLIST.join("\n")), $("#ITEM_DB_MIN_RARITY").val(_.ITEM_DB_MIN_RARITY), $("#BUY_UNKNOWN_ITEMS_PROFIT").val(_.BUY_UNKNOWN_ITEMS_PROFIT), $("#ATTIC_ENABLED").prop("checked", _.ATTIC_ENABLED), $("#ATTIC_SHOULD_REFRESH").prop("checked", _.ATTIC_SHOULD_REFRESH), $("#ATTIC_HIGHLIGHT").prop("checked", _.ATTIC_HIGHLIGHT), $("#ATTIC_CLICK_ITEM").prop("checked", _.ATTIC_CLICK_ITEM), $("#ATTIC_ITEM_DB_MIN_PROFIT_NPS").val(_.ATTIC_ITEM_DB_MIN_PROFIT_NPS), $("#ATTIC_ITEM_DB_MIN_PROFIT_PERCENT").val(_.ATTIC_ITEM_DB_MIN_PROFIT_PERCENT), $("#ATTIC_MIN_BUY_TIME").val(_.ATTIC_MIN_BUY_TIME), $("#ATTIC_MAX_BUY_TIME").val(_.ATTIC_MAX_BUY_TIME), $("#ATTIC_MIN_REFRESH").val(_.ATTIC_MIN_REFRESH), $("#ATTIC_MAX_REFRESH").val(_.ATTIC_MAX_REFRESH), _.ATTIC_LAST_REFRESH_MS > 0 && updateDateTimeInputs(_.ATTIC_LAST_REFRESH_MS), $("#ATTIC_RUN_BETWEEN_HOURS").val("[" + _.ATTIC_RUN_BETWEEN_HOURS + "]"), $("#ITEM_DB_MIN_PROFIT_NPS").val(_.ITEM_DB_MIN_PROFIT_NPS), $("#ITEM_DB_MIN_PROFIT_PERCENT").val(_.ITEM_DB_MIN_PROFIT_PERCENT), $("#USE_ITEM_DB").prop("checked", _.USE_ITEM_DB), $("#MIN_REFRESH").val(_.MIN_REFRESH), $("#MAX_REFRESH").val(_.MAX_REFRESH), $("#MIN_REFRESH_STOCKED").val(_.MIN_REFRESH_STOCKED), $("#MAX_REFRESH_STOCKED").val(_.MAX_REFRESH_STOCKED), $("#STORES_TO_CYCLE_THROUGH_WHEN_STOCKED").val("[" + _.STORES_TO_CYCLE_THROUGH_WHEN_STOCKED + "]"), $("#RUN_BETWEEN_HOURS").val("[" + _.RUN_BETWEEN_HOURS + "]"), $("#ITEMS_TO_CONSIDER_STOCKED").val(_.ITEMS_TO_CONSIDER_STOCKED), $("#MIN_CLICK_ITEM_IMAGE").val(_.MIN_CLICK_ITEM_IMAGE), $("#MAX_CLICK_ITEM_IMAGE").val(_.MAX_CLICK_ITEM_IMAGE), $("#MIN_CLICK_CONFIRM").val(_.MIN_CLICK_CONFIRM), $("#MAX_CLICK_CONFIRM").val(_.MAX_CLICK_CONFIRM), $("#MIN_OCR_PAGE").val(_.MIN_OCR_PAGE), $("#MAX_OCR_PAGE").val(_.MAX_OCR_PAGE), $("#EMAIL_TEMPLATE").val(_.EMAIL_TEMPLATE), $("#EMAIL_USER_ID").val(_.EMAIL_USER_ID), $("#EMAIL_SERVICE_ID").val(_.EMAIL_SERVICE_ID), $("#ENABLED").prop("checked", _.ENABLED), $("#HIGHLIGHT").prop("checked", _.HIGHLIGHT), $("#CLICK_ITEM").prop("checked", _.CLICK_ITEM), $("#CLICK_CONFIRM").prop("checked", _.CLICK_CONFIRM), $("#SHOULD_SHOW_BANNER").prop("checked", _.SHOULD_SHOW_BANNER), $("#SHOULD_CLICK_NEOPET").prop("checked", _.SHOULD_CLICK_NEOPET), $("#SHOULD_ANNOTATE_IMAGE").prop("checked", _.SHOULD_ANNOTATE_IMAGE), $("#SHOULD_SOUND_ALERTS").prop("checked", _.SHOULD_SOUND_ALERTS), $("#SHOULD_ENTER_OFFER").prop("checked", _.SHOULD_ENTER_OFFER), $("#SHOULD_SEND_EMAIL").prop("checked", _.SHOULD_SEND_EMAIL), $("#SHOULD_GO_FOR_SECOND_MOST_VALUABLE").prop("checked", _.SHOULD_GO_FOR_SECOND_MOST_VALUABLE), $("#RESTOCK_LIST").val(_.RESTOCK_LIST.join("\n")), showOrHide() });