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

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var bookName = doc.select('div.bookinfo h1').first().text();
        var detail = doc.select('div.bookinfo p.booktime').first().text();
        detail = '更新：' + detail.replace('更新時間：', '');
        var genresName = doc.select('div.bookinfo p.booktag span:nth-child(1)').first().text().trim();
        var objGen = GENRES_LIST.find(gen => gen.title == genresName);

        return Response.success({
            name: bookName.formatTocName(),
            cover: doc.select("div.bookcover img").first().attr("src") || DEFAULT_COVER,
            description: '',
            detail: detail.convertT2S(),
            host: BASE_URL,
            genres: [
                {
                    title: genresName,
                    input: objGen ? objGen.input : "all",
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