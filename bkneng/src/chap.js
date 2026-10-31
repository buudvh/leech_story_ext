load('libs.js');
load('config.js');

function execute(url) {
    try {
        // Trang chương bản wap nhẹ hơn nhiều (~13KB so với ~100KB) mà nội dung như nhau.
        url = String(url).replace('/www/book/read/', '/wap/book/read/');
        if (url.startsWith('/')) url = BASE_URL + url;
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        // Chương khoá chỉ có vài dòng xem trước, kèm nút "点我下载APP继续阅读" ngay dưới nội dung
        // (chỉ xét các nút .readBtn, không xét chữ trong truyện).
        if (doc.select('.readMain .readBtn').text().indexOf('继续阅读') != -1) {
            return Response.success(LOCKED_NOTICE);
        }

        var content = doc.select('.readMain_Content').first();
        content.select('script, style, a, .readBtn').remove();
        var htm = content.html();
        if (!htm || !content.text()) throw new Error('Không thấy nội dung chương');

        return Response.success(cleanHtml(htm));
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
