load('config.js');
load('libs.js');

function execute(url) {
    try {
        var next = false;
        var content = "";

        do {
            var response = crawler.get(url);
            if (!response.ok) throw new Error(`Status ${response.status}`)

            var doc = response.html();
            var htm = doc.select("body > div:nth-child(3) > div.con");
            htm.select("div").remove();
            htm.select("a").remove();
            htm.select("h1").remove();

            htm = htm.html();
            htm = htm.cleanHtml();
            content += `\n${htm}`;

            next = doc.select('body > div:nth-child(3) > div.prenext > span:nth-child(3) > a') && doc.select('body > div:nth-child(3) > div.prenext > span:nth-child(3) > a').text() == '下一页';
            url = next ? BASE_URL + doc.select('body > div:nth-child(3) > div.prenext > span:nth-child(3) > a').attr("href") : url;
        } while (next);

        return Response.success(content);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}