load('libs.js');
load('config.js');

function execute(url) {
    url = url.replace("m.mibiquge.com", "www.mibiquge.com");
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        const data = [];
        doc.select("#list dl").last().select("a").forEach(e => data.push({
            name: formatName(e.select("a").text()),
            url: e.attr("href"),
            host: BASE_URL,
        }));

        return Response.success(data);
    }
    return null;
}