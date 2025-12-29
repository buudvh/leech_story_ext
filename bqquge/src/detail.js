load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('body > div:nth-child(3) > div.bookdetail > div > p:nth-child(2) > a').first();
        var bookName = doc.select('body > div:nth-child(3) > div.bookdetail > div > h1').text();
        var cover = doc.select("body > div:nth-child(3) > div.bookdetail > img").first().attr("src");
        var recommendBooks = [];
        (doc.select("body > div:nth-child(4) > ul > li") || []).forEach(e => {
            recommendBooks.push({
                name: e.select("p > a").first().text().convertT2S(),
                link: e.select("p > a").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                host: BASE_URL,
            })
        });
        var genreElm = doc.select('body > div.menu > a:nth-child(2)').first();
        var tags = [{
            title: genreElm.text(),
            input: genreElm.attr("href"),
            script: "gen.js"
        }];

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text().convertT2S(),
            cover: cover,
            description: doc.select("body > div:nth-child(3) > div.des").html(),
            detail: doc.select("body > div:nth-child(3) > div.bookdetail > div > p:nth-child(6)").text()
                + "\n最新章节: " + doc.select("body > div:nth-child(3) > div.newest > h3").text(),
            host: BASE_URL,
            ongoing: doc.select("body > main > div:nth-child(1) > div.novel > div.n-text > p:nth-child(3) > span").text() == "連載中",
            suggests: [
                {
                    title: "猜你喜欢",
                    input: JSON.stringify(recommendBooks),
                    script: "recommend.js"
                },
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