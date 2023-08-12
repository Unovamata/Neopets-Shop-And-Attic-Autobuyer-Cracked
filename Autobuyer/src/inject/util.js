function getParameterByName(e, n) {
    n || (n = window.location.href), e = e.replace(/[[\]]/g, "\\$&");
    var r = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)")
        .exec(n);
    return r ? r[2] ? decodeURIComponent(r[2].replace(/\+/g, " ")) : "" : null
}