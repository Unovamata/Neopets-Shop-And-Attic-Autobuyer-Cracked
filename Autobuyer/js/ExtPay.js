var ExtPay = function() {
    "use strict";
    var commonjsGlobal = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {},
        browserPolyfill = function(b) {
            var a = {
                exports: {}
            };
            return b(a, a.exports), a.exports
        }(function(module, exports) {
            ! function(b, a) {
                a(module)
            }("undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : commonjsGlobal, function(module) {
                if ("undefined" == typeof browser || Object.getPrototypeOf(browser) !== Object.prototype) {
                    let CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.",
                        SEND_RESPONSE_DEPRECATION_WARNING = "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)",
                        wrapAPIs = extensionAPIs => {
                            let apiMetadata = {
                                alarms: {
                                    clear: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    clearAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    get: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                bookmarks: {
                                    create: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getChildren: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getRecent: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getSubTree: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getTree: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    move: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    },
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeTree: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    search: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    update: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    }
                                },
                                browserAction: {
                                    disable: {
                                        minArgs: 0,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    enable: {
                                        minArgs: 0,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    getBadgeBackgroundColor: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getBadgeText: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getPopup: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getTitle: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    openPopup: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    setBadgeBackgroundColor: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    setBadgeText: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    setIcon: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    setPopup: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    setTitle: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    }
                                },
                                browsingData: {
                                    remove: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    },
                                    removeCache: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeCookies: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeDownloads: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeFormData: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeHistory: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeLocalStorage: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removePasswords: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removePluginData: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    settings: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                commands: {
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                contextMenus: {
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    update: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    }
                                },
                                cookies: {
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getAll: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getAllCookieStores: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    set: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                devtools: {
                                    inspectedWindow: {
                                        eval: {
                                            minArgs: 1,
                                            maxArgs: 2,
                                            singleCallbackArg: !1
                                        }
                                    },
                                    panels: {
                                        create: {
                                            minArgs: 3,
                                            maxArgs: 3,
                                            singleCallbackArg: !0
                                        },
                                        elements: {
                                            createSidebarPane: {
                                                minArgs: 1,
                                                maxArgs: 1
                                            }
                                        }
                                    }
                                },
                                downloads: {
                                    cancel: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    download: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    erase: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getFileIcon: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    open: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    pause: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeFile: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    resume: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    search: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    show: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    }
                                },
                                extension: {
                                    isAllowedFileSchemeAccess: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    isAllowedIncognitoAccess: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                history: {
                                    addUrl: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    deleteAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    deleteRange: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    deleteUrl: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getVisits: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    search: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                i18n: {
                                    detectLanguage: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getAcceptLanguages: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                identity: {
                                    launchWebAuthFlow: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                idle: {
                                    queryState: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                management: {
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    getSelf: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    setEnabled: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    },
                                    uninstallSelf: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    }
                                },
                                notifications: {
                                    clear: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    create: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    getPermissionLevel: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    update: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    }
                                },
                                pageAction: {
                                    getPopup: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getTitle: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    hide: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    setIcon: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    setPopup: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    setTitle: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    },
                                    show: {
                                        minArgs: 1,
                                        maxArgs: 1,
                                        fallbackToNoCallback: !0
                                    }
                                },
                                permissions: {
                                    contains: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    request: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                runtime: {
                                    getBackgroundPage: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    getPlatformInfo: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    openOptionsPage: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    requestUpdateCheck: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    sendMessage: {
                                        minArgs: 1,
                                        maxArgs: 3
                                    },
                                    sendNativeMessage: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    },
                                    setUninstallURL: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                sessions: {
                                    getDevices: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    getRecentlyClosed: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    restore: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    }
                                },
                                storage: {
                                    local: {
                                        clear: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        get: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        getBytesInUse: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        remove: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        set: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    },
                                    managed: {
                                        get: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        getBytesInUse: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        }
                                    },
                                    sync: {
                                        clear: {
                                            minArgs: 0,
                                            maxArgs: 0
                                        },
                                        get: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        getBytesInUse: {
                                            minArgs: 0,
                                            maxArgs: 1
                                        },
                                        remove: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        },
                                        set: {
                                            minArgs: 1,
                                            maxArgs: 1
                                        }
                                    }
                                },
                                tabs: {
                                    captureVisibleTab: {
                                        minArgs: 0,
                                        maxArgs: 2
                                    },
                                    create: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    detectLanguage: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    discard: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    duplicate: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    executeScript: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getCurrent: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    },
                                    getZoom: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    getZoomSettings: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    goBack: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    goForward: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    highlight: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    insertCSS: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    move: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    },
                                    query: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    reload: {
                                        minArgs: 0,
                                        maxArgs: 2
                                    },
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    removeCSS: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    sendMessage: {
                                        minArgs: 2,
                                        maxArgs: 3
                                    },
                                    setZoom: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    setZoomSettings: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    update: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    }
                                },
                                topSites: {
                                    get: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                webNavigation: {
                                    getAllFrames: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    getFrame: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                },
                                webRequest: {
                                    handlerBehaviorChanged: {
                                        minArgs: 0,
                                        maxArgs: 0
                                    }
                                },
                                windows: {
                                    create: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 2
                                    },
                                    getAll: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    getCurrent: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    getLastFocused: {
                                        minArgs: 0,
                                        maxArgs: 1
                                    },
                                    remove: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    update: {
                                        minArgs: 2,
                                        maxArgs: 2
                                    }
                                }
                            };
                            if (0 === Object.keys(apiMetadata)
                                .length) throw new Error("api-metadata.json has not been included in browser-polyfill");
                            class DefaultWeakMap extends WeakMap {
                                constructor(a, b) {
                                    super(b), this.createItem = a
                                }
                                get(a) {
                                    return this.has(a) || this.set(a, this.createItem(a)), super.get(a)
                                }
                            }
                            let isThenable = a => a && "object" == typeof a && "function" == typeof a.then,
                                makeCallback = (a, b) => (...c) => {
                                    extensionAPIs.runtime.lastError ? a.reject(extensionAPIs.runtime.lastError) : b.singleCallbackArg || c.length <= 1 && !1 !== b.singleCallbackArg ? a.resolve(c[0]) : a.resolve(c)
                                },
                                pluralizeArguments = a => 1 == a ? "argument" : "arguments",
                                wrapAsyncFunction = (a, b) => function(d, ...c) {
                                    if (c.length < b.minArgs) throw new Error(`Expected at least ${b.minArgs} ${pluralizeArguments(b.minArgs)} for ${a}(), got ${c.length}`);
                                    if (c.length > b.maxArgs) throw new Error(`Expected at most ${b.maxArgs} ${pluralizeArguments(b.maxArgs)} for ${a}(), got ${c.length}`);
                                    return new Promise((e, f) => {
                                        if (b.fallbackToNoCallback) try {
                                            d[a](...c, makeCallback({
                                                resolve: e,
                                                reject: f
                                            }, b))
                                        } catch (g) {
                                            console.warn(`${a} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `, g), d[a](...c), b.fallbackToNoCallback = !1, b.noCallback = !0, e()
                                        } else b.noCallback ? (d[a](...c), e()) : d[a](...c, makeCallback({
                                            resolve: e,
                                            reject: f
                                        }, b))
                                    })
                                },
                                wrapMethod = (b, a, c) => new Proxy(a, {
                                    apply: (e, a, d) => c.call(a, b, ...d)
                                }),
                                hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty),
                                wrapObject = (a, d = {}, e = {}) => {
                                    let f = Object.create(null),
                                        b = {
                                            has: (c, b) => b in a || b in f,
                                            get(h, b, i) {
                                                if (b in f) return f[b];
                                                if (!(b in a)) return;
                                                let c = a[b];
                                                if ("function" == typeof c) {
                                                    if ("function" == typeof d[b]) c = wrapMethod(a, a[b], d[b]);
                                                    else if (hasOwnProperty(e, b)) {
                                                        let g = wrapAsyncFunction(b, e[b]);
                                                        c = wrapMethod(a, a[b], g)
                                                    } else c = c.bind(a)
                                                } else if ("object" == typeof c && null !== c && (hasOwnProperty(d, b) || hasOwnProperty(e, b))) c = wrapObject(c, d[b], e[b]);
                                                else {
                                                    if (!hasOwnProperty(e, "*")) return Object.defineProperty(f, b, {
                                                        configurable: !0,
                                                        enumerable: !0,
                                                        get: () => a[b],
                                                        set(c) {
                                                            a[b] = c
                                                        }
                                                    }), c;
                                                    c = wrapObject(c, d[b], e["*"])
                                                }
                                                return f[b] = c, c
                                            },
                                            set: (d, b, c, e) => (b in f ? f[b] = c : a[b] = c, !0),
                                            defineProperty: (c, a, b) => Reflect.defineProperty(f, a, b),
                                            deleteProperty: (b, a) => Reflect.deleteProperty(f, a)
                                        },
                                        c = Object.create(a);
                                    return new Proxy(c, b)
                                },
                                wrapEvent = a => ({
                                    addListener(b, c, ...d) {
                                        b.addListener(a.get(c), ...d)
                                    },
                                    hasListener: (b, c) => b.hasListener(a.get(c)),
                                    removeListener(b, c) {
                                        b.removeListener(a.get(c))
                                    }
                                }),
                                loggedSendResponseDeprecationWarning = !1,
                                onMessageWrappers = new DefaultWeakMap(a => "function" != typeof a ? a : function(d, e, k) {
                                    let f = !1,
                                        g, h = new Promise(a => {
                                            g = function(b) {
                                                loggedSendResponseDeprecationWarning || (console.warn(SEND_RESPONSE_DEPRECATION_WARNING, new Error()
                                                    .stack), loggedSendResponseDeprecationWarning = !0), f = !0, a(b)
                                            }
                                        }),
                                        b;
                                    try {
                                        b = a(d, e, g)
                                    } catch (i) {
                                        b = Promise.reject(i)
                                    }
                                    let c = !0 !== b && isThenable(b);
                                    if (!0 !== b && !c && !f) return !1;
                                    let j = a => {
                                        a.then(a => {
                                                k(a)
                                            }, a => {
                                                let b;
                                                b = a && (a instanceof Error || "string" == typeof a.message) ? a.message : "An unexpected error occurred", k({
                                                    __mozWebExtensionPolyfillReject__: !0,
                                                    message: b
                                                })
                                            })
                                            .catch(a => {
                                                console.error("Failed to send onMessage rejected reply", a)
                                            })
                                    };
                                    return j(c ? b : h), !0
                                }),
                                wrappedSendMessageCallback = ({
                                    reject: b,
                                    resolve: c
                                }, a) => {
                                    extensionAPIs.runtime.lastError ? extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE ? c() : b(extensionAPIs.runtime.lastError) : a && a.__mozWebExtensionPolyfillReject__ ? b(new Error(a.message)) : c(a)
                                },
                                wrappedSendMessage = (c, a, d, ...b) => {
                                    if (b.length < a.minArgs) throw new Error(`Expected at least ${a.minArgs} ${pluralizeArguments(a.minArgs)} for ${c}(), got ${b.length}`);
                                    if (b.length > a.maxArgs) throw new Error(`Expected at most ${a.maxArgs} ${pluralizeArguments(a.maxArgs)} for ${c}(), got ${b.length}`);
                                    return new Promise((a, c) => {
                                        let e = wrappedSendMessageCallback.bind(null, {
                                            resolve: a,
                                            reject: c
                                        });
                                        b.push(e), d.sendMessage(...b)
                                    })
                                },
                                staticWrappers = {
                                    runtime: {
                                        onMessage: wrapEvent(onMessageWrappers),
                                        onMessageExternal: wrapEvent(onMessageWrappers),
                                        sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                                            minArgs: 1,
                                            maxArgs: 3
                                        })
                                    },
                                    tabs: {
                                        sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
                                            minArgs: 2,
                                            maxArgs: 3
                                        })
                                    }
                                },
                                settingMetadata = {
                                    clear: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    get: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    },
                                    set: {
                                        minArgs: 1,
                                        maxArgs: 1
                                    }
                                };
                            return apiMetadata.privacy = {
                                network: {
                                    "*": settingMetadata
                                },
                                services: {
                                    "*": settingMetadata
                                },
                                websites: {
                                    "*": settingMetadata
                                }
                            }, wrapObject(extensionAPIs, staticWrappers, apiMetadata)
                        };
                    //if ("object" != typeof chrome || !chrome || !chrome.runtime || !chrome.runtime.id) throw new Error("This script should only be loaded in a browser extension.");
                    module.exports = wrapAPIs(chrome)
                } else module.exports = browser
            })
        });
    return "undefined" != typeof window && window.addEventListener("message", a => {
            "https://extensionpay.com" === a.origin && a.source == window && ("fetch-user" === a.data || "trial-start" === a.data) && browserPolyfill.runtime.sendMessage(a.data)
        }, !1),
        function(a) {
            let b = "https://extensionpay.com",
                g = `${b}/extension/${a}`;
            function h(a) {
                return new Promise(b => setTimeout(b, a))
            }
            async function c(a) {
                try {
                    return await browserPolyfill.storage.sync.get(a)
                } catch (b) {
                    return await browserPolyfill.storage.local.get(a)
                }
            }
            async function i(a) {
                try {
                    return await browserPolyfill.storage.sync.set(a)
                } catch (b) {
                    return await browserPolyfill.storage.local.set(a)
                }
            }
            browserPolyfill.management && browserPolyfill.management.getSelf()
                .then(async a => {
                    if (!a.permissions.includes("storage")) {
                        var b = a.hostPermissions.concat(a.permissions);
                        throw `ExtPay Setup Error: please include the "storage" permission in manifest.json["permissions"] or else ExtensionPay won't work correctly.
You can copy and paste this to your manifest.json file to fix this error:
"permissions": [
    ${b.map(a=>`"    ${a}"`).join(",\n")}${b.length>0?",":""}
    "storage"
]
`
                    }
                }), c(["extensionpay_installed_at", "extensionpay_user"])
                .then(async a => {
                    if (a.extensionpay_installed_at) return;
                    let b = a.extensionpay_user,
                        c = b ? b.installedAt : new Date()
                        .toISOString();
                    await i({
                        extensionpay_installed_at: c
                    })
                });
            let j = [],
                k = [];
            async function l() {
                var a, d = {};
                if (browserPolyfill.management) a = await browserPolyfill.management.getSelf();
                else if (browserPolyfill.runtime) a = await browserPolyfill.runtime.sendMessage("extpay-extinfo");
                else throw "ExtPay needs to be run in a browser extension context";
                "development" == a.installType && (d.development = !0);
                let c = await fetch(`${g}/api/new-key`, {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(d)
                });
                if (!c.ok) throw c.status, `${b}/home`;
                let e = await c.json();
                return await i({
                    extensionpay_api_key: e
                }), e
            }
            async function m() {
                let a = await c(["extensionpay_api_key"]);
                return a.extensionpay_api_key ? a.extensionpay_api_key : null
            }
            let n = /^\d\d\d\d-\d\d-\d\dT/;
            async function o() {
                var a = await c(["extensionpay_user", "extensionpay_installed_at"]);
                let f = await m();
                if (!f) return {
                    paid: !1,
                    paidAt: null,
                    installedAt: a.extensionpay_installed_at ? new Date(a.extensionpay_installed_at) : new Date,
                    trialStartedAt: null
                };
                let e = await fetch(`${g}/api/user?api_key=${f}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json"
                    }
                });
                if (!e.ok) throw "ExtPay error while fetching user: " + e;
                let h = await e.json(),
                    d = {};
                for (var [l, b] of Object.entries(h)) b && b.match && b.match(n) && (b = new Date(b)), d[l] = b;
                return d.installedAt = new Date(a.extensionpay_installed_at), d.paidAt && (a.extensionpay_user && (!a.extensionpay_user || a.extensionpay_user.paidAt) || j.forEach(a => a(d))), d.trialStartedAt && (a.extensionpay_user && (!a.extensionpay_user || a.extensionpay_user.trialStartedAt) || k.forEach(a => a(d))), await i({
                    extensionpay_user: h
                }), d
            }
            async function p() {
                var a = await m();
                return a || (a = await l()), `${g}?api_key=${a}`
            }
            async function d() {
                let a = await p();
                if (browserPolyfill.windows) try {
                    browserPolyfill.windows.create({
                        url: a,
                        type: "popup",
                        focused: !0,
                        width: 500,
                        height: 800,
                        left: 450
                    })
                } catch (b) {
                    browserPolyfill.windows.create({
                        url: a,
                        type: "popup",
                        width: 500,
                        height: 800,
                        left: 450
                    })
                } else window.open(a, null, "toolbar=no,location=no,directories=no,status=no,menubar=no,width=500,height=800,left=450")
            }
            async function e(c) {
                var b = await m();
                b || (b = await l());
                var a = `${g}/trial?api_key=${b}`;
                if (c && (a += `&period=${c}`), browserPolyfill.windows) try {
                    browserPolyfill.windows.create({
                        url: a,
                        type: "popup",
                        focused: !0,
                        width: 500,
                        height: 650,
                        left: 450
                    })
                } catch (d) {
                    browserPolyfill.windows.create({
                        url: a,
                        type: "popup",
                        width: 500,
                        height: 650,
                        left: 450
                    })
                } else window.open(a, null, "toolbar=no,location=no,directories=no,status=no,menubar=no,width=500,height=800,left=450")
            }
            async function f() {
                var a = await m();
                a || (a = await l());
                let b = `${g}/reactivate?api_key=${a}`;
                if (browserPolyfill.windows) try {
                    browserPolyfill.windows.create({
                        url: b,
                        type: "popup",
                        focused: !0,
                        width: 500,
                        height: 800,
                        left: 450
                    })
                } catch (c) {
                    browserPolyfill.windows.create({
                        url: b,
                        type: "popup",
                        width: 500,
                        height: 800,
                        left: 450
                    })
                } else window.open(b, null, "toolbar=no,location=no,directories=no,status=no,menubar=no,width=500,height=800,left=450")
            }
            var q = !1;
            async function r() {
                if (!q) {
                    q = !0;
                    for (var a = await o(), b = 0; b < 120; ++b) {
                        if (a.paidAt) return q = !1, a;
                        await h(1e3), a = await o()
                    }
                    q = !1
                }
            }
            return {
                getUser: function() {
                    return o()
                },
                onPaid: {
                    addListener: function(e) {
                        let a = `"content_scripts": [
                {
            "matches": ["${b}/*"],
            "js": ["ExtPay.js"],
            "run_at": "document_start"
        }]`,
                            d = browserPolyfill.runtime.getManifest();
                        if (!d.content_scripts) throw `ExtPay setup error: To use the onPaid callback handler, please include ExtPay as a content script in your manifest.json. You can copy the example below into your manifest.json or check the docs: https://github.com/Glench/ExtPay#2-configure-your-manifestjson
        ${a}`;
                        let c = d.content_scripts.find(a => a.matches.includes(b.replace(":3000", "") + "/*"));
                        if (c) {
                            if (!c.run_at || "document_start" !== c.run_at) throw `ExtPay setup error: To use the onPaid callback handler, please make sure the ExtPay content script in your manifest.json runs at document start. You can copy the example below into your manifest.json or check the docs: https://github.com/Glench/ExtPay#2-configure-your-manifestjson
        ${a}`
                        } else throw `ExtPay setup error: To use the onPaid callback handler, please include ExtPay as a content script in your manifest.json matching "${b}/*". You can copy the example below into your manifest.json or check the docs: https://github.com/Glench/ExtPay#2-configure-your-manifestjson
        ${a}`;
                        j.push(e)
                    }
                },
                openPaymentPage: d,
                openTrialPage: e,
                openLoginPage: f,
                onTrialStarted: {
                    addListener: function(a) {
                        k.push(a)
                    }
                },
                startBackground: function() {
                    browserPolyfill.runtime.onMessage.addListener(function(a, b, c) {
                        if (console.log("service worker got message! Here it is:", a), "fetch-user" == a) r();
                        else if ("trial-start" == a) o();
                        else if ("extpay-extinfo" == a && browserPolyfill.management) return browserPolyfill.management.getSelf()
                    })
                }
            }
        }
}()