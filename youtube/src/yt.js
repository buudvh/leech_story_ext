// Thư viện dùng chung cho tiện ích YouTube: gọi API nội bộ youtubei/v1 của web YouTube và đọc kết quả.

var YT = "https://www.youtube.com";
var YT_DESKTOP_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
var YT_WEB_VERSION = "2.20261016.01.00";
var YT_MOBILE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1";

// Client ANDROID không kèm androidSdkVersion: luồng muxed itag 18 (360p, có tiếng) tải được trọn file mà không cần
// po_token; video trực tiếp có hlsManifestUrl. Client IOS/ANDROID_VR bị chặn 403 sau ~1-5 MB đầu.
var YT_ANDROID_VERSION = "20.10.38";
var YT_ANDROID_UA = "com.google.android.youtube/" + YT_ANDROID_VERSION + " (Linux; U; Android 11) gzip";

// Trang nhúng trả lỗi 153 khi thiếu Referer và "video không có sẵn" khi Referer là youtube.com.
var YT_EMBED_REFERER = "https://com.raikiri1498.freebook/";

var YT_TOC_PAGE_LIMIT = 10;      // danh sách phát: tối đa 10 trang x 100 video
var YT_UPLOAD_PAGE_LIMIT = 3;    // kênh: 300 video mới nhất

// ---------- Mạng ----------

function ytParseJson(res) {
    if (!res || !res.ok) return null;
    try {
        var text = res.text();
        if (!text) return null;
        return JSON.parse(text);
    } catch (e) {
        return null;
    }
}

function ytWebVersion() {
    try {
        var saved = localStorage.getItem("yt_web_version");
        if (saved) return saved;
    } catch (e) {}
    return YT_WEB_VERSION;
}

// Lấy lại clientVersion WEB từ trang chủ khi phiên bản đang dùng bị từ chối.
function ytRefreshWebVersion() {
    var res = fetch(YT + "/?hl=vi&gl=VN", { headers: { "User-Agent": YT_DESKTOP_UA, "Accept-Language": "vi-VN,vi;q=0.9" } });
    if (!res || !res.ok) return "";
    var m = String(res.text() || "").match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/);
    if (!m) return "";
    try { localStorage.setItem("yt_web_version", m[1]); } catch (e) {}
    return m[1];
}

function ytPost(endpoint, payload, version, mobile) {
    payload.context = { client: { clientName: mobile ? "MWEB" : "WEB", clientVersion: version, hl: "vi", gl: "VN", utcOffsetMinutes: 420 } };
    return fetch(YT + "/youtubei/v1/" + endpoint + "?prettyPrint=false", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": mobile ? YT_MOBILE_UA : YT_DESKTOP_UA,
            "Origin": YT,
            "Referer": YT + "/",
            "X-YouTube-Client-Name": mobile ? "2" : "1",
            "X-YouTube-Client-Version": version
        },
        body: JSON.stringify(payload)
    });
}

// POST tới youtubei/v1/<endpoint> bằng client WEB (mobile: MWEB, phản hồi nhẹ hơn ~2 lần); trả JSON hoặc null.
function ytApi(endpoint, payload, mobile) {
    var version = ytWebVersion();
    var res = ytPost(endpoint, payload, version, mobile);
    var json = ytParseJson(res);
    if (json) return json;
    // clientVersion quá cũ/sai: YouTube trả 4xx (400 "Precondition check failed", 404…).
    if (res && res.status >= 400 && res.status < 500) {
        var fresh = ytRefreshWebVersion();
        if (fresh && fresh !== version) return ytParseJson(ytPost(endpoint, payload, fresh, mobile));
    }
    return null;
}

// Gọi player bằng client ANDROID (không po_token). Trả JSON hoặc null.
function ytAndroidPlayer(videoId) {
    var res = fetch(YT + "/youtubei/v1/player?prettyPrint=false", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": YT_ANDROID_UA,
            "X-YouTube-Client-Name": "3",
            "X-YouTube-Client-Version": YT_ANDROID_VERSION
        },
        body: JSON.stringify({
            context: { client: { clientName: "ANDROID", clientVersion: YT_ANDROID_VERSION, osName: "Android", osVersion: "11", hl: "vi", gl: "VN" } },
            videoId: videoId,
            contentCheckOk: true,
            racyCheckOk: true
        })
    });
    return ytParseJson(res);
}

