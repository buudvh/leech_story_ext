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
        htm = htm.cleanHtml()

        return Response.success(convertT2S(htm));
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
