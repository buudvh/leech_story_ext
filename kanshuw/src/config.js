var BASE_URL = 'https://www.kanshuw.com';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var COVER_BASE = 'https://www.kanshuw.com';
var DEFAULT_GENRES = [
    {"title": "全部分类", "input": "/novel/class/lianzai/{0}.html", "script": "gen.js"},
    {"title": "玄幻奇幻", "input": "/novel/class/xuanhuan/{0}.html", "script": "gen.js"},
    {"title": "現代都市", "input": "/novel/class/dushi/{0}.html", "script": "gen.js"},
    {"title": "武俠仙俠", "input": "/novel/class/wuxia/{0}.html", "script": "gen.js"},
    {"title": "言情小說", "input": "/novel/class/yaniqng/{0}.html", "script": "gen.js"},
    {"title": "遊戲競技", "input": "/novel/class/youxi/{0}.html", "script": "gen.js"},
    {"title": "科幻小說", "input": "/novel/class/kehuan/{0}.html", "script": "gen.js"},
    {"title": "恐怖靈異", "input": "/novel/class/kongbu/{0}.html", "script": "gen.js"},
    {"title": "恐怖靈異", "input": "/novel/class/xuanhuan/{0}.html", "script": "gen.js"},
    {"title": "歷史軍事", "input": "/novel/class/lishi/{0}.html", "script": "gen.js"},
    {"title": "動漫同人", "input": "/novel/class/tongren/{0}.html", "script": "gen.js"},
    {"title": "其他類型", "input": "/novel/class/qita/{0}.html", "script": "gen.js"}
];

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}