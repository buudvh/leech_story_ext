load('libs.js');
load('config.js');

function execute(url) {
    try {
        var data = [];
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        var sectionChapters = doc.select('div.container > div.row.row-section > div > div:nth-child(4)');
        var chapterElms = sectionChapters.select("a");

        if (!chapterElms.length) throw new Error(`Length = 0`);

        chapterElms.forEach(function (e) {
            data.push({
                name: e.text(),
                url: e.attr('href'),
                host: BASE_URL,
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
        // return Response.success([{
        //     name: error.message,
        //     url: '',
        //     host: BASE_URL,
        // }]);
    }
}