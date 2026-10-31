load('libs.js');
load('config.js');

function execute(url) {
    try {
        var ids = String(url).match(/master\/([0-9a-f]{32})_(\d+)\.txt/i);
        if (!ids) throw new Error('Không đọc được id chương');
        var md5 = String(url).match(/[?&]md5=([0-9a-f]+)/i);
        var path = '/book/chapter/segment/master/' + ids[1] + '_' + ids[2] + '.txt' + (md5 ? '?md5=' + md5[1] : '');

        // Nội dung là mảng đoạn [{content, paragraph_id}], có đoạn rỗng.
        var response = fetchBookFile(path);
        var paragraphs = response.json();
        if (!paragraphs || !paragraphs.length) throw new Error('Không thấy nội dung chương');

        var lines = cleanChapterParagraphs(paragraphs);
        // Chương chỉ có câu đệm "本章无内容/正在上传中" của nền tảng.
        if (!lines.length) return Response.success(EMPTY_CHAPTER_MESSAGE);

        var htm = cleanHtml(lines.join('<br>'));
        return Response.success(htm || EMPTY_CHAPTER_MESSAGE);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
