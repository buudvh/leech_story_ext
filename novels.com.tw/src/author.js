load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(BASE_URL + url, page);
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("body > div.container > div > ul > li");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];
        elms.forEach(function (e) {
            var authorElm = e.select("div:nth-child(2) > p:nth-child(2)");
            authorElm.select("span").remove();
            authorElm.select("i").remove();
            data.push({
                name: e.select("div:nth-child(2) > a > h3").first().text().convertT2S(),
                link: e.select("div:nth-child(2) > a").attr("href"),
                cover: e.select("div.img_span > a > img").first().attr("data-original") || DEFAULT_COVER,
                description: authorElm.text().convertT2S()
                    + "\n" + e.select("div:nth-child(2) > p.searchresult_p").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}