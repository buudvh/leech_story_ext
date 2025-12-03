load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        var url = BASE_URL + url;

        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        // var browser = Engine.newBrowser(); // Khởi tạo browser
        // browser.launch(url, 10000); // Mở trang web với timeout
        // var doc = browser.html();
        // browser.close();

        chapterElms = doc.select("#alllist > div.lb_mulu > ul > li:not(.title)");

        if (!chapterElms.length) throw new Error(`Length = 0`);

        chapterElms.forEach(function (e) {
            data.push({
                name: (e.select("a").first().text() || e.select('span').first().text()),
                url: e.select("a").first().attr('href') || e.select('span').first().attr('data-cid-url'),
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