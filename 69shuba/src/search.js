load('libs.js');
load('config.js');

function execute(key, page) {
    var url = '';
    try {
        var arrKey = key.split("&");
        if (!page) page = '1';
        var sort = '';
        if (arrKey.length == 2) {
            sort = arrKey[1];
        }

        url = STVHOST + '/io/searchtp/searchBooks/?findinname=' + encodeURIComponent(arrKey[0]) +
            '&sort=' + sort + '&host=69shu&minc=0&tag=&p=' + page;

        if (key.indexOf("find=") === 0) {
            url = STVHOST + '/io/searchtp/searchBooks/?find=' + encodeURIComponent(arrKey[0].replace("find=", "")) +
                '&sort=' + sort + '&host=69shu&minc=0&tag=&p=' + page;
        }
        var response = fetch(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        var doc = response.html();
        var next = (parseInt(page, 10) + 1).toString();
        var el = doc.select("a.booksearch");

        if (!el.length) throw new Error("Length = 0");

        var data = [];
        el.forEach(function (e) {
            var stv_story_link = e.select("a").first().attr("href");
            var bookid = stv_story_link.split("/")[4];
            var tag = e.select("div > span.searchtag").first().text().trim();

            if (tag != "69shu") return;

            data.push({
                name: toCapitalize(e.select(".searchbooktitle").first().text()),
                link: STVHOST + "/truyen/69shu/1/" + bookid + "/",
                cover: buildCover(bookid),
                description: e.select("div > span.searchtag").first().text() + "|" + e.select("div > span.searchbookauthor").first().text()
                    + "\n" + e.select("div > span.lhr").last().text(),
            });
        });

        return Response.success(data, next);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
