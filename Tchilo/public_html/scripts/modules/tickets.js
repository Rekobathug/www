if ((document.URL.indexOf('file')) >= 0) {
} else if (top.location === self.location) {
    top.location.href = "home.html"
}
