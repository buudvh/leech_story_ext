load('yt.js');

// YouTube đã bỏ trang Thịnh hành (FEtrending trả 400) và trang chủ trống khi chưa đăng nhập, nên Khám phá
// dựng từ bảng xếp hạng nhạc Việt Nam và các trang chủ đề (Trực tiếp, Tin tức, Thể thao, Âm nhạc).
var YT_CHART_VN = "PL4fGSI1pDJn4FPCRZtojwqQro5GPY6cuV";
var YT_LIVE = "UC4R8DWoMoI7CAwX8_LjQHig";
var YT_NEWS = "UCYfdidRxbB8Qhf0Nx7ioOYw";
var YT_SPORTS = "UCEgdi0XIXXZ-qJOFPf4JSKw";
var YT_GAMING = "UCOpNcN46UbXVtpKMrmU4Abg";
var YT_MUSIC = "UC-9-kyTW8ZkZNDHQJ6FgpwQ";

function section(id, title, type, items, input) {
    return {
        id: id,
        title: title,
        subtitle: "",
        type: type,
        shape: "movie",
        items: items,
        more: { type: "list", name: title, script: "list.js", input: input }
    };
}

// Khám phá dùng client MWEB (dữ liệu nhẹ hơn khoảng một nửa so với WEB), trừ trang Thể thao: bản MWEB
// chỉ có thẻ giải đấu quốc tế, bản WEB có kệ "Thịnh hành" theo khu vực.
function browseRoot(browseId, desktop) {
    var json = ytApi("browse", { browseId: browseId }, !desktop);
    return json ? json.contents : null;
}

// Item của kệ đầu tiên có tên chứa `filter`.
function shelfItems(root, filter) {
    var shelves = ytShelves(root, filter);
    return shelves.length ? ytItems(shelves[0].node) : [];
}

function take(items, n) {
    return (items || []).slice(0, n);
}

function execute() {
    var sections = [];
    var seen = {};

    function add(id, title, type, items, input) {
        var list = [];
        for (var i = 0; i < items.length; i++) {
            if (!items[i].name || seen[items[i].link]) continue;
            seen[items[i].link] = 1;
            list.push(items[i]);
        }
        if (list.length) sections.push(section(id, title, type, list, input));
    }

    var chart = browseRoot("VL" + YT_CHART_VN);
    if (chart) add("trend", "Thịnh hành: video nhạc Việt Nam", "grid", take(ytItems(chart, { videosOnly: true }), 12), "playlist:" + YT_CHART_VN);

    var live = browseRoot(YT_LIVE);
    if (live) add("live", "Đang phát trực tiếp", "grid", take(shelfItems(live, "Đang phát trực tiếp"), 10), "browse:" + YT_LIVE + "|Đang phát trực tiếp");

    var news = browseRoot(YT_NEWS);
    if (news) add("news", "Tin tức", "grid", take(ytItems(news), 10), "browse:" + YT_NEWS);

    var sports = browseRoot(YT_SPORTS, true);
    if (sports) add("sports", "Thể thao", "grid", take(ytItems(sports), 10), "browse:" + YT_SPORTS);

    var games = live ? shelfItems(live, "Trò chơi") : [];
    if (games.length) {
        add("gaming", "Trò chơi", "grid", take(games, 10), "browse:" + YT_LIVE + "|Trò chơi");
    } else {
        var gaming = browseRoot(YT_GAMING);
        if (gaming) add("gaming", "Trò chơi", "grid", take(ytItems(gaming), 10), "browse:" + YT_GAMING);
    }

    var music = browseRoot(YT_MUSIC);
    if (music) add("music", "Danh sách phát âm nhạc", "horizontal_list", take(ytItems(music), 15), "browse:" + YT_MUSIC);

    if (!sections.length) return Response.error("Không tải được dữ liệu YouTube");
    return Response.success(sections);
}
