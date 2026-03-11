load('libs.js');

function execute(key, page) {
    var url = null;
    try {
        var url = `${BASE_URL}/ar.php?keyWord=${encodeURIComponent(key)}`;
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var data = [];
        var doc = response.html();
        var elms = doc.select(".txt-list li");

        if (!elms.length) throw new Error(`Length = 0`);

        elms.forEach(function (e) {
            var link = e.select(".s2 a").first().attr("href");
            data.push({
                name: e.select(".s2 a").first().text().convertT2S(),
                link: link,
                cover: buildCover(getBookId(link)),
                description: e.select(".s4").first().text().convertT2S(),
                host: BASE_URL,
                author: e.select(".s4").first().text()
            });
        });

        data = data.filter(p => p.author == key);

        return Response.success(data);
    } catch (e) {
        return Response.error(`Url: ${url} \Message: ${e.message}`);
    }
}