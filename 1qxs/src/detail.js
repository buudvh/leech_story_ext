load('libs.js');
load('config.js');

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