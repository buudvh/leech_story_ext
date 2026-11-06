// Ô Kênh (FILTER_CHANNEL) -> mã kênh của trang 书库 ('a' = tất cả). Dùng chung cho cat.js, genre.js, home.js.
// Cần filter.js (filterCode). Hằng config được app tiêm vào dạng chuỗi; không khai lại tên này bằng var/let/const.
function channelFilter() {
    return filterCode('channel', typeof FILTER_CHANNEL !== 'undefined' ? FILTER_CHANNEL : '');
}
