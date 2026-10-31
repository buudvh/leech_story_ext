load('libs.js');
load('config.js');

function execute(url) {
    try {
        // UA iPhone mặc định ⇒ trang chương bản mobile, có sẵn nội dung trong HTML.
        var response = fetch(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);

        var doc = response.html();
        var content = doc.select('div[id^=ChapterContent]').first();
        var htm = content.html();
        if (!htm) throw new Error('Không thấy nội dung chương');

        // Chương VIP chỉ có vài dòng xem trước kết thúc bằng "......", khung nội dung không được hiện ra.
        var shown = /display:\s*block/.test(content.attr('style'));
        if (!shown && /\.{6}\s*$/.test(content.text())) {
            return Response.success('本章为VIP章节，需在黑岩登录并订阅后才能阅读。');
        }

        content.select('script, style, a').remove();
        htm = cleanHtml(content.html());

        return Response.success(htm);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
