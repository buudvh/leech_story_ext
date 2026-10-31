load('libs.js');
load('config.js');

// url: tệp .txt trên CDN (mục lục) hoặc link API get_content_by_chapterId (chương CDN hỏng).
function execute(url) {
    try {
        var ids = fengduChapterIds(url);
        var text = '';
        var title = '';

        if (CDN_CHAPTER_RE.test(String(url))) text = fetchCdnText(String(url));

        // CDN mất tệp (404) hoặc chỉ có câu giữ chỗ ⇒ lấy qua API.
        if (!fengduHasContent(text)) {
            if (!ids) throw new Error('Không đọc được id chương');
            var result = fengduApi('get_content_by_chapterId?bookId=' + ids.bookId + '&chapterId=' + ids.chapterId);
            var item = (result.content || [])[0] || {};
            text = item.chapterContent || '';
            title = item.chapterTitle || '';
        }

        if (!fengduHasContent(text)) return Response.success(EMPTY_CHAPTER_MESSAGE);

        var htm = fengduContentHtml(text, title);
        if (!htm) return Response.success(EMPTY_CHAPTER_MESSAGE);

        return Response.success(cleanHtml(htm));
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}

// CDN https có lúc lỗi DNS nhưng http vẫn được ⇒ thử https rồi http. TXT không khai charset ⇒ ép UTF-8.
function fetchCdnText(url) {
    var https = url.replace(/^http:\/\//, 'https://');
    var urls = [https, https.replace(/^https:\/\//, 'http://')];
    for (var i = 0; i < urls.length; i++) {
        var response = fetch(urls[i]);
        if (response.ok) {
            var text = response.text('utf-8');
            if (fengduHasContent(text)) return text;
            return '';
        }
        // 404/403: tệp không tồn tại, http cũng vậy.
        if (response.status == 404 || response.status == 403) return '';
    }
    return '';
}
