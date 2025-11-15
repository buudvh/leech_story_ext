load('config.js');
load('libs.js');

function execute(url) {
    try {
        url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
        let response = fetch(url + "/");

        if (!response.ok) throw new Error("Status = " + response.status);

        let doc = response.html();
        let chapList = [];
        doc.select(".section-list").last().select("a").forEach(e => {
            chapList.push({
                name: formatName(e.text()),
                url: e.attr("href"),
                host: BASE_URL
            })
        })
        return Response.success(chapList);
    } catch (error) {
        return Response.error("Url: " + url + "\nMessage: " + error.message);
    }
}