load('libs.js');
load('config.js');

function execute(url) {
    try {
        var ref = mowanBookRef(url);
        if (!ref) throw new Error('Không đọc được nguồn/id truyện từ link');

        // API đọc chương nhận kèm tên truyện (SPA luôn gửi); link không có tên thì hỏi chi tiết.
        var bookName = ref.name;
        if (!bookName) {
            var detail = mowanApi('/book/detail', { source: ref.source, book_id: ref.bookId }) || {};
            bookName = cleanText((detail.book || detail).name);
        }

        // Truyện dài vài nghìn chương ⇒ phản hồi lớn, nguồn ngoài chậm.
        var data = mowanApi('/book/chapters', { source: ref.source, book_id: ref.bookId }, 60000) || {};
        var list = Array.isArray(data) ? data : (data.chapters || data.items || []);

        var result = [];
        list.forEach(function (c) {
            var id = c && (c.id != null && c.id !== '' ? c.id : c.chapter_id);
            if (id == null || id === '') return;
            var pay = mowanChapterLocked(c);
            var name = cleanChapterName(c.name || c.title || c.chapter_name) || ('第' + (result.length + 1) + '章');
            result.push({
                name: name + (pay ? ' 🔒︎' : ''),
                url: mowanChapterUrl(ref.source, ref.bookId, id, bookName),
                pay: pay,
                host: BASE_URL
            });
        });

        if (!result.length) throw new Error('Truyện chưa có chương nào');

        return Response.success(result);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
