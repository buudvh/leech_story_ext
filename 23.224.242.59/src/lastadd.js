load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        var response = fetch(BASE_URL);
        if (!response.ok) throw new Error(`Status = ${response.status}`)

        var doc = response.html();
        var elms = doc.select("div.container div:nth-child(4) div.layout.layout2.layout-col1.fr ul li");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            var link = e.select(".s2 a").first().attr("href")
            data.push({
                name: convertT2S(e.select(".s2 a").first().text()),
                link: link,
                cover: buildCover(getBookId(link)),
                description: "Author: " + e.select(".s5").first().text(),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}