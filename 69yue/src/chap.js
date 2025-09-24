load('config.js');
load('libs.js');
function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        var htm = doc.select(".reading-content")
        htm.select("div").remove()
        htm.select(".contentadv").remove()
        htm.select(".bottom-ad").remove()
        htm.select(".txtinfo").remove()
        htm.select("#txtright").remove()
        htm.select("h1").remove()
        htm = htm.html()
        htm = cleanHtml(htm)
            .replace(/第\d+章.*?<br\s*\/?>/, '') // Ex: '  第11745章 大结局，终<br>'
            .replace('(本章完)', '')
            ;
        return Response.success(htm);
    }
    return null;
}