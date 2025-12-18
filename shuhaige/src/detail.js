load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(formatToMobileShuUrl(url), {}, true);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('#info div.main div.detail p.author a');
        var bookName = doc.select('#info div.main div.detail p.name strong').text();
        var detail = $.QA(doc, '#info div.main div.detail p',
            { m: function (x) { return x.text().indexOf("最后更新：") === 0 || x.text().indexOf("最新章节：") === 0 ? x.text() : ""; }, j: '<br>' });
        var cover = doc.select("#info div.main div.detail img").first().attr("src") || DEFAULT_COVER;
        var genreName = doc.select('#info div.main div.detail p:nth-child(4) a').text().trim();
        var genres = DEFAULT_GENRES.find(p => p.title == genreName);

        return Response.success({
            name: bookName.formatTocName(),
            cover: cover,
            description: doc.select("#info div.main div:nth-child(4) div.intro p:nth-child(1)").html().cleanHtml().replace(/([.!?…]+)/g, function (match) {
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
            genres: [
                {
                    title: genreName || "全部分类",
                    input: genres ? genres.input : DEFAULT_GENRES["全部分类"].input,
                    script: "gen.js"
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

function formatToMobileShuUrl(url) {
    const regex = /shuhaige\.net\/(?:shu_)?(\d+)/;
    const match = url.match(regex);

    if (match && match[1]) {
        const bookId = match[1];
        return `https://m.shuhaige.net/shu_${bookId}.html`;
    }

    return url;
}