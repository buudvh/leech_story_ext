load('config.js');

// Bình luận (API JSON /comment, 10 bình luận gốc mỗi trang). Trả lời lồng sẵn trong `children` (sâu tối đa 2 cấp)
// ⇒ `replies` cùng dạng; app dàn phẳng một cấp nên trả lời cấp 2 ghi "Trả lời <tên>". `start` là vị trí bắt đầu
// (0, 10, 20…), không phải số trang.
function execute(input, next) {
    var start = next ? String(next) : '0';
    var response = fetch(input, { queries: { start: start } });
    if (!response.ok) return Response.error('HTTP ' + response.status + ' ' + input);
    var json = response.json();
    var data = json && json.data;
    if (!data || !data.comments) return Response.error('Dữ liệu bình luận Wiki Dịch không hợp lệ');

    var comments = [];
    data.comments.forEach(function (e) {
        if (e) comments.push(toComment(e, ''));
    });

    var current = parseInt(data.current_page, 10) || 1;
    var pageSize = parseInt(data.page_size, 10) || 10;
    var last = parseInt(data.last_page, 10) || parseInt(data.end_page, 10) || current;
    if (comments.length && current < last) {
        return Response.success(comments, String(current * pageSize));
    }
    return Response.success(comments, null);
}

function toComment(e, parentName) {
    var user = e.user || {};
    var name = user.fullname || user.userslug || 'Ẩn danh';
    var chapter = e.chapter && e.chapter.name_vi;
    var item = {
        name: name,
        avatar: user.picture || '',
        content: e.is_deleted ? 'Bình luận đã bị xoá' : (e.message || ''),
        description: joinParts([
            parentName && Number(e.level) >= 2 ? 'Trả lời ' + parentName : '',
            formatDate(e.created_at && e.created_at.$date),
            Number(e.level) > 0 ? '' : chapter
        ])
    };
    var children = e.children || [];
    if (children.length) {
        item.replies = children.map(function (c) { return toComment(c, name); });
    }
    return item;
}
