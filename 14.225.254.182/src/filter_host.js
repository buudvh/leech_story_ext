// Ô Nguồn của bộ lọc. Nạp ở genre.js và các script dựng danh sách có lọc (cùng filter.js); cần common.js (filterCode).

// Mã nguồn đang chọn ở cấu hình; rỗng = tất cả nguồn.
function filterHost() {
    return filterCode("host", typeof FILTER_HOST !== "undefined" ? FILTER_HOST : "");
}
