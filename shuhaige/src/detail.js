load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('#info p:nth-child(2) a');
        var bookName = doc.select('#info h1').text();
        var detail = $.QA(doc, '#info > p',
            { m: function (x) { return x.text().indexOf("最后更新：") === 0 || x.text().indexOf("最新更新：") === 0 ? x.text() : ""; }, j: '<br>' });
        var cover = doc.select("#fmimg img").first().attr("src") || DEFAULT_COVER;

        return Response.success({
            name: bookName.formatTocName(),
            cover: cover,
            description: doc.select("#intro > p:nth-child(1)").html().cleanHtml().replace(/([.!?…]+)/g, function (match) {
                return match + "\n";
            }),
            detail: detail,
            host: BASE_URL,
            suggests: [
                {
                    title: "同作者",
                    input: authorElm.attr("href"),
                    script: "author.js"
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