// Dự phòng khi API đổi: đọc biến JSON (ytInitialData / ytInitialPlayerResponse) nhúng trong HTML.
function ytPageVar(url, name) {
    var sep = url.indexOf("?") >= 0 ? "&" : "?";
    var res = fetch(url + sep + "hl=vi&gl=VN", {
        headers: { "User-Agent": YT_DESKTOP_UA, "Accept-Language": "vi-VN,vi;q=0.9", "Cookie": "SOCS=CAI; CONSENT=YES+" }
    });
    if (!res || !res.ok) return null;
    var html = String(res.text() || "");
    var marks = ["var " + name + " = {", "window[\"" + name + "\"] = {", name + " = {"];
    for (var i = 0; i < marks.length; i++) {
        var at = html.indexOf(marks[i]);
        if (at < 0) continue;
        var obj = ytCutJsonObject(html, at + marks[i].length - 1);
        if (obj) return obj;
    }
    return null;
}

function ytCutJsonObject(text, start) {
    var depth = 0, inStr = false, esc = false;
    for (var i = start; i < text.length; i++) {
        var ch = text.charAt(i);
        if (inStr) {
            if (esc) esc = false;
            else if (ch === "\\") esc = true;
            else if (ch === "\"") inStr = false;
            continue;
        }
        if (ch === "\"") inStr = true;
        else if (ch === "{") depth++;
        else if (ch === "}") {
            depth--;
            if (depth === 0) {
                try { return JSON.parse(text.substring(start, i + 1)); } catch (e) { return null; }
            }
        }
    }
    return null;
}

// ---------- Nhận dạng URL ----------

