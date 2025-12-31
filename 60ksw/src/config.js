var BASE_URL = 'http://www.60ksw.com';
var COVER_BASE = 'http://www.60ksw.com/files/article/image';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var DEFAULT_GEN = [
  {"title": "全部小说", "input": "/bookstore/quanbu/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
  {"title": "玄幻小说", "input": "/bookstore/xuanhuan/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
  {"title": "仙侠小说", "input": "/bookstore/xianxia/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
  {"title": "都市小说", "input": "/bookstore/dushi/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
  {"title": "历史小说", "input": "/bookstore/lishi/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
  {"title": "悬疑小说", "input": "/bookstore/xuanyi/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
  {"title": "网游小说", "input": "/bookstore/wangyou/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
  {"title": "科幻小说", "input": "/bookstore/kehuan/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
  {"title": "惊悚小说", "input": "/bookstore/jingsong/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
  {"title": "穿越小说", "input": "/bookstore/chuanyue/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
  {"title": "同人小说", "input": "/bookstore/tongren/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"}
];
try {
    // Ưu tiên localStorage > Biến toàn cục > Giá trị mặc định hiện tại
    BASE_URL = localStorage.getItem("CONFIG_URL") || (typeof CONFIG_URL !== 'undefined' ? CONFIG_URL : BASE_URL);
} catch (e) {
}