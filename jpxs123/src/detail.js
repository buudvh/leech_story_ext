load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html('gb2312');
        var authorElm = doc.select('body > div.readContent > div.book_info.clearfix > div.infos > div.date > span:nth-child(1) > a');
        var bookName = doc.select('body > div.readContent > div.book_info.clearfix > div.infos > h1').text();
        var cover = doc.select("body > div.readContent > div.book_info.clearfix > div.pic > img").first().attr("src") || DEFAULT_COVER;
        var genreName = doc.select('body > div.readContent > div.menNav.readTop > a:nth-child(2)').text().trim();
        var genres = DEFAULT_GENRES.find(p => genreName.indexOf(p.title) != -1);

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text().convertT2S(),
            cover: cover,
            detail: doc.select("body > div.readContent > div.book_info.clearfix > div.infos > div.date > span:nth-child(2)").text().convertT2S(),
            description: doc.select("body > div.readContent > div.book_info.clearfix > div.infos > p").text().convertT2S(),
            host: BASE_URL,
            suggests: [
                {
                    title: "同作者",
                    input: authorElm.text(),
                    script: "search.js"
                }
            ],
            genres: [
                {
                    title: genreName || "全部分类",
                    input: genres != undefined ? genres.input : DEFAULT_GENRES[0].input,
                    script: "gen.js"
                }
            ],
            comments: [
                {
                    title: "QQ Comments",
                    input: bookName.convertT2S(),
                    script: "comment.js"
                }
            ]
        });
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}