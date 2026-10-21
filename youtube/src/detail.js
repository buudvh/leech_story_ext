load('yt.js');

function execute(url) {
    var kind = ytKind(url);
    if (kind.type === "video") return videoDetail(kind.id);
    if (kind.type === "playlist") return listDetail(kind.id, ytPlaylistUrl(kind.id), false);
    if (kind.type === "channel") {
        var ucid = ytResolveChannel(kind);
        if (!ucid) return Response.error("Không tìm thấy kênh YouTube");
        return listDetail(ytUploadsId(ucid), YT + "/channel/" + ucid, true);
    }
    return Response.error("Liên kết YouTube không hợp lệ");
}

// Thông tin video: player của client WEB vẫn trả videoDetails + microformat dù không cho phát.
function videoDetail(id) {
    var json = ytApi("player", { videoId: id, contentCheckOk: true, racyCheckOk: true });
    if (!json || !json.videoDetails) json = ytAndroidPlayer(id);
    if (!json || !json.videoDetails) json = ytPageVar(ytWatchUrl(id), "ytInitialPlayerResponse");
    var vd = json && json.videoDetails;
    if (!vd || !vd.title) {
        var reason = json && json.playabilityStatus && ytText(json.playabilityStatus.reason);
        return Response.error(reason || "Không tải được thông tin video");
    }
    var mf = (json.microformat && json.microformat.playerMicroformatRenderer) || {};
    var live = !!(vd.isLive || (mf.liveBroadcastDetails && mf.liveBroadcastDetails.isLiveNow));

    var lines = [];
    if (vd.author) lines.push("Kênh: " + vd.author);
    var views = ytNumber(vd.viewCount || mf.viewCount);
    if (views) lines.push("Lượt xem: " + views);
    var date = ytDate(mf.publishDate || mf.uploadDate);
    if (date) lines.push("Ngày đăng: " + date);
    if (live) lines.push("Thời lượng: Đang phát trực tiếp");
    else if (ytDuration(vd.lengthSeconds)) lines.push("Thời lượng: " + ytDuration(vd.lengthSeconds));
    if (mf.category) lines.push("Thể loại: " + mf.category);
    var likes = ytNumber(mf.likeCount);
    if (likes) lines.push("Lượt thích: " + likes);

    var genres = [];
    if (vd.channelId) genres.push({ title: vd.author || "Kênh", input: "channel:" + vd.channelId, script: "list.js" });
    var keywords = vd.keywords || [];
    for (var i = 0; i < keywords.length && genres.length < 8; i++) {
        if (keywords[i]) genres.push({ title: keywords[i], input: "search:" + keywords[i], script: "list.js" });
    }

    return Response.success({
        name: vd.title,
        author: vd.author || "",
        cover: ytBestImage(vd.thumbnail, 1920) || ("https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"),
        host: YT,
        description: ytEscape(vd.shortDescription || "").replace(/\n/g, "<br>"),
        detail: lines.map(ytEscape).join("<br>"),
        url: ytWatchUrl(id),
        type: "video",
        format: "series",
        ongoing: live,
        genres: genres,
        suggests: [{ title: "Video liên quan", input: "related:" + id, script: "list.js" }]
    });
}

// Danh sách phát hoặc kênh (danh sách "Video tải lên" của kênh).
function listDetail(listId, canonical, isChannel) {
    var state = ytTocState(listId, true);
    if (!state) return Response.error("Không tải được danh sách phát");

    var name = state.title || "";
    if (isChannel) name = state.owner || name.replace(/^Video tải lên từ\s*/i, "");
    var lines = [];
    if (state.owner) lines.push("Kênh: " + state.owner);
    if (state.count) lines.push("Số video: " + ytNumber(state.count));
    if (state.views) lines.push(state.views.charAt(0).toUpperCase() + state.views.substring(1));
    if (state.updated) lines.push(state.updated);
    var limit = (isChannel ? YT_UPLOAD_PAGE_LIMIT : YT_TOC_PAGE_LIMIT) * 100;
    if (state.count > limit) lines.push("Mục lục chỉ lấy " + limit + " video " + (isChannel ? "mới nhất" : "đầu tiên"));

    var genres = [];
    var ucid = listId.indexOf("UU") === 0 ? "UC" + listId.substring(2) : "";
    if (ucid) genres.push({ title: state.owner || "Kênh", input: "channel:" + ucid, script: "list.js" });

    return Response.success({
        name: name || "Danh sách phát YouTube",
        author: state.owner || "",
        cover: state.cover || "",
        host: YT,
        description: ytEscape(state.description || "").replace(/\n/g, "<br>"),
        detail: lines.map(ytEscape).join("<br>"),
        url: canonical,
        type: "video",
        format: "series",
        ongoing: true,
        genres: genres
    });
}
