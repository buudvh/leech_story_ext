function execute(query, page) {
    var pageInt = parseInt(page) || 1;
    var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";
    
    var url = baseUrl + '/io/searchtp/searchBooks/?findinname=' + encodeURIComponent(query) +
        '&sort=update&minc=0&tag=&p=' + page;
    var response = fetch(url);

    if (!response.ok) return Response.error('fetch ' + url + ' failed: status ' + response.status);

    var doc = response.html();
    var next = (parseInt(page, 10) + 1).toString();
    var el = doc.select("a.booksearch");

    if (!el.length) return null;

    var data = [];
    el.forEach(function (e) {
        var stv_story_link = e.select("a").first().attr("href");
        var bookid = stv_story_link.split("/")[4];
        data.push({
            name: toCapitalize(e.select(".searchbooktitle").first().text()),
            link: STVHOST + "/truyen/qidian/1/" + bookid + "/",
            cover: e.select("img").attr("src") || DEFAULT_COVER,
            description: e.select("div > span.searchtag").first().text() + "|" + e.select("div > span.searchbookauthor").first().text()
                + "\n" + e.select("div > span.lhr").last().text(),
            source: e.select("div > span.searchtag").first().text().trim(),
        });
    });

    return Response.success(data, next);
}
