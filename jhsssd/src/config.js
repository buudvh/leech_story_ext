var BASE_URL = 'https://www.jhsssd.com';
var MOBILE_URL = 'https://m.jhsssd.com'
var COVER_BASE = 'https://m.jhsssd.com/files/article/image';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var DEFAULT_GEN = [
  {"title": "其它小说", "input": "/list/9.html", "script": "gen2.js"},
  {"title": "玄幻小说", "input": "/list/1.html", "script": "gen2.js"},
  {"title": "修真小说", "input": "/list/2.html", "script": "gen2.js"},
  {"title": "都市小说", "input": "/list/3.html", "script": "gen2.js"},
  {"title": "穿越小说", "input": "/list/4.html", "script": "gen2.js"},
  {"title": "网游小说", "input": "/list/5.html", "script": "gen2.js"},
  {"title": "科幻小说", "input": "/list/6.html", "script": "gen2.js"},
  {"title": "灵异小说", "input": "/list/7.html", "script": "gen2.js"},
  {"title": "女生小说", "input": "/list/8.html", "script": "gen2.js"},
  {"title": "完本小说", "input": "/wanben.html", "script": "gen2.js"}
];
try {
    // Ưu tiên localStorage > Biến toàn cục > Giá trị mặc định hiện tại
    BASE_URL = localStorage.getItem("CONFIG_URL") || (typeof CONFIG_URL !== 'undefined' ? CONFIG_URL : BASE_URL);
} catch (e) {
}