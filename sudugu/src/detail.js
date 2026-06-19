load('libs.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        
        var titleElm = doc.select("div.item div.itemtxt h1 a").first();
        var name = titleElm ? titleElm.text().convertT2S() : "";
        
        var cover = doc.select("div.item img").first() ? doc.select("div.item img").first().attr("src") : DEFAULT_COVER;
        
        var authorElm = doc.select("div.item div.itemtxt a[href*=zuozhe]").first();
        var author = authorElm ? authorElm.text().replace(/^作者：/, "").trim().convertT2S() : "";
        
        var status = doc.select("div.item div.itemtxt p span").first() ? doc.select("div.item div.itemtxt p span").first().text() : "";
        var ongoing = status.indexOf("连载") !== -1;

        var description = doc.select("div.des").first() ? doc.select("div.des").html().cleanHtml() : "";

        var genres = [];
        doc.select("div.item div.itemtxt p span").forEach(function (span) {
            var text = span.text().trim();
            if (text && text.indexOf("连载") === -1 && text.indexOf("完结") === -1) {
                genres.push({
                    title: text.convertT2S(),
                    input: text,
                    script: "search.js"
                });
            }
        });

        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            ongoing: ongoing,
            host: BASE_URL,
            genres: genres
        });
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}
