load('config.js');
load('libs.js');

function execute(url) {
    try {
        var initUrl = url;
        var referer = getRefererFromUrl(url);
        var response = fetch(url, {
            method: 'GET',
            headers: {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "vi,en-US;q=0.9,en;q=0.8,ja;q=0.7,zh-CN;q=0.6,zh;q=0.5",
                "cache-control": "max-age=0",
                "priority": "u=0, i",
                "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Referer": referer,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
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
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "vi,en-US;q=0.9,en;q=0.8,ja;q=0.7,zh-CN;q=0.6,zh;q=0.5",
                    "cache-control": "max-age=0",
                    "priority": "u=0, i",
                    "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    "Referer": referer,
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
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

function getRefererFromUrl(url) {
    if (!url) return "";

    // Tìm vị trí của dấu gạch chéo cuối cùng
    var lastSlashIndex = url.lastIndexOf('/');

    if (lastSlashIndex !== -1) {
        // Cắt chuỗi từ đầu đến dấu gạch chéo cuối cùng và thêm .html
        return url.substring(0, lastSlashIndex) + ".html";
    }

    return url;
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