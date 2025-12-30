load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        page = page || '1';
        url = `${BASE_URL}/search/${key}/${page}.html`;
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var elms = doc.select("#article_list_content > li");

        // if (doc.html() != "") return searchOnlyOneResult(url, key);

        if (!elms.length) {
            if (doc.select("head > meta[property=og:novel:book_name]")) {
                return Response.success([{
                    name: doc.select("head > meta[property=og:novel:book_name]").attr("content").convertT2S(),
                    link: doc.select("head > meta[property=og:url]").attr("content"),
                    cover: doc.select("head > meta[property=og:image]").attr("content"),
                    description: doc.select("head > meta[property=og:description]").attr("content").convertT2S(),
                    host: BASE_URL
                }]);
            } else throw new Error("Length = 0");
        }

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("div.newnav > h3 > a:nth-child(2)").first().text().convertT2S(),
                link: e.select("div.newnav > h3 > a:nth-child(2)").first().attr("href"),
                cover: e.select("a > img").first().attr("data-src") || DEFAULT_COVER,
                description: e.select("div.newnav > div.labelbox > label:nth-child(1)").first().text().convertT2S()
                    + "\n" + e.select("div.newnav > ol").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
        // return Response.success([
        //     {
        //         name: `Url ${url} \nMessage: ${error.message}`,
        //         link: '',
        //         cover: DEFAULT_COVER,
        //         host: BASE_URL
        //     }
        // ]);
    }
}