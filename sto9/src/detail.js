load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();

        var authorName = doc.select('body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > p:nth-child(2) > a').text().convertT2S();

        return Response.success({
            name: doc.select('body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > h1 > a').text().formatTocName(),
            author: authorName,
            cover: doc.select('body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.bookimg2 > img').attr('src'),
            description: doc.select("#tab_info > div").html().convertT2S(),
            detail: doc.select("body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > p:nth-child(6)").text().convertT2S(),
            host: BASE_URL,
            suggests: [
                {
                    title: "同作者",
                    input: `/author/${authorName}.html`,
                    script: "author.js"
                },
            ],
            comments: [
                {
                    title: "Comments",
                    input: getComment(doc),
                    script: "comment_book.js"
                },
                {
                    title: "QQ Comments",
                    input: doc.select('body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > h1 > a').text().formatTocName(),
                    script: "comment.js"
                }
            ],
            ongoing: doc.select('body > div.container > ul > li.col-8 > div:nth-child(1) > div > div.booknav2 > p:nth-child(4)').text().trim() != '狀態：全本'
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}

function getComment(doc) {
    var comments = [];
    doc.select('#tab_reviews div.swiper-slide').forEach(e => {
        comments.push({
            name: e.select('.user').text().convertT2S(),
            content: e.select('.review-text').text().convertT2S(),
        })
    });

    return JSON.stringify(comments);
}