// Bảng xếp hạng theo ô Trạng thái (FILTER_STATUS). Dùng chung cho explore.js (bảng Trang chủ) và gen.js (tab 最近更新,
// tab phân loại, "rank:<kiểu>"). Cần config.js (configText). Hằng config được app tiêm vào dạng chuỗi; không khai lại tên này.

// Ô Trạng thái -> phần <0|1 全本> của URL /novels/<kiểu>_<phân loại>_<0|1>_<trang>.html.
function statusFlag() {
    return configText(typeof FILTER_STATUS !== 'undefined' ? FILTER_STATUS : '') === '全本' ? '1' : '0';
}

// Một bảng xếp hạng của Trang chủ (explore) — 全部分類, kiểu cố định, Trạng thái theo cấu hình.
function rankUrl(kind, page) {
    return BASE_URL + '/novels/' + kind + '_0_' + statusFlag() + '_' + page + '.html';
}
