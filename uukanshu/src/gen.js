load('config.js');
load('libs.js');

function execute(url, page) {
    try {
        if (!page) page = '1';
        var url = String.format(url.replace('https', 'http'), page);
        var response = fetch(url);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var data = [];
        var elems = doc.select('div.bookbox');

        if (!elems.length) throw new Error(`Length = 0`);

        elems.forEach(function (e) {
            var booklink = e.select("h4.bookname a").first().attr('href');
            var bookid = getBookId(booklink);
            data.push({
                name: convertT2S(e.select("h4.bookname").text()),
                link: e.select("h4.bookname a").first().attr('href'),
                //https://image.uukanshu.cc/25/25950/25950s.jpg
                cover: bookid ? createCoverImgFromBookid(bookid) : DEFAULT_COVER,
                description: convertT2S(e.select("div.cat").text()),
            })
        })

        var next_page = parseInt(page) + 1;
        return Response.success(data, next_page.toString());
    } catch (error) {
        return Response.error('fetch: ' + url + '\nfailed: ' + error.message);
    }

}