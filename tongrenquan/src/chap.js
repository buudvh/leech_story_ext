load('libs.js');

function execute(url) {
    try {
        url = url.replace('m.tongrenquan.org', 'tongrenquan.org').replace('www.tongrenquan.org', 'tongrenquan.org');;

        var response = fetch(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        var doc = response.html('gb2312');

        var htm = $.Q(doc, 'div.read_chapterDetail').html();
        htm = htm.cleanHtml();

        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url: ${url}\nMessage: ${error.message}`);
    }
}