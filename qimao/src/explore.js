load('crypto.js');
load('config.js');
load('boards.js');

// Tab BXH: mỗi bảng xếp hạng một section `ranking` (5 truyện, "Xem thêm" mở đủ bảng qua rank.js).
// Theo kênh đang lọc: một kênh ⇒ đủ bảng của kênh đó; Tất cả ⇒ bảng chính của từng kênh + 原创风云榜.
var TOP_ITEMS = 5;

function rankingSection(id, title, items, input) {
    return {
        id: id,
        title: title,
        subtitle: '',
        type: 'ranking',
        items: items.slice(0, TOP_ITEMS),
        more: { type: 'list', name: title, script: 'rank.js', input: input }
    };
}

// Một bảng lỗi chỉ mất section đó, không làm hỏng cả trang.
function tryCall(fn) {
    try {
        return fn();
    } catch (error) {
        console.log('qimao BXH: ' + error.message);
        return null;
    }
}

function boardSections(info, wanted) {
    var sections = [];
    var first = tryCall(function () { return fetchBoard(info.tab, info.firstType); });
    if (!first) return sections;
    // Danh sách bảng và kỳ (sub_titles) lấy từ chính server nên tự theo khi Qimao thêm/bớt bảng.
    var ranks = (first.rank_list || []).filter(function (rank) {
        return rank && rank.title && /^[a-z_]+$/.test(String(rank.type)) && (!wanted || wanted.indexOf(rank.type) >= 0);
    });
    ranks.forEach(function (rank) {
        var data = rank.type === first.rank_type ? first : tryCall(function () { return fetchBoard(info.tab, rank.type); });
        if (!data) return;
        boardPeriods(data, rank).forEach(function (period, i) {
            if (!period.items.length) return;
            sections.push(rankingSection(info.tab + '_' + rank.type + '_' + i, joinTitle([info.label, rank.title, period.label]),
                period.items, 'lb|' + info.tab + '|' + rank.type + '|' + i));
        });
    });
    return sections;
}

function awardSection(info) {
    var award = tryCall(function () { return awardBoard(info.gender); });
    if (!award || !award.books.length) return [];
    var title = joinTitle([info.label, '原创风云榜', award.year + '年']);
    return [rankingSection(info.tab + '_award', title, awardItems(award.books), 'award|' + info.gender + '|' + award.year)];
}

function honorSections(info) {
    var sections = awardSection(info);
    var hall = tryCall(function () { return hallItems(info.gender); });
    if (hall && hall.length) {
        var hallTitle = joinTitle([info.label, '殿堂作品']);
        sections.push(rankingSection(info.tab + '_hall', hallTitle, hall, 'hall|' + info.gender));
    }
    var master = tryCall(function () { return masterBoard(''); });
    if (master && master.items.length) {
        var masterTitle = joinTitle(['七猫宗师&大师作家', master.year + '年']);
        sections.push(rankingSection(info.tab + '_master', masterTitle, master.items, 'master|' + master.year));
    }
    return sections;
}

function execute() {
    var channel = readFilters().channel;
    var sections = [];
    if (channel === 'a') {
        ['0', '1', '2'].forEach(function (key) {
            var info = BOARD_TABS[key];
            sections = sections.concat(boardSections(info, MAIN_BOARDS[info.tab]));
            if (info.gender) sections = sections.concat(awardSection(info));
        });
    } else {
        var info = BOARD_TABS[channel];
        sections = boardSections(info, null);
        if (info.gender) sections = sections.concat(honorSections(info));
    }
    if (!sections.length) return Response.error('Không tải được bảng xếp hạng Qimao');
    return Response.success(sections);
}
