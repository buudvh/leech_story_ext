load('yt.js');

function execute(query, page) {
    query = String(query || "").trim();
    if (!query) return Response.success([], "");
    var result = ytList("search", query, "", page || "");
    if (!result) return Response.error("Không tìm được trên YouTube");
    return Response.success(result.items, result.next || "");
}
