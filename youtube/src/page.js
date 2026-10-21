load('yt.js');

// Video lẻ: một trang. Danh sách phát/kênh: ceil(số video / 100) trang (có giới hạn); token trang kế được lưu
// lại khi tải từng trang nên mỗi lần gọi toc chỉ tốn một request.
function execute(url) {
    var kind = ytKind(url);
    if (kind.type !== "playlist" && kind.type !== "channel") return Response.success([url]);
    var listId = ytListIdOf(url);
    if (!listId) return Response.success([url]);
    var state = ytTocState(listId, true);
    if (!state) return Response.error("Không tải được danh sách phát");

    var limit = kind.type === "channel" ? YT_UPLOAD_PAGE_LIMIT : YT_TOC_PAGE_LIMIT;
    var total = state.count ? Math.ceil(state.count / 100) : (state.end ? state.end : limit);
    if (state.end === 1) total = 1;
    total = Math.max(1, Math.min(total, limit));

    var pages = [];
    for (var i = 1; i <= total; i++) pages.push(ytPlaylistUrl(listId) + "&page=" + i);
    return Response.success(pages);
}
