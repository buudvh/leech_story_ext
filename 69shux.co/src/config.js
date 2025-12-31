var BASE_URL = 'https://69shux.co';
var COVER_BASE = 'https://69shux.co/files/article/image';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var DEFAULT_GEN = [
    {"title": "其他类型", "input": "/novels/newhot_10_0_{0}.html", "script": "gen.js"},
    {"title": "动漫同人", "input": "/novels/newhot_9_0_{0}.html", "script": "gen.js"},
    {"title": "玄幻奇幻", "input": "/novels/newhot_1_0_{0}.html", "script": "gen.js"},
    {"title": "武侠仙侠", "input": "/novels/newhot_2_0_{0}.html", "script": "gen.js"},
    {"title": "现代都市", "input": "/novels/newhot_3_0_{0}.html", "script": "gen.js"},
    {"title": "歷史军事", "input": "/novels/newhot_4_0_{0}.html", "script": "gen.js"},
    {"title": "科幻小说", "input": "/novels/newhot_5_0_{0}.html", "script": "gen.js"},
    {"title": "游戏竞技", "input": "/novels/newhot_6_0_{0}.html", "script": "gen.js"},
    {"title": "恐怖灵异", "input": "/novels/newhot_7_0_{0}.html", "script": "gen.js"},
    {"title": "言情小说", "input": "/novels/newhot_8_0_{0}.html", "script": "gen.js"},
];
try {
    // Ưu tiên localStorage > Biến toàn cục > Giá trị mặc định hiện tại
    BASE_URL = localStorage.getItem("CONFIG_URL") || (typeof CONFIG_URL !== 'undefined' ? CONFIG_URL : BASE_URL);
} catch (e) {
}