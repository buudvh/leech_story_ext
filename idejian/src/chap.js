load('libs.js');
load('config.js');

function execute(url) {
    try {
        const match = url.match(/\/book\/(\d+)\/(\d+)\.html$/);
        if (!match) throw new Error("Url invalid");

        var bookId = match[1];
        var chapterId = match[2];

        url = `${WECHAT_URL}/book/${bookId}/${chapterId}`;

        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        var result = response.json();

        var doc = Html.parse(result.body.content.trim().decodeEscapedHtml().toString());
        doc.select('table').remove();
        doc.select('h1').remove();
        var htm = doc.html();

        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}