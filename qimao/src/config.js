// Qimao (七猫): danh sách theo phân loại + bộ lọc lấy từ API của trang web (www.qimao.com/qimaoapi, không ký);
// BXH, tìm kiếm, chi tiết, mục lục, chương lấy từ API của app (wtzw.com, ký MD5). Cần load('crypto.js') trước.
var BASE_URL = 'https://www.qimao.com';
var WEB_API = BASE_URL + '/qimaoapi/api';
var APP_BC = 'https://api-bc.wtzw.com';
var APP_KS = 'https://api-ks.wtzw.com';
var SIGN_KEY = 'd3dGiJc651gSQ8w1';
var CHAPTER_KEY = '242ccb8230d709e1';
var IMEI_IP = '2937357107';
var WEB_PAGE_SIZE = 15;
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover1.jpg';

// ---- Bộ lọc (config select) ----

// Chữ hiển thị trong config -> mã của trang 书库 (classify/select-option). Phải khớp đúng `values` trong plugin.json.
var FILTER_CODES = {
    channel: { 'Tất cả': 'a', 'Nam (男生原创)': '0', 'Nữ (女生原创)': '1', 'Sách xuất bản (出版图书)': '2' },
    words: {
        'Tất cả': 'a', 'Dưới 300.000 chữ': '1', '300.000–500.000 chữ': '2', '500.000–1 triệu chữ': '3',
        '1–2 triệu chữ': '4', 'Trên 2 triệu chữ': '5'
    },
    update: { 'Tất cả': 'a', 'Trong 3 ngày': '1', 'Trong 7 ngày': '2', 'Trong 30 ngày': '3' },
    status: { 'Tất cả': 'a', 'Hoàn thành': '1', 'Đang ra': '0' },
    sort: {
        'Lượt nhấp (按点击量)': 'click', 'Tổng số chữ (按总字数)': 'words_num',
        'Mới cập nhật (最近更新)': 'update_time', 'Lượt lưu (按收藏数)': 'favorite_uv'
    }
};
// Mã dùng khi chữ không có trong bảng (chưa cấu hình, hoặc chữ của bản cũ).
var FILTER_DEFAULTS = { channel: 'a', words: 'a', update: 'a', status: 'a', sort: 'click' };

