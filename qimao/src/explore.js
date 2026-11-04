load('crypto.js');
load('config.js');
load('boards.js');

// Trang chủ: hàng chip "Bảng khác" (mọi bảng còn lại của cả ba kênh, bấm mở đủ bảng qua rank.js) rồi bảng đang chọn ở
// ô "Bảng xếp hạng Trang chủ" (EXPLORE_BOARD), cả trang đầu, kiểu hiển thị theo ô EXPLORE_LAYOUT (mặc định ranking).
// Không theo ô Kênh. Chỉ tải một bảng. Bỏ 角色榜 (nhân vật) và 粉丝榜 (người dùng): không phải danh sách truyện.
var EXPLORE_LAYOUTS = { 'Xếp hạng (đánh số)': 'ranking', 'Danh sách': 'list', 'Lưới': 'grid', 'Hàng ngang': 'horizontal_list' };

// [tab, rank_type, kỳ (0 = books: 日榜 / 新完结, 1 = month_books: 月榜 / 全部), tên bảng]
var GENDER_BOARDS = [
    ['must_read_list', 0, '必读榜'], ['rec_list', 0, '推荐榜'], ['hot_list', 0, '大热榜 · 日榜'], ['hot_list', 1, '大热榜 · 月榜'],
    ['craft_list', 0, '匠心榜'], ['new_list', 0, '新书榜 · 日榜'], ['new_list', 1, '新书榜 · 月榜'],
    ['end_list', 0, '完结榜 · 新完结'], ['end_list', 1, '完结榜 · 全部'], ['up_list', 0, '飙升榜'], ['good_comment_list', 0, '好评榜'],
    ['hot_search_list', 0, '热搜榜 · 日榜'], ['hot_search_list', 1, '热搜榜 · 月榜'], ['reward_value_list', 0, '礼物榜'],
    ['ticket_list', 0, '投票榜 · 日榜'], ['ticket_list', 1, '投票榜 · 月榜']
];
var PUBLISH_BOARDS = [
    ['rec_list', 0, '推荐榜'], ['hot_list', 0, '大热榜 · 日榜'], ['hot_list', 1, '大热榜 · 月榜'], ['film_list', 0, '影视榜'],
    ['good_comment_list', 0, '好评榜'], ['hot_search_list', 0, '热搜榜 · 日榜'], ['hot_search_list', 1, '热搜榜 · 月榜'],
    ['ticket_list', 0, '投票榜 · 日榜'], ['ticket_list', 1, '投票榜 · 月榜']
];

// { name: "男频 · 大热榜 · 日榜", input: "lb|1|hot_list|0" } — 41 bảng, đúng thứ tự `values` của EXPLORE_BOARD.
function exploreBoards() {
    var boards = [];
    [['1', '男频', GENDER_BOARDS], ['2', '女频', GENDER_BOARDS], ['3', '出版', PUBLISH_BOARDS]].forEach(function (channel) {
        channel[2].forEach(function (b) {
            boards.push({ name: channel[1] + ' · ' + b[2], input: 'lb|' + channel[0] + '|' + b[0] + '|' + b[1], tab: channel[0], type: b[0], period: b[1] });
        });
    });
    return boards;
}

function configText(value) {
    return value == null ? '' : String(value).trim();
}

function execute() {
    var boards = exploreBoards();
    var picked = configText(typeof EXPLORE_BOARD !== 'undefined' ? EXPLORE_BOARD : '');
    var chosen = boards[2]; // 男频 · 大热榜 · 日榜
    boards.forEach(function (board) {
        if (board.name === picked) chosen = board;
    });
    var layout = EXPLORE_LAYOUTS[configText(typeof EXPLORE_LAYOUT !== 'undefined' ? EXPLORE_LAYOUT : '')] || 'ranking';

    var items;
    try {
        var data = fetchBoard(chosen.tab, chosen.type);
        var periods = boardPeriods(data, findRank(data, chosen.type));
        var period = periods[chosen.period] || periods[0];
        items = period ? period.items : [];
    } catch (error) {
        return Response.error('Qimao: ' + error.message);
    }
    // App không lọc giúp mục của explore: bỏ mục không tên và trùng link.
    var seen = {};
    items = items.filter(function (item) {
        if (!item || !item.name || seen[item.link]) return false;
        seen[item.link] = true;
        return true;
    });

    var chips = boards.filter(function (board) { return board !== chosen; }).map(function (board) {
        return { name: board.name, action: { type: 'list', name: board.name, script: 'rank.js', input: board.input } };
    });
    var sections = [{ id: 'other_boards', title: 'Bảng khác', type: 'chip', items: chips }];
    if (items.length) {
        sections.push({
            id: 'board_' + chosen.tab + '_' + chosen.type + '_' + chosen.period,
            title: 'Bảng xếp hạng (' + chosen.name + ')',
            type: layout,
            items: items,
            more: { type: 'list', name: chosen.name, script: 'rank.js', input: chosen.input }
        });
    }
    return Response.success(sections);
}
