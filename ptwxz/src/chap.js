load('libs.js');

function execute(url) {
    try {
        var response = fetch(url);

        if (!response.ok) throw new Error("Status = " + response.status);

        var doc = response.html('gb2312');

        var htm = $.Q(doc, 'body', { remove: 'h1, div, table, script, center' }).html();
        htm = cleanHtml(htm)
            .replace(/^第\d+章.*?<br>/, '') // Ex: '  第11745章 大结局，终<br>'
            .replace('(本章完)', '');

        return Response.success(convertT2S(htm));
    } catch (error) {
        return Response.error("Url: " + url + "\nMessage: " + error.message);
    }
}