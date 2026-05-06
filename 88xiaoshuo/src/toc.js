load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = url.replace(
            /\/book\/(\d+)\/index\.html$/,
            '/Partlist/$1/'
        );

        console.log(url);

        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();

        var elms = doc.select("#list > dl > dd > a");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];

        var data = [];
        elms.forEach(e => {
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
        //     name: error.message,
        //     url: '',
        //     host: BASE_URL,
        // }]);
    }
}