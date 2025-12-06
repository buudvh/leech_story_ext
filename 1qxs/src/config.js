var BASE_URL = 'https://www.1qxs.com';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var COVER_BASE = 'https://img.1qxs.com/cover';
var GENRES_LIST = [
    { "title": "玄幻", "input": "/all/0_1_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "军事", "input": "/all/0_7_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "游戏", "input": "/all/0_9_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "现实", "input": "/all/0_6_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "奇幻", "input": "/all/0_2_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "轻小说", "input": "/all/0_13_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "短篇", "input": "/all/0_14_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "仙侠", "input": "/all/0_4_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "科幻", "input": "/all/0_11_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "历史", "input": "/all/0_8_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "体育", "input": "/all/0_10_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "都市", "input": "/all/0_5_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "武侠", "input": "/all/0_3_0_0_0_{0}.html", "script": "gen.js" },
    { "title": "悬疑", "input": "/all/0_12_0_0_0_{0}.html", "script": "gen.js" },
];

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
}