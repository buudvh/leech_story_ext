load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        key = url.match(/\/list\/(.+?)\.html$/)[1];
        url = "https://www.dxmwx.org/dxmwx/listreq.aspx?toptype=topall&keywords=" + encodeURIComponent(key) + "&pageid=" + page;
        var response = fetch(url, {
            headers: {
                'Content-Type': 'text/html;charset=utf-8',
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
            }
        });
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var data = [];
        var doc = response.html();
        var elms = doc.select("body > div");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            if (e.select("div.right_wid").length) {
                data.push({
                    name: text(e, "div.right_wid > div.margin0h5 > a.fonttext"),
                    link: attr(e, "div.right_wid > div.margin0h5 > a.fonttext", "href"),
                    cover: e.select("img.imgwidth").first().attr("src") || DEFAULT_COVER,
                    description: text(e, "div.right_wid > div:nth-child(4) > a").replace('最新章节', '') + "\n" + text(e, "div.right_wid > div.neirongh5 > a"),
                    host: BASE_URL
                });
            }
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (e) {
        Response.error(`fetch ${url} failed: ${e.message}`);
    }
}