load('libs.js');

function execute(url) {
    var response = fetch(url);
    if (response.ok) {
        var doc = response.html();

        var htm = $.Q(doc, 'dib.readcotent', {remove: 'h1, div, table, script, center'}).html();
        htm = cleanHtml(htm);

        return Response.success(htm);
    }
    return null;
}