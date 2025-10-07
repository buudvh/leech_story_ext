load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`)
        
        var doc = response.html();
        var htm = doc.select("#nr1");
        htm.select("div").remove();
        htm.select("a").remove();
        htm.select("h1").remove();

        htm = htm.html();
        htm = cleanHtml(htm)
            .replace(/^第\d+章.*?<br>/, '') // Ex: '  第11745章 大结局，终<br>'
            .replace('(本章完)', '');

        return Response.success(htm);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
