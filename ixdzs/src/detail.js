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

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text().convertT2S(),
            cover: cover,
            description: doc.select("#intro_pc").text().convertT2S(),
            detail: doc.select("body > main > div:nth-child(1) > div.novel > div.n-text > p:nth-child(6)").text()
                + "\n" + doc.select("body > main > div:nth-child(1) > div.novel > div.n-text > p:nth-child(5)").text(),
            host: BASE_URL,
            ongoing: doc.select("body > main > div:nth-child(1) > div.novel > div.n-text > p:nth-child(3) > span").text() == "連載中",
            suggests: [
                {
                    title: "Recommend",
                    input: JSON.stringify(recommendBooks),
                    script: "recommend.js"
                },
                {
                    title: authorElm.text(),
                    input: authorElm.attr("href"),
                    script: "author.js"
                }
            ],
            comments: [
                {
                    title: "QQ Comments",
                    input: bookName.convertT2S(),
                    script: "comment.js"
                }
            ],
            genres: [{
                title: objGenre.title || DEFAULT_GENRES[0].title,
                input: objGenre.input || DEFAULT_GENRES[0].input,
                script: objGenre.script || DEFAULT_GENRES[0].script
            }]
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}