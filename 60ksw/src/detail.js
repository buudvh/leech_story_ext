load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);

        if(!response.ok) throw new Error(`Status = ${response.status}`);
        
        var doc = response.html('gbk');

        var authorElm = doc.select('#author');
        var bookName = doc.select('#bookinfo > div.bookright > div.booktitle > h1').text();
        var cover = doc.select("#bookimg > a > img").first().attr("src");
        var recommendBooks = [];
        (doc.select("#maininfo > div.list_center.w_200.right > div.hotlist > ul > li > a") || []).forEach(e => {
            recommendBooks.push({
                name: e.text().convertT2S(),
                link: e.attr("href"),
                cover: buildCover(getBookId(e.attr("href"))),
                host: BASE_URL,
            })
        });
        var genreElm = doc.select('#bookinfo > div.bookright > div.count > ul > li:nth-child(1) > span').first();
        var objGen = DEFAULT_GEN.find(p => p.title == genreElm.text());
        var genres = [{
            title: objGen ? objGen.title : DEFAULT_GEN[0].title,
            input: objGen ? objGen.input : DEFAULT_GEN[0].input,
            script: objGen ? objGen.script : DEFAULT_GEN[0].script
        }];

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text().convertT2S(),
            cover: cover,
            description: doc.select("#bookintro").html().convertT2S(),
            detail: doc.select("#bookinfo > div.bookright > div.new > span.new_t").text().convertT2S(),
            host: BASE_URL,
            ongoing: doc.select("#bookinfo > div.bookright > div.count > ul > li:nth-child(5) > span").text().convertT2S().indexOf("连载中") != -1,
            suggests: [
                {
                    title: "猜你喜欢",
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
            genres: genres
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}