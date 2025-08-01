function execute(url) {
    let charpters = [];
    try {
        let fetchUrl = url.replace('https','http');
        if (!fetchUrl.endsWith("/")) {
            fetchUrl = fetchUrl + "/";
        }
        let response = fetch(fetchUrl);
        if (response.ok) {
            let doc = response.html();
            let chapelm = doc.select("#list-chapterAll")
            let elems = chapelm.select("a");
            elems.forEach(function (e) {
                charpters.push({
                    name: e.text(),
                    url: e.attr('href'),
                    host: "https://uukanshu.cc",
                });
            })
            return Response.success(charpters);
        }

        return null;
    } catch (error) {
        return Response.success([{
            name: error.message,
            url: "",
            host: "",
        }]);
    }
}