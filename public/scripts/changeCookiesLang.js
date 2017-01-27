function changeCookiesLang(value) {
    document.cookie = "lang=" + value + "; expires=Fri, 01 Jan 2021 00:00:00 UTC; path=/";
    window.location.reload(true);
}

