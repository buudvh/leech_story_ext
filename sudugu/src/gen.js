load('libs.js');

function execute(url, page) {
    try {
        var targetUrl = "";
        if (!page) {
            if (url.indexOf("/") === 0) {
                targetUrl = BASE_URL + url;
            } else {
                targetUrl = BASE_URL + "/" + url + "/";
            }
        } else {
            targetUrl = BASE_URL + page;
        }

        var response = crawler.get(targetUrl);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var elms = doc.select("div.item");

        if (!elms.length) throw new Error(`Length = 0`);

        var data = [];
        elms.forEach(function (e) {
            var titleElm = e.select("div.itemtxt h3 a, div.itemtxt h1 a").first();
            var link = titleElm.attr("href");
            var name = titleElm.text().convertT2S();
            var cover = e.select("a img").first().attr("src");
            
            var authorElm = e.select("div.itemtxt p a:contains(作者)").first();
            var author = authorElm ? authorElm.text().replace(/^作者：/, "").convertT2S() : "";

            var status = e.select("div.itemtxt p span").first() ? e.select("div.itemtxt p span").first().text().convertT2S() : "";
            var category = e.select("div.itemtxt p span").last() ? e.select("div.itemtxt p span").last().text().convertT2S() : "";

            data.push({
                name: name,
                link: link,
                cover: cover || DEFAULT_COVER,
                description: "作者: " + author + (status ? " | " + status : "") + (category ? " | " + category : ""),
                host: BASE_URL
            });
        });

        // Find next page link
        var nextPage = "";
        doc.select("div.page a").forEach(function (e) {
            if (e.text().trim() === "下一页") {
                nextPage = e.attr("href");
            }
        });

        return Response.success(data, nextPage || null);
    } catch (error) {
        return Response.error(`Url ${targetUrl} \nMessage: ${error.message}`);
    }
}
