// Cấu hình bình luận (COMMENT_MODE) -> 'off' | 'on'. Giá trị của v2 ("Tối đa 20 phản hồi…", "Tất cả phản hồi") = bật:
// từ v3 trả lời tải khi bấm (reply.js), không còn giới hạn số phản hồi. Dùng cho comment.js và detail.js.
function commentMode() {
    var key = (typeof COMMENT_MODE !== 'undefined' && COMMENT_MODE != null ? String(COMMENT_MODE) : '').trim();
    return key === 'Tắt bình luận' ? 'off' : 'on';
}
