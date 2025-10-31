load('config.js');
load('libs.js');

function execute(url) {
    try {
        var data;
        var content = '';
        nextUrl = url;

        do {
            data = getChapterContent(nextUrl);
            nextUrl = data.nextUrl;
            content += data.htm + '\n';
        } while (data.nextUrl != null);

        return Response.success(convertT2S(htm));
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function getChapterContent(url) {
    try {
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);


        var doc = response.html();
        var isMoreContent = checkMoreContent(doc);
        var htm = doc.select("#content");
        htm.select("div").remove();
        htm.select("script").remove();
        htm.select("a").remove();
        htm.select("h1").remove();

        htm = htm.html();
        htm = cleanHtml(htm)
            .replace(/^第\d+章.*?<br>/, '') // Ex: '  第11745章 大结局，终<br>'
            .replace('(本章完)', '');

        return {
            htm: htm,
            nextUrl: getMoreContentUrl(doc)
        };
    } catch (error) {
        throw new Error(error.message);
    }
}

function getMoreContentUrl(doc) {
    var nextButton = doc.select(`a[text()='下一章']`).first();
    if (nextButton == null || nextButton.length == 0) return null;

    if (getBookId(nextButton.attr('href')).indexOf('_') != -1) return BASE_URL + nextButton.attr('href');

    return null;
}

function getBookId(url) {
    // Biểu thức chính quy:
    // Nó tìm kiếm một chuỗi số (\d+) (Phần chính của ID)
    // Sau đó là một nhóm tùy chọn (?:...)?: gồm (_\d+) (Phần số phụ)
    var regex = /\/(\d+(?:_\d+)?)\.html$/;

    // Thực hiện khớp
    var match = url.match(regex);

    // Kiểm tra và trả về Nhóm Chụp (Capturing Group)
    if (match && match.length > 1) {
        // match[1] chứa nội dung của nhóm chụp đầu tiên
        return match[1];
    }

    return null;
}