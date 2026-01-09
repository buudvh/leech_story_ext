load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = url.replace(/\/book\/(\d+)\.html/, "/ajax_novels/chapterlist/$1.html");
        var response = crawler.get(url);
        var data = [];
        if (response.status == 403) {
            var browser = Engine.newBrowser(); // Khởi tạo browser
            browser.launch(url, 10000); // Mở trang web với timeout, trả về Document object
            var doc = browser.html(); // Trả về Document object của trang web
            browser.close(); // Đóng browser khi đã xử lý xong
            var elms = doc.select("a");
            if (!elms.length) throw new Error("Length = 0");
            elms.forEach(e => {
                data.push({
                    name: e.text().formatTocName(),
                    url: e.attr("href"),
                    host: BASE_URL,
                });
            });
            return Response.success(data);
        } else if (!response.ok) throw new Error(`Status ${response.status}`);

        var html = response.text();
        var regex = /href="([^"]+)">([^<]+)/g;
        var match;

        while ((match = regex.exec(html)) !== null) {
            data.push({
                name: match[2].trim().formatTocName(),
                url: match[1],
                host: BASE_URL,
            });
        }

        if (!data.length) throw new Error("Length = 0");

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