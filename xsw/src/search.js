load('libs.js');
load('config.js');

function execute(key, page) {
    var url;
    try {
        url = `${BASE_URL}/modules/article/search.php`;
        var response = fetch(url, {
            "body": `searchkey=${encodeURIComponent(key)}`,
            "method": "POST",
        });

        if (!response.ok) throw new Error(`Status = ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#alistbox");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("div.info > div.title > h2 > a").first().text().convertT2S(),
                link: e.select("div.info > div.title > h2 > a").first().attr("href"),
                cover: e.select("div.pic > a > img").first().attr("src") || DEFAULT_COVER,
                description: e.select("div.info > div.title > span").first().text().convertT2S()
                    + "\n" + e.select("div.info > div.intro").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        return Response.success(data);
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