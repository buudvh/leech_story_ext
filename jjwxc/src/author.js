load('libs.js');
load('config.js');
load('gbk.js');

function execute(key, page) {
    var url;
    try {
        page = page || "1";
        url = String.format(`${BASE_URL}/search/index/page/{0}?kw=${GBK.encode(key)}&t=2&o=2`, page);
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html('gb18030');
        var elms = doc.select("body > div.b.module > ul > li");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select("a:nth-child(1)").first().text(),
                link: e.select("a:nth-child(1)").attr("href"),
                description: e.select("a:nth-child(2)").first().text(),
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