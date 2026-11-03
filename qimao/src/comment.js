load('crypto.js');
load('config.js');

// Bình luận (API app, cùng chữ ký, không cần đăng nhập). input: '{"bookId":"…","sort":"0|1"}' (0 nổi bật, 1 mới nhất).
// App chỉ hiện tên · mô tả · nội dung nên phản hồi được gộp vào cuối nội dung, theo cấu hình COMMENT_MODE.
var RATING_NAMES = { '1': '好看', '2': '一般', '3': '不好看' };
var REPLY_PAGE_SIZE = 20;
// "Tất cả phản hồi": chặn an toàn số lượt gọi cho một bình luận (500 phản hồi).
var REPLY_MAX_ROUNDS = 25;

function commentText(item) {
    var text = String(item.content || '').trim();
    if (!text && item.comment_pic) text = '[Ảnh]';
    return escapeHtml(text).replace(/\r\n|\r|\n/g, '<br>');
}

function loadReplies(bookId, comment, mode) {
    var total = parseInt(comment.reply_count, 10) || 0;
    if (mode === 'off' || !total || !comment.comment_id) return [];
    var lines = [];
    var cursor = '';
    var seen = {};
    for (var round = 0; round < (mode === 'all' ? REPLY_MAX_ROUNDS : 1); round++) {
        var data;
        try {
            data = fetchApp(APP_CMNT, '/api/v1/comment/detail', {
                book_id: String(bookId), comment_id: String(comment.comment_id), next_id: cursor, size: String(REPLY_PAGE_SIZE)
            });
        } catch (error) {
            break;
        }
        var rows = data.reply_list || [];
        rows.forEach(function (r) {
            if (!r || seen[r.comment_id]) return;
            seen[r.comment_id] = true;
            var user = r.user_info || {};
            var target = (r.reference || {}).nickname;
            lines.push('↳ ' + escapeHtml(cleanText(user.nickname || r.nickname || '读者')) +
                (target ? ' ▸ ' + escapeHtml(cleanText(target)) : '') + ': ' + commentText(r));
        });
        var next = String(data.next_id || '');
        if (!rows.length || !next || next === cursor) break;
        cursor = next;
    }
    if (lines.length && total > lines.length) lines.push('… còn ' + (total - lines.length) + ' trả lời');
    return lines;
}

function execute(input, page) {
    var options;
    try {
        options = JSON.parse(String(input || '{}'));
    } catch (error) {
        return Response.error('Tham số bình luận không hợp lệ: ' + input);
    }
    var bookId = parseBookId(String(options.bookId || ''));
    if (!bookId) return Response.error('Thiếu id truyện cho bình luận');
    var mode = commentMode();
    if (mode === 'off') return Response.success([], '');
    var cursor = String(page || '');
    try {
        var params = { book_id: bookId, circle_id: bookId, need_common: '0', sort: options.sort === '1' ? '1' : '0', tag_id: '1' };
        if (cursor) params.next_id = cursor;
        var data = fetchApp(APP_CMNT, '/api/v2/community/book-evaluates', params);
        var rows = data.list || [];
        var comments = [];
        rows.forEach(function (item) {
            if (!item) return;
            var content = commentText(item);
            if (!content) return;
            var replies = loadReplies(bookId, item, mode);
            var user = item.user_info || {};
            comments.push({
                name: cleanText(user.nickname || item.nickname || '读者'),
                description: joinInfo([
                    RATING_NAMES[String(item.eval_rating)],
                    parseInt(item.like_count, 10) ? '👍 ' + item.like_count : '',
                    parseInt(item.reply_count, 10) ? '💬 ' + item.reply_count : '',
                    item.comment_time
                ]),
                content: content + (replies.length ? '<br>——<br>' + replies.join('<br>') : '')
            });
        });
        var next = String(data.next_id || '');
        if (!rows.length || next === cursor) next = '';
        return Response.success(comments, next);
    } catch (error) {
        return Response.error('Qimao: ' + error.message);
    }
}
