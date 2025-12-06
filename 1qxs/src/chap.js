load('config.js');
load('libs.js');

function execute(url) {
    try {
        var initUrl = url;
        var response = fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
            }
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();

        var totalPart = getTotalPart(doc.select("div.title h1").first().text());

        var htm = getContent(doc);

        for (let index = 2; index <= totalPart; index++) {
            url = initUrl.replace(/\/(\d+)\.html$/, `/$1/${index}.html`);
            var response = fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
                }
            });

            if (!response.ok) throw new Error(`Status ${response.status}`);

            var doc = response.html();

            htm += getContent(doc);
        }

        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}


function getContent(doc) {
    var htm = doc.select('.content');
    htm.select('div').remove();
    htm.select('a').remove();
    htm.select('h1').remove();

    htm = htm.html();
    htm = htm.replace(
        /<p[^>]*>[\s\S]*?(镇压诸天|本站http|本章未完)[\s\S]*?<\/p>/g,
        ""
    ).cleanHtml();

    return htm;
}

function getTotalPart(chapterName) {
    const matches = chapterName.match(/\((\d+)\/(\d+)\)/g);

    let total = null;
    if (matches && matches.length > 0) {
        const last = matches[matches.length - 1];           // lấy cái cuối
        const parts = last.match(/\((\d+)\/(\d+)\)/);       // tách x/y
        return Number(parts[2]);                           // tổng số phần
    }

    return 1;
}