var BASE_URL = 'https://ixdzs.tw';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var DEFAULT_GENRES = [
    {"title": "其他小說", "input": "/sort/0/index-0-0-0-{0}.html", "script": "gen2.js"},
    {"title": "玄幻奇幻", "input": "/sort/1/index-0-0-0-{0}.html", "script": "gen2.js"},
    {"title": "傳統武俠", "input": "/sort/10/index-0-0-0-{0}.html", "script": "gen2.js"},
    {"title": "修真仙俠", "input": "/sort/2/index-0-0-0-{0}.html", "script": "gen2.js"},
    {"title": "都市青春", "input": "/sort/3/index-0-0-0-{0}.html", "script": "gen2.js"},
    {"title": "軍事歷史", "input": "/sort/4/index-0-0-0-{0}.html", "script": "gen2.js"},
    {"title": "網游競技", "input": "/sort/5/index-0-0-0-{0}.html", "script": "gen2.js"},
    {"title": "科幻靈異", "input": "/sort/6/index-0-0-0-{0}.html", "script": "gen2.js"},
    {"title": "言情穿越", "input": "/sort/7/index-0-0-0-{0}.html", "script": "gen2.js"},
    {"title": "耽美同人", "input": "/sort/8/index-0-0-0-{0}.html", "script": "gen2.js"},
    {"title": "台言古言", "input": "/sort/9/index-0-0-0-{0}.html", "script": "gen2.js"},
];

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}