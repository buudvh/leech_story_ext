function execute(query, page) {
    var pageInt = parseInt(page) || 1;
    var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";
    
    var url = baseUrl + "/index.php?ngmar=search&searchkey=" + encodeURIComponent(query) + "&page=" + pageInt;
    var response = Http.get(url).html();
    
    var results = [];
    var links = response.select("a.cap");
    var seen = {};
    
    for (var i = 0; i < links.size(); i++) {
        var a = links.get(i);
        var href = a.attr("href");
        if (!href || href.indexOf("/truyen/") === -1) continue;
        
        // Format of SangTacViet: /truyen/<sourceHost>/1/<bookId>/
        var regex = /\/truyen\/([^\/]+)\/1\/([^\/]+)/;
        var match = href.match(regex);
        if (!match) continue;
        var sourceHost = match[1];
        var bookId = match[2];
        
        var absoluteLink = baseUrl + "/truyen/" + sourceHost + "/1/" + bookId + "/";
        if (seen[absoluteLink]) continue;
        seen[absoluteLink] = true;
        
        var name = a.select("b").text().trim();
        if (!name) name = a.text().trim();
        
        var cover = a.select("img").attr("src");
        if (cover && cover.indexOf("nothumb") >= 0) {
            cover = "";
        }
        if (cover) {
            if (cover.indexOf("//") === 0) {
                cover = "http:" + cover;
            } else if (cover.indexOf("/") === 0) {
                cover = baseUrl + cover;
            }
        }
        
        results.push({
            name: name,
            author: "Không rõ",
            description: "",
            cover: cover || "",
            link: absoluteLink,
            host: baseUrl
        });
    }
    
    return Response.success(results);
}
