// Ô Giới tính (FILTER_GENDER) — chung cho bộ lọc /tim-kiem (filter.js, tham số `gender`) và tab Review (review.js,
// tham số `cat`, cùng mã). Cần config.js (WD, configText) nạp trước. Hằng config được app tiêm vào dạng chuỗi; không
// khai lại tên này bằng var/let/const.

// Chữ hiển thị trong config -> mã của form tìm kiếm. Phải khớp đúng `values` trong plugin.json.
var GENDER_CODES = {
    'Tất cả': '', 'Ngôn tình': WD + '95', 'Nam sinh': WD + '96', 'Đam mỹ': WD + '97', 'Bách hợp': WD + '98',
    'Nữ tôn': WD + '99', 'Không CP': WD + '9a', 'Đa nguyên': '6867732623deea6af9481d15'
};

// Mã giới tính đang chọn; chữ lạ (bản cũ / gõ tay) -> Nam sinh (mặc định của ô).
function genderCode() {
    var key = configText(typeof FILTER_GENDER !== 'undefined' ? FILTER_GENDER : '');
    if (Object.prototype.hasOwnProperty.call(GENDER_CODES, key)) return GENDER_CODES[key];
    return GENDER_CODES['Nam sinh'];
}
