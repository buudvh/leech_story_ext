load('yt.js');

function execute(data) {
    var req = parseRequest(data);
    if (!req.id) return Response.error("Không nhận ra video YouTube");
    if (req.mode === "embed") return embedTrack(req.id);
    // "Gốc": HLS nhiều mức chất lượng (client VISIONOS) trước; "sd" (server 360p) đi thẳng client ANDROID.
    if (req.mode !== "sd") {
        var hd = ytVisionHls(req.id);
        if (hd) return hlsTrack(hd.data, captionTracks(hd.json));
    }
    return androidTrack(req.id);
}

// Client ANDROID: video trực tiếp → HLS; video thường → MP4 muxed 360p (itag 18); không được thì trình phát nhúng.
function androidTrack(id) {
    var json = ytAndroidPlayer(id);
    if (!json) return embedTrack(id);
    var ps = json.playabilityStatus || {};
    if (ps.status && ps.status !== "OK") {
        var reason = ytText(ps.reason) || ytText(ps.messages && ps.messages[0]);
        if (ps.status === "LIVE_STREAM_OFFLINE") return Response.error(reason || "Buổi phát trực tiếp chưa bắt đầu");
        if (ps.status === "ERROR") return Response.error(reason || "Video không tồn tại hoặc đã bị xoá");
        // LOGIN_REQUIRED / UNPLAYABLE…: thử trình phát nhúng.
        return embedTrack(id);
    }

    var sd = json.streamingData || {};
    var vd = json.videoDetails || {};
    var subtitles = captionTracks(json);
    var hls = sd.hlsManifestUrl || "";

    if (hls && vd.isLive) return nativeTrack(hls, "application/x-mpegURL", subtitles);

    // Chỉ lấy định dạng muxed (có cả hình và tiếng), không lấy luồng adaptive chỉ hình.
    var best = null;
    var formats = sd.formats || [];
    for (var i = 0; i < formats.length; i++) {
        var f = formats[i];
        if (!f.url) continue;
        var mime = String(f.mimeType || "");
        if (mime.indexOf("video/") !== 0) continue;
        if (mime.indexOf("mp4a") < 0 && mime.indexOf("opus") < 0 && !f.audioQuality) continue;
        if (!best || (f.height || 0) > (best.height || 0)) best = f;
    }
    if (best) return nativeTrack(best.url, "video/mp4", subtitles);
    if (hls) return nativeTrack(hls, "application/x-mpegURL", subtitles);
    return embedTrack(id);
}

function parseRequest(data) {
    data = String(data || "").trim();
    if (data.charAt(0) === "{") {
        try {
            var obj = JSON.parse(data);
            return { id: ytVideoId(obj.id || obj.url || ""), mode: obj.mode || "native" };
        } catch (e) {}
    }
    return { id: ytVideoId(data), mode: "native" };
}

function nativeTrack(url, mimeType, subtitles) {
    return Response.success({
        type: "native",
        data: url,
        host: YT,
        mimeType: mimeType,
        headers: { "User-Agent": YT_ANDROID_UA },
        subtitles: subtitles
    });
}

// Master HLS của client VISIONOS (text đã lọc, hoặc URL master gốc).
function hlsTrack(data, subtitles) {
    return Response.success({
        type: "native",
        data: data,
        host: YT,
        mimeType: "application/x-mpegURL",
        headers: { "User-Agent": YT_VISION_UA },
        subtitles: subtitles
    });
}

function embedTrack(id) {
    return Response.success({
        type: "webview",
        data: YT + "/embed/" + id + "?autoplay=1&playsinline=1&rel=0",
        host: YT,
        headers: { "Referer": YT_EMBED_REFERER }
    });
}

// Phụ đề VTT: tiếng Việt trước, phụ đề tự tạo xếp sau, tối đa 8 bản.
function captionTracks(json) {
    var list = json.captions && json.captions.playerCaptionsTracklistRenderer && json.captions.playerCaptionsTracklistRenderer.captionTracks;
    if (!list || !list.length) return [];
    var tracks = [];
    for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if (!c.baseUrl) continue;
        var lang = String(c.languageCode || "");
        var auto = c.kind === "asr";
        var base = ytAbs(c.baseUrl).replace(/([?&])fmt=[^&]*(&|$)/, "$1").replace(/[?&]$/, "");
        tracks.push({
            rank: (lang.indexOf("vi") === 0 ? 0 : 2) + (auto ? 1 : 0),
            order: i,
            data: base + (base.indexOf("?") >= 0 ? "&" : "?") + "fmt=vtt",
            label: ytText(c.name) || lang,
            language: lang
        });
    }
    tracks.sort(function (a, b) { return a.rank - b.rank || a.order - b.order; });
    var out = [];
    for (var j = 0; j < tracks.length && out.length < 8; j++) {
        out.push({ data: tracks[j].data, type: "vtt", label: tracks[j].label, language: tracks[j].language });
    }
    return out;
}
