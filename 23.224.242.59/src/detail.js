load('libs.js');

function execute(url) {
    try {
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var nameElm = doc.select('.info h1').first();

        var authorElm = doc.select('body > div.container > div.row.row-detail > div > div > div.info > div.top > div > p:nth-child(1)');
        var authorName = authorElm.text().replace("作者：", "").trim()

        return Response.success({
            name: nameElm.text(),
            cover: doc.select(".imgbox img").first().attr("src") || DEFAULT_COVER,
            author: authorName.convertT2S(),
            description: doc.select(".row-detail .m-desc.xs-show").html().cleanHtml().convertT2S(),
            detail: $.QA(doc, '.info p',
                { m: function (x) { return x.text().indexOf("最后更新：") === 0 || x.text().indexOf("最新章节：") === 0 ? x.text() : ""; }, j: '<br>' }).convertT2S(),
            host: BASE_URL,
            suggests: [
                { title: "同作者", input: authorName, script: "search_author.js" }
            ],
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}