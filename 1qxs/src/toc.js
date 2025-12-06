load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = url.replace(/\/xs_([a-z0-9]+)\/(\d+)\.html$/, "/catalog_$1/$2.html");

        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        var data = [];
        var elems = doc.select('div.catalog ul li a');

        if (!elems.length) throw new Error(`Length = 0`);

        elems.forEach(element => {
            data.push({
                name: element.text().formatTocName(),
                url: element.attr('href'),
                host: BASE_URL,
            });
        });

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
