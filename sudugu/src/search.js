load('libs.js');

function execute(key, page) {
    try {
        page = page || '1';
        var url = (page === '1' || !page) 
            ? `${BASE_URL}/i/sor.aspx?key=${encodeURIComponent(key)}`
            : `${BASE_URL}${page}`;

        var data = [];
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        
        var doc = response.html();
        var elms = doc.select("div.item");

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

        var nextPage = "";
        doc.select("div.page a").forEach(function (e) {
            if (e.text().trim() === "下一页") {
                nextPage = e.attr("href");
            }
        });

        return Response.success(data, nextPage || null);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}
