load('libs.js');

function execute(url) {
    try {
        var next = false;
        var content = "";
        var currentUrl = url;

        do {
            var response = crawler.get(currentUrl);
            if (!response.ok) throw new Error(`Status ${response.status}`);

            var doc = response.html();
            var htm = doc.select("div.con");
            htm.select("div").remove();
            htm.select("a").remove();
            htm.select("h1").remove();

            var firstP = htm.select("p").first();
            if (firstP && /^第[\d\u4e00-\u9fa5]+[章节]/.test(firstP.text().trim())) {
                firstP.remove();
            }

            var text = htm.html().cleanHtml();
            // remove (本章完)
            text = text.replace(/\(本章完\)/g, "");
            content += text + "\n";

            next = false;
            var nextElms = doc.select("div.prenext a");
            nextElms.forEach(function (e) {
                if (e.text().trim() === "下一页") {
                    var nextUrlVal = e.attr("href");
                    if (nextUrlVal.indexOf("http") === 0) {
                        currentUrl = nextUrlVal;
                    } else if (nextUrlVal.indexOf("/") === 0) {
                        currentUrl = BASE_URL + nextUrlVal;
                    } else {
                        // resolve relative to currentUrl parent folder
                        var parentUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
                        currentUrl = parentUrl + "/" + nextUrlVal;
                    }
                    next = true;
                }
            });
        } while (next);

        return Response.success(content.trim());
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}
