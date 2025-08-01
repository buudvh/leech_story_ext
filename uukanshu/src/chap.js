load('libs.js');
function execute(url) {
    try {
        let response = fetch(url.replace('https','http'));
        if (response.ok) {
            let doc = response.html();
            let elm = doc.select("div.readcotent");
            let htm = elm.html();
            htm = cleanHtml(htm).replace(/^第\d+章.*?<br>/, '') // Ex: '  第11745章 大结局，终<br>'
            .replace('(本章完)', '');
            return Response.success(htm);
        }
        return null;
    } catch (error) {
        return Response.success(error.message);
    }
}