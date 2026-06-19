load('libs.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var chapterElms = doc.select("div#list ul li a");

        if (!chapterElms.length) throw new Error(`Length = 0`);

        var data = [];
        chapterElms.forEach(function (e) {
            data.push({
                name: e.text().formatTocName(),
                url: e.attr('href'),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}
