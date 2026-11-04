load('yt.js');

// YouTube đã bỏ trang Thịnh hành (FEtrending trả 400) và trang chủ trống khi chưa đăng nhập, nên Khám phá
// dựng từ bảng xếp hạng nhạc Việt Nam và các trang chủ đề (Trực tiếp, Tin tức, Thể thao, Âm nhạc).
// Trang chủ: hàng chip "Mục khác" (các mục không chọn, bấm mở đủ danh sách qua list.js) rồi mục đang chọn ở ô
// "Mục Trang chủ" (EXPLORE_RANK), cả trang/kệ đầu, kiểu hiển thị theo ô EXPLORE_LAYOUT (mặc định ranking).
// Chỉ tải dữ liệu cho mục đang chọn.
var YT_CHART_VN = "PL4fGSI1pDJn4FPCRZtojwqQro5GPY6cuV";
var YT_LIVE = "UC4R8DWoMoI7CAwX8_LjQHig";
var YT_NEWS = "UCYfdidRxbB8Qhf0Nx7ioOYw";
var YT_SPORTS = "UCEgdi0XIXXZ-qJOFPf4JSKw";
var YT_GAMING = "UCOpNcN46UbXVtpKMrmU4Abg";
var YT_MUSIC = "UC-9-kyTW8ZkZNDHQJ6FgpwQ";

var EXPLORE_LAYOUTS = { "Xếp hạng (đánh số)": "ranking", "Danh sách": "list", "Lưới": "grid", "Hàng ngang": "horizontal_list" };

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

function rootItems(root) {
    return root ? { items: ytItems(root) } : null;
}

// Các mục chủ đề, theo thứ tự chip. name khớp giá trị của ô EXPLORE_RANK; input là input list.js của mục.
// load() trả { items, input? } (input khi nguồn thật khác input mặc định) hoặc null khi không tải được.
var EXPLORE_TOPICS = [
    {
        id: "trend", name: "Thịnh hành: video nhạc Việt Nam", input: "playlist:" + YT_CHART_VN,
        load: function () {
            var chart = browseRoot("VL" + YT_CHART_VN);
            return chart ? { items: ytItems(chart, { videosOnly: true }) } : null;
        }
    },
    {
        id: "live", name: "Đang phát trực tiếp", input: "browse:" + YT_LIVE + "|Đang phát trực tiếp",
        load: function () {
            var live = browseRoot(YT_LIVE);
            return live ? { items: shelfItems(live, "Đang phát trực tiếp") } : null;
        }
    },
    {
        id: "news", name: "Tin tức", input: "browse:" + YT_NEWS,
        load: function () { return rootItems(browseRoot(YT_NEWS)); }
    },
    {
        id: "sports", name: "Thể thao", input: "browse:" + YT_SPORTS,
        load: function () { return rootItems(browseRoot(YT_SPORTS, true)); }
    },
    {
        // Kệ "Trò chơi" của trang Trực tiếp; trang đó không có kệ này thì dùng trang chủ đề Trò chơi.
        id: "gaming", name: "Trò chơi", input: "browse:" + YT_LIVE + "|Trò chơi",
        load: function () {
            var live = browseRoot(YT_LIVE);
            var games = live ? shelfItems(live, "Trò chơi") : [];
            if (games.length) return { items: games };
            var gaming = browseRoot(YT_GAMING);
            return gaming ? { items: ytItems(gaming), input: "browse:" + YT_GAMING } : null;
        }
    },
    {
        id: "music", name: "Danh sách phát âm nhạc", input: "browse:" + YT_MUSIC,
        load: function () { return rootItems(browseRoot(YT_MUSIC)); }
    }
];

function configText(value) {
    return value == null ? "" : String(value).trim();
}

// Bỏ mục không tên và mục trùng link (app không tự lọc).
function uniqueItems(items) {
    var list = [];
    var seen = {};
    for (var i = 0; i < (items || []).length; i++) {
        var item = items[i];
        if (!item || !item.name || seen[item.link]) continue;
        seen[item.link] = 1;
        list.push(item);
    }
    return list;
}

function execute() {
    var picked = configText(typeof EXPLORE_RANK !== "undefined" ? EXPLORE_RANK : "");
    var chosen = EXPLORE_TOPICS[0];
    EXPLORE_TOPICS.forEach(function (topic) {
        if (topic.name === picked) chosen = topic;
    });
    var layout = EXPLORE_LAYOUTS[configText(typeof EXPLORE_LAYOUT !== "undefined" ? EXPLORE_LAYOUT : "")] || "ranking";

    var data = chosen.load();
    if (!data) return Response.error("Không tải được dữ liệu YouTube");

    var chips = EXPLORE_TOPICS.filter(function (topic) { return topic !== chosen; }).map(function (topic) {
        return { name: topic.name, action: { type: "list", name: topic.name, script: "list.js", input: topic.input } };
    });
    var sections = [{ id: "other_sections", title: "Mục khác", type: "chip", items: chips }];
    var items = uniqueItems(data.items);
    if (items.length) {
        sections.push({
            id: chosen.id,
            title: chosen.name,
            type: layout,
            shape: "movie",
            items: items,
            more: { type: "list", name: chosen.name, script: "list.js", input: data.input || chosen.input }
        });
    }
    return Response.success(sections);
}
