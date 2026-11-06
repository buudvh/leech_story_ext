// BASE_URL đến từ cấu hình (plugin.json). wikicv.net / truyenwikidich.net chỉ chuyển hướng sang wikicv.org: gọi thẳng
// wikicv.org để cookie đăng nhập (chép từ trình duyệt "Mở link lỗi" theo tên miền) khớp với tên miền được gọi.
var BASE_URL = (typeof BASE_URL !== 'undefined' && BASE_URL ? String(BASE_URL) : 'https://wikicv.org').trim().replace(/\/+$/, '');
if (/^https?:\/\/(www\.)?(wikicv\.net|truyenwikidich\.net)$/i.test(BASE_URL)) BASE_URL = 'https://wikicv.org';

// Trang tìm kiếm / lọc / nhãn và bảng xếp hạng bắt buộc đăng nhập; khách chỉ thấy dòng này.
var LOGIN_WALL_TEXT = 'Đăng nhập để xem nội dung';
var LOGIN_MESSAGE = 'Wiki Dịch yêu cầu đăng nhập để xem danh sách này. Bấm "Mở link lỗi", đăng nhập trên trang đó rồi đóng lại để tải lại.';

// ---- Bộ lọc ----
// File này được mọi script nạp nên không nhắc tên ô cấu hình nào (nút Bộ lọc của tab hiện mọi ô mà script của tab và
// các file nó nạp nhắc tới): bộ lọc /tim-kiem ở filter.js, ô Giới tính ở gender.js, ô Xếp review ở review.js.

// Tiền tố chung của nhiều mã trong form tìm kiếm (giới tính, tình trạng, thể loại…).
var WD = '5794f03dd7ced228f44191';

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

// Giá trị một ô cấu hình (hằng app tiêm vào dạng chuỗi, đọc bằng `typeof KEY !== 'undefined' ? KEY : ''` ở file cần) ->
// chuỗi đã bỏ khoảng trắng hai đầu.
function configText(value) {
    return value == null ? '' : String(value).trim();
}

function hasParam(url, param) {
    return new RegExp('[?&]' + param + '=').test(url);
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
