load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = fetch(url, {
            headers: {
                'Content-Type': 'text/html;charset=utf-8',
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
            }
        });
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('div.bodywidth > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > span > span > a');
        var genreElm = doc.select("div.bodywidth > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > span.typebut > a");
        var descriptionElm = doc.select('div.bodywidth > div:nth-child(7) > div')
        var genres = [];
        genreElm.forEach(function (e) {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });

        var bookName = text(doc, 'div.bodywidth > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > span');

        return Response.success({
            name: bookName,
            cover: doc.select("div.bodywidth > div:nth-child(4) > div:nth-child(2) > div.imgwidth.imgmargin > img").first().attr("src") || DEFAULT_COVER,
            author: authorElm.text(),
            description: cleanHtml(descriptionElm.html()),
            detail: text(doc, 'div.bodywidth > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > div:nth-child(4) > span > span'),
            host: BASE_URL,
            suggests: [
                {
                    title: "同作者",
                    input: authorElm.attr("href"),
                    script: "gen.js"
                }
            ],
            genres: genres,
            comments: [
                {
                    title: "QQ Comments",
                    input: bookName,
                    script: "qqcomment.js"
                },
            ]
        });
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}