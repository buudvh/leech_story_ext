load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("body > ul > li");

        if(!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            data.push({
                name: e.select("a").first().text(), //e.select('a:nth-child(2)').text(),
                link: BASE_URL + e.select("a").first().attr("href"),
                cover: DEFAULT_COVER,
                description: e.text(),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}