function execute(url) {
    let charpters = [];
    try {
        var url = url.replace('https', 'http');
        if (!url.endsWith("/")) {
            url = url + "/";
        }
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var chapelm = doc.select("#list-chapterAll")
        var elems = chapelm.select("a");

        if (!elems.length) throw new Error(`Length = 0`);

        elems.forEach(function (e) {
            charpters.push({
                name: e.text(),
                url: e.attr('href'),
                host: "https://uukanshu.cc",
            });
        })

        return Response.success(charpters);
    } catch (error) {
        return Response.error('fetch: ' + url + '\nfailed: ' + error.message);
    }
}