function ytVideoId(url) {
    var s = String(url || "");
    var m = s.match(/[?&#]v=([\w-]{11})/) || s.match(/youtu\.be\/([\w-]{11})/) || s.match(/\/(?:shorts|live|embed|v)\/([\w-]{11})/);
    if (m) return m[1];
    if (/^[\w-]{11}$/.test(s)) return s;
    return "";
}

function ytListId(url) {
    var m = String(url || "").match(/[?&]list=([\w-]+)/);
    return m ? m[1] : "";
}

// { type: "video" | "playlist" | "channel" | "", id }. watch?v=X&list=Y được coi là video X.
function ytKind(url) {
    var s = String(url || "");
    var id = ytVideoId(s);
    if (id) return { type: "video", id: id };
    id = ytListId(s);
    if (id) return { type: "playlist", id: id };
    var m = s.match(/\/channel\/(UC[\w-]{22})/);
    if (m) return { type: "channel", id: m[1] };
    m = s.match(/youtube\.com\/(@[^\/?#&]+|c\/[^\/?#&]+|user\/[^\/?#&]+)/);
    if (m) return { type: "channel", id: "", path: m[1] };
    return { type: "", id: "" };
}

// Đổi /@handle, /c/…, /user/… thành channelId UC….
function ytResolveChannel(kind) {
    if (kind.id) return kind.id;
    var json = ytApi("navigation/resolve_url", { url: YT + "/" + kind.path });
    var id = json && json.endpoint && json.endpoint.browseEndpoint && json.endpoint.browseEndpoint.browseId;
    if (id && id.indexOf("UC") === 0) return id;
    var data = ytPageVar(YT + "/" + kind.path, "ytInitialData");
    var meta = data && data.metadata && data.metadata.channelMetadataRenderer;
    return meta && meta.externalId ? meta.externalId : "";
}

function ytWatchUrl(id) {
    return YT + "/watch?v=" + id;
}

function ytPlaylistUrl(id) {
    return YT + "/playlist?list=" + id;
}

// ---------- Đọc dữ liệu ----------

function ytText(t) {
    if (t === null || t === undefined) return "";
    if (typeof t === "string" || typeof t === "number") return String(t);
    if (t.simpleText !== undefined) return String(t.simpleText);
    if (t.content !== undefined) return String(t.content);
    if (t.runs) {
        var s = "";
        for (var i = 0; i < t.runs.length; i++) s += t.runs[i].text || "";
        return s;
    }
    if (t.text !== undefined) return ytText(t.text);
    return "";
}

function ytAbs(url) {
    url = String(url || "");
    if (url.indexOf("//") === 0) return "https:" + url;
    if (url.indexOf("/") === 0) return YT + url;
    return url;
}

// Ảnh lớn nhất không quá `maxWidth` (mặc định 720px; ảnh maxres của danh sách nhạc có thể nặng >1 MB)
// trong mảng {url, width} (hoặc {sources}/{thumbnails}).
function ytBestImage(list, maxWidth) {
    if (!list) return "";
    maxWidth = maxWidth || 720;
    if (list.sources) list = list.sources;
    if (list.thumbnails) list = list.thumbnails;
    if (!list.length) return "";
    var best = null, smallest = null;
    for (var i = 0; i < list.length; i++) {
        if (!list[i].url) continue;
        var w = list[i].width || 0;
        if (w <= maxWidth && (!best || w >= (best.width || 0))) best = list[i];
        if (!smallest || w < (smallest.width || 0)) smallest = list[i];
    }
    best = best || smallest;
    if (!best) return "";
    // Ảnh webp của i.ytimg.com luôn có bản jpg cùng kích thước.
    return ytAbs(String(best.url).replace(/\/vi_webp\/([\w-]{11})\/(\w+)\.webp/, "/vi/$1/$2.jpg"));
}

// Tìm đối tượng đầu tiên có khoá `key` (duyệt sâu).
function ytDig(node, key, depth) {
    depth = depth || 0;
    if (!node || typeof node !== "object" || depth > 30) return null;
    if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) {
            var r = ytDig(node[i], key, depth + 1);
            if (r) return r;
        }
        return null;
    }
    if (node[key] !== undefined && node[key] !== null) return node[key];
    for (var k in node) {
        if (!node.hasOwnProperty(k)) continue;
        var v = node[k];
        if (v && typeof v === "object") {
            var found = ytDig(v, key, depth + 1);
            if (found) return found;
        }
    }
    return null;
}

function ytJoin(parts, sep) {
    var out = [];
    for (var i = 0; i < parts.length; i++) {
        var p = String(parts[i] || "").replace(/\s+/g, " ").trim();
        if (p && out.indexOf(p) < 0) out.push(p);
    }
    return out.join(sep || " · ");
}

function ytIsLiveLabel(s) {
    s = String(s || "").toUpperCase();
    return s === "LIVE" || s.indexOf("TRỰC TIẾP") >= 0 || s.indexOf("TRUC TIEP") >= 0;
}

// Nhãn thời lượng/LIVE của renderer kiểu cũ (videoRenderer, gridVideoRenderer…).
function ytOldTag(r) {
    var overlays = r.thumbnailOverlays || [];
    for (var i = 0; i < overlays.length; i++) {
        var ts = overlays[i].thumbnailOverlayTimeStatusRenderer;
        if (!ts) continue;
        if (ts.style === "LIVE" || ytIsLiveLabel(ytText(ts.text))) return "LIVE";
        if (ts.style === "SHORTS") return "Shorts";
        var t = ytText(ts.text);
        if (t) return t;
    }
    var badges = r.badges || [];
    for (var j = 0; j < badges.length; j++) {
        var b = badges[j].metadataBadgeRenderer;
        if (b && (b.style === "BADGE_STYLE_TYPE_LIVE_NOW" || ytIsLiveLabel(b.label))) return "LIVE";
    }
    var len = ytText(r.lengthText);
    if (len) return len;
    return "";
}

function ytVideoItem(id, name, cover, description, tag) {
    return {
        name: name,
        link: ytWatchUrl(id),
        cover: cover || ("https://i.ytimg.com/vi/" + id + "/mqdefault.jpg"),
        description: description,
        tag: tag,
        host: YT
    };
}

function ytParseOldVideo(r) {
    if (!r.videoId) return null;
    var name = ytText(r.title) || ytText(r.headline);
    if (!name) return null;
    var desc = ytJoin([
        ytText(r.ownerText) || ytText(r.longBylineText) || ytText(r.shortBylineText) || ytText(r.bylineText),
        ytText(r.shortViewCountText) || ytText(r.viewCountText) || ytText(r.metadataText),
        ytText(r.publishedTimeText) || ytText(r.videoInfo)
    ]);
    return ytVideoItem(r.videoId, name, ytBestImage(r.thumbnail), desc, ytOldTag(r));
}

function ytParsePlaylistRenderer(r) {
    var id = r.playlistId;
    var name = ytText(r.title);
    if (!id || !name) return null;
    var cover = ytBestImage(r.thumbnail) || ytBestImage(r.thumbnails && r.thumbnails[0]) || ytBestImage(r.thumbnailRenderer && ytDig(r.thumbnailRenderer, "thumbnail"));
    var count = ytText(r.videoCountText) || (r.videoCount ? r.videoCount + " video" : "");
    return {
        name: name,
        link: ytPlaylistUrl(id),
        cover: cover,
        description: ytJoin([ytText(r.shortBylineText) || ytText(r.longBylineText), count]),
        tag: count || "Danh sách phát",
        host: YT
    };
}

function ytParseChannel(r) {
    if (!r.channelId) return null;
    var name = ytText(r.title);
    if (!name) return null;
    return {
        name: name,
        link: YT + "/channel/" + r.channelId,
        cover: ytBestImage(r.thumbnail),
        description: ytJoin([ytText(r.subscriberCountText), ytText(r.videoCountText), ytText(r.descriptionSnippet)]),
        tag: "Kênh",
        host: YT
    };
}

// lockupViewModel: dạng mới cho video, danh sách phát, mix.
function ytParseLockup(r, opts) {
    var id = r.contentId;
    var type = String(r.contentType || "");
    var meta = r.metadata && r.metadata.lockupMetadataViewModel;
    if (!id || !meta) return null;
    var name = ytText(meta.title);
    if (!name) return null;

    var image = r.contentImage || {};
    var thumbVm = image.thumbnailViewModel || (image.collectionThumbnailViewModel && image.collectionThumbnailViewModel.primaryThumbnail && image.collectionThumbnailViewModel.primaryThumbnail.thumbnailViewModel);
    var cover = thumbVm ? ytBestImage(thumbVm.image) : "";

    var rows = (meta.metadata && meta.metadata.contentMetadataViewModel && meta.metadata.contentMetadataViewModel.metadataRows) || [];
    var parts = [];
    for (var i = 0; i < rows.length; i++) {
        var mp = rows[i].metadataParts || [];
        for (var j = 0; j < mp.length; j++) {
            var part = ytText(mp[j].text);
            if (!/^Xem (toàn bộ|danh sách)/i.test(part)) parts.push(part);
        }
    }

    var tag = "";
    var badge = ytDig(image, "thumbnailBadgeViewModel");
    if (badge) {
        tag = String(badge.text || "");
        if (badge.badgeStyle === "THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE" || ytIsLiveLabel(tag)) tag = "LIVE";
    }

    if (type === "LOCKUP_CONTENT_TYPE_VIDEO") {
        return ytVideoItem(id, name, cover, ytJoin(parts), tag);
    }
    if (opts && opts.videosOnly) return null;
    var listLike = type === "LOCKUP_CONTENT_TYPE_PLAYLIST" || type === "LOCKUP_CONTENT_TYPE_ALBUM" || type === "LOCKUP_CONTENT_TYPE_PODCAST";
    // Mix "RD…" do YouTube tự sinh không mở được dạng danh sách; riêng RDCLAK… (danh sách nhạc) thì được.
    var station = type === "LOCKUP_CONTENT_TYPE_STATION" && id.indexOf("RDCLAK") === 0;
    if (listLike || station) {
        return {
            name: name,
            link: ytPlaylistUrl(id),
            cover: cover,
            description: ytJoin(parts),
            tag: tag || "Danh sách phát",
            host: YT
        };
    }
    return null;
}

var YT_PARSERS = {
    videoRenderer: ytParseOldVideo,
    gridVideoRenderer: ytParseOldVideo,
    compactVideoRenderer: ytParseOldVideo,
    playlistVideoRenderer: ytParseOldVideo,
    playlistPanelVideoRenderer: ytParseOldVideo,
    videoWithContextRenderer: ytParseOldVideo,
    videoCardRenderer: ytParseOldVideo,
    lockupViewModel: ytParseLockup,
    playlistRenderer: ytParsePlaylistRenderer,
    gridPlaylistRenderer: ytParsePlaylistRenderer,
    compactPlaylistRenderer: ytParsePlaylistRenderer,
    channelRenderer: ytParseChannel
};

// Bỏ qua: Shorts, quảng cáo, thẻ trò chơi, phim trả phí và các phần không phải nội dung.
var YT_SKIP = {
    shortsLockupViewModel: 1, reelShelfRenderer: 1, reelItemRenderer: 1, gridShelfViewModel: 1,
    adSlotRenderer: 1, promotedSparklesWebRenderer: 1, promotedVideoRenderer: 1, searchPyvRenderer: 1,
    inFeedAdLayoutRenderer: 1, movieRenderer: 1, gameCardRenderer: 1,
    feedNudgeRenderer: 1, backgroundPromoRenderer: 1, menu: 1, menuRenderer: 1, frameworkUpdates: 1,
    engagementPanels: 1, topbar: 1, header: 1, playerOverlays: 1
};

// Gom item từ cây JSON. opts.videosOnly: chỉ lấy video (mục lục danh sách phát).
function ytCollect(node, out, seen, opts) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
        for (var i = 0; i < node.length; i++) ytCollect(node[i], out, seen, opts);
        return;
    }
    for (var k in node) {
        if (!node.hasOwnProperty(k)) continue;
        var v = node[k];
        if (!v || typeof v !== "object") continue;
        if (YT_SKIP[k]) continue;
        if (opts && opts.videosOnly && k === "horizontalShelfViewModel") continue;
        var parser = YT_PARSERS[k];
        if (parser) {
            var item = parser(v, opts);
            if (item && item.name && !seen[item.link]) {
                seen[item.link] = 1;
                out.push(item);
            }
            continue;
        }
        ytCollect(v, out, seen, opts);
    }
}

function ytItems(node, opts) {
    var out = [];
    ytCollect(node, out, {}, opts || {});
    return out;
}

// continuationCommand.token (continuationItemViewModel bọc thêm một lớp innertubeCommand).
function ytTokenOf(node, depth) {
    depth = depth || 0;
    if (!node || typeof node !== "object" || depth > 12) return "";
    if (node.continuationCommand && node.continuationCommand.token) return String(node.continuationCommand.token);
    for (var k in node) {
        if (!node.hasOwnProperty(k)) continue;
        var v = node[k];
        if (v && typeof v === "object") {
            var t = ytTokenOf(v, depth + 1);
            if (t) return t;
        }
    }
    return "";
}

// Token trang kế: lấy từ ô continuation cuối cùng của danh sách chính.
function ytNextToken(node) {
    var token = "";
    (function walk(n, depth) {
        if (!n || typeof n !== "object" || depth > 40) return;
        if (Array.isArray(n)) {
            for (var i = 0; i < n.length; i++) walk(n[i], depth + 1);
            return;
        }
        for (var k in n) {
            if (!n.hasOwnProperty(k)) continue;
            var v = n[k];
            if (!v || typeof v !== "object") continue;
            if (k === "continuationItemRenderer" || k === "continuationItemViewModel") {
                var t = ytTokenOf(v);
                if (t) token = t;
                continue;
            }
            if (YT_SKIP[k] || YT_PARSERS[k]) continue;
            walk(v, depth + 1);
        }
    })(node, 0);
    return token;
}

// Phần nội dung chính của phản hồi (trang đầu: contents; trang kế: onResponseReceived…).
function ytRoot(json) {
    if (!json) return null;
    return json.onResponseReceivedActions || json.onResponseReceivedCommands || json.onResponseReceivedEndpoints || json.contents || null;
}

// Các kệ (richShelfRenderer/shelfRenderer) có tiêu đề chứa `filter`.
function ytShelves(node, filter) {
    var out = [];
    var needle = String(filter || "").toLowerCase();
    (function walk(n, depth) {
        if (!n || typeof n !== "object" || depth > 40) return;
        if (Array.isArray(n)) {
            for (var i = 0; i < n.length; i++) walk(n[i], depth + 1);
            return;
        }
        for (var k in n) {
            if (!n.hasOwnProperty(k)) continue;
            var v = n[k];
            if (!v || typeof v !== "object") continue;
            if (k === "richShelfRenderer" || k === "shelfRenderer") {
                var title = ytText(v.title).toLowerCase();
                if (!needle || title.indexOf(needle) >= 0) out.push({ title: ytText(v.title), node: v.content || v.contents || v });
                continue;
            }
            if (YT_SKIP[k] || YT_PARSERS[k]) continue;
            walk(v, depth + 1);
        }
    })(node, 0);
    return out;
}

// ---------- Định dạng ----------

function ytEscape(s) {
    return String(s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function ytNumber(n) {
    var s = String(n || "").replace(/\D/g, "");
    if (!s) return "";
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function ytDuration(seconds) {
    var t = parseInt(seconds, 10);
    if (!t || t < 0) return "";
    var h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = t % 60;
    var mm = (h && m < 10 ? "0" : "") + m;
    var ss = (s < 10 ? "0" : "") + s;
    return h ? (h + ":" + mm + ":" + ss) : (mm + ":" + ss);
}

function ytDate(iso) {
    var m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? (m[3] + "/" + m[2] + "/" + m[1]) : "";
}

// ---------- Danh sách ----------

// Nguồn danh sách: search (q[|sp]), playlist (id), channel (UC…), related (videoId), browse (browseId[|lọc tên kệ]).
// Trả { items, next } hoặc null khi không tải được.
function ytList(kind, arg, extra, token) {
    // FreeBook gọi search với page = "1" (số trang, không phải token): trang 1 = không token,
    // trang n > 1 thì đi lần token từ trang đầu.
    token = String(token || "");
    if (/^\d+$/.test(token)) {
        var pageNo = parseInt(token, 10);
        var result = ytList(kind, arg, extra, "");
        for (var p = 2; p <= pageNo && result; p++) {
            if (!result.next) return { items: [], next: "" };
            result = ytList(kind, arg, extra, result.next);
        }
        return result;
    }

    var endpoint = "browse", payload, fallbackUrl;
    if (kind === "search") {
        endpoint = "search";
        payload = { query: arg };
        if (extra) payload.params = extra;
        fallbackUrl = YT + "/results?search_query=" + encodeURIComponent(arg) + (extra ? "&sp=" + encodeURIComponent(extra) : "");
    } else if (kind === "playlist") {
        payload = { browseId: "VL" + arg };
        fallbackUrl = ytPlaylistUrl(arg);
    } else if (kind === "channel") {
        payload = { browseId: "VLUU" + arg.substring(2) };
        fallbackUrl = ytPlaylistUrl("UU" + arg.substring(2));
    } else if (kind === "related") {
        endpoint = "next";
        payload = { videoId: arg };
        fallbackUrl = ytWatchUrl(arg);
    } else {
        payload = { browseId: arg };
        fallbackUrl = YT + "/channel/" + arg;
    }
    if (token) payload = { continuation: token };

    var json = ytApi(endpoint, payload);
    if (!json && !token) json = ytPageVar(fallbackUrl, "ytInitialData");
    if (!json) return null;

    var root = ytRoot(json);
    if (kind === "related" && !token) {
        var watch = json.contents && json.contents.twoColumnWatchNextResults;
        root = watch && watch.secondaryResults;
    }
    var items;
    if (kind === "browse" && extra) {
        items = [];
        var seen = {};
        var shelves = ytShelves(root, extra);
        for (var i = 0; i < shelves.length; i++) ytCollect(shelves[i].node, items, seen, {});
    } else {
        items = ytItems(root);
    }
    var next = ytNextToken(root);
    if (next === token) next = "";
    return { items: items, next: next };
}

// ---------- Mục lục danh sách phát (lưu token trang kế giữa các lần gọi page/toc) ----------

function ytUploadsId(channelId) {
    return "UU" + String(channelId).substring(2);
}

// Danh sách phát ứng với URL (kênh ⇒ danh sách "Video tải lên").
function ytListIdOf(url) {
    var kind = ytKind(url);
    if (kind.type === "playlist") return kind.id;
    if (kind.type === "channel") {
        var ucid = ytResolveChannel(kind);
        return ucid ? ytUploadsId(ucid) : "";
    }
    return "";
}

function ytTocStore() {
    try {
        var raw = localStorage.getItem("yt_toc_state");
        var obj = raw ? JSON.parse(raw) : null;
        return obj && typeof obj === "object" ? obj : {};
    } catch (e) {
        return {};
    }
}

function ytTocSave(state) {
    var store = ytTocStore();
    store[state.id] = state;
    var ids = [];
    for (var k in store) if (store.hasOwnProperty(k)) ids.push(k);
    ids.sort(function (a, b) { return (store[b].ts || 0) - (store[a].ts || 0); });
    for (var i = 5; i < ids.length; i++) delete store[ids[i]];
    try { localStorage.setItem("yt_toc_state", JSON.stringify(store)); } catch (e) {}
}

function ytTocEntries(items) {
    var out = [];
    for (var i = 0; i < items.length; i++) {
        out.push({ name: items[i].name, url: items[i].link, description: items[i].tag || "" });
    }
    return out;
}

// Chữ trong phần đầu trang danh sách phát (tên kênh, "N video", lượt xem, cập nhật…).
function ytHeaderTexts(node) {
    var out = [];
    (function walk(n, depth) {
        if (!n || typeof n !== "object" || depth > 30) return;
        if (Array.isArray(n)) {
            for (var i = 0; i < n.length; i++) walk(n[i], depth + 1);
            return;
        }
        if (typeof n.simpleText === "string" || typeof n.content === "string" || Array.isArray(n.runs)) {
            var t = ytText(n).replace(/\s+/g, " ").trim();
            if (t && out.indexOf(t) < 0) out.push(t);
            return;
        }
        for (var k in n) {
            if (!n.hasOwnProperty(k) || k === "actions" || k === "menu" || k === "playButton" || k === "shufflePlayButton") continue;
            var v = n[k];
            if (v && typeof v === "object") walk(v, depth + 1);
        }
    })(node, 0);
    return out;
}

// Tải trang 1 của danh sách phát, ghi trạng thái (thông tin + token trang 2). Trả state hoặc null.
function ytTocFetchFirst(listId) {
    var json = ytApi("browse", { browseId: "VL" + listId });
    if (!json) json = ytPageVar(ytPlaylistUrl(listId), "ytInitialData");
    var root = json && json.contents;
    var items = root ? ytItems(root, { videosOnly: true }) : [];
    // Mix (RD…) không mở được bằng browse: lấy danh sách từ khung phát của trang xem.
    if (!items.length) return ytTocFromWatch(listId);
    var meta = (json.metadata && json.metadata.playlistMetadataRenderer) || {};
    var micro = (json.microformat && json.microformat.microformatDataRenderer) || {};
    var texts = ytHeaderTexts(json.header);
    var count = 0, owner = "", views = "", updated = "";
    for (var i = 0; i < texts.length; i++) {
        var t = texts[i];
        var m = t.match(/^([\d.,]+)\s*video/i);
        if (m && !count) count = parseInt(m[1].replace(/[.,]/g, ""), 10) || 0;
        else if (/lượt xem/i.test(t) && !views) views = t;
        else if (/^(Cập nhật|Đã cập nhật)/i.test(t) && !updated) updated = t;
        else if (/^của /i.test(t) && !owner) owner = t.substring(4);
    }
    if (!owner && json.header && json.header.playlistHeaderRenderer) owner = ytText(json.header.playlistHeaderRenderer.ownerText);

    var state = {
        id: listId,
        ts: new Date().getTime(),
        title: meta.title || ytText(json.header && json.header.playlistHeaderRenderer && json.header.playlistHeaderRenderer.title),
        description: meta.description || micro.description || "",
        cover: ytBestImage(micro.thumbnail) || (items[0] ? items[0].cover : ""),
        owner: owner,
        views: views,
        updated: updated,
        count: count,
        first: ytTocEntries(items),
        tokens: {},
        end: 0
    };
    var next = ytNextToken(root);
    if (next) state.tokens["2"] = next;
    else state.end = 1;
    ytTocSave(state);
    return state;
}

function ytTocFromWatch(listId) {
    var json = ytApi("next", { playlistId: listId });
    var watch = json && json.contents && json.contents.twoColumnWatchNextResults;
    var pl = watch && watch.playlist && watch.playlist.playlist;
    if (!pl) return null;
    var items = ytItems(pl.contents, { videosOnly: true });
    if (!items.length) return null;
    var state = {
        id: listId,
        ts: new Date().getTime(),
        title: ytText(pl.title) || ytText(pl.titleText),
        description: "",
        cover: items[0].cover,
        owner: ytText(pl.ownerName) || ytText(pl.shortBylineText),
        views: "",
        updated: "",
        count: items.length,
        first: ytTocEntries(items),
        tokens: {},
        end: 1
    };
    ytTocSave(state);
    return state;
}

// Trạng thái còn mới (≤ 10 phút) thì dùng lại, không thì tải trang 1.
function ytTocState(listId, needFresh) {
    var state = ytTocStore()[listId];
    var fresh = state && state.first && (new Date().getTime() - (state.ts || 0) < 10 * 60 * 1000);
    if (state && (fresh || !needFresh)) return state;
    return ytTocFetchFirst(listId);
}

// Tải trang `n` (≥ 2) bằng token đã lưu; ghi token trang n+1.
function ytTocFetchPage(state, n) {
    var token = state.tokens[String(n)];
    if (!token) return null;
    var json = ytApi("browse", { continuation: token });
    if (!json) return null;
    var root = ytRoot(json);
    var items = ytItems(root, { videosOnly: true });
    var next = ytNextToken(root);
    if (next && next !== token) state.tokens[String(n + 1)] = next;
    else if (!state.end || state.end > n) state.end = n;
    ytTocSave(state);
    return ytTocEntries(items);
}

// Mục lục trang `n` của danh sách phát. Thiếu token thì đi lần từ trang 1.
function ytTocPage(listId, n) {
    if (n <= 1) {
        var first = ytTocState(listId, true);
        return first ? first.first : null;
    }
    var state = ytTocStore()[listId];
    var fetched = false;
    if (!state) {
        state = ytTocFetchFirst(listId);
        fetched = true;
        if (!state) return null;
    }
    if (!state.tokens[String(n)]) {
        if (state.end && state.end < n) return [];
        if (!fetched) state = ytTocFetchFirst(listId);
        if (!state) return null;
        for (var k = 2; k < n; k++) {
            if (state.end && state.end < n) return [];
            if (!state.tokens[String(k + 1)] && !ytTocFetchPage(state, k)) return null;
        }
        if (!state.tokens[String(n)]) return [];
    }
    return ytTocFetchPage(state, n);
}
