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
            var genres = e.select("p:nth-child(3) span:nth-child(2)").first().text();

            if (genres.indexOf("幻言") != -1
                || genres.indexOf("现言") != -1
                || genres.indexOf("古言") != -1
                || genres.indexOf("青春") != -1
                || genres.indexOf("女生") != -1) return;

            data.push({
                name: e.select(".bookname a").first().text(),
                link: e.select(".bookname a").first().attr("href"),
                cover: e.select("a img").first().attr("src") || DEFAULT_COVER,
                description: genres + "|" + e.select("p:nth-child(3) a").first().text()
                    + "\n" + e.select(".intro").first().text(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}