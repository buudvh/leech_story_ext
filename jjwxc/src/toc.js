load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = formatJJWXCUrl(url);
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html('gb18030');
        var elms = doc.select("body > div.b.module > div:nth-child(3) > a");

        if (!elms.length) throw new Error(`Length = 0`);

        var data = [];
        elms.forEach(e => {
            e.select('span').remove();
            data.push({
                name: e.text().formatTocName(),
                url: e.attr("href"),
                host: BASE_URL,
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
        // return Response.success([{
        //     name: `Url ${url} \nMessage: ${error.message}`,
        //     url: '',
        //     host: BASE_URL,
        // }]);
    }
}