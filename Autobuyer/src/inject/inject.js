function topLevelTurbo() {
    var e = performance.now();
    function t(e, t) {
        document.title = e.toUpperCase(), t = t + " - " + (new Date)
            .toLocaleString(), console.log(e + " - " + t), chrome.runtime.sendMessage({
                neobuyer: "NeoBuyer",
                type: "Notification",
                notificationObject: {
                    type: "basic",
                    title: e,
                    message: t,
                    iconUrl: "../../icons/icon48.png"
                }
            })
    }
    
    function n(e) {
        chrome.runtime.sendMessage({
            neobuyer: "NeoBuyer",
            type: "OpenQuickstockPage",
            itemName: e
        })
    }
    function o() {
        document.body.innerText.indexOf("502 Bad Gateway\nopenresty") > -1 || document.body.innerText.indexOf("504 Gateway Time-out\nopenresty") > -1 || document.body.innerText.indexOf("Loading site please wait...") > -1 ? setTimeout((function() {
            location.reload()
        }), 1e4) : t("Captcha page detected", "Captcha page detected. Pausing.")
    }
    function r() {
        if (!(window.location.href.indexOf("neopets.com/halloween/garage") > -1)) return !1;
        var e = document.body.innerText.indexOf("Almost Abandoned Attic") > -1,
            t = document.body.innerText.indexOf("I am very happy to have a visitor") > -1,
            n = document.body.innerText.indexOf("Sorry, but you cannot buy any more items from this shop today! Please come back again tomorrow so that others may have a fair chance.") > -1,
            r = document.body.innerText.indexOf("Sorry, please try again later.") > -1;
        return !!(e && t || n || r) || (o(), !1)
    }
    function i() {
        var e = window.location.href.indexOf("neopets.com/haggle.phtml") > -1,
            t = document.body.innerText.indexOf("Haggle for") > 0;
        return !!e && (!!t || (o(), !1))
    }
    function a() {
        return window.location.href.indexOf("neopets.com/objects.phtml") > -1 && (!!(document.body.innerText.indexOf("Neopian Inflation") > 0) || (o(), !1))
    }
    function c() {
        return i() || a()
    }
    function u() {
        return r() || c()
    }
    function l() {
        var o, l, m, s, d, f, _, T, E, g, h, p, I, A, y, S, M, C, v, N, R, O, b, w, x, L, D, H, B, P, U, k, F, q, K, G, W, X, Y, j, V, z, $, Q, J, Z, ee, te, ne;
        chrome.storage.local.get({
            BUY_UNKNOWN_ITEMS_PROFIT: 1e5,
            ITEM_DB_MIN_RARITY: 1,
            USE_BLACKLIST: !1,
            BLACKLIST: [],
            ENABLED: !0,
            USE_ITEM_DB: !0,
            ITEM_DB_MIN_PROFIT_NPS: 1e4,
            ITEM_DB_MIN_PROFIT_PERCENT: .5,
            HIGHLIGHT: !0,
            CLICK_ITEM: !0,
            CLICK_CONFIRM: !0,
            SHOULD_SHOW_BANNER: !0,
            MIN_REFRESH: 3500,
            MAX_REFRESH: 5e3,
            MIN_REFRESH_STOCKED: 37500,
            MAX_REFRESH_STOCKED: 45e3,
            ITEMS_TO_CONSIDER_STOCKED: 1,
            MIN_CLICK_ITEM_IMAGE: 500,
            MAX_CLICK_ITEM_IMAGE: 1e3,
            MIN_CLICK_CONFIRM: 100,
            MAX_CLICK_CONFIRM: 200,
            MIN_OCR_PAGE: 750,
            MAX_OCR_PAGE: 1100,
            EMAIL_TEMPLATE: "",
            EMAIL_USER_ID: "",
            EMAIL_SERVICE_ID: "",
            SHOULD_CLICK_NEOPET: !0,
            SHOULD_ANNOTATE_IMAGE: !0,
            SHOULD_ENTER_OFFER: !0,
            SHOULD_SEND_EMAIL: !1,
            SHOULD_GO_FOR_SECOND_MOST_VALUABLE: !1,
            STORES_TO_CYCLE_THROUGH_WHEN_STOCKED: [2, 58],
            RUN_BETWEEN_HOURS: [0, 23],
            RESTOCK_LIST: defaultDesiredItems,
            ATTIC_ENABLED: !0,
            ATTIC_HIGHLIGHT: !0,
            ATTIC_CLICK_ITEM: !0,
            ATTIC_ITEM_DB_MIN_PROFIT_NPS: 1e4,
            ATTIC_ITEM_DB_MIN_PROFIT_PERCENT: .5,
            ATTIC_MIN_BUY_TIME: 500,
            ATTIC_MAX_BUY_TIME: 750,
            ATTIC_RUN_BETWEEN_HOURS: [0, 23],
            ATTIC_MIN_REFRESH: 2500,
            ATTIC_MAX_REFRESH: 3500,
            ATTIC_SHOULD_REFRESH: !1,
            ATTIC_LAST_REFRESH_MS: -1,
            ATTIC_PREV_NUM_ITEMS: -1,
            SEND_TO_SDB_AFTER_PURCHASE: !1,
            PAUSE_AFTER_BUY_MS: 0
        }, (function(oe) {
            ne = oe.PAUSE_AFTER_BUY_MS, m = oe.SEND_TO_SDB_AFTER_PURCHASE, J = oe.BUY_UNKNOWN_ITEMS_PROFIT, Z = oe.ITEM_DB_MIN_RARITY, ee = oe.USE_BLACKLIST, te = oe.BLACKLIST, o = oe.ENABLED, B = oe.USE_ITEM_DB, P = oe.ITEM_DB_MIN_PROFIT_NPS, U = oe.ITEM_DB_MIN_PROFIT_PERCENT, l = oe.HIGHLIGHT, s = oe.CLICK_ITEM, d = oe.CLICK_CONFIRM, f = oe.SHOULD_SHOW_BANNER, _ = oe.SHOULD_CLICK_NEOPET, T = oe.SHOULD_ANNOTATE_IMAGE, E = oe.SHOULD_ENTER_OFFER, g = oe.SHOULD_SEND_EMAIL, h = oe.SHOULD_GO_FOR_SECOND_MOST_VALUABLE, p = oe.STORES_TO_CYCLE_THROUGH_WHEN_STOCKED, I = oe.RUN_BETWEEN_HOURS, A = oe.MIN_REFRESH, y = oe.MAX_REFRESH, S = oe.ITEMS_TO_CONSIDER_STOCKED, M = oe.MIN_REFRESH_STOCKED, C = oe.MAX_REFRESH_STOCKED, v = oe.MIN_CLICK_ITEM_IMAGE, N = oe.MAX_CLICK_ITEM_IMAGE, R = oe.MIN_CLICK_CONFIRM, O = oe.MAX_CLICK_CONFIRM, b = oe.MIN_OCR_PAGE, w = oe.MAX_OCR_PAGE, x = oe.EMAIL_TEMPLATE, L = oe.EMAIL_USER_ID, D = oe.EMAIL_SERVICE_ID, H = oe.RESTOCK_LIST, k = oe.ATTIC_ENABLED, F = oe.ATTIC_HIGHLIGHT, q = oe.ATTIC_CLICK_ITEM, K = oe.ATTIC_ITEM_DB_MIN_PROFIT_NPS, G = oe.ATTIC_ITEM_DB_MIN_PROFIT_PERCENT, W = oe.ATTIC_MIN_BUY_TIME, X = oe.ATTIC_MAX_BUY_TIME, Y = oe.ATTIC_RUN_BETWEEN_HOURS, j = oe.ATTIC_MIN_REFRESH, V = oe.ATTIC_MAX_REFRESH, z = oe.ATTIC_SHOULD_REFRESH, $ = oe.ATTIC_LAST_REFRESH_MS, Q = oe.ATTIC_PREV_NUM_ITEMS;
            var re, ie = "Attic",
                ae = "qpkzsoynerzxsqw",
                ce = [0, 60],
                ue = 50,
                le = 100,
                me = 5e3,
                se = 5100,
                de = b / 2,
                fe = w / 2,
                _e = !1,
                Te = !1,
                Ee = 50;
            function ge() {
                if (i()) qe(), De() ? xe() : we() ? Ce() : (document.documentElement.textContent || document.documentElement.innerText)
                    .indexOf("You don't have that kind of money") > -1 ? (o = document.querySelector("h2")
                        .innerText.replaceAll("Haggle for ", ""), c = {
                            status: "missed",
                            item: o,
                            notes: "You do not have enough neopoints to purchase " + o + ". Program will pause now."
                        }, u = document.getElementsByTagName("h1")[0].textContent, ve(c), he("Not enough NPs", "Not enough NPs to purchase " + o + " from " + u + ". Pausing."), be(o, u, "-", "Not enough neopoints")) : document.body.innerText.indexOf("every five seconds") > -1 ? (be(document.getElementsByTagName("h2")[0].innerText.split("Haggle for ")[1], document.getElementsByTagName("h1")[0].textContent, "-", "Five second rule"), he("Five second rule", "Attempted to purchase item within 5 seconds of a different purchase"), window.history.back()) : document.body.innerText.indexOf("Sorry, you can only carry a maximum of") > -1 ? he("Inventory full", "Inventory was full. Pausing.") : (Ke("Entering offer..."), function() {
                        (document.documentElement.textContent || document.documentElement.innerText)
                        .indexOf("You must select the correct pet in order to continue") > -1 && console.error("Incorrect click on pet!");
                        E && setTimeout((function() {
                            var e, t = new RegExp("[0-9|,]+ Neopoints")
                                .exec(document.getElementById("shopkeeper_makes_deal")
                                    .innerText)[0].replace(" Neopoints", "")
                                .replaceAll(",", ""),
                                n = Number(t),
                                o = (e = n, Math.random() > .33 ? function(e) {
                                    for (var t = 1 - (.015 * Math.random() + .015), n = Math.round(t * e), o = Math.round(e * (1 + .005 * Math.random())), r = n, i = n, a = Oe(n); r <= o;) {
                                        var c = Oe(r);
                                        (c > a || c == a && Math.random() < .33) && (a = c, i = r), r += 1
                                    }
                                    return i
                                }(e) : function(e) {
                                    var t = 100 * (Math.round(4 * Math.random()) + 1),
                                        n = Math.round(e / t) * t;
                                    return e <= 500 && (n = 10 * Math.round(e / 10)), n
                                }(e));
                            document.querySelector(".haggleForm input[type=text]")
                                .value = o
                        }), Math.random() * (fe - de) + de);
                        t = document.querySelector("input[type='image']"), n = performance.now(),
                            function(e, t, n, o) {
                                var r = new Image;
                                r.src = e;
                                var i = performance.now();
                                r.onload = function() {
                                    var e = performance.now();
                                    console.log("Image load took " + Math.round(e - i) + " milliseconds.");
                                    var a = document.createElement("canvas");
                                    a.width = n, a.height = o;
                                    var c = a.getContext("2d");
                                    c.drawImage(r, 0, 0), document.body.append(a);
                                    for (var u = c.getImageData(0, 0, n, o), l = 0, m = 100, s = 0, d = 1, f = 0; f < u.data.length; f += 4 * d) {
                                        if (red = u.data[f + 0], green = u.data[f + 1], blue = u.data[f + 2], alpha = u.data[f + 3], 0 != red || 0 != green || 0 != blue) {
                                            var _ = We(red, green, blue)
                                                .l;
                                            _ < m && (m = _, s = l)
                                        }
                                        l += d
                                    }
                                    var T = Math.floor(s / n);
                                    t(s - T * n, T)
                                }
                            }(t.src, (function(o, r) {
                                var i = performance.now(),
                                    a = Math.max(i - e, i - n),
                                    c = Math.random() * (w - b) + b,
                                    u = Math.max(Math.round(c - a), 0);
                                setTimeout((function() {
                                    var a = performance.now();
                                    ! function(e, t, n) {
                                        var o = function(e) {
                                                for (var t = 0, n = 0; e && !isNaN(e.offsetLeft) && !isNaN(e.offsetTop);) t += e.offsetLeft - e.scrollLeft, n += e.offsetTop - e.scrollTop, e = e.offsetParent;
                                                return {
                                                    top: n,
                                                    left: t
                                                }
                                            }(e),
                                            r = Math.round(t + o.left),
                                            i = Math.round(n + o.top),
                                            a = new MouseEvent("click", {
                                                view: window,
                                                bubbles: !0,
                                                cancelable: !0,
                                                clientX: r,
                                                clientY: i
                                            });
                                        _ && (e.dispatchEvent(a), Ae()),
                                            function(e, t) {
                                                if (T) {
                                                    var n = document.createElement("img");
                                                    n.src = "https://upload.wikimedia.org/wikipedia/commons/3/31/Circle_Burgundy_Solid.svg", n.style.height = "14px", n.style.width = "14px", n.style.position = "absolute", n.style.top = t - 7 + "px", n.style.left = e - 7 + "px", n.style.zIndex = "9999999999", n.style.pointerEvents = "none", document.body.appendChild(n), Ge("\n                          input[type='image'] {\n                            filter: contrast(2) grayscale(1);\n                          }\n                        ")
                                                }
                                            }(r, i)
                                    }(t, o, r);
                                    var c = performance.now();
                                    console.log("Load script to click image took " + Math.round(performance.now() - e) + "ms [X: " + o + ", Y: " + r + "]. Image solve took " + Math.round(i - n) + "ms. Added " + u + "ms to meet minimum. Click then took " + Math.round(c - a) + "ms.")
                                }), u)
                            }), t.width, t.height);
                        var t, n
                    }());
                else if (a())
                    if (qe(), De()) xe();
                    else if (we()) Ce();
                else {
                    ! function() {
                        if (l)
                            if (B) ! function() {
                                var e = Array.from(document.querySelectorAll(".item-img"))
                                    .map((e => e.getAttribute("data-name"))),
                                    t = Array.from(document.querySelectorAll(".item-img"))
                                    .map((e => parseInt(e.getAttribute("data-price")
                                        .replaceAll(",", "")))),
                                    n = He(e, t),
                                    o = Be(e, t, n, P, U),
                                    r = Pe(e, t, n, P, U);
                                if (null != o) {
                                    for (var i of r) document.querySelector(`.item-img[data-name="${i}"]`)
                                        .parentElement.style.backgroundColor = "lightgreen";
                                    document.querySelector(`.item-img[data-name="${o}"]`)
                                        .parentElement.style.backgroundColor = "orangered"
                                }
                            }();
                            else {
                                var e = new Set(Array.from(document.querySelectorAll(".item-img"))
                                        .map((e => e.getAttribute("data-name")))),
                                    t = H.find((t => e.has(t) && !Ue(t))),
                                    n = H.filter((t => e.has(t) && !Ue(t)));
                                if (null != t) {
                                    for (var o of n) document.querySelector(`.item-img[data-name="${o}"]`)
                                        .parentElement.style.backgroundColor = "lightgreen";
                                    document.querySelector(`.item-img[data-name="${t}"]`)
                                        .parentElement.style.backgroundColor = "orangered"
                                }
                            }
                    }();
                    var t = function() {
                        var e;
                        if (B) {
                            var t = function() {
                                for (var e = Array.from(document.querySelectorAll(".item-img"))
                                        .map((e => e.getAttribute("data-name"))), t = Array.from(document.querySelectorAll(".item-img"))
                                        .map((e => parseInt(e.getAttribute("data-price")
                                            .replaceAll(",", "")))), n = He(e, t), o = null, r = null, i = -1, a = 0; a < n.length; a++) {
                                    var c = n[a] > P,
                                        u = n[a] / t[a] > U;
                                    c && u && n[a] > i && (i = n[a], null != r && (o = r), r = e[a])
                                }
                                return null == r ? [] : null == o ? [r] : [r, o]
                            }();
                            if (0 == t.length) return;
                            1 == t.length ? e = t[0] : h ? (e = t[1], console.warn("Skipping first most valuable item: " + t[0])) : e = t[0]
                        } else {
                            var n = new Set(Array.from(document.querySelectorAll(".item-img"))
                                    .map((e => e.getAttribute("data-name")))),
                                o = H.find((e => n.has(e) && !Ue(e)));
                            if (e = o, h) {
                                var r = H.find((e => n.has(e) && e !== o && !Ue(e)));
                                r && (console.warn("Skipping first most valuable item: " + e), e = r)
                            }
                        }
                        e && s ? he("Buying " + e, "Buying " + e + " from main shop") : e && he(e + " is in stock", e + " is in stock in main shop");
                        return e
                    }();
                    t ? function(e) {
                            if (s) {
                                var t = document.querySelector(`.item-img[data-name="${e}"]`);
                                setTimeout((function() {
                                    t.click(), Ae()
                                }), Math.random() * (N - v) + v)
                            }
                        }(t) : ! function() {
                            var e = new Date,
                                t = e.getHours(),
                                n = e.getMinutes();
                            e.getDay();
                            return t >= I[0] && t <= I[1] && n >= ce[0] && n <= ce[1]
                        }() ? (_e || (he("Waiting", "Waiting for scheduled time in main shop"), _e = !0), setTimeout((function() {
                            ge()
                        }), 3e4)) : Re(),
                        function() {
                            if (d) {
                                var e = !1;
                                clearInterval(re), re = setInterval((function() {
                                    var t, n = document.getElementById("confirm-link");
                                    ((t = n)
                                        .offsetWidth || t.offsetHeight || t.getClientRects()
                                        .length) && setTimeout((function() {
                                        e || (n.click(), Ae(), e = !0)
                                    }), Math.random() * (O - R) + R)
                                }), Ee)
                            }
                        }()
                } else r() > -1 && function() {
                    if (qe(), function() {
                            var e = "I have placed it in your inventory";
                            return document.body.innerText.indexOf(e) > -1
                        }()) ! function() {
                        var e = document.getElementsByTagName("strong")[0].innerText,
                            t = {
                                status: "bought",
                                item: e,
                                notes: ""
                            };
                        ve(t), he(e + " bought", e + " bought from Attic"), be(e, ie, "-", "Bought"), m && n(e);
                        setTimeout((function() {
                            Ie()
                        }), 12e5)
                    }(), Se();
                    else if (pe("Didn't you just buy something?")) he("Need to wait 20 minutes in Attic", "Pausing NeoBuyer in Attic for 20 minutes"), setTimeout((function() {
                        window.location.href = "https://www.neopets.com/halloween/garage.phtml"
                    }), 12e5);
                    else if (pe("Sorry, please try again later.")) he("Attic is refresh banned", "Pausing NeoBuyer in Attic");
                    else if (pe("cannot buy any more items from this shop today")) he("Five item limit reached in Attic", "Pausing NeoBuyer in Attic");
                    else {
                        ! function() {
                            if (Q < 0) return;
                            if ($ < 0) return;
                            var e = ye(),
                                t = Date.now();
                            e > Q && chrome.storage.local.set({
                                ATTIC_PREV_NUM_ITEMS: e,
                                ATTIC_LAST_REFRESH_MS: t
                            }, (function() {
                                he("Attic restocked", "Restock detected in Attic, updating last restock estimate.")
                            }))
                        }(), pe("Sorry, we just sold out of that.") && he("Sold out", "Item was sold out at the Attic"), Se();
                        var e = (o = Array.from(document.querySelectorAll("#items li"))
                            .map((e => e.getAttribute("oname"))), r = Array.from(document.querySelectorAll("#items li"))
                            .map((e => e.getAttribute("oprice")
                                .replaceAll(",", ""))), i = He(o, r), Be(o, r, i, K, G));
                        e ? function(e) {
                            if (q) {
                                var t = Math.random() * (X - W) + W;
                                he("Attempting " + e + " in Attic", "Attempting to buy " + e + " in Attic in " + Ne(t));
                                var n = document.querySelector(`#items li[oname="${e}"]`),
                                    o = n.getAttribute("oii"),
                                    r = n.getAttribute("oprice");
                                be(e, ie, r, "Attempted"), setTimeout((function() {
                                    document.getElementById("oii")
                                        .value = o, document.getElementById("frm-abandoned-attic")
                                        .submit()
                                }), t)
                            }
                        }(e) : !z || function() {
                            var e = new Date,
                                t = e.getHours();
                            e.getMinutes(), e.getDay();
                            return t >= Y[0] && t <= Y[1]
                        }() ? Ie() : (_e || (he("Waiting", "Waiting for scheduled time in Attic"), _e = !0), setTimeout((function() {
                            ge()
                        }), 3e4)), t = ye(), chrome.storage.local.set({
                            ATTIC_PREV_NUM_ITEMS: t
                        }, (function() {}))
                    }
                    var t;
                    var o, r, i
                }();
                var o, c, u
            }
            function he(e, n) {
                Ke(n), t(e, n)
            }
            function pe(e) {
                return document.body.innerText.indexOf(e) > -1
            }
            function Ie() {
                if (z) {
                    var e = function() {
                            if ($ < 0) return Math.random() * (V - j) + j;
                            var e = Date.now(),
                                t = 42e4,
                                n = 0,
                                o = 8,
                                r = $,
                                i = $;
                            for (; r < e && i < e;) r += t + 1e3 * n, i += t + 1e3 * o;
                            return e <= i && e >= r ? Math.random() * (V - j) + j : r - e
                        }(),
                        t = "Waiting " + Ne(e) + " to reload...";
                    if ($ > 0) t += " Last restock: " + moment($)
                        .tz("America/Los_Angeles")
                        .format("h:mm:ss A") + " NST...";
                    Ke(t), setTimeout((function() {
                        window.location.href = "https://www.neopets.com/halloween/garage.phtml"
                    }), e)
                } else Ke("Attic auto refresh is disabled. Waiting for manual refresh.")
            }
            function Ae() {
                chrome.runtime.sendMessage({
                    neobuyer: "NeoBuyer",
                    type: "Beep"
                })
            }
            function ye() {
                return Array.from(document.querySelectorAll("#items li"))
                    .map((e => e.getAttribute("oname")))
                    .length
            }
            function Se() {
                if (F) {
                    var e = Array.from(document.querySelectorAll("#items li"))
                        .map((e => e.getAttribute("oname"))),
                        t = Array.from(document.querySelectorAll("#items li"))
                        .map((e => e.getAttribute("oprice")
                            .replaceAll(",", ""))),
                        n = He(e, t),
                        o = Be(e, t, n, K, G),
                        r = Pe(e, t, n, K, G);
                    if (null != o) {
                        for (var i of r) Me(i, "lightgreen");
                        Me(o, "orangered")
                    }
                }
            }
            function Me(e, t) {
                document.querySelector(`#items li[oname="${e}"]`)
                    .style.backgroundColor = t
            }
            function Ce() {
                var e = document.querySelector("h2")
                    .innerText.replaceAll("Haggle for ", "");
                ve({
                    status: "bought",
                    item: e,
                    notes: ""
                });
                var t = document.getElementsByTagName("h1")[0].textContent,
                    o = document.querySelector("p > b")
                    .textContent.split("your offer of ")[1].split(" Neopoints!'")[0];
                he(e + " bought", e + " bought from " + t + " for " + o + " NPs"), be(e, t, o, "Bought"), m && n(e), Re()
            }
            function ve(e) {
                g && window.emailjs.send(D, x, e, L)
                    .then((function(e) {
                        console.log("Email sent!", e.status, e.text)
                    }), (function(e) {
                        console.error("Failed to send email...", e)
                    }))
            }
            function Ne(e) {
                return (e / 1e3)
                    .toFixed(2) + " secs"
            }
            function Re() {
                var e;
                if (De()) Ke("Waiting " + Ne(t = Math.random() * (le - ue) + ue) + " to reload page..."), setTimeout((function() {
                    Le()
                }), t);
                else if (we()) {
                    Ke("Waiting " + Ne(t = Math.random() * (se - me) + me + ne) + " to reload page..."), setTimeout((function() {
                        Le()
                    }), t)
                } else if (e = Array.from(document.querySelectorAll(".item-img"))
                    .length, document.title = e + " stocked items", e < S) {
                    Ke("Waiting " + Ne(t = Math.random() * (y - A) + A) + " to reload page..."), setTimeout((function() {
                        location.reload()
                    }), t)
                } else {
                    var t;
                    Ke("Waiting " + Ne(t = Math.random() * (C - M) + M) + " to reload page..."), setTimeout((function() {
                        ! function() {
                            if (0 == p.length) location.reload();
                            else if (1 == p.length) window.location.href = "http://www.neopets.com/objects.phtml?type=shop&obj_type=" + p[0];
                            else {
                                var e = !1;
                                p.forEach(((t, n) => {
                                    if (window.location.toString()
                                        .match(/obj_type=(\d+)/)[1] == t) {
                                        var o = n == p.length - 1 ? p[0] : p[n + 1];
                                        e = !0, window.location.href = "http://www.neopets.com/objects.phtml?type=shop&obj_type=" + o
                                    }
                                })), e || (window.location.href = "http://www.neopets.com/objects.phtml?type=shop&obj_type=" + p[0])
                            }
                        }()
                    }), t)
                }
            }
            function Oe(e) {
                return 20 - function(e) {
                    let t = 0,
                        n = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    for (; e > 0;) {
                        n[e % 10]++, e = Math.floor(e / 10)
                    }
                    for (let e = 0; e < 10; e++) n[e] >= 1 && t++;
                    return t
                }(e)
            }
            function be(e, t, n, o) {
                chrome.storage.local.get({
                    ITEM_HISTORY: []
                }, (function(r) {
                    var i, a = r.ITEM_HISTORY;
                    i = t == ie ? document.querySelector(".user a:nth-of-type(1)")
                        .innerText : document.getElementsByClassName("nav-profile-dropdown-text")[0].innerText.split("Welcome, ")[1];
                    var c = {
                        "Item Name": e,
                        "Shop Name": t,
                        Price: n,
                        Status: o,
                        "Date & Time": (new Date)
                            .toLocaleString(),
                        Account: i
                    };
                    a.push(c), chrome.storage.local.set({
                        ITEM_HISTORY: a
                    }, (function() {
                        console.log("Added item to history")
                    }))
                }))
            }
            function we() {
                return (document.documentElement.textContent || document.documentElement.innerText)
                    .indexOf("has been added to your inventory") > -1
            }
            function xe() {
                var e = document.querySelector("h2")
                    .innerText.replaceAll("Haggle for ", "");
                he("Sold out", "Sold out of " + e), be(e, document.getElementsByTagName("h1")[0].textContent, "-", "Sold out"), Re()
            }
            function Le() {
                document.querySelector("div.shop-bg")
                    .click()
            }
            function De() {
                return (document.documentElement.textContent || document.documentElement.innerText)
                    .indexOf(" is SOLD OUT!") > -1
            }
            function He(e, t) {
                var n = [];
                for (var o of e) {
                    var r = item_db[o];
                    if (!ke(o) || Ue(o)) n.push(-99999999);
                    else if (null == r) console.warn("Did not have item in database"), n.push(J);
                    else if (null == r.Price || 0 == r.Price) console.warn("Did not have price for item in database"), n.push(J);
                    else {
                        var i = parseInt(r.Price.toString()
                            .replaceAll(",", "")) - parseInt(t[e.indexOf(o)]);
                        n.push(i)
                    }
                }
                return n
            }
            function Be(e, t, n, o, r) {
                for (var i = null, a = -1, c = 0; c < n.length; c++) {
                    var u = n[c] >= o,
                        l = n[c] / t[c] >= r;
                    u && l && n[c] > a && (a = n[c], i = e[c])
                }
                return i
            }
            function Pe(e, t, n, o, r) {
                for (var i = [], a = 0; a < n.length; a++) {
                    var c = n[a] > o,
                        u = n[a] / t[a] > r;
                    c && u && i.push(e[a])
                }
                return i
            }
            function Ue(e) {
                return !!ee && te.includes(e)
            }
            function ke(e) {
                var t = item_db[e];
                return null == t || (null == t.Rarity || parseInt(t.Rarity) >= Z)
            }
            function Fe() {
                r() ? Ge("#" + ae + " {\n                                    color: white;\n                                    width: 100%;\n                                    position: fixed;\n                                    height: 35px;\n                                    top: 0;\n                                    left: 0;\n                                    z-index: 11;\n                                    pointer-events: none;\n                                    text-align: center;\n                                    line-height: 35px;\n                                    font-size: 15px;\n                                    font-family: Verdana, Arial, Helvetica, sans-serif;\n                                    background-color: rgba(0,0,0,.8);\n                                    font-weight: bold;\n                                    text-overflow: ellipsis;\n                                    white-space: nowrap;\n                                    overflow: hidden;\n                                }\n                        ") : Ge("#" + ae + " {\n                                    color: white;\n                                    width: 100%;\n                                    position: fixed;\n                                    height: 35px;\n                                    top: 68px;\n                                    left: 0;\n                                    z-index: 11;\n                                    pointer-events: none;\n                                    text-align: center;\n                                    line-height: 35px;\n                                    font-size: 15px;\n                                    font-family: Verdana, Arial, Helvetica, sans-serif;\n                                    background-color: rgba(0,0,0,.8);\n                                    font-weight: bold;\n                                    text-overflow: ellipsis;\n                                    white-space: nowrap;\n                                    overflow: hidden;\n                                }\n                        ")
            }
            function qe() {
                if (f && !Te) {
                    Te = !0;
                    var e = document.createElement("div");
                    e.innerText = "Autobuyer Running", e.id = ae, document.body.appendChild(e), Fe()
                }
            }
            function Ke(e) {
                Te && (document.getElementById(ae)
                    .innerText = "Autobuyer Running: " + e)
            }
            function Ge(e) {
                const t = document.createElement("style");
                t.textContent = e, document.head.append(t)
            }
            function We(e, t, n) {
                e /= 255, t /= 255, n /= 255;
                var o, r, i = Math.max(e, t, n),
                    a = Math.min(e, t, n),
                    c = (i + a) / 2;
                if (i == a) o = r = 0;
                else {
                    var u = i - a;
                    switch (r = c > .5 ? u / (2 - i - a) : u / (i + a), i) {
                        case e:
                            o = (t - n) / u + (t < n ? 6 : 0);
                            break;
                        case t:
                            o = (n - e) / u + 2;
                            break;
                        case n:
                            o = (e - t) / u + 4
                    }
                    o /= 6
                }
                return {
                    h: o,
                    s: r,
                    l: c
                }
            }(r() && k || c() && o) && chrome.storage.local.get({
                EXT_P_S: !1
            }, (function(e) {
                if (e.EXT_P_S) ge();
                else {
                    var t = ExtPay("restock-highligher-autobuyer");
                    t.getUser()
                        .then((e => {
                            e.paid ? (chrome.storage.local.set({
                                EXT_P_S: !0
                            }, (function() {})), ge()) : (! function() {
                                if (u()) {
                                    var e = document.createElement("div");
                                    e.innerText = "Autobuyer Not Running - Please Subscribe", e.id = ae, document.body.appendChild(e), Fe()
                                }
                            }(), chrome.storage.local.set({
                                EXT_P_S: !1
                            }, (function() {})), u() && t.openPaymentPage())
                        }))
                        .catch((e => {
                            console.error(e), u() && window.alert("Please try again, it looks like there was an error loading your subscription: " + e)
                        }))
                }
            }))
        }))
    }
    function m() {
        chrome.storage.local.get({
            SEND_TO_SDB_AFTER_PURCHASE: !0
        }, (function(e) {
            var n;
            e.SEND_TO_SDB_AFTER_PURCHASE && (t("Sending " + (n = getParameterByName("itemToQuickstock")) + " to SDB", "Sending " + n + " to safety deposit box"), function(e, t) {
                ! function(e, t) {
                    for (var n, o = document.querySelectorAll("#content table td form table tbody tr"), r = 0; r < o.length; r++) o[r].innerText.indexOf(e) > -1 && (n = o[r]);
                    n.querySelectorAll("input[value='" + t.toLowerCase() + "']")[0].checked = !0
                }(e, "deposit"), setTimeout((function() {
                    document.querySelector(".content input[type='submit']")
                        .click()
                }), 500)
            }(n))
        }))
    }
    var s = setInterval((function() {
        "complete" === document.readyState && (clearInterval(s), u() && l(), window.location.href.indexOf("neopets.com/quickstock.phtml") > -1 && (document.body.innerText.indexOf("This is designed to make life easier when putting items in your deposit box") > 0 || (o(), 0)) && null != getParameterByName("itemToQuickstock") && "" !== getParameterByName("itemToQuickstock") && m())
    }), 20)
}
topLevelTurbo();