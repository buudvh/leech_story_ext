load('libs.js');
load('config.js');

function execute(url) {
    try {
        var bookid = getBookId(url);
        if (bookid == null) throw new Error("bookid null");

        var response = fetch("https://ixdzs.tw/novel/html/", {
            "method": "POST",
            "headers": {
                "content-type": "application/x-www-form-urlencoded",
                "x-requested-with": "XMLHttpRequest",
                "accept": "text/html"
            },
            "body": "bid=" + bookid,
            "referrer": "https://ixdzs.tw/read/" + bookid + "/"
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        // throw new Error(response.text());

        var data = extractChapters(response.text());

        if (!data.length) throw new Error("Length = 0");

        return Response.success(data);
    } catch (error) {
        // return Response.error(`Url ${url} \nMessage: ${error.message}`);
        return Response.success([{
            name: `Url ${url} \nMessage: ${error.message}`,
            url: '',
            host: BASE_URL,
        }]);
    }
}

function extractChapters(html) {
    const regex = /href="([^"]+)">([^<]+)/g;
    let match;
    const chapters = [];

    while ((match = regex.exec(html)) !== null) {
        chapters.push({
            href: match[1], // Nhóm 1: Nội dung trong href
            name: match[2].trim() // Nhóm 2: Tên chương nằm giữa <a> và </a>
        });
    }
    return chapters;
}