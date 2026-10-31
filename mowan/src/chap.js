load('libs.js');
load('config.js');

function execute(url) {
    try {
        var ref = mowanChapterRef(url);
        if (!ref) throw new Error('Không đọc được nguồn/id chương từ link');

        var content = mowanApi('/chapter/content', { source: ref.source, chapter_id: ref.chapterId, book_name: ref.bookName }, SLOW_TIMEOUT_MS) || {};

        // Nguồn không trả nội dung. SPA coi là lỗi tạm (nút 重新加载, không lưu offline) ⇒ báo lỗi để app cho thử lại và
        // không lưu câu báo thành nội dung chương; riêng chương trả phí thì trả câu báo như chương VIP.
        if (content.unavailable === true) {
            var msg = cleanText(content.msg);
            if (PAID_MESSAGE_RE.test(msg)) return Response.success(UNAVAILABLE_CHAPTER_MESSAGE + '<br>' + msg);
            throw new Error('Nguồn tạm không trả nội dung chương này' + (msg ? ' (服务器: ' + msg + ')' : '') + ', thử lại sau.');
        }
        var type = mowanType(content.type);
        if (type != 'novel') {
            return Response.success('Chương này là ' + mowanTypeName(type) + ', tiện ích chỉ đọc được truyện chữ.');
        }

        var lines = cleanChapterLines(content);
        if (!lines.length) return Response.success(EMPTY_CHAPTER_MESSAGE);

        return Response.success(cleanHtml(lines.join('<br>')) || EMPTY_CHAPTER_MESSAGE);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}
