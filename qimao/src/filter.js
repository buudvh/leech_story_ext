// Bảng mã bộ lọc (config select) của trang 书库. Chỉ có bảng và hàm tra, không đọc ô cấu hình nào: script nào dùng ô
// nào thì tự đọc ô đó (cat.js, search.js, channel.js), để nút Bộ lọc của từng tab chỉ hiện đúng các ô tab đó dùng.

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
