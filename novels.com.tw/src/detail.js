load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('body > div.container > section > div.novel_info_main > div > i > a').first();
        var bookName = doc.select('body > div.container > section > div.novel_info_main > div > h1').text();
        var cover = doc.select("body > div.container > section > div.novel_info_main > img").first().attr("src");
        var genreElm = doc.select('body > div.container > section > div.novel_info_main > div > p > span:nth-child(1)').first();
        var objGenre = DEFAULT_GENRES.find(p => p.title = genreElm.text());
        var tags = [{
            title: objGenre.title || DEFAULT_GENRES[0].title,
            input: objGenre.input || DEFAULT_GENRES[0].input,
            script: objGenre.script || DEFAULT_GENRES[0].script
        }];

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text().convertT2S(),
            cover: cover,
            description: doc.select("#info > div.intro").html().cleanHtml(),
            detail: "最新: " + doc.select("body > div.container > section > div.novel_info_main > div > div.flex.to100 > em").text()
                + "\n最新章: " + doc.select("body > div.container > section > div.novel_info_main > div > div.flex.to100 > a").text(),
            host: BASE_URL,
            ongoing: doc.select("body > div.container > section > div.novel_info_main > div > p > span:nth-child(3)").text() == "連載",
            suggests: [
                {
                    title: "同作者",
                    input: authorElm.attr("href"),
                    script: "author.js"
                },
            ],
            comments: [
                {
                    title: "QQ Comments",
                    input: bookName.convertT2S(),
                    script: "comment.js"
                }
            ],
            genres: tags
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}