load('yt.js');

function execute(url) {
    var kind = ytKind(url);
    if (kind.type === "video") {
        return Response.success([{ name: "Video", url: ytWatchUrl(kind.id), host: YT }]);
    }
    var listId = ytListIdOf(url);
    if (!listId) return Response.error("Liên kết YouTube không hợp lệ");

    var m = String(url).match(/[?&]page=(\d+)/);
    var chapters;
    if (m) {
        chapters = ytTocPage(listId, parseInt(m[1], 10));
    } else {
        // Gọi thẳng bằng URL danh sách (không qua page.js): gom các trang tới giới hạn.
        var limit = kind.type === "channel" ? YT_UPLOAD_PAGE_LIMIT : YT_TOC_PAGE_LIMIT;
        chapters = [];
        for (var p = 1; p <= limit; p++) {
            var part = ytTocPage(listId, p);
            if (!part || !part.length) break;
            chapters = chapters.concat(part);
        }
    }
    if (!chapters) return Response.error("Không tải được danh sách video");
    for (var i = 0; i < chapters.length; i++) chapters[i].host = YT;
    return Response.success(chapters);
}
