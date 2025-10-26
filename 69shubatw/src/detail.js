load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p:nth-child(2) > a');
        var genreElm = doc.select("div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p:nth-child(3) > a");

        return Response.success({
            name: convertT2S(text(doc, 'div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p:nth-child(1) > strong')),
            cover: doc.select(".bookinfo img").first().attr("src") || DEFAULT_COVER,
            author: authorElm.text(),
            description: convertT2S(cleanHtml(doc.select("div.intro").html())),
            detail: convertT2S(
                $.QA(doc, 'div.bookinfo > table:nth-child(1) > tbody > tr > td.info > p',
                    { m: function (x) { return x.text().indexOf("更新：") === 0 || x.text().indexOf("最新：") === 0 ? x.text() : ""; }, j: '<br>' })
            ),
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
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}