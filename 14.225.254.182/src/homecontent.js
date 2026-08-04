function execute(input, pageUrl) {
    var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";
    var endpoint = pageUrl || input || "";

    if (!endpoint) {
        return Response.error("Thiếu URL danh sách truyện");
    }
    if (endpoint.indexOf("http://") !== 0 && endpoint.indexOf("https://") !== 0) {
        endpoint = baseUrl + (endpoint.charAt(0) === "/" ? endpoint : "/" + endpoint);
    }

    var document = Http.post(endpoint)
        .header("Referer", baseUrl + "/")
        .header("X-Requested-With", "XMLHttpRequest")
        .header("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body("ignores=")
        .html();

    var links = document.select("a.booksearch");
    if (links.size() === 0) {
        links = document.select("a.cap");
    }

    var results = [];
    var seen = {};
    for (var i = 0; i < links.size(); i++) {
        var item = links.get(i);
        var href = item.attr("href");
        if (!href || href.indexOf("/truyen/") === -1) continue;

        var match = href.match(/\/truyen\/([^\/]+)\/1\/([^\/]+)/);
        if (!match) continue;

        var link = href;
        if (link.indexOf("http://") !== 0 && link.indexOf("https://") !== 0) {
            link = baseUrl + (link.charAt(0) === "/" ? link : "/" + link);
        }
        if (seen[link]) continue;
        seen[link] = true;

        var name = item.select(".searchbooktitle").text().trim();
        if (!name) name = item.select("b").text().trim();
        if (!name) name = item.text().trim();

        var author = item.select(".searchbookauthor").text().trim();
        if (!author) author = "Không rõ";

        var cover = item.select("img").attr("src").trim();
        if (cover.indexOf("//") === 0) {
            cover = "http:" + cover;
        } else if (cover && cover.charAt(0) === "/") {
            cover = baseUrl + cover;
        }

        var description = item.select("span[style*=font-size]").text().trim();

        results.push({
            name: name,
            author: author,
            description: description,
            cover: cover,
            link: link,
            host: baseUrl
        });
    }

    var nextPage = null;
    if (results.length >= 48) {
        var pageMatch = endpoint.match(/([?&]p=)(\d+)/);
        if (pageMatch) {
            var nextNumber = parseInt(pageMatch[2], 10) + 1;
            nextPage = endpoint.replace(pageMatch[0], pageMatch[1] + nextNumber);
        }
    }

    return Response.success(results, nextPage);
}
