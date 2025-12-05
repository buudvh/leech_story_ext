load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('#wrapper > main > div > div.rank.mt10.pc-only > div.left > div > div > div.booktitle > h2 > a');
        var bookName = doc.select('#wrapper > main > div > div.rank.mt10.pc-only > div.left > div > div > div.booktitle > h1 > a').text().convertT2S();
        var detail = $.QA(doc, '#wrapper > main > div > div.rank.mt10.pc-only > div.left > div > div > div.bookdes > p',
            { m: function (x) { return x.text().indexOf("最新章节：") === 0 || x.text().indexOf("最后更新：") === 0 ? x.text() : ""; }, j: '<br>' });
        var genreElm = doc.select("#wrapper > main > div > div.rank.mt10.pc-only > div.left > div > div > div.bookintro > p:nth-child(1) > a");

        var genres = [];
        genreElm.forEach(element => {
            genres.push({
                title: element.text(),
                input: element.attr("href"),
                script: "tag.js"
            });
        });

        return Response.success({
            name: bookName.formatTocName(),
            cover: doc.select("#wrapper > main > div > div.rank.mt10.pc-only > div.left > div > a > img").first().attr("src") || DEFAULT_COVER,
            author: authorElm.text(),
            description: doc.select('#wrapper > main > div > div.rank.mt10.pc-only > div.left > div > div > div.bookintro > p:nth-child(2)').html().cleanHtml().replace(/([.!?…]+)/g, function (match) {
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
            genres: genres,
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