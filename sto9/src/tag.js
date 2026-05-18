load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(BASE_URL + url, page);
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#article_list_content > li");

        if (!elms.length) throw new Error("Length = 0");

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
    }
}