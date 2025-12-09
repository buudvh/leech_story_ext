load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(BASE_URL + url, page);
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#main div.novelslist2 div.sitebox dl");

        if (!elms.length) throw new Error(`Length = 0`);

        var data = [];
        elms.forEach(function (e) {
            data.push({
                name: e.select('dd:nth-child(2) h3 a').first().text(),
                link: e.select('dd:nth-child(2) h3 a').first().attr("href"),
                cover: e.select('dt a img').first().attr("src") || DEFAULT_COVER,
                description: e.select('.book_des').first().html().cleanHtml(),
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        // return Response.error(`Url ${url} \nMessage: ${error.message}`);
        return Response.success([
            {
                name: `Url ${url} \nMessage: ${error.message}`,
                link: '',
                cover: DEFAULT_COVER,
                host: BASE_URL
            }
        ]);
    }
}