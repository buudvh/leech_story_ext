load("config.js");
load("common.js");

function execute(url) {
    try {
        const bookidRegex = /bookid=(\d+)/;
        const match = url.match(bookidRegex);
        const bookid = match[1];
        let url2 = "https://bookshelf.html5.qq.com/qbread/api/novel/intro-info?bookid=" + bookid
        let response = fetch(url2, {
            "headers":
            {
                "user-agent": "Mozilla/5.0 (Linux; Android 10; MI 8 Build/QKQ1.190828.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.101 Mobile Safari/537.36",
                "Referer": "https://bookshelf.html5.qq.com/qbread"
            }
        });

        if (!response.ok) throw new Error("Status = " + response.status);

        let doc = response.json();
        let book = doc.data.bookInfo
        var genres = [];
        book.tag.split("|").forEach(element => {
            var genresObj = CONST_GENRES.find(p => p.title == element);
            genres.push({
                title: element,
                input: genresObj ? genresObj.input : CONST_DEFAULT_INPUT,
                script: "gen.js"
            })
        });

        genres = !genres.length ? genres : null;

        return Response.success({
            name: book.resourceName,
            cover: book.picurl,
            author: book.author,
            description: book.summary.replace(/\n/g, "<br>"),
            // detail: "最新章节： " + book.lastSerialname
            //     + "<br>最后更新： " + formatDate(book.lastUpdatetime, "yyyy-MM-dd HH:mm:ss"),
            detail: "最新章节： " + book.lastSerialname,
            ongoing: !book.isfinish,
            host: "https://bookshelf.html5.qq.com",
            genres: genres,
            suggests: [
                {
                    title: "同作者",
                    input: book.author,
                    script: "author.js"
                },
            ],
            comments: [{
                title: "评论",
                input: bookid,
                script: "comment.js"
            }]
        });

    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}