load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var authorElm = doc.select('body > section:nth-child(4) > div > div > div.row.book_info > div.col-9.col-md-10.pl-md-3.info > div > ul > li:nth-child(1) > a');
        var bookName = doc.select('body > section:nth-child(4) > div > div > div.row.book_info > div.col-9.col-md-10.pl-md-3.info > h1').text();
        var cover = BASE_URL + doc.select("body > section:nth-child(4) > div > div > div.row.book_info > div.col-3.col-md-2 > img").first().attr("src");
        var recommendBooks = [];
        (doc.select("body > section:nth-child(4) > div > div > div.book_info.d-none.d-md-block > p > a") || []).forEach(e => {
            recommendBooks.push({
                name: e.text().convertT2S(),
                link: e.attr("href"),
                cover: buildCover(getBookId(e.attr("href"))),
                host: BASE_URL,
            })
        });

        return Response.success({
            name: bookName.formatTocName(),
            author: authorElm.text().convertT2S(),
            cover: cover,
            description: doc.select("#intro_pc").text().convertT2S(),
            detail: "最新章：" + doc.select("body > section:nth-child(4) > div > div > div.row.book_info > div.col-9.col-md-10.pl-md-3.info > div > ul > li:nth-child(5) > a").text(),
            host: BASE_URL,
            ongoing: doc.select("body > section:nth-child(4) > div > div > div.row.book_info > div.col-9.col-md-10.pl-md-3.info > div > ul > li:nth-child(4)").text() == "状态：连载",
            suggests: [
                {
                    title: "Recommend",
                    input: JSON.stringify(recommendBooks),
                    script: "recommend.js"
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
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}