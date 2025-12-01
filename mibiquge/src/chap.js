load('libs.js');
load('config.js');

function execute(url) {
    let response = fetch(url);

    if (response.ok) {
        let doc = response.html();
        let htm = doc.select("#content").html();
        htm = cleanHtml(htm.replace(/\&nbsp;/g, ""));
        return Response.success(htm);
    }
    return null;
}