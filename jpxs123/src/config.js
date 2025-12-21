var BASE_URL = 'https://jpxs123.com';
var DEFAULT_COVER = 'https://raw.githubusercontent.com/buudvh/leech_story_ext/main/asset/cover2.jpg';
var DEFAULT_GENRES = [
  {"title": "精品小說", "input": "/book/", "script": "gen.js"},
  {"title": "都市小說", "input": "/dsxs/", "script": "gen.js"},
  {"title": "玄幻修真", "input": "/xh/", "script": "gen.js"},
  {"title": "歷史軍事", "input": "/lishi/", "script": "gen.js"},
  {"title": "科幻競技", "input": "/khjj/", "script": "gen.js"},
  {"title": "穿越架空", "input": "/cyjk/", "script": "gen.js"},
  {"title": "鬼話懸疑", "input": "/guihua/", "script": "gen.js"},
  {"title": "同人小說", "input": "/tongren/", "script": "gen.js"}
];

try {
    if (typeof CONFIG_URL !== 'undefined' && CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua nếu lỗi
}