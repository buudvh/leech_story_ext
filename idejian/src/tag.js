load('libs.js');
load('config.js');
load('common.js');

function execute(tag, page) {
    try {
        var arrTag = tag.split("&");
        if (!page) page = '1';
        var sort = 'update';
        if (arrTag.length === 2) {
            sort = arrTag[1];
        }

        var url = STVHOST + '/io/searchtp/searchBooks/?find=&tag=' + arrTag[0] + '&sort=' + sort + '&host=idejian&minc=0&p=' + page;
        var response = fetch(url);

        if (response.ok) {
            var doc = response.html();
            var el = doc.select("a.booksearch");

            if (!el.length) return null;

            var next = (parseInt(page, 10) + 1).toString();
            var data = [];

            el.forEach(function (e) {
                var stv_story_link = e.select("a").first().attr("href") || "";
                var parts = stv_story_link.split("/");
                var bookid = parts.length > 4 ? parts[4] : "";
                data.push({
                    name: toCapitalize(e.select(".searchbooktitle").first().text()),
                    link: BASE_URL + '/book/' + bookid + '/',
                    cover: DEFAULT_COVER,
                    description: e.select("div > span.searchtag").first().text() + "|" + e.select("div > span.searchbookauthor").first().text()
                        + "\n" + e.select("div > span.lhr").last().text(),
                    host: BASE_URL
                });
            });

            return Response.success(data, next);
        }

        return Response.error('fetch ' + url + ' failed: status ' + response.status);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
