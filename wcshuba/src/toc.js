load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        var url = BASE_URL + url;

        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        chapterElms = doc.select("div.chapterlist.mt10 ul a");

        if (!chapterElms.length) throw new Error(`Length = 0`);

        chapterElms.forEach(function (e) {
            data.push({
                name: e.select("a").first().text().formatTocName(),
                url: e.select("a").first().attr('href'),
                host: BASE_URL,
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
        // return Response.success([{
        //     name: 'Url: ' + url + ', Message:' + error.message,
        //     url: '',
        //     host: BASE_URL,
        // }]);
    }
}