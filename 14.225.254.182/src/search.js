function execute(query, page) {
    var url = '';
    try {
        var pageInt = parseInt(page) || 1;
        var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";

        var url = baseUrl + '/search/?find=&findinname=' + encodeURIComponent(query) + '&minc=0&sort=update&tag=&p=' + page;
        var response = fetch(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        var doc = response.html();
        var next = (parseInt(page, 10) + 1).toString();
        var el = doc.select("a.booksearch");

        if (!el.length) return null;

        var data = [];
        el.forEach(function (e) {
            data.push({
                name: e.select(".searchbooktitle").first().text(),
                link: e.select("a").first().attr("href"),
                cover: e.select("img").attr("src"),
                description: e.select("div > span.searchtag").first().text() + "|" + e.select("div > span.searchbookauthor").first().text()
                    + "\n" + e.select("div > span.lhr").last().text(),
                host: baseUrl
            });
        });

        return Response.success(data, next);
    } catch (error) {
        return Response.error(`Url: ${url}\nMessage: ${error.message}`);
    }
}
