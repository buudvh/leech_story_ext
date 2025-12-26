load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('body > main > div:nth-child(1) > div.novel > div.n-text > p:nth-child(2) > a').first();
        var bookName = doc.select('body > main > div:nth-child(1) > div.novel > div.n-text > h1').text();
        var cover = doc.select("body > main > div:nth-child(1) > div.novel > div.n-img > img").first().attr("src");
        var recommendBooks = [];
        (doc.select("body > main > div:nth-child(6) > ul > li") || []).forEach(e => {
            recommendBooks.push({
                name: e.select("h3").first().text().convertT2S(),
                link: e.select("a:nth-child(1)").first().attr("href"),
                cover: e.select("img").first().attr("src"),
                host: BASE_URL,
            })
        });
        var genreElm = doc.select('body > main > div:nth-child(1) > div.novel > div.n-text > p:nth-child(3) > a').first();
        var objGenre = DEFAULT_GENRES.find(p => p.title = genreElm.text());
        var tags = [{
            title: objGenre.title || DEFAULT_GENRES[0].title,
            input: objGenre.input || DEFAULT_GENRES[0].input,
            script: objGenre.script || DEFAULT_GENRES[0].script
        }];
        (doc.select("body > main > div:nth-child(2) > div > em > a") || []).forEach(e => {
            tags.push({
                title: e.text().convertT2S(),
                input: e.attr("href"),
                script: "gen.js",
            })
        });

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text().convertT2S(),
            cover: cover,
            description: doc.select("#intro").text().convertT2S(),
            detail: doc.select("body > main > div:nth-child(1) > div.novel > div.n-text > p:nth-child(6)").text()
                + "\n" + doc.select("body > main > div:nth-child(1) > div.novel > div.n-text > p:nth-child(5)").text(),
            host: BASE_URL,
            ongoing: doc.select("body > main > div:nth-child(1) > div.novel > div.n-text > p:nth-child(3) > span").text() == "連載中",
            suggests: [
                {
                    title: "同作者",
                    input: JSON.stringify(recommendBooks),
                    script: "recommend.js"
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