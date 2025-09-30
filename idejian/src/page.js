load('config.js');
function execute(url) {
    try {
        var m2 = url.match(/(?:https?:\/\/)?(?:www\.)?idejian\.com\/book\/(\d+)/);
        var bookId = m2[1];
        url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
        if (url.slice(-1) !== "/")
            url = url + "/";
        var response = fetch(url);
        var data = [];
        if (response.ok) {
            var doc = response.html();
            var num_page = doc.select("#catelog").attr("data-size") || "50";

            for (var i = 1; i <= parseInt(num_page); i++) {
                data.push(BASE_URL + "/catelog/" + bookId + "/1?page=" + i.toString())
            }
            return Response.success(data);
        }

        return null;
    } catch (error) {
        return Response.error(error.message);
    }

}