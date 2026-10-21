load('yt.js');

// "Gốc": phát bằng trình phát của app (MP4 360p, HLS khi đang trực tiếp; tự chuyển sang nhúng nếu không lấy
// được luồng). "Nhúng": trình phát YouTube trong WebView.
function execute(url) {
    var id = ytVideoId(url);
    if (!id) return Response.error("Không nhận ra video YouTube");
    return Response.success([
        { title: "Gốc", data: JSON.stringify({ id: id, mode: "native" }) },
        { title: "Nhúng", data: JSON.stringify({ id: id, mode: "embed" }) }
    ]);
}
