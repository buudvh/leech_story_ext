load('libs.js');
load('config.js');

function execute(url) {
    try {
        var browser = Engine.newBrowser(); // Khởi tạo browser
        browser.launch(url, 5000); // Mở trang web với timeout

        browser.callJs(
            `
                var div = document.createElement('div');
                div.id = 'bookinfo';
                div.setAttribute('tags', (typeof bookinfo !== 'undefined' && bookinfo && bookinfo.tags) ? bookinfo.tags : '');
                document.body.appendChild(div);
            `,
            100
        );

        var doc = browser.html();
        browser.close();

        var authorElm = doc.select('body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > p:nth-child(2) > a').first();
        var bookName = doc.select('body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > h1 > a').text();
        var cover = doc.select("body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.bookimg2 > img").first().attr("src");
        var recommendBooks = [];
        (doc.select("body > div.container > ul > li.col-4 > div > div > div:nth-child(1) > ul > li > a") || []).forEach(e => {
            e.select('.rank_right').remove();
            e.select('h4').remove();
            e.select('p').remove();
            recommendBooks.push({
                name: e.text().convertT2S(),
                link: e.attr("href"),
                cover: buildCover(getBookId(e.attr("href"))),
                host: BASE_URL,
            })
        });
        var genreElm = doc.select('body > div.container > ul > li.col-8 > div:nth-child(1) > h3 > div > a:nth-child(2)').first();
        var objGen = DEFAULT_GEN.find(p => p.title == genreElm.text().convertT2S());
        var genres = [{
            title: objGen ? objGen.title : DEFAULT_GEN[0].title,
            input: objGen ? objGen.input : DEFAULT_GEN[0].input,
            script: objGen ? objGen.script : DEFAULT_GEN[0].script
        }];

        if (doc.select('#bookinfo') && doc.select('#bookinfo').attr('tags')) {
            doc.select('#bookinfo').attr('tags').split(",").forEach(e => {
                if (e.trim() == '') return;
                genres.push({
                    title: e,
                    input: `/newtag/${e}/{0}`,
                    script: "tag.js"
                })
            });
        }

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text().convertT2S(),
            cover: cover,
            description: doc.select("#tab_info > div").html().convertT2S(),
            detail: doc.select("body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > p:nth-child(5)").text().convertT2S()
                + "\n最新章节: " + doc.select("#tab_chapters > ul > li:nth-child(1) > a > span").text().convertT2S(),
            host: BASE_URL,
            ongoing: doc.select("body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > p:nth-child(4)").text().convertT2S().indexOf("連載") != -1,
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