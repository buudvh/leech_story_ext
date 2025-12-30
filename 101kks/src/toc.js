load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = url.replace(/\/book\/(\d+)\.html/, "/ajax_novels/chapterlist/$1.html");
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var html = response.text();
        var regex = /href="([^"]+)">([^<]+)/g;
        var match;
        var data = [];

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