load('libs.js');
load('config.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        
        var doc = response.html();
        
        chapterElms = doc.select("#list dl dd a");
        
        if (!chapterElms.length) throw new Error(`Length = 0`);
        
        var data = [];
        chapterElms.forEach(function (e) {
            data.push({
                name: e.text().formatTocName(),
                url: e.attr('href'),
                host: BASE_URL,
            });
        });

        if(data.length >= 12) data = data.slice(12);

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