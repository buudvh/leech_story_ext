load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = formatJJWXCUrl(url);
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html('gb18030');
        var authorElm = doc.select('#left > li.authorname-content > a').first();
        var bookHeaderElm = doc.select('body > div.b.module > h2');
        bookHeaderElm.select('span').remove();
        bookHeaderElm.select('a').remove();
        var bookName = bookHeaderElm.text();
        var tags = [];
        (doc.select('#left > li:nth-child(4) > a') || []).forEach(e => {
            tags.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text(),
            description: doc.select("#novelintro").html().cleanHtml(),
            detail:  doc.select("#left > li:nth-child(5)").text()
                + "\n" + doc.select("#left > li:nth-child(6)").text()
                + "\n" + doc.select("#left > li:nth-child(7)").text()
                + "\n" + doc.select("#left > li:nth-child(3)").text(),
            host: BASE_URL,
            suggests: [
                {
                    title: "同作者",
                    input: authorElm.text(),
                    script: "author.js"
                },
            ],
            comments: [
                {
                    title: "QQ Comments",
                    input: bookName,
                    script: "comment.js"
                }
            ],
            genres: tags
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}