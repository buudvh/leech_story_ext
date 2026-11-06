// Tab Khám phá lấy thẳng bảng xếp hạng của trang piaotia (không qua STV). Tên theo tiêu đề trang; bảng booktop*
// đọc bằng gen2.js (URL đầy đủ, {0} = trang), truyện hoàn thành đọc bằng gen.js (đường dẫn, cùng mẫu bảng thể loại).
function execute() {
    var base = typeof BASE_URL !== 'undefined' && BASE_URL ? String(BASE_URL).replace(/\/+$/, '') : 'https://www.piaotia.com';
    var top = function (title, kind) {
        return { title: title, input: base + '/' + kind + '/0/{0}.html', script: 'gen2.js' };
    };
    return Response.success([
        top('最近更新', 'booktoplastupdate'),
        top('日排行榜', 'booktopdayvisit'),
        top('月排行榜', 'booktopmonthvisit'),
        top('总排行榜', 'booktopallvisit'),
        top('月推荐榜', 'booktopmonthvote'),
        top('总推荐榜', 'booktopallvote'),
        top('总收藏榜', 'booktopgoodnum'),
        top('最新入库', 'booktoppostdate'),
        top('本站推荐', 'booktoptoptime'),
        { title: '全本小说', input: '/modules/article/index.php?fullflag=1&page={0}', script: 'gen.js' }
    ]);
}
