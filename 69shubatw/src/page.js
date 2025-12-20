load('config.js');
load('libs.js');

function execute(url) {
    try {
        var data = [];
        var url = url.replace(/\/book\//, "/indexlist/");

        // var response = crawler.get(url);
        // if (!response.ok) throw new Error(`Status ${response.status}`);

        // var doc = response.html();

        var browser = Engine.newBrowser();
        browser.launch(url, 10000);
        var doc = browser.html();
        browser.close();

        var chapternums = doc.select("#indexselect-top option");

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