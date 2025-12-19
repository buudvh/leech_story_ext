load('libs.js');
load('config.js');

function execute(url) {
    try {
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

        var bookName = doc.select('div.detail div.name h1').first().text();
        var genresName = doc.select('div.book div.detail div:nth-child(3) span:nth-child(1) a').first().text().trim();
        var genres = GENRES_LIST.find(gen => gen.title == genresName);
        return Response.success({
            name: bookName,
            cover: doc.select('div.book div.image img').first().attr('data-original') || DEFAULT_COVER,
            author: doc.select('div.detail div.name span').first().text(),
            description: doc.select('div.bookinfo div.desc.panel div.description').text(),
            detail: `更新: ${doc.select('div.book div.detail div:nth-child(4) span:nth-child(3)').text()}`,
            host: BASE_URL,
            genres: [{
                title: genresName,
                input: genres ? genres.input : "/all/0_0_0_0_0_{0}.html",
                script: "gen.js"
            }],
            comments: [
                {
                    title: "QQ Comments",
                    input: bookName,
                    script: "qqcomment.js"
                },
            ]
        });
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}