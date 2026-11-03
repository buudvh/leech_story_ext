// BASE_URL đến từ cấu hình (plugin.json). wikicv.net / truyenwikidich.net chỉ chuyển hướng sang wikicv.org: gọi thẳng
// wikicv.org để cookie đăng nhập (chép từ trình duyệt "Mở link lỗi" theo tên miền) khớp với tên miền được gọi.
var BASE_URL = (typeof BASE_URL !== 'undefined' && BASE_URL ? String(BASE_URL) : 'https://wikicv.org').trim().replace(/\/+$/, '');
if (/^https?:\/\/(www\.)?(wikicv\.net|truyenwikidich\.net)$/i.test(BASE_URL)) BASE_URL = 'https://wikicv.org';

// Trang tìm kiếm / lọc / nhãn và bảng xếp hạng bắt buộc đăng nhập; khách chỉ thấy dòng này.
var LOGIN_WALL_TEXT = 'Đăng nhập để xem nội dung';
var LOGIN_MESSAGE = 'Wiki Dịch yêu cầu đăng nhập để xem danh sách này. Bấm "Mở link lỗi", đăng nhập trên trang đó rồi đóng lại để tải lại.';

// ---- Bộ lọc (config select) ----
// Chữ hiển thị trong config -> mã của form tìm kiếm (/tim-kiem). Phải khớp đúng `values` trong plugin.json.
var WD = '5794f03dd7ced228f44191';
var FILTERS = {
    FILTER_SORT: { param: 'so', values: { 'Đọc nhiều nhất': '', 'Rating cao nhất': '2', 'Mới nhất': '4' } },
    FILTER_STATUS: { param: 'status', values: {
        'Tất cả': '', 'Hoàn thành': WD + '91', 'Còn tiếp': WD + '92', 'Tạm ngưng': '5921225a12fb5546f4b9e100',
        'Chưa xác minh': '59c6a50112fb553750272b0a' } },
    FILTER_GENDER: { param: 'gender', values: {
        'Tất cả': '', 'Ngôn tình': WD + '95', 'Nam sinh': WD + '96', 'Đam mỹ': WD + '97', 'Bách hợp': WD + '98',
        'Nữ tôn': WD + '99', 'Không CP': WD + '9a', 'Đa nguyên': '6867732623deea6af9481d15' } },
    FILTER_OFFICIAL: { param: 'official', values: { 'Tất cả': '', 'Nguyên sang': WD + '93', 'Diễn sinh': WD + '94' } },
    FILTER_LENGTH: { param: 'tc', values: {
        'Tất cả': '', '1 - 20 chương': '1', '21 - 50 chương': '2', '51 - 100 chương': '3', '101 - 200 chương': '4',
        '201 - 300 chương': '5', '301 - 500 chương': '6', '501 - 1000 chương': '7', 'Trên 1000 chương': '8' } },
    FILTER_AGE: { param: 'age', values: {
        'Tất cả': '', 'Cổ đại': WD + '9b', 'Cận đại': WD + '9c', 'Hiện đại': WD + '9d', 'Tương lai': WD + '9e',
        'Giả tưởng lịch sử': '6748055223deea071cb36cd5' } },
    FILTER_ENDING: { param: 'ending', values: { 'Tất cả': '', 'HE': WD + '9f', 'SE': WD + 'a0', 'OE': WD + 'a1' } }
};

// 19 thể loại của form tìm kiếm (2026-11-03) = các tab home sau Review. Thể loại hướng truyện nam đứng trước,
// Làm sự nghiệp / Tình cảm (hướng nữ) cuối.
var GENRES = [
    ['Huyền huyễn', '57d17c94d7ced218fcd2734b'], ['Tiên hiệp', WD + 'a4'], ['Võ hiệp', WD + 'a3'],
    ['Khoa học viễn tưởng', WD + 'a9'], ['Mạt thế', WD + 'ac'], ['Sinh tồn', '5fd54e6523deea0a1a87e9b9'],
    ['Tranh bá', '5a1ce8f512fb556782b06f7e'], ['Quân sự', '6785b91d23deea36d63efe7f'],
    ['Quan trường', '5b10edd012fb550d90428316'], ['Kinh thương', WD + 'd4'], ['Xây dựng', '5fd3abb623deea0a1a87e9b5'],
    ['Huyền học', '58458dc2d7ced23af03679c5'], ['Trinh thám', WD + 'a7'], ['Kinh dị', WD + 'a6'],
    ['Làm ruộng', WD + 'c0'], ['Manga anime', WD + 'a8'], ['Phim ảnh', '596bd83012fb557cb030fc5a'],
    ['Làm sự nghiệp', '6785c24e23deea36d63efe8e'], ['Tình cảm', WD + 'a2']
];

// Trang Review (/review) chỉ lọc theo giới tính (`cat`, cùng mã) và xếp Mới nhất / Cũ nhất.
var REVIEW_SORTS = { 'Mới nhất': '', 'Cũ nhất': 'oldest' };

