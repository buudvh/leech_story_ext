load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        var response = fetch(BASE_URL + url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        chapterElms = doc.select('a[href^="/read"]');

        if(!chapterElms.length) throw new Error(`Length = 0`);

        chapterElms.forEach(function (e) {
            data.push({
                name: formatName(e.text()),
                url: e.attr("href"),
                host: BASE_URL,
            });
        });

        return Response.success(data);
    } catch (error) {
        // return Response.error('fetch ' + url + ' failed: ' + error.message);
        return Response.success([{
            name: 'fetch ' + url + ' failed: ' + error.messag,
            url: '',
            host: BASE_URL,
        }]);
    }
}