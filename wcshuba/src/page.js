load('config.js');
load('libs.js');

function execute(url) {
    try {
        var data = [];
        var url = url.replace(/\/book\/(\d+)\.html$/, "/chapterlist/$1.html");

        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        var selectPage = doc.select("#indexselect-top").first();
        var chapternums = selectPage.select("option");

        if(!chapternums.length) throw new Error("Length = 0");

        chapternums.forEach(function(e){
            data.push(e.attr("value"))
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(error.message);
        // return Response.success([
        //     error.message,
        // ]);
    }
}