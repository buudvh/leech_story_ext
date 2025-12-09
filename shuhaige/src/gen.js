load('libs.js');
load('config.js');

function execute(url, page) {
    try {
        page = page || '1';
        url = String.format(BASE_URL + url, page);
        var data = [];
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#main div.novelslist2 ul li span.s2 a");
        var elmBoys = doc.select("#main div.novelslist2 ul li span.s2.boys a");

        if (!elms.length) throw new Error(`Length = 0`);

        elmBoys.forEach(function (e) {
            data.push({
                name: e.text(),
                link: e.attr("href"),
                cover: DEFAULT_COVER,
                host: BASE_URL
            });
        });

        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}