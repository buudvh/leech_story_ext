load('config.js');

function execute(url) {
    var data = [];
    var chapterRegex = /<a\s+href="([^"]+)">([^<]+)<\/a>/g;
    try {
        var response = fetch(url);
        if (!response.ok) return Response.success([{
            url,
            name: url,
            host: BASE_URL
        }]);;

        var json = response.json();
        var html = json.html;
        if (html.length === 0) return null;

        var m;
        while ((m = chapterRegex.exec(html)) !== null) {
            data.push({
                url: m[1],
                name: m[2].trim(),
                host: BASE_URL
            });
        }

        return Response.success(data);
    } catch (e) {
        return Response.success([{
            url: url,
            name: e.message,
            host: BASE_URL
        }]);
    }
}