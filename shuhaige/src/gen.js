load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(MOBILE_URL + url, page);
        var data = [];
        var response = crawler.get(url, {}, true);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#library .main ul li");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: e.select(".bookname a").first().text(),
                link: e.select(".bookname a").first().attr("href"),
                cover: e.select("a img").first().attr("src") || DEFAULT_COVER,
                description: e.select("p:nth-child(3) a").first().text() + "\n" + e.select(".intro").first().text(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}