load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        var url = url.replace(/\/book\//, "/indexlist/");

        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        chapterElms = doc.select("#alllist > div.lb_mulu > ul > li:not(.title)");

        if(!chapterElms.length) throw new Error(`Length = 0`);

        chapterElms.forEach(function (e) {
            data.push({
                name: formatName(e.select("a").first().text() || e.select('span').first().text()),
                url: e.select("a").first().attr('href') || e.select('span').first().attr('data-cid-url'),
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