load('crypto.js');
load('config.js');
load('boards.js');

// "Xem thêm" của tab BXH và danh sách đề xuất ở trang chi tiết. input:
//   lb|<tab>|<rank_type>|<kỳ 0/1>   award|<gender>|<năm>   hall|<gender>   master|<năm>   books|<JSON [{id,title,image_link,sub_title}]>
// Các bảng trả trọn danh sách trong một lượt ⇒ không có trang kế.
function execute(input, page) {
    input = String(input || '');
    var parts = input.split('|');
    try {
        var items;
        if (parts[0] === 'lb') {
            var data = fetchBoard(parts[1], parts[2]);
            var periods = boardPeriods(data, findRank(data, parts[2]));
            var period = periods[parseInt(parts[3], 10) || 0] || periods[0];
            items = period ? period.items : [];
        } else if (parts[0] === 'award') {
            items = awardItems(awardBoard(parts[1], parts[2]).books);
        } else if (parts[0] === 'hall') {
            items = hallItems(parts[1]);
        } else if (parts[0] === 'master') {
            items = masterBoard(parts[1]).items;
        } else if (parts[0] === 'books') {
            items = uniqueItems(JSON.parse(input.substring(6)).filter(function (b) { return b && b.id; }).map(appBookItem));
        } else {
            return Response.error('Bảng xếp hạng không hợp lệ: ' + input);
        }
        return Response.success(items, '');
    } catch (error) {
        return Response.error('Qimao: ' + error.message + '\nInput: ' + input);
    }
}
