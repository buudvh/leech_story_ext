load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("ul:not(div ul) > li");

        elms.forEach(function (e) {
            data.push({
                name: e.select("a")[0].text(),
                link: BASE_URL + e.select("a")[0].attr("href"),
                cover: DEFAULT_COVER,
                description: e.select("a")[1].text(),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}