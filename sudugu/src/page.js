load('libs.js');

function execute(url) {
    try {
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var data = [];

        // Check if there is pagination in the TOC
        var selectPage = doc.select("#pageSelect").first();
        if (selectPage) {
            var options = selectPage.select("option");
            if (options.length > 0) {
                var normalizedUrl = url;
                if (!normalizedUrl.endsWith("/")) normalizedUrl += "/";

                options.forEach(function (e) {
                    var val = e.attr("value");
                    if (val.indexOf("index-") === 0) {
                        data.push(url); // Page 1 is the main book URL
                    } else {
                        data.push(normalizedUrl + "p-" + val + ".html");
                    }
                });
            }
        }

        // If no select box is found or it's empty, return the original url as the only page
        if (data.length === 0) {
            data.push(url);
        }

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}