function configValue(name) {
    var value = '';
    try {
        if (name === 'FILTER_SORT' && typeof FILTER_SORT !== 'undefined') value = FILTER_SORT;
        else if (name === 'FILTER_STATUS' && typeof FILTER_STATUS !== 'undefined') value = FILTER_STATUS;
        else if (name === 'FILTER_GENDER' && typeof FILTER_GENDER !== 'undefined') value = FILTER_GENDER;
        else if (name === 'FILTER_OFFICIAL' && typeof FILTER_OFFICIAL !== 'undefined') value = FILTER_OFFICIAL;
        else if (name === 'FILTER_LENGTH' && typeof FILTER_LENGTH !== 'undefined') value = FILTER_LENGTH;
        else if (name === 'FILTER_AGE' && typeof FILTER_AGE !== 'undefined') value = FILTER_AGE;
        else if (name === 'FILTER_ENDING' && typeof FILTER_ENDING !== 'undefined') value = FILTER_ENDING;
        else if (name === 'FILTER_REVIEW_SORT' && typeof FILTER_REVIEW_SORT !== 'undefined') value = FILTER_REVIEW_SORT;
    } catch (e) {}
    return value == null ? '' : String(value).trim();
}

// Mã của một ô lọc; chữ lạ (bản cũ / gõ tay) -> giá trị mặc định của ô (Giới tính: Nam sinh, còn lại: không lọc).
function filterCode(name) {
    var values = FILTERS[name].values;
    var key = configValue(name);
    if (Object.prototype.hasOwnProperty.call(values, key)) return values[key];
    return name === 'FILTER_GENDER' ? values['Nam sinh'] : '';
}

function hasParam(url, param) {
    return new RegExp('[?&]' + param + '=').test(url);
}

// Ghép bộ lọc vào URL /tim-kiem. Tham số tab tự khai (vd `genre` của tab thể loại) thắng ô lọc.
// `qs=2` (link nhãn của trang chủ) bỏ qua bộ lọc nên đổi về `qs=1`.
function applyFilters(url) {
    url = String(url || '');
    if (url.indexOf('/tim-kiem') < 0) return url;
    url = url.replace(/([?&])qs=2(?=&|$)/, '$1qs=1');
    var parts = [];
    if (!hasParam(url, 'qs')) parts.push('qs=1');
    if (!hasParam(url, 'vo')) parts.push('vo=1');
    Object.keys(FILTERS).forEach(function (name) {
        var param = FILTERS[name].param;
        var code = filterCode(name);
        if (code && !hasParam(url, param)) parts.push(param + '=' + code);
    });
    if (!parts.length) return url;
    return url + (url.indexOf('?') < 0 ? '?' : '&') + parts.join('&');
}

// ---- Tải trang ----

// { doc } khi có nội dung; { error } khi HTTP lỗi hoặc trang bắt đăng nhập (`listSelector` không có mà thấy dòng
// yêu cầu đăng nhập).
function fetchPage(url, options, listSelector) {
    var response = fetch(url, options || {});
    if (!response.ok) {
        if (response.status === 401 || response.status === 403 || response.status === 500) return { error: LOGIN_MESSAGE };
        return { error: 'HTTP ' + response.status + ' ' + url };
    }
    var doc = response.html();
    if (listSelector && doc.select(listSelector).size() === 0 && doc.text().indexOf(LOGIN_WALL_TEXT) >= 0) {
        return { error: LOGIN_MESSAGE };
    }
    return { doc: doc };
}

// Danh sách truyện của /tim-kiem (Home, thể loại, nhãn, tìm kiếm).
function parseBookList(doc) {
    var data = [];
    doc.select('.book-list > .book-item').forEach(function (e) {
        data.push({
            name: e.select('.book-title').text(),
            link: e.select('.info-col > a').first().attr('href'),
            cover: e.select('.cover-col img').attr('src'),
            description: e.select('.book-author').text(),
            host: BASE_URL
        });
    });
    return data;
}

function nextStart(doc) {
    var next = doc.select('.pagination').select('li.active + li').select('a').attr('href').match(/start=(\d+)/);
    return next ? next[1] : null;
}

// ---- Bình luận ----

function pad2(n) {
    return n < 10 ? '0' + n : '' + n;
}

// Mốc thời gian (ms) -> "dd/MM/yyyy HH:mm" theo giờ máy.
function formatDate(ms) {
    var date = new Date(Number(ms));
    if (!ms || isNaN(date.getTime())) return '';
    return pad2(date.getDate()) + '/' + pad2(date.getMonth() + 1) + '/' + date.getFullYear() + ' ' +
        pad2(date.getHours()) + ':' + pad2(date.getMinutes());
}

// Số giây đã qua (data-interval của trang review) -> "3 giờ trước".
function timeAgo(seconds) {
    var s = Number(seconds);
    if (!s || isNaN(s) || s < 0) return '';
    if (s < 60) return 'Vừa xong';
    var units = [[31536000, 'năm'], [2592000, 'tháng'], [86400, 'ngày'], [3600, 'giờ'], [60, 'phút']];
    for (var i = 0; i < units.length; i++) {
        if (s >= units[i][0]) return Math.floor(s / units[i][0]) + ' ' + units[i][1] + ' trước';
    }
    return '';
}

function joinParts(parts) {
    var out = [];
    for (var i = 0; i < parts.length; i++) {
        var part = String(parts[i] == null ? '' : parts[i]).replace(/\s+/g, ' ').trim();
        if (part) out.push(part);
    }
    return out.join(' · ');
}
