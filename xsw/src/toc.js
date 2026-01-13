load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = url.replace(/(?:\/book)?\/(\d+)(?:\.html|\/)?/, "/book/$1/");
        var response = crawler.get(url);

        if(!response.ok) throw new Error(`Status = ${response.status}`);
        
        var doc = response.html();

        var elms = doc.select("body > div.kfml > div.liebiao > ul > li > a");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];

        elms.forEach(e => {
            data.push({
                name: e.text().formatTocName(),
                url: e.attr("href"),
                host: BASE_URL,
            });
        });

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