load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        
        var doc = response.html('gb2312');
        
        chapterElms = doc.select("body > div.readContent > div.book_list.clearfix > ul > li > a");
        
        if (!chapterElms.length) throw new Error(`Length = 0`);
        
        var data = [];
        chapterElms.forEach(function (e) {
            data.push({
                name: e.text().formatTocName().replace(/第(\d+)节/g, '第$1章'),
                url: e.attr('href'),
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