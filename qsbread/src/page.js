load('config.js');
load('libs.js');

function execute(url) {
    try {
        url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
        let response = fetch(url);

        if (!response.ok) throw new Error("Status = " + response.status);

        let doc = response.html();
        let pages = [];

        doc.select("#indexselect option").forEach(e => {
            pages.push(BASE_URL + e.attr("value"));
        });
        return Response.success(pages);
    } catch (error) {
        return Response.error("Url: " + url + "\nMessage: " + error.message);
    }
}