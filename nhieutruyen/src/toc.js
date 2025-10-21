load('config.js')
function execute(url) {
    try {
        let response = fetch(url + "/muc-luc");

        if (!response.ok) {
            return Response.success([{
                name: `error: ${response.status}`,
                url: url + "/muc-luc"
            }]);
        }

        let doc = response.html();
        let elms = doc.select("#chapter-list a");
        const data = [];
        elms.forEach(e => {
            data.push({
                name: e.select("h3").text(),
                url: e.attr("href")
            });
        })
        return Response.success(data);
    } catch (error) {
        return Response.success([{
            name: `error: ${error.message}`,
            url: url + "/muc-luc"
        }]);
    }
}