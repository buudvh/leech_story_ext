// Bộ lọc của trang /tim-kiem (gen.js, search.js). Cần config.js (WD, configText, hasParam) nạp trước, và gender.js
// (genderCode) trước khi gọi applyFilters. Hằng config được app tiêm vào dạng chuỗi; không khai lại các tên này.

// Chữ hiển thị trong config -> mã của form tìm kiếm (/tim-kiem). Phải khớp đúng `values` trong plugin.json. Thứ tự
// khoá = thứ tự tham số ghép vào URL; Giới tính lấy mã ở gender.js (chung với tab Review).
var FILTERS = {
    FILTER_SORT: { param: 'so', values: { 'Đọc nhiều nhất': '', 'Rating cao nhất': '2', 'Mới nhất': '4' } },
    FILTER_STATUS: { param: 'status', values: {
        'Tất cả': '', 'Hoàn thành': WD + '91', 'Còn tiếp': WD + '92', 'Tạm ngưng': '5921225a12fb5546f4b9e100',
        'Chưa xác minh': '59c6a50112fb553750272b0a' } },
    FILTER_GENDER: { param: 'gender' },
    FILTER_OFFICIAL: { param: 'official', values: { 'Tất cả': '', 'Nguyên sang': WD + '93', 'Diễn sinh': WD + '94' } },
    FILTER_LENGTH: { param: 'tc', values: {
        'Tất cả': '', '1 - 20 chương': '1', '21 - 50 chương': '2', '51 - 100 chương': '3', '101 - 200 chương': '4',
        '201 - 300 chương': '5', '301 - 500 chương': '6', '501 - 1000 chương': '7', 'Trên 1000 chương': '8' } },
    FILTER_AGE: { param: 'age', values: {
        'Tất cả': '', 'Cổ đại': WD + '9b', 'Cận đại': WD + '9c', 'Hiện đại': WD + '9d', 'Tương lai': WD + '9e',
        'Giả tưởng lịch sử': '6748055223deea071cb36cd5' } },
    FILTER_ENDING: { param: 'ending', values: { 'Tất cả': '', 'HE': WD + '9f', 'SE': WD + 'a0', 'OE': WD + 'a1' } }
};

// Chữ đang chọn của các ô (trừ Giới tính).
function filterLabels() {
    return {
        FILTER_SORT: typeof FILTER_SORT !== 'undefined' ? FILTER_SORT : '',
        FILTER_STATUS: typeof FILTER_STATUS !== 'undefined' ? FILTER_STATUS : '',
        FILTER_OFFICIAL: typeof FILTER_OFFICIAL !== 'undefined' ? FILTER_OFFICIAL : '',
        FILTER_LENGTH: typeof FILTER_LENGTH !== 'undefined' ? FILTER_LENGTH : '',
        FILTER_AGE: typeof FILTER_AGE !== 'undefined' ? FILTER_AGE : '',
        FILTER_ENDING: typeof FILTER_ENDING !== 'undefined' ? FILTER_ENDING : ''
    };
}

// Mã của một ô lọc; chữ lạ (bản cũ / gõ tay) -> giá trị mặc định của ô (Giới tính: Nam sinh, còn lại: không lọc).
function filterCode(name, labels) {
    if (name === 'FILTER_GENDER') return genderCode();
    var values = FILTERS[name].values;
    var key = configText(labels[name]);
    if (Object.prototype.hasOwnProperty.call(values, key)) return values[key];
    return '';
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
    var labels = filterLabels();
    Object.keys(FILTERS).forEach(function (name) {
        var param = FILTERS[name].param;
        var code = filterCode(name, labels);
        if (code && !hasParam(url, param)) parts.push(param + '=' + code);
    });
    if (!parts.length) return url;
    return url + (url.indexOf('?') < 0 ? '?' : '&') + parts.join('&');
}
