load('libs.js');
load('config.js');

function execute(url) {
    try {
        url = url.replace(/\/xs_([a-z0-9]+)\/(\d+)\.html$/, "/catalog_$1/$2.html");

        var response = fetch(url, {
            method: 'GET',
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9,ja;q=0.8,vi;q=0.7",
                "cache-control": "max-age=0",
                "if-none-match": "\"082a3022d4eb13b7cde59e014ea67d8e4--gzip\"",
                "priority": "u=0, i",
                "sec-ch-ua": "\"Microsoft Edge\";v=\"143\", \"Chromium\";v=\"143\", \"Not A(Brand\";v=\"24\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Referer": "https://www.1qxs.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
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
