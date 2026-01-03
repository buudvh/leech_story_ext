load('config.js');
load('libs.js');

function execute(url) {
    try {
        var next = false;
        var content = "";
        url = url.replace(BASE_URL, MOBILE_URL);

        do {
            var response = crawler.get(url);
            if (!response.ok) throw new Error(`Status ${response.status}`)

            var doc = response.html();
            var htm = doc.select("#nr1");
            htm.select("div").remove();
            htm.select("a").remove();
            htm.select("h1").remove();

            htm = htm.html();
            htm = htm.cleanHtml();
            content += `\n${htm}`;

            next = doc.select('#pb_next') && doc.select('#pb_next').text() == '下一页';
            url = next ? MOBILE_URL + doc.select('#pb_next').attr("href") : url;
        } while (next);

        return Response.success(content);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}