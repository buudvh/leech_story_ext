var BASE_URL = 'https://sto55.com';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var COVER_BASE = 'https://sto55.com/files/article/image';

var GENRES_LIST = [
    { "title": "玄幻奇幻", "input": "/class_1_{0}.html", "script": "gen.js" },
    { "title": "武俠仙俠", "input": "/class_2_{0}.html", "script": "gen.js" },
    { "title": "現代都市", "input": "/class_3_{0}.html", "script": "gen.js" },
    { "title": "歷史軍事", "input": "/class_4_{0}.html", "script": "gen.js" },
    { "title": "科幻小說", "input": "/class_5_{0}.html", "script": "gen.js" },
    { "title": "遊戲競技", "input": "/class_6_{0}.html", "script": "gen.js" },
    { "title": "恐怖靈異", "input": "/class_7_{0}.html", "script": "gen.js" },
    { "title": "言情小說", "input": "/class_8_{0}.html", "script": "gen.js" },
    { "title": "其他類型", "input": "/class_9_{0}.html", "script": "gen.js" }
];

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}