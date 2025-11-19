load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var nameElm = doc.select('.info h1').first();

        var authorElm = doc.select('div.info > p:nth-child(1)');

        return Response.success({
            name: nameElm.text(),
            cover: doc.select(".imgbox img").first().attr("src") || DEFAULT_COVER,
            author: authorElm.text(),
            description: convertT2S(cleanHtml(doc.select(".row-detail .m-desc.xs-show").html())),
            detail: convertT2S(
                $.QA(doc, '.info p',
                    { m: function (x) { return x.text().indexOf("最后更新：") === 0 || x.text().indexOf("最新章节：") === 0  ? x.text() : ""; }, j: '<br>' })
            ),
            host: BASE_URL,
            // suggests: [
            //     {
            //         title: "同作者",
            //         input: authorElm.attr("href"),
            //         script: "author.js"
            //     }
            // ],
            // genres: [
            //     {
            //         title: genreElm.text(),
            //         input: genreElm.attr("href"),
            //         script: "gen2.js"
            //     }
            // ],
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}