load('yt.js');

// "Gốc": phát bằng trình phát của app — HLS nhiều mức chất lượng tới 1080p (client VISIONOS, có menu Chất lượng);
// không được thì MP4 360p, HLS khi đang trực tiếp; tự chuyển sang nhúng nếu không lấy được luồng.
// "360p": bỏ qua HLS, phát thẳng MP4 360p của client ANDROID (khi bản HD lỗi). "Nhúng": trình phát YouTube trong WebView.
function execute(url) {
    var id = ytVideoId(url);
    if (!id) return Response.error("Không nhận ra video YouTube");
    return Response.success([
        { title: "Gốc", data: JSON.stringify({ id: id, mode: "native" }) },
        { title: "360p", data: JSON.stringify({ id: id, mode: "sd" }) },
        { title: "Nhúng", data: JSON.stringify({ id: id, mode: "embed" }) }
    ]);
}
