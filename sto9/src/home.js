load('config.js');

// 最近更新 (phân loại theo ô "Phân loại 最近更新") rồi 11 phân loại của trang (theo ô Sắp xếp + Trạng thái) — gen.js.
function execute() {
    var tabs = [{ title: '最近更新', input: 'update', script: 'gen.js' }];
    CLASSES.forEach(function (c) {
        tabs.push({ title: c[0], input: 'class:' + c[1], script: 'gen.js' });
    });
    return Response.success(tabs);
}
