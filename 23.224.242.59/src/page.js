load('config.js');

function execute(url) {
    try {
        var data = [];
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var chapternums = doc.select(".listpage select option");

        chapternums.forEach(function (e) {
            data.push(BASE_URL + e.attr("value"))
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(error.message);
    }

}