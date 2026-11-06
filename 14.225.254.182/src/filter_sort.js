// Ô Sắp xếp của bộ lọc. Chỉ danh sách theo thể loại / nhãn / tìm kiếm nạp file này (tag.js, search.js; "rank:" của
// tag.js vẫn dùng mã của bảng); explore.js luôn dùng mã của bảng xếp hạng nên không nạp. Cần common.js (filterCode).

// Mã sắp xếp đang chọn ở cấu hình; buildFilterQuery() (filter.js) gọi khi không có mã của bảng xếp hạng.
function filterSort() {
    return filterCode("sort", typeof FILTER_SORT !== "undefined" ? FILTER_SORT : "");
}
