load('config.js');

function execute(url) {
    try {
        var data = [];
        var response = fetch(url, {
            headers: {
                'Content-Type': 'text/html;charset=utf-8',
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1",
            }
        });
        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var chapternums = doc.select("div.bodywidth > div.onlyh5 a");

        chapternums.forEach(function(e){
            data.push(e.attr("href"))
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(error.message);
    }

}