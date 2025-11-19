load('libs.js');
load('config.js');
load('common.js');

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
                name: convertT2S(e.select(".s2 a").first().text()),
                link: link,
                cover: buildCover(getBookId(link)),
                description: "Last update time: " + convertT2S(e.select(".s5").first().text()),
                host: BASE_URL
            });
        });

        return Response.success(data);
    } catch (e) {
        return Response.error(`Url: ${url} \Message: ${e.message}`);
    }
}