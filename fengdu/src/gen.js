load('libs.js');
load('config.js');

// input: "gender=..&classificationId=..&bookIsFinished=..&sortTitle=.." (trang nối thêm ở đây, trang đánh từ 1).
function execute(input, page) {
    var url;
    try {
        page = parseInt(page || '1', 10);
        var path = 'get_book_info_by_tab?' + input + '&wordsNum=-1&page=' + page + '&count=' + LIST_PAGE_SIZE;
        url = fengduApiUrl(path);

        var result = fengduApi(path);
        var data = (result.classficationBooks || []).map(fengduBookItem);
        if (!data.length) {
            if (page > 1) return Response.success([], '');
            throw new Error('Length = 0');
        }

        var totalPage = parseInt((result.page_info || {}).total_page || '0', 10);
        return Response.success(data, page < totalPage ? (page + 1).toString() : '');
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
