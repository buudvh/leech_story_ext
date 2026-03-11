load('libs.js');

function execute(url) {
    try {
        var data = [];
        var response = fetch(BASE_URL);
        if (!response.ok) throw new Error(`Status = ${response.status}`)

        var doc = response.html();
        var elms = doc.select("body > div.container > div:nth-child(4) > div.layout.layout2.layout-col2.fl > ul > li");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            var link = e.select("span.s2 > a").first().attr("href")
            data.push({
                name: e.select("span.s2 > a").first().text().convertT2S(),
                link: link,
                cover: buildCover(getBookId(link)),
                description: "作者：" + e.select("span.s4").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}