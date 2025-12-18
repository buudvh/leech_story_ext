var BASE_URL = 'https://www.shuhaige.net';
var MOBILE_URL = 'https://m.shuhaige.net';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var DEFAULT_GENRES = [
    {"title": "全部分类", "input": "/shuku/allvisit_0_0_{0}.html", "script": "gen.js"},
    {"title": "玄幻", "input": "/shuku/allvisit_1_0_{0}.html", "script": "gen.js"},
    {"title": "奇幻", "input": "/shuku/allvisit_2_0_{0}.html", "script": "gen.js"},
    {"title": "武侠", "input": "/shuku/allvisit_3_0_{0}.html", "script": "gen.js"},
    {"title": "都市", "input": "/shuku/allvisit_4_0_{0}.html", "script": "gen.js"},
    {"title": "历史", "input": "/shuku/allvisit_5_0_{0}.html", "script": "gen.js"},
    {"title": "军事", "input": "/shuku/allvisit_6_0_{0}.html", "script": "gen.js"},
    {"title": "悬疑", "input": "/shuku/allvisit_7_0_{0}.html", "script": "gen.js"},
    {"title": "游戏", "input": "/shuku/allvisit_8_0_{0}.html", "script": "gen.js"},
    {"title": "科幻", "input": "/shuku/allvisit_9_0_{0}.html", "script": "gen.js"},
    {"title": "体育", "input": "/shuku/allvisit_10_0_{0}.html", "script": "gen.js"},
    {"title": "古言", "input": "/shuku/allvisit_11_0_{0}.html", "script": "gen.js"},
    {"title": "现言", "input": "/shuku/allvisit_12_0_{0}.html", "script": "gen.js"},
    {"title": "幻言", "input": "/shuku/allvisit_13_0_{0}.html", "script": "gen.js"},
    {"title": "仙侠", "input": "/shuku/allvisit_14_0_{0}.html", "script": "gen.js"},
    {"title": "青春", "input": "/shuku/allvisit_15_0_{0}.html", "script": "gen.js"},
    {"title": "穿越", "input": "/shuku/allvisit_16_0_{0}.html", "script": "gen.js"},
    {"title": "女生", "input": "/shuku/allvisit_17_0_{0}.html", "script": "gen.js"},
    {"title": "其他", "input": "/shuku/allvisit_18_0_{0}.html", "script": "gen.js"}
];

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}