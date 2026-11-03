load('crypto.js');
load('config.js');

// Bình luận (API app, cùng chữ ký, không cần đăng nhập). input: '{"bookId":"…","sort":"0|1"}' (0 nổi bật, 1 mới nhất).
// Trả lời không tải ở đây — mỗi bình luận một lượt gọi làm trang đầu mất ~30 s. Bình luận có trả lời khai `reply_count`
// + `reply_source` ⇒ app gọi reply.js khi người dùng bấm "N trả lời".
var RATING_NAMES = { '1': '好看', '2': '一般', '3': '不好看' };

function execute(input, page) {
    var options;
    try {
        options = JSON.parse(String(input || '{}'));
    } catch (error) {
        return Response.error('Tham số bình luận không hợp lệ: ' + input);
    }
    var bookId = parseBookId(String(options.bookId || ''));
    if (!bookId) return Response.error('Thiếu id truyện cho bình luận');
    if (commentMode() === 'off') return Response.success([], '');
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
            var user = item.user_info || {};
            var comment = {
                name: cleanText(user.nickname || item.nickname || '读者'),
                avatar: String(user.avatar || item.avatar || ''),
                description: joinInfo([
                    RATING_NAMES[String(item.eval_rating)],
                    parseInt(item.like_count, 10) ? '👍 ' + item.like_count : '',
                    item.comment_time
                ]),
                content: content
            };
            var replyCount = parseInt(item.reply_count, 10) || 0;
            if (replyCount > 0 && item.comment_id) {
                comment.reply_count = replyCount;
                comment.reply_source = {
                    input: JSON.stringify({ bookId: bookId, commentId: String(item.comment_id) }),
                    script: 'reply.js'
                };
            }
            comments.push(comment);
        });
        var next = String(data.next_id || '');
        if (!rows.length || next === cursor) next = '';
        return Response.success(comments, next);
    } catch (error) {
        return Response.error('Qimao: ' + error.message);
    }
}
