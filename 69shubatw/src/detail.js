load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p:nth-child(2) > a');
        var genreElm = doc.select("div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p:nth-child(3) > a");
        var bookName = doc.select('div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p:nth-child(1) > strong').text().convertT2S();
        var detail = $.QA(doc, 'div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p',
            { m: function (x) { return x.text().indexOf("更新：") === 0 || x.text().indexOf("最新：") === 0 ? x.text() : ""; }, j: '<br>' });
        var cover = doc.select(".bookinfo img").first().attr("src") || DEFAULT_COVER;
        if(cover.indexOf('//') == 0) cover = "http:" + cover;

        return Response.success({
            name: bookName.formatTocName(),
            cover: cover,
            author: authorElm.text(),
            description: doc.select("div.intro").html().cleanHtml().replace(/([.!?…]+)/g, function (match) {
                return match + "\n";
            }),
            detail: detail.convertT2S(),
            host: BASE_URL,
            suggests: [
                {
                    title: "同作者",
                    input: authorElm.attr("href"),
                    script: "author.js"
                }
            ],
            genres: [
                {
                    title: genreElm.text(),
                    input: genreElm.attr("href"),
                    script: "gen2.js"
                }
            ],
            comments: [
                {
                    title: "QQ Comments",
                    input: bookName,
                    script: "comment.js"
                }
            ]
        });
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}