load('yt.js');

// input: "playlist:<id>", "channel:<UC…>", "related:<videoId>", "search:<từ khoá>[|sp]", "browse:<browseId>[|lọc tên kệ]".
// page: token continuation của trang trước (rỗng ở trang đầu).
function execute(input, page) {
    input = String(input || "");
    var colon = input.indexOf(":");
    var kind = colon > 0 ? input.substring(0, colon) : "search";
    var arg = colon > 0 ? input.substring(colon + 1) : input;
    var extra = "";
    var bar = arg.indexOf("|");
    if (bar >= 0) {
        extra = arg.substring(bar + 1);
        arg = arg.substring(0, bar);
    }
    if (!arg) return Response.success([], "");
    var result = ytList(kind, arg, extra, page || "");
    if (!result) return Response.error("Không tải được danh sách YouTube");
    return Response.success(result.items, result.next || "");
}
