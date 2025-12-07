load('config.js');
load('libs.js');

function execute(url) {
    try {
        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        var htm = doc.select("div.read_content div:nth-child(2)");
        htm.select("div").remove();
        htm.select("a").remove();
        htm.select("h1").remove();
        htm.select("script").remove();

        htm = htm.html().cleanHtml();

        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
