var extpay = ExtPay("restock-highligher-autobuyer");

function openPaymentPage() { extpay.openPaymentPage(), setInterval(function () { checkRedirect() }, 1e4) }

function checkRedirect() { extpay.getUser().then(e => { e.paid && (chrome.storage.local.set({ EXT_P_S: !0 }, function () {}), window.location.href = "thanks.html") }).catch(e => { console.error(e) }) } $("#PAYMENT_LINK").bind("click", function () { openPaymentPage() }), $("#PAYMENT_LINK2").bind("click", function () { openPaymentPage() }), checkRedirect();