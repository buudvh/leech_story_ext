load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = url.replace(BASE_URL, MOBILE_URL);
        var response = crawler.get(url, {}, true);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        var doc = response.html();

        var authorElm = doc.select('body > div.cover > div.block > div.block_txt2 > p:nth-child(4)');
        var authorName = authorElm.text().replace('作者：', '').trim();
        var bookName = doc.select('body > div.cover > div.block > div.block_txt2 > h2 > a').text();
        var cover = doc.select("body > div.cover > div.block > div.block_img2 > img").first().attr("src");
        var genreElm = doc.select('body > div.cover > div.block > div.block_txt2 > p:nth-child(5) > a').first();
        var objGen = DEFAULT_GEN.find(p => p.title == genreElm.text());
        var genres = [{
            title: objGen ? objGen.title : DEFAULT_GEN[0].title,
            input: objGen ? objGen.input : DEFAULT_GEN[0].input,
            script: objGen ? objGen.script : DEFAULT_GEN[0].script
        }];

        return Response.success({
            name: bookName.formatTocName(),
            author: authorName.convertT2S(),
            cover: cover,
            description: doc.select("body > div.cover > div.intro_info").html().convertT2S(),
            detail: doc.select("body > div.cover > div.block > div.block_txt2 > p:nth-child(8)").text().convertT2S()
                + `\n${doc.select("body > div.cover > div.block > div.block_txt2 > p:nth-child(7)").text().convertT2S()}`,
            host: BASE_URL,
            ongoing: doc.select("body > div.cover > div.block > div.block_txt2 > p:nth-child(6)").text().indexOf("连载中") != -1,
            suggests: [
                {
                    title: "同作者",
                    input: authorName,
                    script: "search.js"
                },
            ],
            comments: [
                {
                    title: "QQ Comments",
                    input: authorElm,
                    script: "comment.js"
                }
            ],
            genres: genres
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}