load('crypto.js');
load('config.js');

// Trả lời của một bình luận — app gọi khi người dùng bấm "N trả lời" (`reply_source` của comment.js).
// input: '{"bookId":"…","commentId":"…"}'; page: `next_id` của lượt trước (lượt đầu rỗng). 20 trả lời mỗi lượt.
var REPLY_PAGE_SIZE = 20;

function execute(input, page) {
    var options;
    try {
        options = JSON.parse(String(input || '{}'));
    } catch (error) {
        return Response.error('Tham số trả lời không hợp lệ: ' + input);
    }
    var bookId = parseBookId(String(options.bookId || ''));
    var commentId = String(options.commentId || '');
    if (!bookId || !commentId) return Response.error('Thiếu id truyện hoặc id bình luận cho trả lời');
    var cursor = String(page || '');
    try {
        var data = fetchApp(APP_CMNT, '/api/v1/comment/detail', {
            book_id: bookId, comment_id: commentId, next_id: cursor, size: String(REPLY_PAGE_SIZE)
        });
        var rows = data.reply_list || [];
        var replies = [];
        rows.forEach(function (r) {
            if (!r) return;
            var content = commentText(r);
            if (!content) return;
            var user = r.user_info || {};
            var reference = r.reference || {};
            var target = reference.nickname || (reference.user_info || {}).nickname;
            replies.push({
                name: cleanText(user.nickname || r.nickname || '读者'),
                avatar: String(user.avatar || r.avatar || ''),
                description: joinInfo([
                    target ? 'Trả lời ' + target : '',
                    parseInt(r.like_count, 10) ? '👍 ' + r.like_count : '',
                    r.comment_time
                ]),
                content: content
            });
        });
        var next = String(data.next_id || '');
        if (!rows.length || next === '0' || next === cursor) next = '';
        return Response.success(replies, next);
    } catch (error) {
        return Response.error('Qimao: ' + error.message);
    }
}
