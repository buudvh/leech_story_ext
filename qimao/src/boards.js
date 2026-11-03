// Bảng xếp hạng (API app). Dùng chung cho explore.js (tab BXH) và rank.js ("Xem thêm"). Cần config.js.

// Kênh lọc -> tab của API leader-board (1 男频, 2 女频, 3 出版) và gender của bảng vinh danh.
var BOARD_TABS = {
    '0': { tab: '1', gender: '1', label: '男频', firstType: 'must_read_list' },
    '1': { tab: '2', gender: '2', label: '女频', firstType: 'must_read_list' },
    '2': { tab: '3', gender: '', label: '出版', firstType: 'rec_list' }
};
// Kênh = Tất cả: chỉ các bảng chính của mỗi kênh (giữ trang dưới ~5 s, mỗi bảng một lượt gọi).
var MAIN_BOARDS = {
    '1': ['must_read_list', 'rec_list', 'hot_list', 'new_list', 'end_list'],
    '2': ['must_read_list', 'rec_list', 'hot_list', 'new_list', 'end_list'],
    '3': ['rec_list', 'hot_list', 'film_list']
};

function tabLabel(tab) {
    for (var key in BOARD_TABS) {
        if (BOARD_TABS[key].tab === tab) return BOARD_TABS[key].label;
    }
    return '';
}

function joinTitle(parts) {
    return parts.filter(function (x) { return x; }).join(' · ');
}

// Một lượt trả cả hai kỳ: books (日榜 / 新完结) + month_books (月榜 / 全部); 角色榜: character_list + year_character_list.
function fetchBoard(tab, type) {
    return fetchApp(APP_BC, '/api/v1/leader-board', {
        rank_type: type, category_id: '0', category_type: '0', tab_type: tab,
        imei_ip: IMEI_IP, book_privacy: '1', read_preference: '0', list_type: 'month'
    });
}

function findRank(data, type) {
    var list = data.rank_list || [];
    for (var i = 0; i < list.length; i++) {
        if (list[i] && list[i].type === type) return list[i];
    }
    return null;
}

// 角色榜: mỗi mục là một nhân vật, `id` là id truyện gốc, sub_title "出自 <tên truyện>".
function characterItem(c) {
    var origin = cleanText(String(c.sub_title || '').replace(/^出自\s*/, ''));
    return {
        name: origin || cleanText(c.nickname),
        link: bookUrl(c.id),
        cover: coverOf(c.avatar),
        description: joinInfo(['角色：' + cleanText(c.nickname), c.heat_number]),
        host: BASE_URL
    };
}

function uniqueItems(items) {
    var seen = {};
    return items.filter(function (item) {
        if (!item.name || seen[item.link]) return false;
        seen[item.link] = true;
        return true;
    });
}

// Các kỳ của một bảng: [{ label, items }]. Bảng không có sub_titles chỉ có một kỳ.
function boardPeriods(data, rank) {
    var isCharacter = !!(data.character_list || data.year_character_list);
    var lists = isCharacter ? [data.character_list, data.year_character_list] : [data.books, data.month_books];
    var labels = rank && rank.sub_titles && rank.sub_titles.length ? rank.sub_titles.slice(0, 2) : [''];
    return labels.map(function (label, i) {
        var items = (lists[i] || []).filter(function (x) { return x && x.id; }).map(isCharacter ? characterItem : appBookItem);
        return { label: cleanText(label), items: uniqueItems(items) };
    });
}

// ---- Bảng theo năm ----

function currentYear() {
    return new Date().getFullYear();
}

function fetchAward(gender, year) {
    return fetchApp(APP_BC, '/api/v1/h5/book-original-award/list', { gender: gender, year: String(year) }, true);
}

// 原创风云榜: năm hiện tại nếu đã có trong `years` và có sách, không thì lùi về năm gần nhất trước đó.
// Không chỉ xét "có sách": năm chưa mở (vd 2027) server vẫn trả danh sách tổng hợp, không gắn năm.
function awardBoard(gender, fixedYear) {
    if (fixedYear) {
        return { year: String(fixedYear), books: fetchAward(gender, fixedYear).books || [] };
    }
    var year = currentYear();
    var data = fetchAward(gender, year);
    var years = (data.years || []).map(Number);
    if (years.indexOf(year) >= 0 && data.books && data.books.length) return { year: String(year), books: data.books };
    var older = years.filter(function (y) { return y < year; }).sort(function (a, b) { return b - a; });
    for (var i = 0; i < older.length && i < 2; i++) {
        var books = fetchAward(gender, older[i]).books || [];
        if (books.length) return { year: String(older[i]), books: books };
    }
    return { year: '', books: [] };
}

function awardItems(books) {
    return uniqueItems(books.filter(function (b) { return b && b.id; }).map(function (b) {
        return {
            name: cleanText(b.title),
            link: bookUrl(b.id),
            cover: coverOf(b.image_link),
            description: joinInfo([b.author, b.sub_title]),
            host: BASE_URL
        };
    }));
}

// 七猫宗师&大师作家: mỗi mục có `year`; lấy năm hiện tại, chưa có thì năm gần nhất trước đó.
function masterBoard(fixedYear) {
    var list = fetchApp(APP_BC, '/api/v1/h5/original-author-master/list', {}, true).list || [];
    var year = fixedYear ? Number(fixedYear) : currentYear();
    var years = list.map(function (x) { return Number(x.year); }).filter(function (y) { return y <= year; });
    if (!years.length) return { year: '', items: [] };
    var pick = Math.max.apply(null, years);
    var items = list.filter(function (x) { return Number(x.year) === pick && x.book_id; }).map(function (x) {
        return {
            name: cleanText(x.book_title),
            link: bookUrl(x.book_id),
            cover: coverOf(x.img),
            description: joinInfo([x.author_name, Number(x.type) === 1 ? '宗师作家' : '大师作家', x.rec_desc]),
            host: BASE_URL
        };
    });
    return { year: String(pick), items: uniqueItems(items) };
}

// 殿堂作品: server trả 10 truyện chọn ngẫu nhiên mỗi lần gọi (không phân trang).
function hallItems(gender) {
    var books = fetchApp(APP_BC, '/api/v1/h5/hall-of-fame/list', { gender: gender }, true).books || [];
    return awardItems(books);
}
