load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = fetch(url.replace('https', 'http'));

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var elm = doc.select("div.readcotent");
        var htm = elm.html();
        htm = convertT2S(cleanHtml(htm)).replace(/^第\d+章.*?<br>/, '') // Ex: '  第11745章 大结局，终<br>'
            .replace('(本章完)', '');
        return Response.success(htm);
    } catch (error) {
        return Response.error('fetch: ' + url + '\nfailed: ' + error.message);
    }
}