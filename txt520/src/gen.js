load('libs.js');

function execute(url, page) {
    try {
        url = url.replace(ORIGINAL_HOST, REPLACE_HOST);
        if (!page) page = '1';
        if (url.slice(-1) === "/")
            url = url.slice(0, -1)
        if (page === '1') {
            url = url + "/index.html";
        }
        else {
            url = url + "/index_" + page + ".html";
        }

        let response = fetch(url);
        if (!response.ok) throw new Error(`Status = ${response.status}`);

        let doc = response.html('gbk');
        const data = [];
        let next = "";
        doc.select("ul.page a").last().remove();
        next = doc.select("ul.page a").last().attr("href").replace(".html", "").replace("index_", "").split(/[/ ]+/).pop();

        doc.select("ul.list li").forEach(e => {
            data.push({
                name: e.select("a.title b").first().text().formatTocName(),
                link: e.select("a.title").first().attr("href"),
                description: e.select("a > div > span:nth-child(1)").text()
                    + "\n更新时间：" + e.select("span.pubdate").first().text(),
                cover: DEFAULT_COVER,
                host: BASE_URL
            })
        });
        return Response.success(data, next);
    } catch (error) {
        return Response.error(`Url: ${url}\nMessage: ${error.message}`);
    }
}