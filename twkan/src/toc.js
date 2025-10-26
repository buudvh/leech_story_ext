load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        //https://twkan.com/book/78813.html
        //to
        //https://twkan.com/ajax_novels/chapterlist/78813.html
        var url = url.replace(/\/book\//, "/ajax_novels/chapterlist/");

        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        chapterElms = doc.select("ul li");

        if(!chapterElms.length) throw new Error(`Length = 0`);

        chapterElms.forEach(function (e) {
            data.push({
                name: formatName(e.select("a").first().text()),
                url: e.select("a").first().attr('href'),
                id: e.attr('data-num'),
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
        // return Response.success([{
        //     name: 'fetch ' + url + ' failed: ' + error.messag,
        //     url: '',
        //     host: BASE_URL,
        // }]);
    }
}