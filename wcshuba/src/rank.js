load('libs.js');

function execute(url) {
    try {
        url = BASE_URL + url;
        var data = [];
        var response = crawler.get(url, {}, true);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select(".content dl");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: e.select("dt:nth-child(2) > a").first().text().convertT2S(),
                link: e.select("dt:nth-child(2) > a").first().attr("href"),
                cover: e.select("dt:nth-child(1) img").first().attr("src"),
                description: '作者: ' + e.select('dd > a').first().text().convertT2S(),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}