function filterCode(group, label) {
    var table = FILTER_CODES[group];
    var key = (label == null ? '' : String(label)).trim();
    if (table && Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    return FILTER_DEFAULTS[group];
}

// Hằng config được app tiêm vào dạng chuỗi; không khai lại các tên này bằng var/let/const.
function readFilters() {
    return {
        channel: filterCode('channel', typeof FILTER_CHANNEL !== 'undefined' ? FILTER_CHANNEL : ''),
        words: filterCode('words', typeof FILTER_WORDS !== 'undefined' ? FILTER_WORDS : ''),
        update: filterCode('update', typeof FILTER_UPDATE !== 'undefined' ? FILTER_UPDATE : ''),
        status: filterCode('status', typeof FILTER_STATUS !== 'undefined' ? FILTER_STATUS : ''),
        sort: filterCode('sort', typeof FILTER_SORT !== 'undefined' ? FILTER_SORT : '')
    };
}

// ---- Gọi API ----

function queryString(params) {
    return Object.keys(params).sort().map(function (k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
}

// sign = md5("k1=v1k2=v2..." theo khoá tăng dần + SIGN_KEY), dùng cho cả query lẫn header.
function signParams(params) {
    var keys = Object.keys(params).sort();
    var text = '';
    for (var i = 0; i < keys.length; i++) text += keys[i] + '=' + params[keys[i]];
    params.sign = CryptoJS.MD5(text + SIGN_KEY).toString();
    return params;
}

// Header của app Android. Header rỗng (AUTHORIZATION, qm-params) không gửi và không đưa vào chữ ký:
// server vẫn nhận (thử 2026-11-03), và không phụ thuộc việc fetch có gửi header giá trị rỗng hay không.
function appHeaders() {
    return signParams({
        'app-version': '80400',
        'application-id': 'com.kmxs.reader',
        'channel': 'unknown',
        'net-env': '1',
        'platform': 'android',
        'reg': '0'
    });
}

function readJsonData(response, url) {
    if (!response.ok) throw new Error('HTTP ' + response.status + ' ' + url);
    var json = response.json();
    if (json && json.data) return json.data;
    var errors = json && json.errors;
    var message = errors ? (errors.details || errors.title) : (json && (json.message || json.Status));
    throw new Error((message ? String(message) : 'Dữ liệu trống') + ' — ' + url);
}

// unsigned = true cho các API h5 (bảng vinh danh) vốn gọi không ký.
function fetchApp(host, path, params, unsigned) {
    var query = unsigned ? params : signParams(params);
    var url = host + path + '?' + queryString(query);
    return readJsonData(fetch(url, { headers: appHeaders() }), url);
}

function fetchWeb(path, params) {
    var url = WEB_API + path + (params ? '?' + queryString(params) : '');
    return readJsonData(fetch(url), url);
}

// ---- 作品分类 (trang 书库) ----

// Phân loại cấp 1 [id, tên, kênh] (classify/select-option, 2026-11-03) — chỉ dùng khi API lỗi.
var FALLBACK_CATEGORIES = [
    ['1', '现代言情', '1'], ['2', '古代言情', '1'], ['4', '幻想言情', '1'], ['56', '历史', '0'], ['60', '军事', '0'],
    ['64', '科幻', '0'], ['75', '游戏', '0'], ['200', '游戏竞技', '1'], ['202', '玄幻奇幻', '0'], ['203', '都市', '0'],
    ['204', '奇闻异事', '0'], ['205', '武侠仙侠', '0'], ['206', '体育', '0'], ['207', 'N次元', '0'], ['240', '文学艺术', '2'],
    ['241', '人文社科', '2'], ['242', '经管励志', '2'], ['243', '经典文学', '2'], ['257', '出版小说', '2'], ['258', '少儿教育', '2'],
    ['277', '衍生言情', '1'], ['306', '现实题材', '0'], ['307', '现实主义', '1']
];

// Cây phân loại: [{ id, name, type (kênh '0' nam / '1' nữ / '2' xuất bản), children: [{ id, name }] }], bỏ mục "全部".
function loadCategories() {
    try {
        var list = (fetchWeb('/classify/select-option').category || []).filter(function (c) {
            return c && c.id && c.id !== 'a' && c.name;
        });
        if (list.length) return list;
    } catch (error) {
        console.log('qimao select-option: ' + error.message);
    }
    return FALLBACK_CATEGORIES.map(function (c) {
        return { id: c[0], name: c[1], type: c[2], children: [] };
    });
}

// ---- URL ----

function bookUrl(bookId) {
    return BASE_URL + '/shuku/' + bookId + '/';
}

// Đúng URL đọc chương của trang web (mở được trong trình duyệt).
function chapterUrl(bookId, chapterId) {
    return BASE_URL + '/shuku/' + bookId + '-' + chapterId + '/';
}

function parseBookId(url) {
    var m = String(url || '').match(/\/shuku\/(\d+)/) || String(url || '').match(/^(\d+)$/);
    return m ? m[1] : '';
}

function parseChapterIds(url) {
    var m = String(url || '').match(/\/shuku\/(\d+)-(\d+)/);
    return m ? { bookId: m[1], chapterId: m[2] } : null;
}

// ---- Dữ liệu ----

function cleanText(text) {
    return String(text == null ? '' : text).replace(/[\s　 ]+/g, ' ').trim();
}

function shortIntro(text) {
    var intro = cleanText(text);
    return intro.length > 80 ? intro.substring(0, 80) + '…' : intro;
}

function joinInfo(parts) {
    return parts.map(cleanText).filter(function (x) { return x; }).join(' · ');
}

// "扮猪吃虎・连载・1670万字" -> "扮猪吃虎 · 连载 · 1670万字"
function subTitleInfo(subTitle) {
    return cleanText(String(subTitle || '').replace(/^[・·\s]+/, '').replace(/\s*・\s*/g, ' · '));
}

function coverOf(src) {
    src = cleanText(src);
    if (!src) return DEFAULT_COVER;
    if (src.indexOf('//') === 0) return 'https:' + src;
    return src;
}

// Item của API web (classify/book-list).
function webBookItem(book) {
    var info = joinInfo([book.author, book.category2_name, book.is_over_txt, book.words_num]);
    var intro = shortIntro(book.intro);
    return {
        name: cleanText(book.title),
        link: bookUrl(book.book_id),
        cover: coverOf(book.image_link),
        description: info + (intro ? '\n' + intro : ''),
        host: BASE_URL
    };
}

// Item của API app (BXH, đề xuất): { id, title, image_link, sub_title, heat_number, author? }.
function appBookItem(book) {
    return {
        name: cleanText(book.title),
        link: bookUrl(book.id),
        cover: coverOf(book.image_link),
        description: joinInfo([book.author, subTitleInfo(book.sub_title), book.heat_number]),
        host: BASE_URL
    };
}

function escapeHtml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
